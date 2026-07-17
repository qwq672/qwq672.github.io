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
 */
function smartShuffle<T extends { ratio: number }>(arr: T[]): T[] {
  const bucket = (r: number) => Math.round(r * 2) / 2;
  const pool = [...arr];
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
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

/** Number of grid columns by viewport. */
function getNumCols(width: number) {
  if (width >= 1280) return 6;
  if (width >= 1024) return 5;
  if (width >= 768) return 4;
  if (width >= 480) return 3;
  return 2;
}

const ROW_HEIGHT = 8; // px — small fixed row for smooth tiling

export function PhotoWallSection() {
  const [photos, setPhotos] = React.useState<PhotoItem[]>([]);
  const [loaded, setLoaded] = React.useState<Set<number>>(new Set());
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [numCols, setNumCols] = React.useState(6);
  const [colWidth, setColWidth] = React.useState(200);

  React.useEffect(() => {
    let cancelled = false;
    fetch("/api/photos")
      .then((r) => r.json())
      .then((data: { photos: PhotoItem[] }) => {
        if (cancelled) return;
        const list = data.photos ?? [];
        if (list.length === 0) return;
        const shuffled = smartShuffle(list);
        // Duplicate 2x to overfill — we clip the middle, repetition is OK.
        const overfilled = [
          ...shuffled,
          ...smartShuffle(list),
        ];
        setPhotos(overfilled);
      })
      .catch(() => {
        /* keep empty */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Measure container width → compute column count + column width
  React.useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => {
      const w = el.offsetWidth;
      setNumCols(getNumCols(w));
      setColWidth(w / getNumCols(w));
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [photos.length]);

  // Compute row span for each image based on its aspect ratio + column width.
  // span = round(columnWidth / ratio / ROW_HEIGHT), clamped to [1, 30]
  const items = React.useMemo(() => {
    return photos.map((p, i) => {
      const span = Math.max(
        1,
        Math.min(30, Math.round(colWidth / p.ratio / ROW_HEIGHT))
      );
      return { ...p, span, i };
    });
  }, [photos, colWidth]);

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

      {/* Gapless photo wall using CSS Grid with dense packing.
          Fixed row height + integer row spans = zero gaps. The inner grid
          is taller than the container (130%) and offset (-15%) so we see
          the middle slice of an overfilled wall. */}
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
            ref={containerRef}
            className="relative w-full overflow-hidden"
            style={{ height: "calc(100vh * 7 / 6)" }}
          >
            <div
              className="absolute inset-x-0"
              style={{
                top: "-15%",
                height: "130%",
                display: "grid",
                gridTemplateColumns: `repeat(${numCols}, 1fr)`,
                gridAutoRows: `${ROW_HEIGHT}px`,
                gridAutoFlow: "row dense",
                gap: 0,
              }}
            >
              {items.map((p) => (
                <div
                  key={`${p.src}-${p.i}`}
                  className="masonry-item"
                  style={{
                    gridRow: `span ${p.span}`,
                    gridColumn: "span 1",
                    overflow: "hidden",
                    lineHeight: 0,
                  }}
                >
                  <motion.img
                    src={p.src}
                    alt=""
                    loading="lazy"
                    onLoad={() => onImgLoad(p.i)}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: loaded.has(p.i) ? 1 : 0 }}
                    transition={{
                      duration: 0.7,
                      ease: [0.22, 1, 0.36, 1],
                      delay: Math.min(p.i * 0.006, 0.3),
                    }}
                    style={{
                      willChange: "opacity",
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block",
                      background: "transparent",
                      filter: "saturate(0.92) contrast(1.03)",
                    }}
                  />
                </div>
              ))}
            </div>

            {/* Cinematic vignette — subtle, only darkens far edges */}
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "radial-gradient(ellipse at center, transparent 60%, rgba(0,0,0,0.28) 100%)",
              }}
            />
            <div className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-background/40 to-transparent" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-background/50 to-transparent" />
          </div>
        )}
      </div>
    </section>
  );
}
