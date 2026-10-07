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
