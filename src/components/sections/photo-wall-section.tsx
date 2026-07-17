"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { SectionHeading } from "@/components/motion-helpers";

export function PhotoWallSection() {
  const [photos, setPhotos] = React.useState<string[]>([]);
  const [loaded, setLoaded] = React.useState<Set<number>>(new Set());

  React.useEffect(() => {
    let cancelled = false;
    fetch("/api/photos")
      .then((r) => r.json())
      .then((data: { photos: string[] }) => {
        if (!cancelled) setPhotos(data.photos ?? []);
      })
      .catch(() => {
        /* keep empty */
      });
    return () => {
      cancelled = true;
    };
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

      {/* Full-width masonry wall. CSS columns with column-gap: 0 and
          break-inside: avoid give a seamless, gapless wall. Images fade
          in gently (opacity + slight scale) as they load. */}
      <div className="mt-12 w-full">
        {photos.length === 0 ? (
          <div className="mx-auto flex max-w-5xl items-center justify-center px-6">
            <div className="h-64 w-full animate-pulse rounded-3xl bg-muted" />
          </div>
        ) : (
          <div className="masonry-wall">
            {photos.map((src, i) => (
              <div key={src} className="masonry-item">
                <motion.img
                  src={src}
                  alt=""
                  loading="lazy"
                  onLoad={() => onImgLoad(i)}
                  initial={{ opacity: 0, scale: 1.03 }}
                  animate={
                    loaded.has(i)
                      ? { opacity: 1, scale: 1 }
                      : { opacity: 0, scale: 1.03 }
                  }
                  transition={{
                    duration: 0.8,
                    ease: [0.22, 1, 0.36, 1],
                    delay: Math.min(i * 0.015, 0.2),
                  }}
                  style={{ willChange: "opacity" }}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        .masonry-wall {
          column-gap: 0;
          column-fill: balance;
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
