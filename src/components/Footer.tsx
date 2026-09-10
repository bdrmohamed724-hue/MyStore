"use client";
import Link from "next/link";
import { useLocale } from "@/lib/locale";

export default function Footer() {
  const { t } = useLocale();

  return (
    <footer className="bg-black border-t border-white/10 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <h3 className="text-lg font-bold tracking-[0.3em] uppercase mb-4">RYVEN DEPT.</h3>
            <p className="text-sm text-white/50 leading-relaxed">
              Premium fashion & lifestyle. Curated collections for the modern individual.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-xs font-semibold tracking-[0.2em] uppercase text-white/40 mb-4">Navigation</h4>
            <nav className="space-y-2">
              {[
                { href: "/", label: t("home") },
                { href: "/products", label: t("products") },
                { href: "/cart", label: t("cart") },
              ].map((item) => (
                <Link key={item.href} href={item.href} className="block text-sm text-white/60 hover:text-white transition-colors">
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-xs font-semibold tracking-[0.2em] uppercase text-white/40 mb-4">{t("followUs")}</h4>
            <div className="space-y-2">
              {["Instagram", "Facebook", "TikTok", "YouTube"].map((s) => (
                <span key={s} className="block text-sm text-white/60 hover:text-white transition-colors cursor-pointer">{s}</span>
              ))}
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-xs font-semibold tracking-[0.2em] uppercase text-white/40 mb-4">{t("newsletter")}</h4>
            <p className="text-sm text-white/50 mb-3">{t("newsletterSubtitle")}</p>
            <form onSubmit={(e) => { e.preventDefault(); }} className="flex gap-2">
              <input
                type="email"
                placeholder={t("emailPlaceholder")}
                className="flex-1 bg-white/5 border border-white/10 rounded px-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/30"
              />
              <button type="submit" className="bg-white text-black text-xs font-semibold tracking-wider uppercase px-4 py-2 hover:bg-white/90 transition-colors">
                {t("subscribe")}
              </button>
            </form>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/30">&copy; {new Date().getFullYear()} RYVEN DEPT. {t("allRightsReserved")}</p>
          <div className="flex gap-4">
            {["en", "fr", "ar"].map((l) => (
              <span key={l} className="text-xs text-white/30 uppercase cursor-pointer hover:text-white/60 transition-colors">{l}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
