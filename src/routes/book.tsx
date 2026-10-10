import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import type { BookingType } from "@/lib/reservation-rules";
import { BookingForm, OptionCard } from "@/components/booking-form";

export const Route = createFileRoute("/book")({
  head: () => ({
    meta: [
      { title: "Book a Table | The Crown & Treaty, Uxbridge" },
      { name: "description", content: "Request a table or a big party booking at The Crown & Treaty in Uxbridge." },
      { property: "og:title", content: "Book a Table at The Crown & Treaty" },
      { property: "og:description", content: "Small parties of 1–20 and big parties of 21–150 guests." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: BookPage,
});

function BookPage() {
  const [type, setType] = useState<BookingType | null>(null);
  return (
    <>
      <section className="bg-deep pb-16 pt-40 text-deep-foreground">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <p className="eyebrow">Reservations</p>
          <h1 className="mt-4 text-5xl md:text-6xl">Book a Table</h1>
        </div>
      </section>
      <section className="mx-auto max-w-4xl px-6 py-16">
        <div className="grid gap-6 md:grid-cols-2">
          <OptionCard active={type === "small_party"} onClick={() => setType("small_party")} title="Small Party" range="1–20 guests" desc="Book a table for a small party." />
          <OptionCard active={type === "big_party"} onClick={() => setType("big_party")} title="Big Party" range="21–150 guests" desc="For larger groups, celebrations and events." />
        </div>
        {type && <BookingForm key={type} variant={{ kind: "party", type }} />}
      </section>
    </>
  );
}
