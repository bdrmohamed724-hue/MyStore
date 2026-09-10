import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/db";
import { categories } from "@/db/schema";
import { eq, ilike, asc, and } from "drizzle-orm";
import { categorySchema } from "@/lib/validation";
import { getSession } from "@/lib/auth";
import { v4 as uuidv4 } from "uuid";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const visibleOnly = searchParams.get("visible") !== "false";

    const conditions = [];
    if (search) conditions.push(ilike(categories.name, `%${search}%`));
    if (visibleOnly) conditions.push(eq(categories.visible, true));

    const where = conditions.length > 0 ? and(...conditions) : undefined;
    const result = where
      ? await db.select().from(categories).where(where).orderBy(asc(categories.name))
      : await db.select().from(categories).orderBy(asc(categories.name));

    return NextResponse.json(result);
  } catch (err) {
    console.error("Categories GET error:", err);
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const parsed = categorySchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

    const id = uuidv4();
    await db.insert(categories).values({ id, ...parsed.data });
    const [created] = await db.select().from(categories).where(eq(categories.id, id));
    return NextResponse.json(created, { status: 201 });
  } catch (err: any) {
    if (err?.code === "23505") return NextResponse.json({ error: "Slug already exists" }, { status: 409 });
    console.error("Categories POST error:", err);
    return NextResponse.json({ error: "Failed to create category" }, { status: 500 });
  }
}
