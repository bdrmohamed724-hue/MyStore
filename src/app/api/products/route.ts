import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/db";
import { products, categories } from "@/db/schema";
import { eq, ilike, desc, asc, and, SQL } from "drizzle-orm";
import { productSchema } from "@/lib/validation";
import { getSession } from "@/lib/auth";
import { v4 as uuidv4 } from "uuid";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const categorySlug = searchParams.get("category");
    const sort = searchParams.get("sort") || "newest";
    const activeOnly = searchParams.get("active") !== "false";

    let conditions: SQL[] = [];
    if (activeOnly) conditions.push(eq(products.active, true));
    if (search) conditions.push(ilike(products.name, `%${search}%`));

    if (categorySlug) {
      const cat = await db.select({ id: categories.id }).from(categories).where(eq(categories.slug, categorySlug)).limit(1);
      if (cat.length > 0) conditions.push(eq(products.categoryId, cat[0].id));
    }

    const where = conditions.length > 0 ? and(...conditions) : undefined;

    const orderBy = sort === "price_low" ? asc(products.price)
      : sort === "price_high" ? desc(products.price)
      : sort === "name" ? asc(products.name)
      : desc(products.createdAt);

    const result = await db.select({
      id: products.id,
      name: products.name,
      slug: products.slug,
      description: products.description,
      price: products.price,
      stock: products.stock,
      imageUrl: products.imageUrl,
      categoryId: products.categoryId,
      active: products.active,
      createdAt: products.createdAt,
    }).from(products).where(where).orderBy(orderBy);

    return NextResponse.json(result);
  } catch (err) {
    console.error("Products GET error:", err);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const parsed = productSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const id = uuidv4();
    await db.insert(products).values({
      id,
      ...parsed.data,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const [created] = await db.select().from(products).where(eq(products.id, id));
    return NextResponse.json(created, { status: 201 });
  } catch (err: any) {
    if (err?.code === "23505") {
      return NextResponse.json({ error: "Slug already exists" }, { status: 409 });
    }
    console.error("Products POST error:", err);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}
