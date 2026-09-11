import Link from "next/link";
import { formatPrice } from "@/lib/format";
import { StarRating } from "./star-rating";

export type ProductCardData = {
  slug: string;
  name: string;
  tagline: string;
  price: number;
  compareAtPrice: number | null;
  category: string;
  images: string[];
  colors: string[];
  isNew: boolean;
  bestSeller: boolean;
  avgRating: number;
  reviewCount: number;
};

export function ProductCard({
  product,
  priority = false,
  index = 0,
}: {
  product: ProductCardData;
  priority?: boolean;
  index?: number;
}) {
  const onSale =
    product.compareAtPrice != null && product.compareAtPrice > product.price;
  const secondImage = product.images[1] ?? product.images[0];

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group block animate-fade-up"
      style={{ animationDelay: `${Math.min(index, 8) * 60}ms` }}
    >
      <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-brand-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.images[0]}
          alt={product.name}
          loading={priority ? "eager" : "lazy"}
          className="img-zoom absolute inset-0 h-full w-full object-cover transition-opacity duration-500 group-hover:opacity-0"
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={secondImage}
          alt=""
          aria-hidden="true"
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        />

        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {product.isNew && (
            <span className="rounded-full bg-ink px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-bone">
              New
            </span>
          )}
          {onSale && (
            <span className="rounded-full bg-amber px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-ink">
              Sale
            </span>
          )}
          {product.bestSeller && !product.isNew && (
            <span className="rounded-full bg-bone px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-ink">
              Best Seller
            </span>
          )}
        </div>

        <div className="absolute inset-x-3 bottom-3 translate-y-3 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <span className="flex w-full items-center justify-center rounded-full bg-bone/95 py-2.5 text-xs font-semibold uppercase tracking-widest text-ink backdrop-blur">
            View Product
          </span>
        </div>
      </div>

      <div className="mt-3 px-0.5">
        <div className="flex items-center justify-between gap-2">
          <p className="text-[11px] font-medium uppercase tracking-wider text-black/40">
            {product.category}
          </p>
          {product.reviewCount > 0 && (
            <span className="flex items-center gap-1 text-[11px] text-black/40">
              <StarRating rating={product.avgRating} size={11} />
              <span className="tabular-nums">({product.reviewCount})</span>
            </span>
          )}
        </div>
        <h3 className="mt-1 text-sm font-semibold leading-snug text-ink">
          {product.name}
        </h3>
        <div className="mt-1 flex items-center gap-2">
          <span className="text-sm font-semibold tabular-nums">
            {formatPrice(product.price)}
          </span>
          {onSale && (
            <span className="text-xs text-black/35 line-through tabular-nums">
              {formatPrice(product.compareAtPrice!)}
            </span>
          )}
          {product.colors.length > 1 && (
            <span className="ml-auto text-[11px] text-black/40">
              {product.colors.length} colors
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
