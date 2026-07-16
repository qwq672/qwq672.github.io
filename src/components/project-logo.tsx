"use client";

import * as React from "react";

/**
 * Renders a project logo. For SVGs we inline the markup so that
 * `currentColor` / theme-aware coloring works (an <img> tag can't inherit
 * CSS color). For raster logos (PNG) we just use <img>.
 */
export function ProjectLogo({
  src,
  kind,
  alt,
  className,
}: {
  src: string;
  kind: "img" | "svg";
  alt: string;
  className?: string;
}) {
  const [svg, setSvg] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (kind !== "svg") return;
    let cancelled = false;
    fetch(src)
      .then((r) => r.text())
      .then((text) => {
        if (!cancelled) setSvg(text);
      })
      .catch(() => {
        /* noop */
      });
    return () => {
      cancelled = true;
    };
  }, [src, kind]);

  if (kind === "img") {
    return (
      <img src={src} alt={alt} className={className} />
    );
  }

  // inline svg
  if (!svg) return null;
  return (
    <span
      className={className}
      dangerouslySetInnerHTML={{ __html: svg }}
      role="img"
      aria-label={alt}
    />
  );
}
