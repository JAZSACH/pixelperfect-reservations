import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { ArrowLeft, ArrowRight, X, Expand } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CEREMONY_ROOMS } from "@/lib/weddings";
import ceremonyRoom from "@/assets/wedding-ceremony-room.jpg.asset.json";
import ceremony from "@/assets/wedding-ceremony.jpg.asset.json";
import carriage from "@/assets/wedding-carriage.jpg.asset.json";
import breakfast from "@/assets/wedding-wedding-breakfast.jpg.asset.json";
import conservatory from "@/assets/wedding-conservatory.jpg.asset.json";
import buffet from "@/assets/wedding-buffet.jpg.asset.json";
import gardenBuffet from "@/assets/wedding-garden-buffet.jpg.asset.json";
import setting from "@/assets/wedding-table-setting.jpg.asset.json";
import reception from "@/assets/wedding-reception.jpg.asset.json";

export const Route = createFileRoute("/weddings")({
  head: () => ({ meta: [
    { title: "Weddings | The Crown & Treaty, Uxbridge" },
    { name: "description", content: "Civil ceremonies, wedding breakfasts and receptions in the historic Crown and Treaty rooms, with celebrations in the Charles bar." },
    { property: "og:title", content: "Weddings at The Crown & Treaty" },
    { property: "og:description", content: "Celebrate your wedding in our historic Uxbridge rooms, from your ceremony to your evening reception." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: WeddingsPage,
});

const PHOTOS = [
  { src: ceremony.url, alt: "A wedding ceremony in the historic Treaty room" },
  { src: breakfast.url, alt: "Wedding breakfast tables with silver candelabras" },
  { src: carriage.url, alt: "A horse-drawn wedding carriage outside The Crown & Treaty" },
  { src: conservatory.url, alt: "The conservatory set for wedding dining" },
  { src: buffet.url, alt: "A wedding buffet in the wood-panelled rooms" },
  { src: reception.url, alt: "Wedding guests enjoying the reception buffet" },
  { src: gardenBuffet.url, alt: "A wedding buffet in the conservatory" },
  { src: setting.url, alt: "A wedding menu and place setting" },
];

function EnquiryButton() {
  return <Button asChild className="h-auto max-w-full whitespace-normal rounded-sm bg-wedding-cta px-8 py-3 font-serif text-2xl italic text-wedding-cta-foreground shadow-none hover:bg-wedding-cta/90"><Link to="/wedding-booking">Book or enquire now</Link></Button>;
}

function WeddingsPage() {
  const [selected, setSelected] = useState<number | null>(null);
  const photo = selected === null ? null : PHOTOS[selected];
  function move(direction: number) {
    setSelected((current) => current === null ? null : (current + direction + PHOTOS.length) % PHOTOS.length);
  }
  return <>
    <section className="bg-deep pt-32 text-deep-foreground">
      <div className="relative flex h-72 items-center justify-center overflow-hidden md:h-96">
        <img src={ceremonyRoom.url} alt="The Crown & Treaty room arranged for a civil wedding ceremony" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-deep/35" />
        <h1 className="relative flex items-center gap-4 px-6 text-5xl md:text-6xl"><span className="h-px w-10 bg-deep-foreground md:w-20" />Weddings<span className="h-px w-10 bg-deep-foreground md:w-20" /></h1>
      </div>
    </section>
    <section className="bg-card">
      <div className="mx-auto max-w-3xl px-6 py-14 text-center md:py-20">
        <h2 className="text-3xl uppercase leading-tight text-primary md:text-4xl">Weddings at The Crown &amp; Treaty</h2>
        <div className="my-9"><EnquiryButton /></div>
        <div className="space-y-6 text-lg leading-8 text-muted-foreground md:text-xl md:leading-9">
          <p>In addition to wedding breakfasts and receptions, our historic Crown and Treaty rooms are both licensed to hold civil wedding ceremonies.</p>
          <p>The rooms can be paired up with other spaces in the building to make the perfect day, for example a service in the historic Treaty room, wedding breakfast in the Crown room and then an evening reception in the beautiful Charles bar.</p>
          <p className="font-bold">For a civil ceremony the rooms are licensed to hold</p>
          {CEREMONY_ROOMS.map(room => <p key={room.name}><strong>{room.name}</strong> – {room.guests} guests + happy couple + two registrars</p>)}
        </div>
      </div>
    </section>
    <section className="bg-secondary px-6 py-10 text-center"><EnquiryButton /></section>
    <section className="bg-card px-6 py-14 md:py-20" aria-label="Wedding photo gallery">
      <div className="mx-auto grid max-w-6xl gap-5 md:grid-cols-2">
        {PHOTOS.map((item, index) => <Button key={item.src} variant="ghost" onClick={() => setSelected(index)} aria-label={`View photo: ${item.alt}`} className="group relative h-auto w-full overflow-hidden rounded-none p-0 hover:bg-transparent">
          <img src={item.src} alt={item.alt} loading="lazy" className="aspect-[4/3] w-full object-cover transition-transform duration-300 motion-safe:group-hover:scale-105" />
          <span className="absolute bottom-3 right-3 flex size-9 items-center justify-center bg-deep/80 text-deep-foreground"><Expand /></span>
        </Button>)}
      </div>
    </section>
    <Dialog.Root open={selected !== null} onOpenChange={open => { if (!open) setSelected(null); }}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-deep/90" />
        <Dialog.Content aria-describedby={undefined} onKeyDown={e => { if (e.key === "ArrowRight") move(1); if (e.key === "ArrowLeft") move(-1); }} className="fixed inset-0 z-50 flex flex-col items-center justify-center px-4 py-20 text-deep-foreground outline-none md:px-20">
          <Dialog.Title className="sr-only">Wedding photo gallery</Dialog.Title>
          <Dialog.Close asChild><Button variant="ghost" size="icon" aria-label="Close photo" className="absolute right-5 top-5 text-deep-foreground hover:bg-deep-foreground/10"><X /></Button></Dialog.Close>
          {photo && <img src={photo.src} alt={photo.alt} className="max-h-[70vh] w-auto max-w-full object-contain" />}
          <div className="mt-5 flex items-center gap-6">
            <Button variant="ghost" size="icon" aria-label="Previous photo" onClick={() => move(-1)} className="hover:bg-deep-foreground/10"><ArrowLeft /></Button>
            <span className="text-sm">{selected === null ? 0 : selected + 1} / {PHOTOS.length}</span>
            <Button variant="ghost" size="icon" aria-label="Next photo" onClick={() => move(1)} className="hover:bg-deep-foreground/10"><ArrowRight /></Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  </>;
}