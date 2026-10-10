// Shared guest-count rules. Enforced in the browser, in reservations.functions.ts, and by a DB check constraint.
export type BookingType = "small_party" | "big_party";

export const LIMITS: Record<BookingType, { min: number; max: number }> = {
  small_party: { min: 1, max: 20 },
  big_party: { min: 21, max: 150 },
};

export const EVENT_TYPES = [
  "Birthday",
  "Celebration",
  "Corporate Event",
  "Family Gathering",
  "Wedding / Wedding Event",
  "Other",
] as const;

/** Returns an error message, or null when the guest count is valid. */
export function guestCountError(type: BookingType, n: number): string | null {
  if (!Number.isInteger(n)) return "Please enter a whole number of guests.";
  if (type === "small_party") {
    if (n < 1) return "Please enter at least 1 guest.";
    if (n > 20)
      return "Small Party bookings are limited to 20 guests. For larger groups, please choose Big Party.";
    return null;
  }
  if (n < 21)
    return "Big Party bookings are for 21–150 guests. For smaller groups, please choose Small Party.";
  if (n > 150) return "Big Party bookings are limited to 150 guests.";
  return null;
}

// ---------- Wedding room bookings ----------
// Wedding bookings choose a room instead of Small/Big Party. They are stored using the
// existing party types so the database guest-limit constraint keeps working:
// 1–20 guests -> small_party, 21+ -> big_party, with the room name kept in event_type.
export type WeddingRoom = "crown" | "treaty";

export const WEDDING_ROOMS: Record<WeddingRoom, { name: string; max: number }> = {
  crown: { name: "The Crown Room", max: 26 },
  treaty: { name: "The Treaty Room", max: 21 },
};

export const WEDDING_EVENT_PREFIX = "Wedding – ";

export function weddingEventType(room: WeddingRoom): string {
  return `${WEDDING_EVENT_PREFIX}${WEDDING_ROOMS[room].name}`;
}

/** Returns an error message, or null when the wedding guest count is valid for the room. */
export function weddingGuestError(room: WeddingRoom, n: number): string | null {
  const { name, max } = WEDDING_ROOMS[room];
  if (!Number.isInteger(n)) return "Please enter a whole number of guests.";
  if (n < 1) return "Please enter at least 1 guest.";
  if (n > max) return `${name} holds a maximum of ${max} guests. Please choose the other room or call us.`;
  return null;
}

/** The party type used to store a wedding booking. */
export function weddingStorageType(n: number): BookingType {
  return n <= LIMITS.small_party.max ? "small_party" : "big_party";
}
