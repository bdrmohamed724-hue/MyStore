"use client";
import Link from "next/link";
import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useCart } from "@/lib/cart";
import { useLocale } from "@/lib/locale";
import { formatPrice } from "@/lib/validation";

interface Product { id: string; name: string; slug: string; price: string; imageUrl?: string | null; stock: number; categoryId?: string | null; }
interface Category { id: string; name: string; slug: string; description?: string | null; imageUrl?: string | null; }
interface Section { id: string; sectionKey: string; title?: string | null; type: string; subtitle?: string | null; imageUrl?: string | null; buttonText?: string | null; buttonUrl?: string | null; visible: boolean; position: number; }

export default function HomeClient({ products, categories, sections }: { products: Product[]; categories: Category[]; sections: Section[] }) {
  const { addItem } = useCart();
  const { t } = useLocale();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const visibleSections = sections.filter((s: Section) => s.visible).sort((a: Section, b: Section) => a.position - b.position);
  const heroSection = visibleSections.find((s: Section) => s.type === "Hero");
  const bannerSection = visibleSections.find((s: Section) => s.type === "Banner");
  const featuredSection = visibleSections.find((s: Section) => s.type === "Featured");
  const categoriesSection = visibleSections.find((s: Section) => s.type === "Categories");
  const newsletterSection = visibleSections.find((s: Section) => s.type === "Newsletter");
  const socialSection = visibleSections.find((s: Section) => s.type === "Social");
  const genericSections = visibleSections.filter((s: Section) => s.type === "Generic");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) { setSubscribed(true); setEmail(""); }
  };

  return (
    <>
      <Header />
      <main className="pt-16 sm:pt-20">
        {/* Hero */}
        <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0">
            {heroSection?.imageUrl ? (
              <img src={heroSection.imageUrl} alt="" className="w-full h-full object-cover opacity-40" />
            ) : (
              <div className="w-full h-full bg-gradient-to-b from-charcoal via-black to-charcoal-light" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
          </div>
          <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-6xl lg:text-8xl font-bold tracking-[0.2em] uppercase animate-fadeIn">
              {heroSection?.title || "RYVEN DEPT."}
            </h1>
            <p className="mt-4 sm:mt-6 text-base sm:text-lg text-white/60 tracking-wider animate-slideUp animate-delay-200">
              {heroSection?.subtitle || "Premium Fashion & Lifestyle"}
            </p>
            <Link
              href={heroSection?.buttonUrl || "/products"}
              className="inline-block mt-8 sm:mt-10 bg-white text-black text-sm font-semibold tracking-[0.2em] uppercase px-8 py-3.5 hover:bg-white/90 transition-all animate-slideUp animate-delay-400"
            >
              {heroSection?.buttonText || t("viewAll")}
            </Link>
          </div>
        </section>

        {/* Featured Products */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-[0.15em] uppercase">
              {featuredSection?.title || t("allProducts")}
            </h2>
            {featuredSection?.subtitle && (
              <p className="mt-3 text-white/50 text-sm tracking-wider">{featuredSection.subtitle}</p>
            )}
          </div>
          {products.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {products.slice(0, 8).map((product: Product) => (
                <div key={product.id} className="group">
                  <Link href={`/products/${product.slug}`} className="block">
                    <div className="relative aspect-[3/4] bg-charcoal overflow-hidden mb-3">
                      {product.imageUrl ? (
                        <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-white/20 text-sm">{t("image")}</div>
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
                      onClick={() => addItem({
                        productId: product.id, name: product.name, price: product.price,
                        imageUrl: product.imageUrl || undefined, slug: product.slug, quantity: 1, stock: product.stock,
                      })}
                      className="mt-2 w-full text-xs tracking-wider uppercase text-white/50 hover:text-white border border-white/10 hover:border-white/30 py-2 transition-colors"
                    >
                      {t("addToCart")}
                    </button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-white/30">
              <p className="text-lg">{t("noProducts")}</p>
            </div>
          )}
          {products.length > 8 && (
            <div className="text-center mt-10">
              <Link href="/products" className="text-sm font-medium tracking-[0.15em] uppercase text-white/60 hover:text-white border-b border-white/20 hover:border-white pb-1 transition-colors">
                {t("viewAll")}
              </Link>
            </div>
          )}
        </section>

        {/* Categories / Collection */}
        {categories.length > 0 && (
          <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-[0.15em] uppercase">
                {categoriesSection?.title || t("collection")}
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((cat: Category) => (
                <Link key={cat.id} href={`/products?category=${cat.slug}`} className="group relative aspect-[4/3] overflow-hidden bg-charcoal">
                  {cat.imageUrl ? (
                    <img src={cat.imageUrl} alt={cat.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  ) : (
                    <div className="w-full h-full bg-charcoal-light flex items-center justify-center" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-lg sm:text-xl font-semibold tracking-wider uppercase">{cat.name}</h3>
                    {cat.description && <p className="text-sm text-white/60 mt-1 line-clamp-2">{cat.description}</p>}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Banner */}
        {bannerSection && (
          <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <div className="relative bg-charcoal overflow-hidden">
              {bannerSection.imageUrl && (
                <img src={bannerSection.imageUrl} alt="" className="absolute inset-0 w-full h-full object-cover opacity-30" />
              )}
              <div className="relative z-10 py-16 sm:py-24 px-8 text-center">
                {bannerSection.title && <h2 className="text-2xl sm:text-4xl font-bold tracking-wider uppercase">{bannerSection.title}</h2>}
                {bannerSection.subtitle && <p className="mt-3 text-white/60 text-sm sm:text-base">{bannerSection.subtitle}</p>}
                {bannerSection.buttonText && (
                  <Link href={bannerSection.buttonUrl || "#"} className="inline-block mt-8 bg-white text-black text-sm font-semibold tracking-wider uppercase px-8 py-3 hover:bg-white/90 transition-colors">
                    {bannerSection.buttonText}
                  </Link>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Generic sections */}
        {genericSections.map((sec: Section) => (
          <section key={sec.id} className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <div className="text-center">
              {sec.title && <h2 className="text-2xl sm:text-3xl font-bold tracking-[0.15em] uppercase">{sec.title}</h2>}
              {sec.subtitle && <p className="mt-3 text-white/60 text-sm sm:text-base">{sec.subtitle}</p>}
              {sec.buttonText && (
                <Link href={sec.buttonUrl || "#"} className="inline-block mt-8 text-sm font-medium tracking-wider uppercase text-white/60 hover:text-white border-b border-white/20 hover:border-white pb-1 transition-colors">
                  {sec.buttonText}
                </Link>
              )}
            </div>
          </section>
        ))}

        {/* Newsletter */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="max-w-xl mx-auto text-center">
            <h2 className="text-xl sm:text-2xl font-bold tracking-[0.15em] uppercase">
              {newsletterSection?.title || t("newsletter")}
            </h2>
            <p className="mt-2 text-white/50 text-sm">
              {newsletterSection?.subtitle || t("newsletterSubtitle")}
            </p>
            <form onSubmit={handleSubscribe} className="mt-6 flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t("emailPlaceholder")}
                required
                className="flex-1 bg-white/5 border border-white/10 rounded px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/30"
              />
              <button type="submit" className="bg-white text-black text-xs font-semibold tracking-wider uppercase px-6 py-3 hover:bg-white/90 transition-colors">
                {t("subscribe")}
              </button>
            </form>
            {subscribed && <p className="mt-3 text-sm text-green-400">{t("subscribed")}</p>}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
