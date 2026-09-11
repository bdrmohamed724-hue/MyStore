import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/db";
import { deliveryZones } from "@/db/schema";
import { eq, asc } from "drizzle-orm";
import { getSession } from "@/lib/auth";
import { v4 as uuidv4 } from "uuid";

function normalizeCommunes(value: unknown): string[] {
  if (!Array.isArray(value)) return [];

  return value
    .map((item) => String(item).trim())
    .filter(Boolean);
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const enabledOnly = searchParams.get("enabled") === "true";

    const result = enabledOnly
      ? await db
          .select()
          .from(deliveryZones)
          .where(eq(deliveryZones.enabled, true))
          .orderBy(asc(deliveryZones.wilayaCode))
      : await db
          .select()
          .from(deliveryZones)
          .orderBy(asc(deliveryZones.wilayaCode));

    return NextResponse.json(result);
  } catch (err) {
    console.error("Delivery GET error:", err);

    return NextResponse.json(
      { error: "Failed to load delivery settings" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();

    const wilayaCode = Number(body.wilayaCode);
    const wilayaName = String(body.wilayaName || "").trim();
    const price = String(body.price ?? "0");
    const estimatedTime = body.estimatedTime
      ? String(body.estimatedTime).trim()
      : null;
    const enabled = body.enabled !== false;
    const communes = normalizeCommunes(body.communes);

    if (
      !Number.isInteger(wilayaCode) ||
      wilayaCode < 1 ||
      !wilayaName
    ) {
      return NextResponse.json(
        { error: "Invalid Wilaya data" },
        { status: 400 }
      );
    }

    if (Number(price) < 0) {
      return NextResponse.json(
        { error: "Invalid delivery price" },
        { status: 400 }
      );
    }

    const existing = await db
      .select()
      .from(deliveryZones)
      .where(eq(deliveryZones.wilayaCode, wilayaCode))
      .limit(1);

    if (existing.length > 0) {
      return NextResponse.json(
        { error: "This Wilaya already exists" },
        { status: 409 }
      );
    }

    const id = uuidv4();

    await db.insert(deliveryZones).values({
      id,
      name: wilayaName,
      price,
      estimatedTime,
      enabled,
      wilayaCode,
      wilayaName,
      communes,
    });

    const [created] = await db
      .select()
      .from(deliveryZones)
      .where(eq(deliveryZones.id, id));

    return NextResponse.json(created, { status: 201 });
  } catch (err) {
    console.error("Delivery POST error:", err);

    return NextResponse.json(
      { error: "Failed to create delivery Wilaya" },
      { status: 500 }
    );
  }
}
