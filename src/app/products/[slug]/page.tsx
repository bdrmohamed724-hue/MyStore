"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useCart } from "@/lib/cart";
import { useLocale } from "@/lib/locale";
import { formatPrice } from "@/lib/validation";

interface Product { id: string; name: string; slug: string; description?: string; price: string; stock: number; imageUrl?: string; categoryId?: string; }

export default function ProductDetailPage() {
  const params = useParams();
  const { addItem } = useCart();
  const { t } = useLocale();
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!params.slug) return;
    fetch(`/api/products?active=true`)
      .then(r => r.ok ? r.json() : [])
      .then((prods: Product[]) => {
        const p = prods.find((x: Product) => x.slug === params.slug);
        setProduct(p || null);
        if (p?.categoryId) {
          setRelated(prods.filter((x: Product) => x.categoryId === p.categoryId && x.id !== p.id).slice(0, 4));
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [params.slug]);

  if (loading) return <><Header /><main className="pt-24 min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" /></main><Footer /></>;

  if (!product) return <><Header /><main className="pt-24 min-h-screen flex items-center justify-center"><p className="text-white/50">{t("noProducts")}</p></main><Footer /></>;

  return (
    <>
      <Header />
      <main className="pt-24 sm:pt-28 pb-20 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/products" className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors mb-8">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" /></svg>
            {t("back")}
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
            {/* Image */}
            <div className="aspect-[3/4] bg-charcoal overflow-hidden">
              {product.imageUrl ? (
                <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white/20">No Image</div>
              )}
            </div>

            {/* Details */}
            <div className="flex flex-col justify-center">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-wider uppercase">{product.name}</h1>
              <p className="mt-4 text-2xl text-white/80">{formatPrice(product.price)}</p>

              {product.stock > 0 ? (
                <p className="mt-2 text-sm text-green-400/80">{t("inStock")} — {product.stock} {t("available")}</p>
              ) : (
                <p className="mt-2 text-sm text-red-400/80">{t("outOfStock")}</p>
              )}

              {product.description && (
                <div className="mt-6 text-sm text-white/60 leading-relaxed whitespace-pre-line">{product.description}</div>
              )}

              {product.stock > 0 && (
                <div className="mt-8 flex items-center gap-4">
                  <div className="flex items-center border border-white/10">
                    <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-3 py-2 text-white/60 hover:text-white transition-colors">−</button>
                    <span className="px-4 py-2 text-sm min-w-[40px] text-center">{qty}</span>
                    <button onClick={() => setQty(Math.min(product.stock, qty + 1))} className="px-3 py-2 text-white/60 hover:text-white transition-colors">+</button>
                  </div>
                  <button
                    onClick={() => addItem({ productId: product.id, name: product.name, price: product.price, imageUrl: product.imageUrl, slug: product.slug, quantity: qty, stock: product.stock })}
                    className="flex-1 bg-white text-black text-sm font-semibold tracking-wider uppercase py-3 hover:bg-white/90 transition-colors"
                  >
                    {t("addToCart")}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Related */}
          {related.length > 0 && (
            <div className="mt-20">
              <h2 className="text-xl font-bold tracking-wider uppercase mb-6">{t("relatedProducts")}</h2>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {related.map((p) => (
                  <Link key={p.id} href={`/products/${p.slug}`} className="group">
                    <div className="aspect-[3/4] bg-charcoal overflow-hidden mb-3">
                      {p.imageUrl ? <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" /> : <div className="w-full h-full bg-charcoal-light" />}
                    </div>
                    <h3 className="text-sm font-medium truncate">{p.name}</h3>
                    <p className="text-sm text-white/60 mt-0.5">{formatPrice(p.price)}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
