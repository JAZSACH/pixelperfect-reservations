import { createFileRoute, Link } from "@tanstack/react-router";
import hero from "@/assets/hero.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "The Crown & Treaty | Historic Pub & Gastropub, Uxbridge" },
      { name: "description", content: "Grade II* listed 16th-century pub in Uxbridge: gastropub dining, Sunday roasts, garden, functions and weddings." },
      { property: "og:title", content: "The Crown & Treaty, Uxbridge" },
      { property: "og:description", content: "Good food, great drinks, historic surroundings. Book a table online." },
    ],
  }),
  component: Index,
});

const FEATURES = [
  ["Food & Dining", "Comforting, well-cooked pub food served in historic wood-panelled rooms."],
  ["Drinks", "Local ales, craft beers, carefully chosen wines and classic cocktails."],
  ["Sunday Lunch", "Traditional roasts every Sunday from midday until the kitchen closes."],
  ["The Garden", "Eat and drink outdoors, close to the Grand Union Canal."],
  ["Private Functions", "The Charles Bar, Crown Room, Treaty Room and Conservatory."],
  ["Weddings", "Historic rooms licensed for civil ceremonies and receptions."],
];

function Index() {
  return (
    <>
      <section className="relative flex min-h-[92vh] items-end bg-deep text-deep-foreground">
        <img src={hero} alt="Candlelit wood-panelled dining room" width={1920} height={1088} className="absolute inset-0 h-full w-full object-cover opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-t from-deep via-deep/40 to-transparent" />
        <div className="relative mx-auto w-full max-w-6xl px-6 pb-20">
          <p className="eyebrow">Est. 16th Century · Grade II* Listed</p>
          <h1 className="mt-4 max-w-3xl text-5xl leading-[1.05] md:text-7xl">Good food. Great drinks. Historic surroundings.</h1>
          <Link to="/book" className="mt-10 inline-block bg-accent px-8 py-4 text-xs uppercase tracking-[0.22em] text-accent-foreground transition-opacity hover:opacity-90">
            Book a Table
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-24 text-center">
        <p className="eyebrow">Welcome</p>
        <h2 className="mt-4 text-4xl text-primary md:text-5xl">A historic Uxbridge pub with a warm welcome</h2>
        <p className="mt-6 text-lg leading-8 text-muted-foreground">
          On Oxford Road, close to Denham and the Grand Union Canal, The Crown &amp; Treaty brings together
          wood-panelled rooms, a garden and conservatory, and modern gastropub dining — for a quiet pint,
          Sunday lunch with family, or a celebration to remember.
        </p>
      </section>

      <section className="border-y border-border bg-card">
        <div className="mx-auto grid max-w-6xl md:grid-cols-3">
          {FEATURES.map(([t, d]) => (
            <div key={t} className="border-border p-10 md:border-r md:[&:nth-child(3n)]:border-r-0 [&:nth-child(-n+3)]:md:border-b">
              <h3 className="text-2xl text-primary">{t}</h3>
              <p className="mt-3 text-muted-foreground">{d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-24 text-center">
        <h2 className="text-4xl text-primary">Planning a gathering of 21 or more?</h2>
        <p className="mt-4 text-muted-foreground">We host celebrations and events for up to 150 guests.</p>
        <Link to="/book" className="mt-8 inline-block border border-primary px-8 py-4 text-xs uppercase tracking-[0.22em] text-primary transition-colors hover:bg-primary hover:text-primary-foreground">
          Book a Table
        </Link>
      </section>
    </>
  );
}
