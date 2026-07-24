import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import sharp from "sharp";

export const dynamic = "force-static";
export const revalidate = 3600; // re-generate at most hourly

interface PhotoItem {
  src: string;
  w: number;
  h: number;
  ratio: number;
}

// Module-level cache so repeated requests in the same process don't
// re-read every image with sharp.
let cache: PhotoItem[] | null = null;

export async function GET() {
  try {
    if (cache) {
      return NextResponse.json({ photos: cache });
    }
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
    cache = photos;
    return NextResponse.json({ photos });
  } catch {
    return NextResponse.json({ photos: [] });
  }
}
