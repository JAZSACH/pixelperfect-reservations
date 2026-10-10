import { describe, it, expect } from "vitest";
import { guestCountError, weddingGuestError, weddingStorageType } from "@/lib/reservation-rules";

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

describe("wedding room limits", () => {
  it("Crown allows 26", () => expect(weddingGuestError("crown", 26)).toBeNull());
  it("Crown rejects 27", () => expect(weddingGuestError("crown", 27)).not.toBeNull());
  it("Treaty allows 21", () => expect(weddingGuestError("treaty", 21)).toBeNull());
  it("Treaty rejects 22", () => expect(weddingGuestError("treaty", 22)).not.toBeNull());
  it("stores 20 as small party", () => expect(weddingStorageType(20)).toBe("small_party"));
  it("stores 21 as big party", () => expect(weddingStorageType(21)).toBe("big_party"));
});
