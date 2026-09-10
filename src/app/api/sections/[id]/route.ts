import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/db";
import { storeSections } from "@/db/schema";
import { eq, asc } from "drizzle-orm";
import { sectionSchema } from "@/lib/validation";
import { getSession } from "@/lib/auth";

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { id } = await params;
    const body = await request.json();

    // Handle reorder
    if (body.action === "moveUp" || body.action === "moveDown") {
      const all = await db.select().from(storeSections).orderBy(asc(storeSections.position));
      const idx = all.findIndex((s) => s.id === id);
      if (idx === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });

      const swapIdx = body.action === "moveUp" ? idx - 1 : idx + 1;
      if (swapIdx < 0 || swapIdx >= all.length) return NextResponse.json({ error: "Cannot move" }, { status: 400 });

      await db.update(storeSections).set({ position: all[swapIdx].position, updatedAt: new Date() }).where(eq(storeSections.id, id));
      await db.update(storeSections).set({ position: all[idx].position, updatedAt: new Date() }).where(eq(storeSections.id, all[swapIdx].id));

      const result = await db.select().from(storeSections).orderBy(asc(storeSections.position));
      return NextResponse.json(result);
    }

    const parsed = sectionSchema.partial().safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

    await db.update(storeSections).set({ ...parsed.data, updatedAt: new Date() }).where(eq(storeSections.id, id));
    const [updated] = await db.select().from(storeSections).where(eq(storeSections.id, id));
    return NextResponse.json(updated);
  } catch (err) {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { id } = await params;
    await db.delete(storeSections).where(eq(storeSections.id, id));
    return NextResponse.json({ success: true });
  } catch { return NextResponse.json({ error: "Failed" }, { status: 500 }); }
}
