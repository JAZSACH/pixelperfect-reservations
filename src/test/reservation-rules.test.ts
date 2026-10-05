import { describe, it, expect } from "vitest";
import { guestCountError } from "@/lib/reservation-rules";

describe("small party guest limits", () => {
  it("allows 1", () => expect(guestCountError("small_party", 1)).toBeNull());
  it("allows 20", () => expect(guestCountError("small_party", 20)).toBeNull());
  it("rejects 21", () => expect(guestCountError("small_party", 21)).not.toBeNull());
});

describe("big party guest limits", () => {
  it("rejects 20", () => expect(guestCountError("big_party", 20)).not.toBeNull());
  it("allows 21", () => expect(guestCountError("big_party", 21)).toBeNull());
  it("allows 150", () => expect(guestCountError("big_party", 150)).toBeNull());
  it("rejects 151", () => expect(guestCountError("big_party", 151)).not.toBeNull());
});
