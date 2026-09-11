"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { formatPrice } from "@/lib/utils";

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

export default function HomeClient({
  products,
  categories,
  sections,
  settings,
}: Props) {
  const [currency, setCurrency] = useState(
    settings?.currency || "DZD"
  );

  useEffect(() => {
    fetch("/api/settings", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (data?.currency) {
          setCurrency(data.currency);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />

      <main>
        <section className="mx-auto max-w-7xl px-6 py-20">
          <div className="max-w-3xl">
            <p className="mb-4 text-xs uppercase tracking-[0.3em] text-white/50">
              Premium Fashion & Lifestyle
            </p>

            <h1 className="text-5xl font-bold tracking-tight md:text-7xl">
              {settings?.storeName || "RYVEN DEPT."}
            </h1>

            <p className="mt-6 max-w-xl text-white/60">
              Discover our latest collection.
            </p>
          </div>
        </section>

        {categories.length > 0 && (
          <section className="mx-auto max-w-7xl px-6 pb-12">
            <div className="flex flex-wrap gap-3">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="rounded-full border border-white/10 px-4 py-2 text-sm text-white/70"
                >
                  {category.name}
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="mx-auto max-w-7xl px-6 pb-20">
          {products.length === 0 ? (
            <div className="py-20 text-center text-white/40">
              No products available.
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {products.map((product) => (
                <div key={product.id} className="group">
                  <div className="aspect-[4/5] overflow-hidden rounded-lg bg-white/5">
                    {product.imageUrl ? (
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-xs text-white/30">
                        No image
                      </div>
                    )}
                  </div>

                  <div className="mt-3">
                    <h2 className="text-sm font-medium">
                      {product.name}
                    </h2>

                    <p className="mt-1 text-sm text-white/60">
                      {formatPrice(product.price)} {currency}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

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
                <p className="mt-2 text-white/50">
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
