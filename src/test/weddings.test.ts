import { describe, expect, it } from "vitest";
import { CEREMONY_ROOMS } from "@/lib/weddings";

describe("Civil ceremony capacities", () => {
  it("allows 26 guests plus the couple and two registrars in Crown", () => {
    expect(CEREMONY_ROOMS.find(room => room.name === "Crown")).toEqual({ name: "Crown", guests: 26, couple: 2, registrars: 2 });
  });
  it("allows 21 guests plus the couple and two registrars in Treaty", () => {
    expect(CEREMONY_ROOMS.find(room => room.name === "Treaty")).toEqual({ name: "Treaty", guests: 21, couple: 2, registrars: 2 });
  });
});