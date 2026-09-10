import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/db";
import { adminUsers } from "@/db/schema";
import { eq } from "drizzle-orm";
import { verifyPassword, createSession, setSessionCookie, clearSessionCookie, hashPassword } from "@/lib/auth";
import { loginSchema } from "@/lib/validation";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const { username, password } = parsed.data;

    // Ensure default admin exists
    const existing = await db.select().from(adminUsers).where(eq(adminUsers.username, "admin")).limit(1);
    if (existing.length === 0) {
      const hash = await hashPassword("admin123");
      await db.insert(adminUsers).values({ username: "admin", passwordHash: hash });
    }

    const user = await db.select().from(adminUsers).where(eq(adminUsers.username, username)).limit(1);
    if (user.length === 0) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const valid = await verifyPassword(password, user[0].passwordHash);
    if (!valid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const token = await createSession(username);
    await setSessionCookie(token);

    return NextResponse.json({ success: true, username });
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}

export async function DELETE() {
  await clearSessionCookie();
  return NextResponse.json({ success: true });
}

export async function GET() {
  try {
    const { getSession } = await import("@/lib/auth");
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ username: session.username });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
