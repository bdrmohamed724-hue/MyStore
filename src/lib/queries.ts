import { db } from "@/db";
import { products, reviews, type Product, type Review } from "@/db/schema";
import { and, desc, eq, sql } from "drizzle-orm";
import type { ProductCardData } from "@/components/product-card";

export type RatingMap = Map<number, { avg: number; count: number }>;

async function getRatingMap(): Promise<RatingMap> {
  const rows = await db
    .select({
      productId: reviews.productId,
      avg: sql<string>`avg(${reviews.rating})`,
      count: sql<string>`count(*)`,
    })
    .from(reviews)
    .groupBy(reviews.productId);

  const map: RatingMap = new Map();
  for (const r of rows) {
    map.set(r.productId, {
      avg: Math.round(Number(r.avg) * 10) / 10,
      count: Number(r.count),
    });
  }
  return map;
}

export function toCardData(
  p: Product,
  rating?: { avg: number; count: number },
): ProductCardData {
  return {
    slug: p.slug,
    name: p.name,
    tagline: p.tagline,
    price: p.price,
    compareAtPrice: p.compareAtPrice,
    category: p.category,
    images: p.images,
    colors: p.colors,
    isNew: p.isNew,
    bestSeller: p.bestSeller,
    avgRating: rating?.avg ?? 0,
    reviewCount: rating?.count ?? 0,
  };
}

export type ProductFilters = {
  category?: string;
  collection?: string;
  filter?: "new" | "best" | "sale";
  sort?: "featured" | "new" | "price-asc" | "price-desc" | "rating";
  maxPrice?: number;
};

export async function getProducts(
  filters: ProductFilters = {},
): Promise<ProductCardData[]> {
  try {
    const conditions = [];
    if (filters.category) conditions.push(eq(products.category, filters.category));
    if (filters.collection)
      conditions.push(eq(products.collection, filters.collection));
    if (filters.filter === "new") conditions.push(eq(products.isNew, true));
    if (filters.filter === "best")
      conditions.push(eq(products.bestSeller, true));

    const rows = await db
      .select()
      .from(products)
      .where(conditions.length ? and(...conditions) : undefined)
      .limit(500);

    const ratingMap = await getRatingMap();
    let cards = rows.map((p) => toCardData(p, ratingMap.get(p.id)));

    if (filters.filter === "sale") {
      cards = cards.filter(
        (c) => c.compareAtPrice != null && c.compareAtPrice > c.price,
      );
    }
    if (typeof filters.maxPrice === "number") {
      cards = cards.filter((c) => c.price <= filters.maxPrice!);
    }

    const rowOrder = new Map(rows.map((r, i) => [r.slug, i]));
    switch (filters.sort) {
      case "price-asc":
        cards.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        cards.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        cards.sort((a, b) => b.avgRating - a.avgRating);
        break;
      case "new":
        cards.sort((a, b) => Number(b.isNew) - Number(a.isNew));
        break;
      default:
        cards.sort((a, b) => {
          const score = (c: ProductCardData) =>
            (c.bestSeller ? 2 : 0) + (c.isNew ? 1 : 0);
          const diff = score(b) - score(a);
          if (diff !== 0) return diff;
          return (rowOrder.get(a.slug) ?? 0) - (rowOrder.get(b.slug) ?? 0);
        });
    }

    return cards;
  } catch (err) {
    console.error("getProducts failed:", err);
    return [];
  }
}

export async function getFeaturedProducts(
  limit = 8,
): Promise<ProductCardData[]> {
  try {
    const rows = await db
      .select()
      .from(products)
      .where(eq(products.featured, true))
      .limit(limit);
    const ratingMap = await getRatingMap();
    return rows.map((p) => toCardData(p, ratingMap.get(p.id)));
  } catch (err) {
    console.error("getFeaturedProducts failed:", err);
    return [];
  }
}

export async function getNewProducts(limit = 4): Promise<ProductCardData[]> {
  try {
    const rows = await db
      .select()
      .from(products)
      .where(eq(products.isNew, true))
      .limit(limit);
    const ratingMap = await getRatingMap();
    return rows.map((p) => toCardData(p, ratingMap.get(p.id)));
  } catch (err) {
    console.error("getNewProducts failed:", err);
    return [];
  }
}

export type ProductDetail = {
  product: Product;
  reviews: Review[];
  avgRating: number;
  reviewCount: number;
  related: ProductCardData[];
};

export async function getProductBySlug(
  slug: string,
): Promise<ProductDetail | null> {
  try {
    const [product] = await db
      .select()
      .from(products)
      .where(eq(products.slug, slug))
      .limit(1);
    if (!product) return null;

    const productReviews = await db
      .select()
      .from(reviews)
      .where(eq(reviews.productId, product.id))
      .orderBy(desc(reviews.createdAt));

    const avgRating = productReviews.length
      ? Math.round(
          (productReviews.reduce((a, r) => a + r.rating, 0) /
            productReviews.length) *
            10,
        ) / 10
      : 0;

    const relatedRows = await db
      .select()
      .from(products)
      .where(eq(products.category, product.category))
      .limit(5);
    const ratingMap = await getRatingMap();
    const related = relatedRows
      .filter((p) => p.id !== product.id)
      .slice(0, 4)
      .map((p) => toCardData(p, ratingMap.get(p.id)));

    return {
      product,
      reviews: productReviews,
      avgRating,
      reviewCount: productReviews.length,
      related,
    };
  } catch (err) {
    console.error("getProductBySlug failed:", err);
    return null;
  }
}

export async function getAllSlugs(): Promise<string[]> {
  try {
    const rows = await db.select({ slug: products.slug }).from(products);
    return rows.map((r) => r.slug);
  } catch {
    return [];
  }
}
