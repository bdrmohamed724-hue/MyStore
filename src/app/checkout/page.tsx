"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useCart } from "@/lib/cart";
import { useLocale } from "@/lib/locale";
import { formatPrice } from "@/lib/validation";

interface DeliveryZone { id: string; name: string; price: string; estimatedTime?: string; }
interface Settings { codEnabled: boolean; cibEnabled: boolean; edahabiaEnabled: boolean; baridiMobEnabled: boolean; cardEnabled: boolean; currency: string; }

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const { t } = useLocale();
  const router = useRouter();

  const [zones, setZones] = useState<DeliveryZone[]>([]);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [deliveryZoneId, setDeliveryZoneId] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({ name: "", email: "", phone: "", wilaya: "", city: "", address: "" });

  useEffect(() => {
    fetch("/api/delivery?enabled=true").then(r => r.ok ? r.json() : []).then(setZones).catch(() => {});
    fetch("/api/settings").then(r => r.ok ? r.json() : null).then(setSettings).catch(() => {});
  }, []);

  const selectedZone = zones.find(z => z.id === deliveryZoneId);
  const deliveryFee = selectedZone ? parseFloat(selectedZone.price) : 0;
  const total = subtotal + deliveryFee;

  const paymentMethods = [
    { key: "COD", label: t("cashOnDelivery"), enabled: settings?.codEnabled ?? true },
    { key: "CIB", label: t("cib"), enabled: settings?.cibEnabled ?? true },
    { key: "Edahabia", label: t("edahabia"), enabled: settings?.edahabiaEnabled ?? true },
    { key: "BaridiMob", label: t("baridiMob"), enabled: settings?.baridiMobEnabled ?? true },
    { key: "Card", label: t("card"), enabled: settings?.cardEnabled ?? true },
  ].filter(m => m.enabled);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: form,
          deliveryZoneId,
          paymentMethod,
          items: items.map(i => ({ productId: i.productId, quantity: i.quantity })),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Checkout failed");
        return;
      }

      clearCart();
      router.push(`/order-success?order=${data.orderNumber}`);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <>
        <Header />
        <main className="pt-24 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-white/30 text-lg mb-4">{t("emptyCart")}</p>
            <Link href="/products" className="text-sm text-white/60 hover:text-white transition-colors">{t("continueShopping")}</Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="pt-24 sm:pt-28 pb-20 min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h1 className="text-3xl font-bold tracking-[0.15em] uppercase mb-8">{t("checkoutTitle")}</h1>

          <form onSubmit={handleSubmit}>
            {error && <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                {/* Customer Info */}
                <div>
                  <h2 className="text-lg font-semibold tracking-wider uppercase mb-4">{t("customerInfo")}</h2>
                  <div className="space-y-3">
                    {[
                      { key: "name", type: "text", required: true },
                      { key: "email", type: "email", required: true },
                      { key: "phone", type: "tel", required: false },
                      { key: "wilaya", type: "text", required: false },
                      { key: "city", type: "text", required: false },
                      { key: "address", type: "text", required: false },
                    ].map(({ key, type, required }) => (
                      <div key={key}>
                        <label className="block text-xs text-white/40 uppercase tracking-wider mb-1">{t(key)}</label>
                        <input
                          type={type}
                          required={required}
                          value={(form as any)[key]}
                          onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 rounded px-4 py-2.5 text-sm text-white focus:outline-none focus:border-white/30"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Delivery */}
                <div>
                  <h2 className="text-lg font-semibold tracking-wider uppercase mb-4">{t("deliveryInfo")}</h2>
                  <label className="block text-xs text-white/40 uppercase tracking-wider mb-1">{t("selectDeliveryZone")}</label>
                  <select
                    value={deliveryZoneId}
                    onChange={(e) => setDeliveryZoneId(e.target.value)}
                    required
                    className="w-full bg-white/5 border border-white/10 rounded px-4 py-2.5 text-sm text-white focus:outline-none appearance-none cursor-pointer"
                  >
                    <option value="">{t("selectDeliveryZone")}</option>
                    {zones.map(z => (
                      <option key={z.id} value={z.id}>{z.name} — {formatPrice(z.price)}{z.estimatedTime ? ` (${z.estimatedTime})` : ""}</option>
                    ))}
                  </select>
                </div>

                {/* Payment */}
                <div>
                  <h2 className="text-lg font-semibold tracking-wider uppercase mb-4">{t("paymentInfo")}</h2>
                  <div className="space-y-2">
                    {paymentMethods.map(m => (
                      <label key={m.key} className={`flex items-center gap-3 p-3 border cursor-pointer transition-colors ${paymentMethod === m.key ? "border-white/30 bg-white/5" : "border-white/5 hover:border-white/10"}`}>
                        <input type="radio" name="payment" value={m.key} checked={paymentMethod === m.key} onChange={() => setPaymentMethod(m.key)} className="accent-white" />
                        <span className="text-sm">{m.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div>
                <h2 className="text-lg font-semibold tracking-wider uppercase mb-4">{t("orderSummary")}</h2>
                <div className="bg-white/5 border border-white/5 p-6 space-y-4">
                  {items.map(item => (
                    <div key={item.productId} className="flex justify-between text-sm">
                      <span className="text-white/70">{item.name} × {item.quantity}</span>
                      <span>{formatPrice(parseFloat(item.price) * item.quantity)}</span>
                    </div>
                  ))}
                  <div className="border-t border-white/10 pt-3 space-y-2">
                    <div className="flex justify-between text-sm"><span className="text-white/60">{t("subtotal")}</span><span>{formatPrice(subtotal)}</span></div>
                    <div className="flex justify-between text-sm"><span className="text-white/60">{t("deliveryFee")}</span><span>{deliveryZoneId ? formatPrice(deliveryFee) : "—"}</span></div>
                  </div>
                  <div className="border-t border-white/10 pt-3 flex justify-between text-lg font-semibold">
                    <span>{t("total")}</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || !deliveryZoneId}
                  className="w-full mt-6 bg-white text-black text-sm font-semibold tracking-wider uppercase py-3.5 hover:bg-white/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {loading ? "..." : t("placeOrder")}
                </button>
              </div>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
}
