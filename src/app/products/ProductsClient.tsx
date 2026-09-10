"use client";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useCart } from "@/lib/cart";
import { useLocale } from "@/lib/locale";
import { formatPrice } from "@/lib/validation";

interface Product { id: string; name: string; slug: string; description?: string; price: string; stock: number; imageUrl?: string; categoryId?: string; active: boolean; }
interface Category { id: string; name: string; slug: string; }

export default function ProductsClient() {
  const { addItem } = useCart();
  const { t } = useLocale();
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "");
  const [sort, setSort] = useState("newest");
  const [loading, setLoading] = useState(true);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (selectedCategory) params.set("category", selectedCategory);
      if (sort) params.set("sort", sort);
      params.set("active", "true");
      const res = await fetch(`/api/products?${params}`);
      if (res.ok) setProducts(await res.json());
    } catch {} finally { setLoading(false); }
  }, [search, selectedCategory, sort]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  useEffect(() => {
    const cat = searchParams.get("category");
    if (cat) setSelectedCategory(cat);
  }, [searchParams]);

  useEffect(() => {
    fetch("/api/categories?visible=true").then(r => r.ok ? r.json() : []).then(setCategories).catch(() => {});
  }, []);

  return (
    <>
      <Header />
      <main className="pt-24 sm:pt-28 pb-20 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-[0.15em] uppercase mb-8">{t("allProducts")}</h1>

          <div className="flex flex-wrap gap-3 mb-8">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("search")}
              className="bg-white/5 border border-white/10 rounded px-4 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/30 min-w-[200px]"
            />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-white/5 border border-white/10 rounded px-4 py-2 text-sm text-white focus:outline-none appearance-none cursor-pointer"
            >
              <option value="">{t("allCategories")}</option>
              {categories.map((c) => <option key={c.id} value={c.slug}>{c.name}</option>)}
            </select>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="bg-white/5 border border-white/10 rounded px-4 py-2 text-sm text-white focus:outline-none appearance-none cursor-pointer"
            >
              <option value="newest">{t("sortByNewest")}</option>
              <option value="price_low">{t("sortByPriceLow")}</option>
              <option value="price_high">{t("sortByPriceHigh")}</option>
              <option value="name">{t("sortByName")}</option>
            </select>
          </div>

          {loading ? (
            <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" /></div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {products.map((product) => (
                <div key={product.id} className="group">
                  <Link href={`/products/${product.slug}`} className="block">
                    <div className="relative aspect-[3/4] bg-charcoal overflow-hidden mb-3">
                      {product.imageUrl ? (
                        <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-white/20 text-xs uppercase tracking-wider">{t("image")}</div>
                      )}
                      {product.stock === 0 && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                          <span className="text-xs font-semibold tracking-wider uppercase text-white/70">{t("outOfStock")}</span>
                        </div>
                      )}
                    </div>
                  </Link>
                  <h3 className="text-sm font-medium truncate">{product.name}</h3>
                  <p className="text-sm text-white/60 mt-0.5">{formatPrice(product.price)}</p>
                  {product.stock > 0 && (
                    <button
                      onClick={() => addItem({ productId: product.id, name: product.name, price: product.price, imageUrl: product.imageUrl, slug: product.slug, quantity: 1, stock: product.stock })}
                      className="mt-2 w-full text-xs tracking-wider uppercase text-white/50 hover:text-white border border-white/10 hover:border-white/30 py-2 transition-colors"
                    >
                      {t("addToCart")}
                    </button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-white/30 text-lg">{t("noProducts")}</p>
              <Link href="/products" className="inline-block mt-4 text-sm text-white/50 hover:text-white transition-colors">{t("viewAll")}</Link>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
