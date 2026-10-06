import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { z } from "zod";
import { guestCountError } from "./reservation-rules";

const bookingInput = z
  .object({
    booking_type: z.enum(["small_party", "big_party"]),
    first_name: z.string().trim().min(1).max(80),
    last_name: z.string().trim().min(1).max(80),
    email: z.string().trim().email().max(255),
    phone: z.string().trim().min(6).max(30).regex(/^[0-9+()\-\s]+$/),
    guest_count: z.number().int(),
    reservation_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    reservation_time: z.string().regex(/^\d{2}:\d{2}$/),
    event_type: z.string().max(60).nullable(),
    special_requests: z.string().trim().max(1000),
    dietary_requirements: z.string().trim().max(1000),
  })
  .superRefine((v, ctx) => {
    const err = guestCountError(v.booking_type, v.guest_count);
    if (err) ctx.addIssue({ code: "custom", message: err, path: ["guest_count"] });
    if (v.booking_type === "big_party" && !v.event_type)
      ctx.addIssue({ code: "custom", message: "Please choose an event type", path: ["event_type"] });
  });

const GENERIC = "Sorry, we couldn't process that. Please try again or call us.";

export const createReservation = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => {
    const r = bookingInput.safeParse(d);
    if (!r.success) throw new Error(r.error.issues[0]?.message ?? GENERIC);
    return r.data;
  })
  .handler(async ({ data }): Promise<{ reference: string }> => {
    const { getDb, sendNewReservationEmails, UserFacingError } = await import("./reservations.server");
    const today = new Date().toLocaleDateString("en-CA", { timeZone: "Europe/London" });
    if (data.reservation_date < today) throw new Error("Please choose a future date");
    try {
      const db = getDb();
      const { data: row, error } = await db
        .from("reservations")
        .insert({
          ...data,
          event_type: data.booking_type === "big_party" ? data.event_type : null,
          special_requests: data.special_requests || null,
          dietary_requirements: data.dietary_requirements || null,
        })
        .select("*")
        .single();
      if (error || !row) {
        console.error("Reservation insert failed", error);
        throw new UserFacingError(GENERIC);
      }
      const origin = process.env["SITE_URL"] || new URL(getRequest().url).origin;
      await sendNewReservationEmails(row, origin);
      return { reference: row.reference as string };
    } catch (e) {
      if (e instanceof UserFacingError) throw e;
      console.error("createReservation error", e);
      throw new Error(GENERIC);
    }
  });

const actionInput = z.object({
  id: z.string().uuid(),
  action: z.enum(["confirm", "decline"]),
  exp: z.number(),
  sig: z.string().max(128),
});

export const performReservationAction = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => {
    const r = actionInput.safeParse(d);
    if (!r.success) throw new Error("This link is invalid or has expired.");
    return r.data;
  })
  .handler(async ({ data }): Promise<{ result: "updated" | "already"; reference: string; status: string }> => {
    const { getDb, verifyAction, sendDecisionEmail, UserFacingError } = await import("./reservations.server");
    if (!(await verifyAction(data.id, data.action, data.exp, data.sig)))
      throw new Error("This link is invalid or has expired.");
    try {
      const db = getDb();
      const next = data.action === "confirm" ? "confirmed" : "declined";
      const { data: updated, error } = await db
        .from("reservations")
        .update({ status: next, updated_at: new Date().toISOString() })
        .eq("id", data.id)
        .eq("status", "pending")
        .select("*")
        .maybeSingle();
      if (error) {
        console.error("Reservation update failed", error);
        throw new UserFacingError(GENERIC);
      }
      if (updated) {
        await sendDecisionEmail(updated, next);
        return { result: "updated", reference: updated.reference, status: next };
      }
      const { data: existing } = await db.from("reservations").select("reference,status").eq("id", data.id).maybeSingle();
      if (!existing) throw new UserFacingError("This reservation could not be found.");
      return { result: "already", reference: existing.reference, status: existing.status };
    } catch (e) {
      if (e instanceof UserFacingError) throw e;
      console.error("performReservationAction error", e);
      throw new Error(GENERIC);
    }
  });
