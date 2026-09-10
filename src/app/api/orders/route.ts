import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/db";
import { orders, orderItems, customers } from "@/db/schema";
import { eq, desc, ilike, or, and } from "drizzle-orm";
import { orderStatusSchema, paymentStatusSchema } from "@/lib/validation";
import { getSession } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    let conditions = [];
    if (status) conditions.push(eq(orders.status, status));
    if (search) {
      // Search by order number
      conditions.push(ilike(orders.orderNumber, `%${search}%`));
    }

    const where = conditions.length > 0 ? and(...conditions) : undefined;

    const result = await db.select({
      id: orders.id,
      orderNumber: orders.orderNumber,
      customerId: orders.customerId,
      status: orders.status,
      paymentMethod: orders.paymentMethod,
      paymentStatus: orders.paymentStatus,
      subtotal: orders.subtotal,
      deliveryFee: orders.deliveryFee,
      total: orders.total,
      deliveryZoneId: orders.deliveryZoneId,
      createdAt: orders.createdAt,
      updatedAt: orders.updatedAt,
    }).from(orders).where(where).orderBy(desc(orders.createdAt)).limit(100);

    // Attach customer info and items
    const enriched = await Promise.all(result.map(async (order) => {
      const [customer] = await db.select().from(customers).where(eq(customers.id, order.customerId)).limit(1);
      const items = await db.select().from(orderItems).where(eq(orderItems.orderId, order.id));
      return { ...order, customer, items };
    }));

    return NextResponse.json(enriched);
  } catch (err) {
    console.error("Orders GET error:", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
