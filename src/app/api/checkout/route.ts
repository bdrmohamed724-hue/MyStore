import { NextResponse, type NextRequest } from "next/server";
import { checkoutSchema, generateOrderNumber } from "@/lib/validation";
import { v4 as uuidv4 } from "uuid";
import { pool } from "@/db";

export async function POST(request: NextRequest) {
  const client = await pool.connect();

  try {
    const body = await request.json();

    const parsed = checkoutSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const {
      customer: custData,
      deliveryZoneId,
      items,
    } = parsed.data;

    // Start transaction
    await client.query("BEGIN");

    // Check delivery zone
    const zoneRes = await client.query(
      `SELECT id, name, price, enabled
       FROM delivery_zones
       WHERE id = $1`,
      [deliveryZoneId]
    );

    if (
      zoneRes.rows.length === 0 ||
      !zoneRes.rows[0].enabled
    ) {
      await client.query("ROLLBACK");

      return NextResponse.json(
        { error: "Invalid delivery zone" },
        { status: 400 }
      );
    }

    const deliveryFee = parseFloat(zoneRes.rows[0].price);

    // Validate products and calculate subtotal
    let subtotal = 0;

    const validatedItems: {
      productId: string;
      name: string;
      price: number;
      quantity: number;
      stock: number;
    }[] = [];

    for (const item of items) {
      const prodRes = await client.query(
        `SELECT id, name, price, stock, active
         FROM products
         WHERE id = $1`,
        [item.productId]
      );

      if (
        prodRes.rows.length === 0 ||
        !prodRes.rows[0].active
      ) {
        await client.query("ROLLBACK");

        return NextResponse.json(
          {
            error: `Product ${item.productId} not available`,
          },
          { status: 400 }
        );
      }

      const prod = prodRes.rows[0];

      if (prod.stock < item.quantity) {
        await client.query("ROLLBACK");

        return NextResponse.json(
          {
            error: `Insufficient stock for ${prod.name}`,
          },
          { status: 400 }
        );
      }

      const price = parseFloat(prod.price);

      subtotal += price * item.quantity;

      validatedItems.push({
        productId: prod.id,
        name: prod.name,
        price,
        quantity: item.quantity,
        stock: prod.stock,
      });
    }

    const total = subtotal + deliveryFee;

    // Database currently requires an email.
    // We generate an internal placeholder email.
    const phoneDigits = (custData.phone || "")
      .replace(/\D/g, "");

    const internalEmail =
      phoneDigits.length > 0
        ? `${phoneDigits}@customer.local`
        : `${uuidv4()}@customer.local`;

    // Find existing customer by phone
    let customerId: string;

    const existingCust = await client.query(
      `SELECT id
       FROM customers
       WHERE phone = $1
       LIMIT 1`,
      [custData.phone]
    );

    if (existingCust.rows.length > 0) {
      customerId = existingCust.rows[0].id;

      await client.query(
        `UPDATE customers
         SET name = $1,
             phone = $2,
             wilaya = $3,
             city = $4,
             address = $5
         WHERE id = $6`,
        [
          custData.name,
          custData.phone || null,
          custData.wilaya || null,
          custData.city || null,
          null,
          customerId,
        ]
      );
    } else {
      customerId = uuidv4();

      await client.query(
        `INSERT INTO customers
         (
           id,
           name,
           email,
           phone,
           wilaya,
           city,
           address,
           created_at
         )
         VALUES
         (
           $1,
           $2,
           $3,
           $4,
           $5,
           $6,
           $7,
           NOW()
         )`,
        [
          customerId,
          custData.name,
          internalEmail,
          custData.phone || null,
          custData.wilaya || null,
          custData.city || null,
          null,
        ]
      );
    }

    // Create order
    const orderId = uuidv4();
    const orderNumber = generateOrderNumber();

    // Payment is no longer shown to customers.
    // The database still requires this field,
    // so we keep COD internally.
    const paymentMethod = "COD";
    const paymentStatus = "Pending";

    await client.query(
      `INSERT INTO orders
       (
         id,
         order_number,
         customer_id,
         status,
         payment_method,
         payment_status,
         subtotal,
         delivery_fee,
         total,
         delivery_zone_id,
         created_at,
         updated_at
       )
       VALUES
       (
         $1,
         $2,
         $3,
         'Pending',
         $4,
         $5,
         $6,
         $7,
         $8,
         $9,
         NOW(),
         NOW()
       )`,
      [
        orderId,
        orderNumber,
        customerId,
        paymentMethod,
        paymentStatus,
        subtotal.toFixed(2),
        deliveryFee.toFixed(2),
        total.toFixed(2),
        deliveryZoneId,
      ]
    );

    // Create order items and decrease stock
    for (const item of validatedItems) {
      const itemId = uuidv4();

      await client.query(
        `INSERT INTO order_items
         (
           id,
           order_id,
           product_id,
           product_name,
           quantity,
           price
         )
         VALUES
         (
           $1,
           $2,
           $3,
           $4,
           $5,
           $6
         )`,
        [
          itemId,
          orderId,
          item.productId,
          item.name,
          item.quantity,
          item.price.toFixed(2),
        ]
      );

      await client.query(
        `UPDATE products
         SET stock = stock - $1,
             updated_at = NOW()
         WHERE id = $2`,
        [
          item.quantity,
          item.productId,
        ]
      );
    }

    await client.query("COMMIT");

    return NextResponse.json(
      {
        success: true,
        orderId,
        orderNumber,
        subtotal: subtotal.toFixed(2),
        deliveryFee: deliveryFee.toFixed(2),
        total: total.toFixed(2),
      },
      { status: 201 }
    );
  } catch (err) {
    await client.query("ROLLBACK");

    console.error("Checkout error:", err);

    return NextResponse.json(
      { error: "Order creation failed" },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
