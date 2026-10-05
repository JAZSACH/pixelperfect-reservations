import { createFileRoute, Link } from "@tanstack/react-router";
import { z } from "zod";

export const Route = createFileRoute("/reservation-received")({
  validateSearch: z.object({ ref: z.string().max(20).optional() }),
  head: () => ({
    meta: [
      { title: "Reservation Request Received | The Crown & Treaty" },
      { name: "description", content: "Your reservation request is pending approval." },
      { property: "og:title", content: "Reservation Request Received" },
      { property: "og:description", content: "Your reservation request at The Crown & Treaty is pending approval." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Received,
});

function Received() {
  const { ref } = Route.useSearch();
  return (
    <section className="flex min-h-screen items-center bg-deep px-6 py-32 text-deep-foreground">
      <div className="mx-auto max-w-xl text-center">
        <p className="eyebrow">Pending approval</p>
        <h1 className="mt-4 text-5xl">Reservation Request Received</h1>
        <p className="mt-6 text-lg leading-8 opacity-80">
          Thank you for your request. Your reservation is currently pending approval. We’ll email you once your request has been reviewed.
        </p>
        {ref && <p className="mt-8 font-serif text-4xl text-accent">{ref}</p>}
        <Link to="/" className="mt-10 inline-block border border-accent px-8 py-4 text-xs uppercase tracking-[0.22em] text-accent hover:bg-accent hover:text-accent-foreground">
          Back to Website
        </Link>
      </div>
    </section>
  );
}
