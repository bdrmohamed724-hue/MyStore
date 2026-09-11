import { db } from "@/db";
import { products, categories, storeSections, storeSettings } from "@/db/schema";
import { eq, desc, asc } from "drizzle-orm";
import HomeClient from "./HomeClient";

export const revalidate = 60;

export default async function HomePage() {
  try {
    const [allProducts, allCategories, allSections, settings] =
      await Promise.all([
        db
          .select({
            id: products.id,
            name: products.name,
            slug: products.slug,
            price: products.price,
            imageUrl: products.imageUrl,
            stock: products.stock,
            categoryId: products.categoryId,
          })
          .from(products)
          .where(eq(products.active, true))
          .orderBy(desc(products.createdAt)),

        db
          .select({
            id: categories.id,
            name: categories.name,
            slug: categories.slug,
            description: categories.description,
            imageUrl: categories.imageUrl,
          })
          .from(categories)
          .where(eq(categories.visible, true))
          .orderBy(asc(categories.name)),

        db
          .select()
          .from(storeSections)
          .orderBy(asc(storeSections.position)),

        db.select().from(storeSettings).limit(1),
      ]);

    return (
      <HomeClient
        products={allProducts}
        categories={allCategories}
        sections={allSections}
        settings={settings[0] || null}
      />
    );
  } catch {
    return (
      <HomeClient
        products={[]}
        categories={[]}
        sections={[]}
        settings={null}
      />
    );
  }
}
