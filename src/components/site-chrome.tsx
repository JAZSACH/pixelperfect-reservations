import { Link } from "@tanstack/react-router";
import { VENUE } from "@/lib/venue";

export function SiteHeader() {
  return (
    <header className="absolute inset-x-0 top-0 z-20 text-deep-foreground">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <Link to="/" className="leading-none">
          <span className="block font-serif text-2xl">The Crown &amp; Treaty</span>
          <span className="eyebrow mt-1 block">Uxbridge · Est. 16th C.</span>
        </Link>
        <div className="flex items-center gap-6">
          <a href={`tel:${VENUE.phoneTel}`} className="hidden text-sm opacity-80 hover:opacity-100 sm:block">
            {VENUE.phone}
          </a>
          <Link
            to="/book"
            className="border border-accent px-5 py-2.5 text-xs uppercase tracking-[0.2em] text-accent transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            Book a Table
          </Link>
        </div>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="bg-deep text-deep-foreground">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-16 md:grid-cols-3">
        <div>
          <p className="font-serif text-2xl">The Crown &amp; Treaty</p>
          <p className="mt-2 text-sm opacity-70">Grade II* listed · 16th century</p>
        </div>
        <div className="text-sm leading-7 opacity-80">
          <p className="eyebrow mb-2">Find us</p>
          <p>{VENUE.address}</p>
          <p><a href={`tel:${VENUE.phoneTel}`}>{VENUE.phone}</a></p>
          <p><a href={`mailto:${VENUE.email}`}>{VENUE.email}</a></p>
        </div>
        <div className="text-sm leading-7 opacity-80">
          <p className="eyebrow mb-2">Opening hours</p>
          {VENUE.hours.map((h) => (
            <p key={h.days}>{h.days}: {h.time}</p>
          ))}
        </div>
      </div>
    </footer>
  );
}
