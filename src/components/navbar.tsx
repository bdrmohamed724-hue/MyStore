"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useCart } from "@/context/cart-context";
import { BagIcon, CloseIcon, MenuIcon } from "./icons";

const LINKS = [
  { label: "New", href: "/shop?filter=new" },
  { label: "Hoodies", href: "/shop?category=Hoodies" },
  { label: "Jackets", href: "/shop?category=Jackets" },
  { label: "Footwear", href: "/shop?category=Footwear" },
  { label: "Shop All", href: "/shop" },
];

export function Navbar() {
  const { count, openCart } = useCart();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const onHome = pathname === "/";
  const transparent = onHome && !scrolled && !mobileOpen;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        transparent
          ? "bg-transparent text-bone"
          : "bg-bone/90 text-ink backdrop-blur-md border-b border-black/10"
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <button
            className="lg:hidden -ml-1 p-1"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <CloseIcon className="h-6 w-6" />
            ) : (
              <MenuIcon className="h-6 w-6" />
            )}
          </button>

          <Link href="/" className="flex items-baseline gap-1.5">
            <span className="font-display text-xl tracking-tight sm:text-2xl">
              RYVEN
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-[0.25em] opacity-70">
              Dept.
            </span>
          </Link>

          <ul className="hidden items-center gap-6 text-[13px] font-medium uppercase tracking-wide lg:flex">
            {LINKS.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="relative py-1 transition-opacity hover:opacity-60"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <Link
            href="/shop"
            className="hidden text-[13px] font-medium uppercase tracking-wide transition-opacity hover:opacity-60 sm:block"
          >
            Search
          </Link>
          <button
            onClick={openCart}
            className="relative flex items-center gap-2 rounded-full px-1 py-1 transition-opacity hover:opacity-70"
            aria-label="Open cart"
          >
            <BagIcon className="h-6 w-6" />
            <span
              className={`absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-bold tabular-nums transition-transform ${
                count > 0 ? "scale-100" : "scale-0"
              } ${transparent ? "bg-bone text-ink" : "bg-ink text-bone"}`}
            >
              {count}
            </span>
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <div
        className={`overflow-hidden border-t border-black/10 bg-bone text-ink transition-[max-height] duration-300 lg:hidden ${
          mobileOpen ? "max-h-96" : "max-h-0"
        }`}
      >
        <ul className="flex flex-col gap-1 px-4 py-4">
          {LINKS.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className="block rounded-lg px-3 py-3 text-sm font-semibold uppercase tracking-wide hover:bg-black/5"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}
