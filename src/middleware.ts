import { NextResponse, type NextRequest } from "next/server";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "ryven-dept-secret-key-change-in-production-2024");

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect admin routes (except login)
  if (pathname.startsWith("/mohabdr") && !pathname.startsWith("/mohabdr/login")) {
    const token = request.cookies.get("ryven_session")?.value;

    if (!token) {
      return NextResponse.redirect(new URL("/mohabdr/login", request.url));
    }

    try {
      const { jwtVerify } = await import("jose");
      await jwtVerify(token, JWT_SECRET);
      return NextResponse.next();
    } catch {
      return NextResponse.redirect(new URL("/mohabdr/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/mohabdr/:path*"],
};
