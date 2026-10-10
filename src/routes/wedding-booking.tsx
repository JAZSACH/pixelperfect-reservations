import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { WEDDING_ROOMS, type WeddingRoom } from "@/lib/reservation-rules";
import { BookingForm, OptionCard } from "@/components/booking-form";

export const Route = createFileRoute("/wedding-booking")({
  head: () => ({
    meta: [
      { title: "Book Your Wedding | The Crown & Treaty, Uxbridge" },
      { name: "description", content: "Enquire about holding your wedding in The Crown Room (up to 26 guests) or The Treaty Room (up to 21 guests) at The Crown & Treaty." },
      { property: "og:title", content: "Book Your Wedding at The Crown & Treaty" },
      { property: "og:description", content: "Choose The Crown Room or The Treaty Room for your wedding in Uxbridge." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: WeddingBookingPage,
});

function WeddingBookingPage() {
  const [room, setRoom] = useState<WeddingRoom | null>(null);
  return (
    <>
      <section className="bg-deep pb-16 pt-40 text-deep-foreground">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <p className="eyebrow">Weddings</p>
          <h1 className="mt-4 text-5xl md:text-6xl">Book Your Wedding</h1>
        </div>
      </section>
      <section className="mx-auto max-w-4xl px-6 py-16">
        <div className="grid gap-6 md:grid-cols-2">
          <OptionCard active={room === "crown"} onClick={() => setRoom("crown")} title={WEDDING_ROOMS.crown.name} range={`Up to ${WEDDING_ROOMS.crown.max} guests`} desc="Our historic Crown room, licensed for civil ceremonies, wedding breakfasts and receptions." />
          <OptionCard active={room === "treaty"} onClick={() => setRoom("treaty")} title={WEDDING_ROOMS.treaty.name} range={`Up to ${WEDDING_ROOMS.treaty.max} guests`} desc="Our historic Treaty room, licensed for civil ceremonies, wedding breakfasts and receptions." />
        </div>
        {room && <BookingForm key={room} variant={{ kind: "wedding", room }} />}
      </section>
    </>
  );
}
