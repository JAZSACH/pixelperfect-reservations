import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { z } from "zod";
import { performReservationAction } from "@/lib/reservations.functions";

// Owner lands here from the email buttons. The signed token is verified on the
// server; nothing privileged happens in the browser.
export const Route = createFileRoute("/reservation-action")({
  ssr: false,
  validateSearch: z.object({
    id: z.string().max(64).optional(),
    action: z.enum(["confirm", "decline"]).optional(),
    exp: z.coerce.number().optional(),
    sig: z.string().max(128).optional(),
  }),
  head: () => ({
    meta: [
      { title: "Reservation Action | The Crown & Treaty" },
      { name: "description", content: "Confirm or decline a reservation." },
      { property: "og:title", content: "Reservation Action" },
      { property: "og:description", content: "Owner reservation action." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ActionPage,
});

function ActionPage() {
  const s = Route.useSearch();
  const act = useServerFn(performReservationAction);
  const [state, setState] = useState<{ title: string; body: string } | null>(null);
  const [ready, setReady] = useState(false);

  async function run() {
    setState({ title: "Working…", body: "" });
    try {
      const data = await act({ data: s });
      if (data.result === "already") return setState({ title: "No change made", body: `Reservation ${data.reference} is already ${data.status}.` });
      setState({
        title: data.status === "confirmed" ? "Reservation Confirmed" : "Reservation Declined",
        body: `Reservation ${data.reference} has been ${data.status}. The customer has been emailed.`,
      });
    } catch (e) {
      setState({ title: "Couldn't update reservation", body: e instanceof Error ? e.message : "This link is invalid or has expired." });
    }
  }

  useEffect(() => setReady(true), []);
  const valid = s.id && s.action && s.exp && s.sig;

  return (
    <section className="flex min-h-screen items-center bg-deep px-6 py-32 text-deep-foreground">
      <div className="mx-auto max-w-xl text-center">
        {!valid ? (
          <h1 className="text-4xl">Invalid link</h1>
        ) : state ? (
          <>
            <h1 className="text-5xl">{state.title}</h1>
            <p className="mt-6 text-lg opacity-80">{state.body}</p>
            <Link to="/" className="mt-10 inline-block text-xs uppercase tracking-[0.22em] text-accent">Back to Website</Link>
          </>
        ) : (
          <>
            <p className="eyebrow">Owner action</p>
            <h1 className="mt-4 text-5xl">{s.action === "confirm" ? "Confirm this reservation?" : "Decline this reservation?"}</h1>
            <button disabled={!ready} onClick={run} className="mt-10 bg-accent px-8 py-4 text-xs uppercase tracking-[0.22em] text-accent-foreground">
              {s.action === "confirm" ? "Confirm Reservation" : "Decline Reservation"}
            </button>
          </>
        )}
      </div>
    </section>
  );
}
