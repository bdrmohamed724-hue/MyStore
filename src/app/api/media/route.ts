import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/db";
import { media } from "@/db/schema";
import { eq, desc, ilike } from "drizzle-orm";
import { getSession } from "@/lib/auth";
import { validateMediaType, validateMediaSize, getMediaTypeGroup } from "@/lib/validation";
import { v4 as uuidv4 } from "uuid";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");

    const result = search
      ? await db.select().from(media).where(ilike(media.name, `%${search}%`)).orderBy(desc(media.createdAt))
      : await db.select().from(media).orderBy(desc(media.createdAt));

    return NextResponse.json(result);
  } catch (err) {
    console.error("Media GET error:", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });

    if (!validateMediaType(file.type)) {
      return NextResponse.json({ error: "File type not allowed" }, { status: 400 });
    }
    if (!validateMediaSize(file.size)) {
      return NextResponse.json({ error: "File too large (max 20MB)" }, { status: 400 });
    }

    // Upload to Vercel Blob or store locally
    let url: string;
    try {
      const { put } = await import("@vercel/blob");
      const blob = await put(`media/${file.name}`, file, { access: "public" });
      url = blob.url;
    } catch {
      // Fallback: store as base64 data URL for local dev
      const buffer = Buffer.from(await file.arrayBuffer());
      const base64 = buffer.toString("base64");
      url = `data:${file.type};base64,${base64}`;
    }

    const id = uuidv4();
    const type = getMediaTypeGroup(file.type);
    await db.insert(media).values({
      id,
      name: file.name,
      type,
      url,
      size: file.size,
    });

    const [created] = await db.select().from(media).where(eq(media.id, id));
    return NextResponse.json(created, { status: 201 });
  } catch (err) {
    console.error("Media POST error:", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
