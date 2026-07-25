/**
 * Static photo data — generated at build time by `scripts/build-data.ts`.
 * `ratio` is a deterministic pseudo-ratio (the photo wall uses a dense
 * CSS Grid, so real pixel dimensions aren't needed).
 */
import photosData from "@/data/photos.json";

export interface PhotoItem {
  src: string;
  ratio: number;
}

export const photos: PhotoItem[] = (photosData as { photos: PhotoItem[] }).photos;
