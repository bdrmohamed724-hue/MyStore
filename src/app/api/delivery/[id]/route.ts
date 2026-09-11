import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/db";
import { deliveryZones } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getSession } from "@/lib/auth";

function normalizeCommunes(value: unknown): string[] {
  if (!Array.isArray(value)) return [];

  return value
    .map((item) => String(item).trim())
    .filter(Boolean);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();

    const updateData: Record<string, unknown> = {};

    if (body.name !== undefined) {
      updateData.name = String(body.name).trim();
    }

    if (body.wilayaName !== undefined) {
      updateData.wilayaName = String(body.wilayaName).trim();
      updateData.name = String(body.wilayaName).trim();
    }

    if (body.wilayaCode !== undefined) {
      const code = Number(body.wilayaCode);

      if (!Number.isInteger(code) || code < 1) {
        return NextResponse.json(
          { error: "Invalid Wilaya code" },
          { status: 400 }
        );
      }

      updateData.wilayaCode = code;
    }

    if (body.price !== undefined) {
      const price = String(body.price);

      if (Number(price) < 0) {
        return NextResponse.json(
          { error: "Invalid delivery price" },
          { status: 400 }
        );
      }

      updateData.price = price;
    }

    if (body.estimatedTime !== undefined) {
      updateData.estimatedTime = body.estimatedTime
        ? String(body.estimatedTime).trim()
        : null;
    }

    if (body.enabled !== undefined) {
      updateData.enabled = Boolean(body.enabled);
    }

    if (body.communes !== undefined) {
      updateData.communes = normalizeCommunes(body.communes);
    }

    await db
      .update(deliveryZones)
      .set(updateData)
      .where(eq(deliveryZones.id, id));

    const [updated] = await db
      .select()
      .from(deliveryZones)
      .where(eq(deliveryZones.id, id));

    if (!updated) {
      return NextResponse.json(
        { error: "Wilaya not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updated);
  } catch (err) {
    console.error("Delivery PATCH error:", err);

    return NextResponse.json(
      { error: "Failed to update delivery Wilaya" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;

    await db
      .delete(deliveryZones)
      .where(eq(deliveryZones.id, id));

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Delivery DELETE error:", err);

    return NextResponse.json(
      { error: "Failed to delete delivery Wilaya" },
      { status: 500 }
    );
  }
}
