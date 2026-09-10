import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/db";
import { customers, orders } from "@/db/schema";
import { eq, ilike, or, desc } from "drizzle-orm";
import { getSession } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");

    let result;
    if (search) {
      result = await db.select().from(customers).where(
        or(
          ilike(customers.name, `%${search}%`),
          ilike(customers.email, `%${search}%`),
          ilike(customers.phone, `%${search}%`),
          ilike(customers.wilaya, `%${search}%`),
          ilike(customers.city, `%${search}%`)
        )
      ).orderBy(desc(customers.createdAt)).limit(50);
    } else {
      result = await db.select().from(customers).orderBy(desc(customers.createdAt)).limit(50);
    }

    // Attach order count
    const enriched = await Promise.all(result.map(async (c) => {
      const orderList = await db.select().from(orders).where(eq(orders.customerId, c.id)).orderBy(desc(orders.createdAt));
      return { ...c, orderCount: orderList.length, recentOrders: orderList.slice(0, 5) };
    }));

    return NextResponse.json(enriched);
  } catch (err) {
    console.error("Customers GET error:", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
