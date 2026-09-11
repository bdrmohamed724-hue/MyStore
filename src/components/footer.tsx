import Link from "next/link";

const COLS = [
  {
    title: "Shop",
    links: [
      { label: "New Arrivals", href: "/shop?filter=new" },
      { label: "Best Sellers", href: "/shop?filter=best" },
      { label: "Hoodies", href: "/shop?category=Hoodies" },
      { label: "Jackets", href: "/shop?category=Jackets" },
      { label: "Footwear", href: "/shop?category=Footwear" },
    ],
  },
  {
    title: "Collections",
    links: [
      { label: "Vault 01", href: "/shop?collection=Vault+01" },
      { label: "Static", href: "/shop?collection=Static" },
      { label: "Terrain", href: "/shop?collection=Terrain" },
      { label: "Relay", href: "/shop?collection=Relay" },
      { label: "Apex", href: "/shop?collection=Apex" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Shipping & Returns", href: "/shop" },
      { label: "Size Guide", href: "/shop" },
      { label: "Track Order", href: "/shop" },
      { label: "Contact", href: "/shop" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="bg-ink text-bone">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-display text-2xl">RYVEN</span>
              <span className="text-[10px] font-semibold uppercase tracking-[0.25em] opacity-60">
                Dept.
              </span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-bone/50">
              Heavyweight essentials and utility outerwear, built for the street
              and everything past it. Designed in-house, made to outlast trends.
            </p>
            <form className="mt-6 flex max-w-sm items-center gap-2">
              <input
                type="email"
                placeholder="Email for 10% off"
                className="w-full rounded-full border border-bone/20 bg-transparent px-4 py-2.5 text-sm placeholder:text-bone/40 focus:border-bone/60 focus:outline-none"
              />
              <button
                type="submit"
                className="shrink-0 rounded-full bg-bone px-5 py-2.5 text-xs font-semibold uppercase tracking-widest text-ink transition-transform hover:scale-105"
              >
                Join
              </button>
            </form>
          </div>

          {COLS.map((col) => (
            <div key={col.title}>
              <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-bone/40">
                {col.title}
              </h3>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="text-sm text-bone/70 transition-colors hover:text-bone"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-bone/10 pt-8 text-xs text-bone/40 sm:flex-row">
          <p>© {new Date().getFullYear()} Ruven Dept. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>Privacy</span>
            <span>Terms</span>
            <span>Accessibility</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
