import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/db";
import { storeSections } from "@/db/schema";
import { eq, asc } from "drizzle-orm";
import { sectionSchema } from "@/lib/validation";
import { getSession } from "@/lib/auth";
import { v4 as uuidv4 } from "uuid";

export async function GET() {
  try {
    const { searchParams } = new URL("http://localhost");
    const result = await db.select().from(storeSections).orderBy(asc(storeSections.position));
    return NextResponse.json(result);
  } catch (err) {
    console.error("Sections GET error:", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const parsed = sectionSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

    const id = uuidv4();
    await db.insert(storeSections).values({
      id,
      ...parsed.data,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const [created] = await db.select().from(storeSections).where(eq(storeSections.id, id));
    return NextResponse.json(created, { status: 201 });
  } catch (err) {
    console.error("Sections POST error:", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
