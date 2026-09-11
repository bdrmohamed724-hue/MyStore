"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useCart } from "@/lib/cart";

type Product = {
  id: string;
  name: string;
  slug: string;
  price: number;
  imageUrl: string | null;
  stock: number;
  categoryId: string | null;
};

type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
};

type Section = {
  id: string;
  title: string | null;
  subtitle: string | null;
  type: string;
  position: number;
  enabled: boolean;
};

type Settings = {
  storeName?: string | null;
  currency?: string | null;
  defaultLanguage?: string | null;
  darkMode?: boolean | null;
};

type Props = {
  products: Product[];
  categories: Category[];
  sections: Section[];
  settings: Settings | null;
};

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-US").format(price);
}

export default function HomeClient({
  products,
  categories,
  sections,
  settings,
}: Props) {
  const router = useRouter();
  const { buyNow } = useCart();

  const [currency, setCurrency] = useState(
    settings?.currency || "DZD"
  );

  const [storeName, setStoreName] = useState(
    settings?.storeName || "RYVEN DEPT."
  );

  const [darkMode, setDarkMode] = useState(
    settings?.darkMode ?? true
  );

  useEffect(() => {
    fetch("/api/settings", { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!data) return;

        if (data?.currency) {
          setCurrency(data.currency);
        }

        if (data?.storeName) {
          setStoreName(data.storeName);
        }

        if (typeof data?.darkMode === "boolean") {
          setDarkMode(data.darkMode);
        }
      })
      .catch(() => {});
  }, []);

  function handleBuy(product: Product) {
    if (product.stock <= 0) return;

    buyNow({
      productId: product.id,
      name: product.name,
      price: String(product.price),
      imageUrl: product.imageUrl || undefined,
      slug: product.slug,
      quantity: 1,
      stock: product.stock,
    });

    router.push("/checkout");
  }

  return (
    <div
      className={
        darkMode
          ? "min-h-screen bg-black text-white"
          : "min-h-screen bg-white text-black"
      }
    >
      <Header />

      <main>
        {/* HERO */}
        <section className="mx-auto max-w-7xl px-6 py-20">
          <div className="max-w-3xl">
            <p
              className={
                darkMode
                  ? "mb-4 text-xs uppercase tracking-[0.3em] text-white/50"
                  : "mb-4 text-xs uppercase tracking-[0.3em] text-black/50"
              }
            >
              Premium Fashion & Lifestyle
            </p>

            <h1 className="text-5xl font-bold tracking-tight md:text-7xl">
              {storeName}
            </h1>

            <p
              className={
                darkMode
                  ? "mt-6 max-w-xl text-white/60"
                  : "mt-6 max-w-xl text-black/60"
              }
            >
              Discover our latest collection.
            </p>
          </div>
        </section>

        {/* CATEGORIES */}
        {categories.length > 0 && (
          <section className="mx-auto max-w-7xl px-6 pb-12">
            <div className="flex flex-wrap gap-3">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/products?category=${encodeURIComponent(
                    category.slug
                  )}`}
                  className={
                    darkMode
                      ? "rounded-full border border-white/10 px-4 py-2 text-sm text-white/70 transition hover:border-white/30 hover:text-white"
                      : "rounded-full border border-black/10 px-4 py-2 text-sm text-black/70 transition hover:border-black/30 hover:text-black"
                  }
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* PRODUCTS */}
        <section className="mx-auto max-w-7xl px-6 pb-20">
          {products.length === 0 ? (
            <div
              className={
                darkMode
                  ? "py-20 text-center text-white/40"
                  : "py-20 text-center text-black/40"
              }
            >
              No products available.
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {products.map((product) => (
                <div key={product.id} className="group">
                  {/* PRODUCT IMAGE */}
                  <Link
                    href={`/products/${product.slug}`}
                    className="block"
                  >
                    <div
                      className={
                        darkMode
                          ? "aspect-[4/5] overflow-hidden rounded-lg bg-white/5"
                          : "aspect-[4/5] overflow-hidden rounded-lg bg-black/5"
                      }
                    >
                      {product.imageUrl ? (
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div
                          className={
                            darkMode
                              ? "flex h-full items-center justify-center text-xs text-white/30"
                              : "flex h-full items-center justify-center text-xs text-black/30"
                          }
                        >
                          No image
                        </div>
                      )}
                    </div>
                  </Link>

                  {/* PRODUCT INFO */}
                  <div className="mt-3">
                    <Link
                      href={`/products/${product.slug}`}
                      className="block"
                    >
                      <h2 className="text-sm font-medium transition-opacity hover:opacity-60">
                        {product.name}
                      </h2>
                    </Link>

                    <p
                      className={
                        darkMode
                          ? "mt-1 text-sm text-white/60"
                          : "mt-1 text-sm text-black/60"
                      }
                    >
                      {formatPrice(product.price)} {currency}
                    </p>

                    {/* BUY BUTTON */}
                    <button
                      type="button"
                      onClick={() => handleBuy(product)}
                      disabled={product.stock <= 0}
                      className={
                        product.stock <= 0
                          ? "mt-3 w-full cursor-not-allowed rounded-md bg-white/10 px-4 py-3 text-sm text-white/30"
                          : darkMode
                          ? "mt-3 w-full rounded-md bg-white px-4 py-3 text-sm font-medium text-black transition hover:bg-white/80 active:scale-[0.98]"
                          : "mt-3 w-full rounded-md bg-black px-4 py-3 text-sm font-medium text-white transition hover:bg-black/80 active:scale-[0.98]"
                      }
                    >
                      {product.stock <= 0 ? "غير متوفر" : "شراء"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* STORE SECTIONS */}
        {sections
          .filter((section) => section.enabled)
          .map((section) => (
            <section
              key={section.id}
              className="mx-auto max-w-7xl px-6 pb-16"
            >
              {section.title && (
                <h2 className="text-2xl font-semibold">
                  {section.title}
                </h2>
              )}

              {section.subtitle && (
                <p
                  className={
                    darkMode
                      ? "mt-2 text-white/50"
                      : "mt-2 text-black/50"
                  }
                >
                  {section.subtitle}
                </p>
              )}
            </section>
          ))}
      </main>

      <Footer />
    </div>
  );
}
