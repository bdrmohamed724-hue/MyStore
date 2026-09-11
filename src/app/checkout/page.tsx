"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useCart } from "@/lib/cart";
import { useLocale } from "@/lib/locale";
import { formatPrice } from "@/lib/validation";

interface DeliveryZone {
  id: string;
  name: string;
  price: string;
  estimatedTime?: string;
}

interface Settings {
  currency: string;
}

interface Wilaya {
  id: number;
  name: string;
  name_ar: string;
}

interface Commune {
  id: number;
  wilaya_id: number;
  name: string;
  name_ar: string;
  daira?: string;
  daira_ar?: string;
}

interface FormState {
  name: string;
  phone: string;
  wilaya: string;
  city: string;
}

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const { t } = useLocale();
  const router = useRouter();

  const [zones, setZones] = useState<DeliveryZone[]>([]);
  const [settings, setSettings] = useState<Settings | null>(null);

  const [wilayas, setWilayas] = useState<Wilaya[]>([]);
  const [communes, setCommunes] = useState<Commune[]>([]);

  const [deliveryZoneId, setDeliveryZoneId] = useState("");

  const [loading, setLoading] = useState(false);
  const [loadingLocations, setLoadingLocations] = useState(true);

  const [error, setError] = useState("");

  const [form, setForm] = useState<FormState>({
    name: "",
    phone: "",
    wilaya: "",
    city: "",
  });

  // Load delivery zones + settings + Algeria locations
  useEffect(() => {
    fetch("/api/delivery?enabled=true")
      .then((r) => (r.ok ? r.json() : []))
      .then(setZones)
      .catch(() => {});

    fetch("/api/settings")
      .then((r) => (r.ok ? r.json() : null))
      .then(setSettings)
      .catch(() => {});

    Promise.all([
      fetch(
        "https://raw.githubusercontent.com/Mohamed-gp/algeria_69_wilayas/main/main.json"
      ).then((r) => r.json()),

      fetch(
        "https://raw.githubusercontent.com/Mohamed-gp/algeria_69_wilayas/main/communes.json"
      ).then((r) => r.json()),
    ])
      .then(([wilayaData, communeData]) => {
        const loadedWilayas = Array.isArray(wilayaData)
          ? wilayaData
          : wilayaData.wilayas || [];

        const loadedCommunes = Array.isArray(communeData)
          ? communeData
          : communeData.communes || [];

        setWilayas(loadedWilayas);
        setCommunes(loadedCommunes);
      })
      .catch(() => {
        setError("Unable to load wilaya and commune list.");
      })
      .finally(() => {
        setLoadingLocations(false);
      });
  }, []);

  const selectedZone = zones.find(
    (zone) => zone.id === deliveryZoneId
  );

  const deliveryFee = selectedZone
    ? parseFloat(selectedZone.price)
    : 0;

  const total = subtotal + deliveryFee;

  const selectedWilayaId = Number(form.wilaya);

  const filteredCommunes = useMemo(() => {
    if (!selectedWilayaId) return [];

    return communes
      .filter(
        (commune) => Number(commune.wilaya_id) === selectedWilayaId
      )
      .sort((a, b) =>
        a.name.localeCompare(b.name, "fr")
      );
  }, [communes, selectedWilayaId]);

  const selectedWilaya = wilayas.find(
    (wilaya) => Number(wilaya.id) === selectedWilayaId
  );

  const handleWilayaChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setForm({
      ...form,
      wilaya: event.target.value,
      city: "",
    });
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");

    if (!form.name.trim()) {
      setError("Please enter your name.");
      return;
    }

    if (!form.phone.trim()) {
      setError("Please enter your phone number.");
      return;
    }

    if (!form.wilaya) {
      setError("Please select your wilaya.");
      return;
    }

    if (!form.city) {
      setError("Please select your commune.");
      return;
    }

    if (!deliveryZoneId) {
      setError("Please select a delivery zone.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customer: {
            name: form.name.trim(),
            phone: form.phone.trim(),
            wilaya:
              selectedWilaya?.name_ar ||
              selectedWilaya?.name ||
              form.wilaya,
            city:
              filteredCommunes.find(
                (commune) => String(commune.id) === form.city
              )?.name_ar ||
              filteredCommunes.find(
                (commune) => String(commune.id) === form.city
              )?.name ||
              form.city,
          },

          deliveryZoneId,

          items: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
          })),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Checkout failed.");
        return;
      }

      clearCart();

      router.push(
        `/order-success?order=${data.orderNumber}`
      );
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
            <p className="text-white/30 text-lg mb-4">
              {t("emptyCart")}
            </p>

            <Link
              href="/products"
              className="text-sm text-white/60 hover:text-white transition-colors"
            >
              {t("continueShopping")}
            </Link>
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

          <h1 className="text-3xl font-bold tracking-[0.15em] uppercase mb-8">
            {t("checkoutTitle")}
          </h1>

          <form onSubmit={handleSubmit}>

            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

              {/* Customer Information */}
              <div className="space-y-6">

                <div>
                  <h2 className="text-lg font-semibold tracking-wider uppercase mb-4">
                    {t("customerInfo")}
                  </h2>

                  <div className="space-y-4">

                    {/* Name */}
                    <div>
                      <label className="block text-xs text-white/40 uppercase tracking-wider mb-1">
                        الاسم الكامل
                      </label>

                      <input
                        type="text"
                        required
                        value={form.name}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            name: e.target.value,
                          })
                        }
                        placeholder="اكتب اسمك الكامل"
                        className="w-full bg-white/5 border border-white/10 rounded px-4 py-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/30"
                      />
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-xs text-white/40 uppercase tracking-wider mb-1">
                        رقم الهاتف
                      </label>

                      <input
                        type="tel"
                        required
                        inputMode="tel"
                        value={form.phone}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            phone: e.target.value,
                          })
                        }
                        placeholder="05 / 06 / 07 ..."
                        className="w-full bg-white/5 border border-white/10 rounded px-4 py-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/30"
                      />
                    </div>

                    {/* Wilaya */}
                    <div>
                      <label className="block text-xs text-white/40 uppercase tracking-wider mb-1">
                        الولاية
                      </label>

                      <select
                        required
                        value={form.wilaya}
                        onChange={handleWilayaChange}
                        disabled={loadingLocations}
                        className="w-full bg-white/5 border border-white/10 rounded px-4 py-3 text-sm text-white focus:outline-none focus:border-white/30 cursor-pointer"
                      >
                        <option value="">
                          {loadingLocations
                            ? "جاري تحميل الولايات..."
                            : "اختر الولاية"}
                        </option>

                        {wilayas
                          .slice()
                          .sort((a, b) =>
                            Number(a.id) - Number(b.id)
                          )
                          .map((wilaya) => (
                            <option
                              key={wilaya.id}
                              value={wilaya.id}
                            >
                              {wilaya.id} — {wilaya.name_ar}
                            </option>
                          ))}
                      </select>
                    </div>

                    {/* Commune */}
                    <div>
                      <label className="block text-xs text-white/40 uppercase tracking-wider mb-1">
                        البلدية
                      </label>

                      <select
                        required
                        value={form.city}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            city: e.target.value,
                          })
                        }
                        disabled={
                          !form.wilaya ||
                          loadingLocations ||
                          filteredCommunes.length === 0
                        }
                        className="w-full bg-white/5 border border-white/10 rounded px-4 py-3 text-sm text-white focus:outline-none focus:border-white/30 cursor-pointer disabled:opacity-40"
                      >
                        <option value="">
                          {!form.wilaya
                            ? "اختر الولاية أولاً"
                            : "اختر البلدية"}
                        </option>

                        {filteredCommunes.map((commune) => (
                          <option
                            key={commune.id}
                            value={commune.id}
                          >
                            {commune.name_ar || commune.name}
                          </option>
                        ))}
                      </select>
                    </div>

                  </div>
                </div>

                {/* Delivery */}
                <div>
                  <h2 className="text-lg font-semibold tracking-wider uppercase mb-4">
                    {t("deliveryInfo")}
                  </h2>

                  <label className="block text-xs text-white/40 uppercase tracking-wider mb-1">
                    {t("selectDeliveryZone")}
                  </label>

                  <select
                    value={deliveryZoneId}
                    onChange={(e) =>
                      setDeliveryZoneId(e.target.value)
                    }
                    required
                    className="w-full bg-white/5 border border-white/10 rounded px-4 py-3 text-sm text-white focus:outline-none focus:border-white/30 cursor-pointer"
                  >
                    <option value="">
                      {t("selectDeliveryZone")}
                    </option>

                    {zones.map((zone) => (
                      <option
                        key={zone.id}
                        value={zone.id}
                      >
                        {zone.name} —{" "}
                        {formatPrice(zone.price)}
                        {zone.estimatedTime
                          ? ` (${zone.estimatedTime})`
                          : ""}
                      </option>
                    ))}
                  </select>
                </div>

              </div>

              {/* Order Summary */}
              <div>

                <h2 className="text-lg font-semibold tracking-wider uppercase mb-4">
                  {t("orderSummary")}
                </h2>

                <div className="bg-white/5 border border-white/5 p-6 space-y-4">

                  {items.map((item) => (
                    <div
                      key={item.productId}
                      className="flex justify-between text-sm"
                    >
                      <span className="text-white/70">
                        {item.name} × {item.quantity}
                      </span>

                      <span>
                        {formatPrice(
                          parseFloat(item.price) *
                            item.quantity
                        )}
                      </span>
                    </div>
                  ))}

                  <div className="border-t border-white/10 pt-3 space-y-2">

                    <div className="flex justify-between text-sm">
                      <span className="text-white/60">
                        {t("subtotal")}
                      </span>

                      <span>
                        {formatPrice(subtotal)}
                      </span>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-white/60">
                        {t("deliveryFee")}
                      </span>

                      <span>
                        {deliveryZoneId
                          ? formatPrice(deliveryFee)
                          : "—"}
                      </span>
                    </div>

                  </div>

                  <div className="border-t border-white/10 pt-3 flex justify-between text-lg font-semibold">

                    <span>{t("total")}</span>

                    <span>
                      {formatPrice(total)}
                    </span>

                  </div>

                </div>

                <button
                  type="submit"
                  disabled={
                    loading ||
                    !deliveryZoneId ||
                    loadingLocations
                  }
                  className="w-full mt-6 bg-white text-black text-sm font-semibold tracking-wider uppercase py-3.5 hover:bg-white/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {loading ? "..." : "تأكيد الطلب"}
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
