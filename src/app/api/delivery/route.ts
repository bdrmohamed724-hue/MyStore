import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/db";
import { deliveryZones } from "@/db/schema";
import { eq } from "drizzle-orm";
import { deliveryZoneSchema } from "@/lib/validation";
import { getSession } from "@/lib/auth";
import { v4 as uuidv4 } from "uuid";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const enabledOnly = searchParams.get("enabled") === "true";

    const result = enabledOnly
      ? await db.select().from(deliveryZones).where(eq(deliveryZones.enabled, true))
      : await db.select().from(deliveryZones);

    return NextResponse.json(result);
  } catch (err) {
    console.error("Delivery GET error:", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const body = await request.json();
    const parsed = deliveryZoneSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    const id = uuidv4();
    await db.insert(deliveryZones).values({ id, ...parsed.data });
    const [created] = await db.select().from(deliveryZones).where(eq(deliveryZones.id, id));
    return NextResponse.json(created, { status: 201 });
  } catch (err) {
    console.error("Delivery POST error:", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
