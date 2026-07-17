import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

export const dynamic = "force-static";

export async function GET() {
  try {
    const photosDir = path.join(process.cwd(), "public", "photos");
    const files = (await fs.readdir(photosDir))
      .filter((f) => f.endsWith(".jpg"))
      .sort((a, b) => {
        const na = parseInt(a, 10);
        const nb = parseInt(b, 10);
        return na - nb;
      });
    return NextResponse.json({ photos: files.map((f) => `/photos/${f}`) });
  } catch {
    return NextResponse.json({ photos: [] });
  }
}
