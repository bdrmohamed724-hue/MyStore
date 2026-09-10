import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/db";
import { orders, orderItems, customers, deliveryZones } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getSession } from "@/lib/auth";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const [order] = await db.select().from(orders).where(eq(orders.id, id));
    if (!order) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const [customer] = await db.select().from(customers).where(eq(customers.id, order.customerId)).limit(1);
    const items = await db.select().from(orderItems).where(eq(orderItems.orderId, id));
    let deliveryZone = null;
    if (order.deliveryZoneId) {
      [deliveryZone] = await db.select().from(deliveryZones).where(eq(deliveryZones.id, order.deliveryZoneId)).limit(1);
    }

    return NextResponse.json({ ...order, customer, items, deliveryZone });
  } catch (err) {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const body = await request.json();
    const updates: Record<string, string> = {};

    if (body.status) {
      const valid = ["Pending", "Confirmed", "Processing", "Shipped", "Delivered", "Cancelled"];
      if (!valid.includes(body.status)) return NextResponse.json({ error: "Invalid status" }, { status: 400 });
      updates.status = body.status;
    }
    if (body.paymentStatus) {
      const valid = ["Pending", "Paid", "Failed", "Refunded"];
      if (!valid.includes(body.paymentStatus)) return NextResponse.json({ error: "Invalid payment status" }, { status: 400 });
      updates.paymentStatus = body.paymentStatus;
    }

    if (Object.keys(updates).length === 0) return NextResponse.json({ error: "No updates" }, { status: 400 });

    await db.update(orders).set({ ...updates, updatedAt: new Date() }).where(eq(orders.id, id));
    const [updated] = await db.select().from(orders).where(eq(orders.id, id));
    return NextResponse.json(updated);
  } catch (err) {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
