"use client";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLocale } from "@/lib/locale";

export default function OrderSuccessClient() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("order");
  const { t } = useLocale();

  return (
    <>
      <Header />
      <main className="pt-24 sm:pt-28 pb-20 min-h-screen flex items-center justify-center">
        <div className="text-center max-w-lg mx-auto px-4">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-white/5 flex items-center justify-center">
            <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold tracking-wider uppercase animate-fadeIn">{t("thankYou")}</h1>
          <p className="mt-4 text-white/60">{t("orderSuccessMsg")}</p>
          {orderNumber && (
            <div className="mt-6 inline-block bg-white/5 border border-white/10 px-6 py-3">
              <p className="text-xs text-white/40 uppercase tracking-wider">{t("orderNumber")}</p>
              <p className="text-lg font-mono font-semibold mt-1">{orderNumber}</p>
            </div>
          )}
          <div className="mt-8 flex gap-4 justify-center">
            <Link href="/products" className="text-sm tracking-wider uppercase text-white/60 hover:text-white border-b border-white/20 hover:border-white pb-1 transition-colors">
              {t("continueShopping")}
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
