import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { VENUE } from "./venue";

// Server-only. Talks to the owner's OWN Supabase project (not Lovable Cloud) using
// EXTERNAL_SUPABASE_* secrets, and sends mail through Resend.

export type ReservationRow = {
  id: string;
  reference: string;
  booking_type: "small_party" | "big_party";
  guest_count: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  reservation_date: string;
  reservation_time: string;
  event_type: string | null;
  special_requests: string | null;
  dietary_requirements: string | null;
  status: "pending" | "confirmed" | "declined";
};

export class UserFacingError extends Error {}

export function getDb(): SupabaseClient {
  const url = process.env["EXTERNAL_SUPABASE_URL"]?.trim().replace(/\/rest\/v1.*$/, "").replace(/\/+$/, "");
  const key = process.env["EXTERNAL_SUPABASE_SERVICE_ROLE_KEY"];
  if (!url || !key) {
    console.error("EXTERNAL_SUPABASE_URL / EXTERNAL_SUPABASE_SERVICE_ROLE_KEY not configured");
    throw new UserFacingError(`Online booking isn't available right now. Please call us on ${VENUE.phone}.`);
  }
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

// ---------- signed owner-action tokens (HMAC-SHA256, Web Crypto) ----------
export type OwnerAction = "confirm" | "decline";
const TOKEN_TTL_MS = 14 * 24 * 60 * 60 * 1000;

async function hmacHex(message: string): Promise<string> {
  const secret = process.env["ACTION_TOKEN_SECRET"];
  if (!secret) throw new Error("ACTION_TOKEN_SECRET not configured");
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(message));
  return Array.from(new Uint8Array(sig)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

export async function signAction(id: string, action: OwnerAction, exp: number): Promise<string> {
  return hmacHex(`${id}.${action}.${exp}`);
}

export async function verifyAction(id: string, action: OwnerAction, exp: number, sig: string): Promise<boolean> {
  if (!Number.isFinite(exp) || exp < Date.now()) return false;
  const expected = await signAction(id, action, exp);
  if (expected.length !== sig.length) return false;
  let diff = 0;
  for (let i = 0; i < expected.length; i++) diff |= expected.charCodeAt(i) ^ sig.charCodeAt(i);
  return diff === 0;
}

async function actionUrl(origin: string, id: string, action: OwnerAction): Promise<string> {
  const exp = Date.now() + TOKEN_TTL_MS;
  const sig = await signAction(id, action, exp);
  const q = new URLSearchParams({ id, action, exp: String(exp), sig });
  return `${origin}/reservation-action?${q.toString()}`;
}

// ---------- email ----------
const esc = (s: string | null | undefined) =>
  String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

async function sendEmail(to: string, subject: string, html: string): Promise<void> {
  const lovableKey = process.env["LOVABLE_API_KEY"];
  const resendKey = process.env["RESEND_API_KEY"];
  if (!lovableKey || !resendKey) {
    console.error("Resend is not configured");
    return;
  }
  const from = process.env["RESEND_FROM"] || "The Crown & Treaty <onboarding@resend.dev>";
  try {
    const res = await fetch("https://connector-gateway.lovable.dev/resend/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${lovableKey}`,
        "X-Connection-Api-Key": resendKey,
      },
      body: JSON.stringify({ from, to: [to], subject, html, reply_to: VENUE.email }),
    });
    if (!res.ok) console.error(`Resend failed [${res.status}]: ${await res.text()}`);
  } catch (e) {
    console.error("Resend request error", e);
  }
}

function layout(title: string, inner: string): string {
  return `<div style="font-family:Georgia,serif;background:#f6f1e4;padding:32px"><div style="max-width:560px;margin:auto;background:#fffdf7;border:1px solid #c9a24a;padding:32px;color:#1f3a2c">
<h1 style="font-weight:normal;margin:0 0 16px">${esc(title)}</h1>${inner}
<p style="margin-top:32px;font-size:13px;color:#6b6b5a">The Crown &amp; Treaty · ${esc(VENUE.address)} · ${esc(VENUE.phone)}</p></div></div>`;
}

function details(r: ReservationRow): string {
  const rows: [string, string][] = [
    ["Reference", r.reference],
    ["Name", `${r.first_name} ${r.last_name}`],
    ["Email", r.email],
    ["Phone", r.phone],
    ["Type", r.booking_type === "big_party" ? "Big Party" : "Small Party"],
    ["Guests", String(r.guest_count)],
    ["Date", r.reservation_date],
    ["Time", r.reservation_time.slice(0, 5)],
  ];
  if (r.event_type) rows.push(["Event", r.event_type]);
  if (r.special_requests) rows.push(["Special requests", r.special_requests]);
  if (r.dietary_requirements) rows.push(["Dietary", r.dietary_requirements]);
  return `<table style="border-collapse:collapse;width:100%">${rows
    .map(([k, v]) => `<tr><td style="padding:4px 12px 4px 0;color:#6b6b5a;vertical-align:top">${esc(k)}</td><td style="padding:4px 0">${esc(v)}</td></tr>`)
    .join("")}</table>`;
}

export async function sendNewReservationEmails(r: ReservationRow, origin: string): Promise<void> {
  const [confirmUrl, declineUrl] = await Promise.all([actionUrl(origin, r.id, "confirm"), actionUrl(origin, r.id, "decline")]);
  const btn = (href: string, label: string, bg: string) =>
    `<a href="${esc(href)}" style="display:inline-block;background:${bg};color:#fff;text-decoration:none;padding:12px 24px;margin-right:8px">${label}</a>`;
  await Promise.all([
    sendEmail(
      r.email,
      `We've received your request (${r.reference})`,
      layout("Reservation Request Received", `<p>Dear ${esc(r.first_name)}, thank you for your request. It is currently pending approval and we'll email you once it has been reviewed.</p>${details(r)}`),
    ),
    sendEmail(
      process.env["OWNER_EMAIL"] || VENUE.email,
      `New ${r.booking_type === "big_party" ? "Big Party" : "Small Party"} request ${r.reference}`,
      layout("New reservation request", `${details(r)}<p style="margin-top:24px">${btn(confirmUrl, "Confirm", "#1f3a2c")}${btn(declineUrl, "Decline", "#8a2f2f")}</p><p style="font-size:13px;color:#6b6b5a">Each button opens a page where you confirm your choice. Links expire in 14 days.</p>`),
    ),
  ]);
}

export async function sendDecisionEmail(r: ReservationRow, status: "confirmed" | "declined"): Promise<void> {
  const ok = status === "confirmed";
  await sendEmail(
    r.email,
    ok ? `Your reservation is confirmed (${r.reference})` : `Update on your reservation request (${r.reference})`,
    layout(
      ok ? "Reservation Confirmed" : "Reservation Declined",
      `<p>Dear ${esc(r.first_name)}, ${
        ok
          ? "we're delighted to confirm your reservation. We look forward to welcoming you."
          : `unfortunately we're unable to accommodate your request. Please call us on ${esc(VENUE.phone)} to discuss alternatives.`
      }</p>${details(r)}`,
    ),
  );
}
