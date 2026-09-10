"use client";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useCart } from "@/lib/cart";
import { useLocale } from "@/lib/locale";
import { formatPrice } from "@/lib/validation";

export default function CartPage() {
  const { items, removeItem, setQuantity, subtotal, clearCart } = useCart();
  const { t } = useLocale();

  return (
    <>
      <Header />
      <main className="pt-24 sm:pt-28 pb-20 min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-[0.15em] uppercase mb-8">{t("yourCart")}</h1>

          {items.length === 0 ? (
            <div className="text-center py-20">
              <svg className="w-16 h-16 mx-auto text-white/10 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.25-3h-15m1.5 0h12m-10.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zm9 0a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
              </svg>
              <p className="text-white/30 text-lg mb-4">{t("emptyCart")}</p>
              <Link href="/products" className="inline-block text-sm font-medium tracking-wider uppercase text-white/60 hover:text-white border-b border-white/20 hover:border-white pb-1 transition-colors">
                {t("continueShopping")}
              </Link>
            </div>
          ) : (
            <>
              <div className="space-y-4 mb-8">
                {items.map((item) => (
                  <div key={item.productId} className="flex gap-4 bg-white/5 border border-white/5 p-4">
                    <div className="w-20 h-24 bg-charcoal flex-shrink-0 overflow-hidden">
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-white/10 text-xs">IMG</div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <Link href={`/products/${item.slug}`} className="text-sm font-medium hover:text-white/80 transition-colors truncate block">{item.name}</Link>
                      <p className="text-sm text-white/60 mt-1">{formatPrice(item.price)}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <div className="flex items-center border border-white/10 text-sm">
                          <button onClick={() => setQuantity(item.productId, item.quantity - 1)} className="px-2 py-1 text-white/60 hover:text-white transition-colors">−</button>
                          <span className="px-3 py-1">{item.quantity}</span>
                          <button onClick={() => setQuantity(item.productId, item.quantity + 1)} className="px-2 py-1 text-white/60 hover:text-white transition-colors">+</button>
                        </div>
                        <button onClick={() => removeItem(item.productId)} className="text-xs text-white/40 hover:text-red-400 transition-colors uppercase tracking-wider">{t("remove")}</button>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{formatPrice(parseFloat(item.price) * item.quantity)}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-white/10 pt-6 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-white/60">{t("subtotal")}</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-lg font-semibold pt-2 border-t border-white/10">
                  <span>{t("subtotal")}</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
              </div>

              <div className="flex gap-4 mt-8">
                <Link href="/products" className="flex-1 text-center text-sm tracking-wider uppercase text-white/60 hover:text-white border border-white/10 py-3 transition-colors">
                  {t("continueShopping")}
                </Link>
                <Link href="/checkout" className="flex-1 text-center bg-white text-black text-sm font-semibold tracking-wider uppercase py-3 hover:bg-white/90 transition-colors">
                  {t("proceedToCheckout")}
                </Link>
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
