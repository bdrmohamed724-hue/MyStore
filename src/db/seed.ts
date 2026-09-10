import { db } from "./index";
import { categories, products, deliveryZones, storeSettings, storeSections, adminUsers } from "./schema";
import { hashPassword } from "@/lib/auth";
import { v4 as uuidv4 } from "uuid";

async function seed() {
  console.log("🌱 Seeding database...");

  // Admin user
  const existingAdmin = await db.select().from(adminUsers).limit(1);
  if (existingAdmin.length === 0) {
    const hash = await hashPassword("admin123");
    await db.insert(adminUsers).values({ id: uuidv4(), username: "admin", passwordHash: hash });
    console.log("✅ Admin user created (admin / admin123)");
  }

  // Categories
  const existingCats = await db.select().from(categories).limit(1);
  if (existingCats.length === 0) {
    const catIds = {
      outerwear: uuidv4(),
      tops: uuidv4(),
      bottoms: uuidv4(),
      accessories: uuidv4(),
    };

    await db.insert(categories).values([
      { id: catIds.outerwear, name: "Outerwear", slug: "outerwear", description: "Premium jackets and coats", visible: true },
      { id: catIds.tops, name: "Tops", slug: "tops", description: "Essential tops and shirts", visible: true },
      { id: catIds.bottoms, name: "Bottoms", slug: "bottoms", description: "Trousers, jeans, and shorts", visible: true },
      { id: catIds.accessories, name: "Accessories", slug: "accessories", description: "Bags, belts, and more", visible: true },
    ]);
    console.log("✅ Categories seeded");

    // Products
    const productData = [
      { name: "Noir Overcoat", slug: "noir-overcoat", price: "18500.00", stock: 12, categoryId: catIds.outerwear, description: "Premium wool overcoat in deep noir. Tailored silhouette with notch lapels." },
      { name: "Shadow Bomber", slug: "shadow-bomber", price: "12000.00", stock: 20, categoryId: catIds.outerwear, description: "Matte bomber jacket. Ribbed cuffs and hem." },
      { name: "Onyx Blazer", slug: "onyx-blazer", price: "15800.00", stock: 8, categoryId: catIds.outerwear, description: "Structured blazer in onyx. Single-breasted, two-button." },
      { name: "Essential Tee", slug: "essential-tee", price: "4500.00", stock: 50, categoryId: catIds.tops, description: "Heavyweight cotton tee. Relaxed fit." },
      { name: "Slim Oxford", slug: "slim-oxford", price: "7200.00", stock: 30, categoryId: catIds.tops, description: "Slim-fit oxford shirt. Button-down collar." },
      { name: "Knit Turtleneck", slug: "knit-turtleneck", price: "8900.00", stock: 15, categoryId: catIds.tops, description: "Ribbed knit turtleneck. Merino wool blend." },
      { name: "Cargo Trouser", slug: "cargo-trouser", price: "9800.00", stock: 25, categoryId: catIds.bottoms, description: "Relaxed cargo trouser. Utility pockets." },
      { name: "Slim Denim", slug: "slim-denim", price: "7600.00", stock: 35, categoryId: catIds.bottoms, description: "Slim-fit denim. Japanese selvedge." },
      { name: "Leather Belt", slug: "leather-belt", price: "5200.00", stock: 40, categoryId: catIds.accessories, description: "Full-grain leather belt. Brushed buckle." },
      { name: "Canvas Tote", slug: "canvas-tote", price: "6800.00", stock: 18, categoryId: catIds.accessories, description: "Heavy canvas tote. Waxed finish." },
    ];

    for (const p of productData) {
      await db.insert(products).values({
        id: uuidv4(),
        ...p,
        active: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
    console.log("✅ Products seeded");
  }

  // Delivery zones
  const existingZones = await db.select().from(deliveryZones).limit(1);
  if (existingZones.length === 0) {
    await db.insert(deliveryZones).values([
      { id: uuidv4(), name: "Algiers", price: "500.00", estimatedTime: "1-2 days", enabled: true },
      { id: uuidv4(), name: "Oran", price: "700.00", estimatedTime: "2-3 days", enabled: true },
      { id: uuidv4(), name: "Constantine", price: "700.00", estimatedTime: "2-3 days", enabled: true },
      { id: uuidv4(), name: "Annaba", price: "800.00", estimatedTime: "3-4 days", enabled: true },
      { id: uuidv4(), name: "Other Wilayas", price: "1000.00", estimatedTime: "3-5 days", enabled: true },
    ]);
    console.log("✅ Delivery zones seeded");
  }

  // Store settings
  const existingSettings = await db.select().from(storeSettings).limit(1);
  if (existingSettings.length === 0) {
    await db.insert(storeSettings).values({
      id: uuidv4(),
      storeName: "RYVEN DEPT.",
      currency: "DZD",
      defaultLanguage: "en",
      darkMode: true,
      musicEnabled: false,
      socialEnabled: true,
      codEnabled: true,
      cibEnabled: true,
      edahabiaEnabled: true,
      baridiMobEnabled: true,
      cardEnabled: true,
    });
    console.log("✅ Store settings seeded");
  }

  // Homepage sections
  const existingSections = await db.select().from(storeSections).limit(1);
  if (existingSections.length === 0) {
    await db.insert(storeSections).values([
      { id: uuidv4(), sectionKey: "hero", title: "RYVEN DEPT.", type: "Hero", subtitle: "Premium Fashion & Lifestyle", buttonText: "Shop Now", buttonUrl: "/products", visible: true, position: 0, createdAt: new Date(), updatedAt: new Date() },
      { id: uuidv4(), sectionKey: "featured-products", title: "Featured", type: "Featured", subtitle: "Curated selection from our latest collection", visible: true, position: 1, createdAt: new Date(), updatedAt: new Date() },
      { id: uuidv4(), sectionKey: "collections", title: "Collections", type: "Categories", subtitle: "Explore by category", visible: true, position: 2, createdAt: new Date(), updatedAt: new Date() },
      { id: uuidv4(), sectionKey: "banner", title: "New Season", type: "Banner", subtitle: "Discover the latest arrivals from our curated collection", buttonText: "View Collection", buttonUrl: "/products", visible: true, position: 3, createdAt: new Date(), updatedAt: new Date() },
      { id: uuidv4(), sectionKey: "newsletter", title: "Stay Updated", type: "Newsletter", subtitle: "Subscribe for exclusive access to new collections and offers", visible: true, position: 4, createdAt: new Date(), updatedAt: new Date() },
    ]);
    console.log("✅ Homepage sections seeded");
  }

  console.log("🎉 Seeding complete!");
}

seed().catch(console.error);
