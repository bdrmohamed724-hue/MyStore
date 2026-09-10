import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/db";
import { storeSettings } from "@/db/schema";
import { eq } from "drizzle-orm";
import { settingsSchema } from "@/lib/validation";
import { getSession } from "@/lib/auth";
import { v4 as uuidv4 } from "uuid";

async function getOrCreateSettings() {
  const existing = await db.select().from(storeSettings).limit(1);
  if (existing.length > 0) return existing[0];

  const id = uuidv4();
  await db.insert(storeSettings).values({ id });
  const [created] = await db.select().from(storeSettings).where(eq(storeSettings.id, id));
  return created;
}

export async function GET() {
  try {
    const settings = await getOrCreateSettings();
    return NextResponse.json(settings);
  } catch (err) {
    console.error("Settings GET error:", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const parsed = settingsSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

    const current = await getOrCreateSettings();
    await db.update(storeSettings).set(parsed.data).where(eq(storeSettings.id, current.id));

    const [updated] = await db.select().from(storeSettings).where(eq(storeSettings.id, current.id));
    return NextResponse.json(updated);
  } catch (err) {
    console.error("Settings PATCH error:", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
