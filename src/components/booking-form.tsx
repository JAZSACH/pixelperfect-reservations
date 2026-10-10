import { useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { z } from "zod";
import { useServerFn } from "@tanstack/react-start";
import {
  EVENT_TYPES,
  LIMITS,
  WEDDING_ROOMS,
  guestCountError,
  weddingGuestError,
  weddingStorageType,
  type BookingType,
  type WeddingRoom,
} from "@/lib/reservation-rules";
import { createReservation } from "@/lib/reservations.functions";

export type FormVariant = { kind: "party"; type: BookingType } | { kind: "wedding"; room: WeddingRoom };

const base = z.object({
  first_name: z.string().trim().min(1, "Required").max(80),
  last_name: z.string().trim().min(1, "Required").max(80),
  email: z.string().trim().email("Enter a valid email").max(255),
  phone: z.string().trim().min(6, "Enter a valid phone number").max(30).regex(/^[0-9+()\-\s]+$/, "Enter a valid phone number"),
  reservation_date: z.string().min(1, "Required"),
  reservation_time: z.string().min(1, "Required"),
  special_requests: z.string().trim().max(1000),
  dietary_requirements: z.string().trim().max(1000),
  event_type: z.string().max(60),
});

const inputCls = "w-full border border-input bg-card px-4 py-3 outline-none focus:border-ring";

export function OptionCard(p: { active: boolean; onClick: () => void; title: string; range: string; desc: string }) {
  return (
    <button
      type="button"
      onClick={p.onClick}
      aria-pressed={p.active}
      className={`border p-8 text-left transition-colors ${p.active ? "border-accent bg-primary text-primary-foreground" : "border-border bg-card hover:border-accent"}`}
    >
      <p className="eyebrow">{p.range}</p>
      <h2 className="mt-3 text-3xl">{p.title}</h2>
      <p className={`mt-2 ${p.active ? "opacity-80" : "text-muted-foreground"}`}>{p.desc}</p>
    </button>
  );
}

export function BookingForm({ variant }: { variant: FormVariant }) {
  const navigate = useNavigate();
  const create = useServerFn(createReservation);
  const wedding = variant.kind === "wedding";
  const big = variant.kind === "party" && variant.type === "big_party";
  const lim = variant.kind === "wedding" ? { min: 1, max: WEDDING_ROOMS[variant.room].max } : LIMITS[variant.type];
  const checkGuests = (n: number) =>
    variant.kind === "wedding" ? weddingGuestError(variant.room, n) : guestCountError(variant.type, n);
  const [guests, setGuests] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");
  const today = new Date().toISOString().slice(0, 10);
  const guestErr = guests === "" ? null : checkGuests(Number(guests));

  const title = variant.kind === "wedding" ? `${WEDDING_ROOMS[variant.room].name} wedding enquiry` : big ? "Big Party request" : "Small Party request";
  const submitLabel = wedding ? "Request this room" : big ? "Request Big Party" : "Request a Table";

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setServerError("");
    const fd = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    const parsed = base.safeParse({ ...fd, event_type: fd["event_type"] ?? "" });
    const errs: Record<string, string> = {};
    if (!parsed.success) parsed.error.issues.forEach((i) => (errs[String(i.path[0])] = i.message));
    const gErr = guests === "" ? "Required" : checkGuests(Number(guests));
    if (gErr) errs["guest_count"] = gErr;
    if (big && !fd["event_type"]) errs["event_type"] = "Please choose an event type";
    if (fd["reservation_date"] && fd["reservation_date"] < today) errs["reservation_date"] = "Please choose a future date";
    setErrors(errs);
    if (Object.keys(errs).length || !parsed.success) return;
    setSubmitting(true);
    try {
      const n = Number(guests);
      const data = await create({
        data:
          variant.kind === "wedding"
            ? { ...parsed.data, booking_type: weddingStorageType(n), wedding_room: variant.room, guest_count: n, event_type: null }
            : { ...parsed.data, booking_type: variant.type, guest_count: n, event_type: big ? parsed.data.event_type : null },
      });
      navigate({ to: "/reservation-received", search: { ref: data.reference } });
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Sorry, we couldn't send your request. Please try again or call us.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} noValidate className="mt-12 border border-border bg-card p-8 md:p-10">
      <h3 className="text-3xl text-primary">{title}</h3>
      <div className="mt-8 grid gap-5 md:grid-cols-2">
        <Field label="First name" name="first_name" errors={errors} />
        <Field label="Last name" name="last_name" errors={errors} />
        <Field label="Email" name="email" type="email" errors={errors} />
        <Field label="Phone number" name="phone" type="tel" errors={errors} />
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium">Number of guests ({wedding ? `max ${lim.max}` : `${lim.min}–${lim.max}`})</span>
          <input className={inputCls} type="number" inputMode="numeric" min={lim.min} max={lim.max} value={guests} onChange={(e) => setGuests(e.target.value)} />
          {(guestErr || errors["guest_count"]) && <span className="mt-1 block text-sm text-destructive">{guestErr ?? errors["guest_count"]}</span>}
        </label>
        <Field label={wedding ? "Wedding date" : "Date"} name="reservation_date" type="date" min={today} errors={errors} />
        <Field label="Preferred time" name="reservation_time" type="time" errors={errors} />
        {big && (
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium">Event type</span>
            <select name="event_type" defaultValue="" className={inputCls}>
              <option value="" disabled>Choose…</option>
              {EVENT_TYPES.map((t) => <option key={t}>{t}</option>)}
            </select>
            {errors["event_type"] && <span className="mt-1 block text-sm text-destructive">{errors["event_type"]}</span>}
          </label>
        )}
      </div>
      <div className="mt-5 grid gap-5">
        <Area label={wedding ? "Tell us about your day" : "Special requests"} name="special_requests" />
        <Area label="Dietary requirements" name="dietary_requirements" />
      </div>
      {serverError && <p className="mt-6 border border-destructive p-4 text-sm text-destructive">{serverError}</p>}
      <button disabled={submitting || !!guestErr} className="mt-8 bg-primary px-8 py-4 text-xs uppercase tracking-[0.22em] text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50">
        {submitting ? "Sending…" : submitLabel}
      </button>
    </form>
  );
}

function Field(p: { label: string; name: string; type?: string; min?: string; errors: Record<string, string> }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium">{p.label}</span>
      <input className={inputCls} name={p.name} type={p.type ?? "text"} min={p.min} />
      {p.errors[p.name] && <span className="mt-1 block text-sm text-destructive">{p.errors[p.name]}</span>}
    </label>
  );
}

function Area(p: { label: string; name: string }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium">{p.label} <span className="text-muted-foreground">(optional)</span></span>
      <textarea name={p.name} rows={3} maxLength={1000} className={inputCls} />
    </label>
  );
}
