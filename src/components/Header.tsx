"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useCart } from "@/lib/cart";
import { useLocale } from "@/lib/locale";
import { locales, localeNames, type Locale } from "@/lib/translations";

interface StoreSettings {
  storeName?: string | null;
  defaultLanguage?: string | null;
}

const DEFAULT_STORE_NAME = "RYVEN DEPT.";

export default function Header() {
  const { itemCount } = useCart();
  const { t, locale, setLocale } = useLocale();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [storeName, setStoreName] = useState(DEFAULT_STORE_NAME);

  useEffect(() => {
    fetch("/api/settings", { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data: StoreSettings | null) => {
        if (data?.storeName) {
          setStoreName(data.storeName);
        }
      })
      .catch(() => {});
  }, []);

  const navItems = [
    { href: "/", label: t("home") },
    { href: "/products", label: t("products") },
    { href: "/products?category=collections", label: t("collection") },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-md border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">

          {/* Logo / Store Name */}
          <Link
            href="/"
            className="text-lg sm:text-xl font-bold tracking-[0.3em] uppercase text-white hover:text-white/80 transition-colors"
          >
            {storeName}
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-xs font-medium tracking-[0.15em] uppercase text-white/70 hover:text-white transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-4">

            {/* Language */}
            <div className="hidden sm:block relative group">
              <button
                type="button"
                className="text-xs tracking-wider uppercase text-white/70 hover:text-white transition-colors"
              >
                {locale.toUpperCase()}
              </button>

              <div className="absolute top-full right-0 mt-2 py-2 bg-charcoal-light rounded-md shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all min-w-[120px]">
                {locales.map((l) => (
                  <button
                    type="button"
                    key={l}
                    onClick={() => setLocale(l)}
                    className={`block w-full text-left px-4 py-1.5 text-sm transition-colors ${
                      locale === l
                        ? "text-white"
                        : "text-white/60 hover:text-white"
                    }`}
                  >
                    {localeNames[l]}
                  </button>
                ))}
              </div>
            </div>

            {/* Cart */}
            <Link
              href="/cart"
              className="relative text-white/70 hover:text-white transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.25-3h-15m1.5 0h12m-10.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zm9 0a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"
                />
              </svg>

              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-white text-black text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* Mobile menu button */}
            <button
              type="button"
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden text-white/70 hover:text-white transition-colors"
              aria-label="Toggle menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
              >
                {mobileOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden animate-slideDown bg-black/95 backdrop-blur-lg border-t border-white/5">
          <nav className="px-6 py-6 space-y-4">

            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="block text-sm font-medium tracking-[0.15em] uppercase text-white/70 hover:text-white transition-colors"
              >
                {item.label}
              </Link>
            ))}

            <div className="pt-4 border-t border-white/10">
              <p className="text-xs text-white/40 uppercase tracking-wider mb-3">
                {t("language")}
              </p>

              <div className="flex gap-3">
                {locales.map((l) => (
                  <button
                    type="button"
                    key={l}
                    onClick={() => {
                      setLocale(l);
                      setMobileOpen(false);
                    }}
                    className={`text-sm px-3 py-1 rounded transition-colors ${
                      locale === l
                        ? "bg-white text-black"
                        : "text-white/60 hover:text-white border border-white/20"
                    }`}
                  >
                    {l.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
