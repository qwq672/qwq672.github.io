/**
 * Photo data for the static site.
 *
 * Photos are baked into src/data/photos.json at build time by
 * scripts/build-data.ts. The JSON contains {src, w, h, ratio} for each
 * photo (dimensions read from JPEG headers, no sharp dependency).
 */
import photosData from "@/data/photos.json";

export interface PhotoItem {
  src: string;
  w: number;
  h: number;
  ratio: number;
}

export function getPhotos(): PhotoItem[] {
  return (photosData as { photos: PhotoItem[] }).photos ?? [];
}
