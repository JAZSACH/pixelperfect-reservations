import { createFileRoute, Link } from "@tanstack/react-router";
import hero from "@/assets/hero.jpg";
import food from "@/assets/food.jpg";
import garden from "@/assets/garden.jpg";
import functions from "@/assets/functions.jpg";

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

const SECTIONS = [
  {
    eyebrow: "Food & Drink",
    title: "Honest pub food, cooked well",
    body: "Comforting, seasonal plates served in historic wood-panelled rooms — from hearty mains to our traditional Sunday roast, alongside local ales, craft beers and carefully chosen wines.",
    image: food,
    alt: "Fish and chips and a pint of ale in the candlelit dining room",
  },
  {
    eyebrow: "The Garden",
    title: "Drinks by the canal",
    body: "Our garden and conservatory open out towards the Grand Union Canal — long summer evenings under the festoon lights, blankets and firelight when the weather turns.",
    image: garden,
    alt: "The pub garden at sunset, with tables beside the Grand Union Canal",
  },
  {
    eyebrow: "Celebrations",
    title: "Rooms with history",
    body: "The Charles Bar, Crown Room, Treaty Room and Conservatory host private dining, parties and weddings for up to 150 guests — historic rooms licensed for civil ceremonies.",
    image: functions,
    alt: "A candlelit function room dressed for a celebration",
    bigParty: true,
  },
];

function Index() {
  return (
    <>
      <section className="relative flex min-h-[92vh] items-end bg-deep text-deep-foreground">
        <img src={hero} alt="Candlelit wood-panelled dining room" width={1920} height={1088} className="absolute inset-0 h-full w-full object-cover opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-t from-deep via-deep/40 to-transparent" />
        <div className="relative mx-auto w-full max-w-6xl px-6 pb-20">
          <h1 className="font-serif text-5xl leading-[1.05] md:text-7xl">The Crown &amp; Treaty</h1>
          <p className="mt-4 max-w-3xl text-2xl leading-snug opacity-90 md:text-3xl">Good food. Great drinks. Historic surroundings.</p>
          <p className="eyebrow mt-4">Est. 16th Century · Grade II* Listed</p>
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

      {SECTIONS.map((s, i) => (
        <section key={s.eyebrow} className={i % 2 === 1 ? "bg-card" : undefined}>
          <div className="mx-auto grid max-w-6xl items-center gap-10 px-6 py-16 md:grid-cols-2 md:gap-16 md:py-24">
            <img
              src={s.image}
              alt={s.alt}
              width={1024}
              height={1280}
              loading="lazy"
              className={`aspect-[4/5] w-full border border-border object-cover shadow-lg ${i % 2 === 1 ? "md:order-2" : ""}`}
            />
            <div className={i % 2 === 1 ? "md:order-1" : undefined}>
              <p className="eyebrow">{s.eyebrow}</p>
              <h2 className="mt-3 font-serif text-3xl leading-tight text-primary md:text-4xl">{s.title}</h2>
              <p className="mt-5 text-lg leading-8 text-muted-foreground">{s.body}</p>
              <Link
                to="/book"
                className="mt-8 inline-block border border-primary px-8 py-4 text-xs uppercase tracking-[0.22em] text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
              >
                {s.bigParty ? "Plan an Event" : "Book a Table"}
              </Link>
            </div>
          </div>
        </section>
      ))}

      <section className="border-y border-border bg-deep text-center text-deep-foreground">
        <div className="mx-auto max-w-6xl px-6 py-24">
          <p className="eyebrow">Gatherings</p>
          <h2 className="mt-3 font-serif text-4xl md:text-5xl">Planning a gathering of 21 or more?</h2>
          <p className="mx-auto mt-4 max-w-xl text-lg opacity-80">We host birthdays, celebrations, corporate events and weddings for up to 150 guests.</p>
          <Link to="/book" className="mt-10 inline-block bg-accent px-8 py-4 text-xs uppercase tracking-[0.22em] text-accent-foreground transition-opacity hover:opacity-90">
            Book a Table
          </Link>
        </div>
      </section>
    </>
  );
}
