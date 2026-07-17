import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import sharp from "sharp";

export const dynamic = "force-static";

interface PhotoItem {
  src: string;
  w: number;
  h: number;
  /** aspect ratio bucket — used by the client to avoid same-size neighbors */
  ratio: number;
}

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

    const photos: PhotoItem[] = [];
    for (const f of files) {
      try {
        const meta = await sharp(path.join(photosDir, f)).metadata();
        const w = meta.width ?? 600;
        const h = meta.height ?? 400;
        photos.push({ src: `/photos/${f}`, w, h, ratio: w / h });
      } catch {
        /* skip */
      }
    }
    return NextResponse.json({ photos });
  } catch {
    return NextResponse.json({ photos: [] });
  }
}
