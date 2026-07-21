export const metadata = {
  title: "Image Credits | Savannah Retreats Africa",
  description: "Attribution for photography used on this site under Creative Commons licenses.",
};

const CREDITS = [
  {
    subject: "Mount Kenya (Batian & Nelion peaks)",
    usedIn: "Homepage hero, Discover Kenya hero, homepage \"Mountains\" section, homepage Discover teaser",
    filename: "This_is_Thomson-Batian-Nelion-MT.kenya.jpg",
    source: "https://commons.wikimedia.org/wiki/File:This_is_Thomson-Batian-Nelion-MT.kenya.jpg",
    license: "CC BY-SA, via Wikimedia Commons",
  },
  {
    subject: "Aberdare Range",
    usedIn: "Homepage hero, homepage \"Mountains\" section",
    filename: "Aberdare_range.jpg",
    source: "https://commons.wikimedia.org/wiki/File:Aberdare_range.jpg",
    license: "CC BY-SA, via Wikimedia Commons",
  },
  {
    subject: "Gura Falls, Aberdare Range",
    usedIn: "Homepage Discover teaser (\"Hills\")",
    filename: "Gura_Giant_Falls_view_from_the_top_of_Karuru_Falls.jpg",
    source:
      "https://commons.wikimedia.org/wiki/File:Gura_Giant_Falls_view_from_the_top_of_Karuru_Falls.jpg",
    license: "CC BY-SA, via Wikimedia Commons",
  },
];

export default function CreditsPage() {
  return (
    <main className="bg-linen">
      <div className="section-pad mx-auto max-w-3xl py-28 md:py-32">
        <span className="eyebrow">Attribution</span>
        <h1 className="mt-4 font-display text-4xl text-umber md:text-5xl">
          Image Credits
        </h1>
        <p className="mt-6 text-[15px] leading-relaxed text-ink">
          Most photography on this site is licensed for unrestricted
          commercial use. A small number of images are sourced from
          Wikimedia Commons under Creative Commons licenses that require
          attribution — credited here, per the license terms.
        </p>

        <div className="mt-14 space-y-8">
          {CREDITS.map((c) => (
            <div key={c.filename} className="border-t border-umber/10 pt-6">
              <h2 className="font-display text-xl text-umber">{c.subject}</h2>
              <p className="mt-1 text-[12px] uppercase tracking-widest2 text-ink/50">
                Used in: {c.usedIn}
              </p>
              <p className="mt-3 text-[13px] text-ink/80">{c.license}</p>
              <a
                href={c.source}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 block text-[13px] text-ochre hover:underline"
              >
                {c.source}
              </a>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
