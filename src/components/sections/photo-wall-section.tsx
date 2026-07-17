"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { SectionHeading } from "@/components/motion-helpers";

interface PhotoItem {
  src: string;
  w: number;
  h: number;
  ratio: number;
}

/**
 * Shuffle but avoid placing same-ratio items next to each other.
 * Ratios are bucketed to 1 decimal place so "similar enough" counts as same.
 */
function smartShuffle<T extends { ratio: number }>(arr: T[]): T[] {
  const bucket = (r: number) => Math.round(r * 2) / 2; // 0.5 steps
  const pool = [...arr];
  // initial random shuffle
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  // rearrange: if a neighbor has the same bucket, swap with next different
  const result: T[] = [];
  const used = new Set<number>();
  let lastBucket = -1;
  while (result.length < pool.length) {
    let picked = -1;
    for (let i = 0; i < pool.length; i++) {
      if (used.has(i)) continue;
      const b = bucket(pool[i].ratio);
      if (b !== lastBucket) {
        picked = i;
        break;
      }
    }
    // if all remaining have same bucket, just take the first
    if (picked === -1) {
      for (let i = 0; i < pool.length; i++) {
        if (!used.has(i)) {
          picked = i;
          break;
        }
      }
    }
    if (picked === -1) break;
    used.add(picked);
    result.push(pool[picked]);
    lastBucket = bucket(pool[picked].ratio);
  }
  return result;
}

export function PhotoWallSection() {
  const [photos, setPhotos] = React.useState<PhotoItem[]>([]);
  const [loaded, setLoaded] = React.useState<Set<number>>(new Set());

  React.useEffect(() => {
    let cancelled = false;
    fetch("/api/photos")
      .then((r) => r.json())
      .then((data: { photos: PhotoItem[] }) => {
        if (cancelled) return;
        const list = data.photos ?? [];
        setPhotos(smartShuffle(list));
      })
      .catch(() => {
        /* keep empty */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Re-shuffle on manual refresh (triggered by section heading click)
  const reshuffle = React.useCallback(() => {
    setPhotos((prev) => smartShuffle(prev));
    setLoaded(new Set());
  }, []);

  const onImgLoad = (i: number) => {
    setLoaded((prev) => new Set(prev).add(i));
  };

  return (
    <section id="gallery" className="relative scroll-mt-24 py-24 sm:py-28">
      <div className="mx-auto max-w-5xl px-6">
        <SectionHeading
          eyebrow="Gallery"
          title={
            <>
              照片墙<span className="text-accent">.</span>
            </>
          }
          description="随手拍的、截图的、收藏的——一些碎片画面。"
        />
      </div>

      {/* Full-width masonry wall with fixed height (100vh + 12.5vh = 112.5vh).
          Overflow hidden so it's a window into the wall. Vignette overlay
          adds a cinematic, story-like feel. */}
      <div className="mt-12 w-full">
        {photos.length === 0 ? (
          <div className="mx-auto flex max-w-5xl items-center justify-center px-6">
            <div
              className="w-full animate-pulse rounded-3xl bg-muted"
              style={{ height: "50vh" }}
            />
          </div>
        ) : (
          <div
            className="relative w-full overflow-hidden"
            style={{ height: "calc(100vh + 12.5vh)" }}
          >
            {/* Masonry wall */}
            <div className="masonry-wall">
              {photos.map((p, i) => (
                <div key={p.src} className="masonry-item">
                  <motion.img
                    src={p.src}
                    alt=""
                    loading="lazy"
                    onLoad={() => onImgLoad(i)}
                    initial={{ opacity: 0, scale: 1.04 }}
                    animate={
                      loaded.has(i)
                        ? { opacity: 1, scale: 1 }
                        : { opacity: 0, scale: 1.04 }
                    }
                    transition={{
                      duration: 0.9,
                      ease: [0.22, 1, 0.36, 1],
                      delay: Math.min(i * 0.012, 0.2),
                    }}
                    style={{ willChange: "opacity" }}
                  />
                </div>
              ))}
            </div>

            {/* Cinematic vignette — top + bottom fade, plus radial darkening */}
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.35) 100%)",
              }}
            />
            <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-background/60 to-transparent" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background/80 to-transparent" />
          </div>
        )}
      </div>

      <style>{`
        .masonry-wall {
          column-gap: 0;
          column-fill: auto;
        }
        .masonry-item {
          break-inside: avoid;
          line-height: 0;
          overflow: hidden;
        }
        .masonry-item img {
          display: block;
          width: 100%;
          height: auto;
          background: var(--muted);
          filter: saturate(0.92) contrast(1.03);
          transition: filter 0.5s ease;
        }
        .masonry-item:hover img {
          filter: saturate(1.1) contrast(1.05) brightness(1.05);
        }
        @media (min-width: 1280px) {
          .masonry-wall { column-count: 6; }
        }
        @media (max-width: 1279px) and (min-width: 1024px) {
          .masonry-wall { column-count: 5; }
        }
        @media (max-width: 1023px) and (min-width: 768px) {
          .masonry-wall { column-count: 4; }
        }
        @media (max-width: 767px) and (min-width: 480px) {
          .masonry-wall { column-count: 3; }
        }
        @media (max-width: 479px) {
          .masonry-wall { column-count: 2; }
        }
      `}</style>
    </section>
  );
}
