"use client";

import * as React from "react";

/**
 * Custom overlay scrollbar.
 * - Sits on top of content (trackless) so the page stays visually centered.
 * - Thumb is hidden by default, fades in while scrolling / hovering the rail.
 * - Draggable: click + drag the thumb to scroll the page.
 * - Falls back to native behaviour on reduced-motion / no-JS gracefully.
 */
export function Scrollbar() {
  const railRef = React.useRef<HTMLDivElement>(null);
  const thumbRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const rail = railRef.current;
    const thumb = thumbRef.current;
    if (!rail || !thumb) return;

    let visible = false;
    let hideTimer: number | undefined;
    let rafId = 0;

    const show = () => {
      if (!visible) {
        visible = true;
        rail.classList.add("is-visible");
      }
      window.clearTimeout(hideTimer);
      hideTimer = window.setTimeout(() => {
        visible = false;
        rail.classList.remove("is-visible");
      }, 900);
    };

    const updateThumb = () => {
      const doc = document.documentElement;
      const scrollTop = window.scrollY || doc.scrollTop;
      const scrollHeight = doc.scrollHeight;
      const clientHeight = doc.clientHeight;
      const maxScroll = scrollHeight - clientHeight;
      if (maxScroll <= 0) {
        thumb.style.height = "0px";
        return;
      }
      const ratio = clientHeight / scrollHeight;
      const thumbHeight = Math.max(clientHeight * ratio, 36);
      const thumbTop = (scrollTop / maxScroll) * (clientHeight - thumbHeight);
      thumb.style.height = `${thumbHeight}px`;
      thumb.style.transform = `translateX(-50%) translateY(${thumbTop}px)`;
    };

    const onScroll = () => {
      show();
      if (!rafId) {
        rafId = requestAnimationFrame(() => {
          updateThumb();
          rafId = 0;
        });
      }
    };

    // Show on hovering the right edge of the viewport
    const onMove = (e: MouseEvent) => {
      if (e.clientX > window.innerWidth - 28) {
        show();
      }
    };

    // Drag to scroll
    let dragging = false;
    let startY = 0;
    let startScroll = 0;

    const onThumbDown = (e: PointerEvent) => {
      e.preventDefault();
      dragging = true;
      startY = e.clientY;
      startScroll = window.scrollY;
      rail.classList.add("is-dragging");
      thumb.setPointerCapture(e.pointerId);
      show();
    };
    const onMoveDrag = (e: PointerEvent) => {
      if (!dragging) return;
      const doc = document.documentElement;
      const maxScroll = doc.scrollHeight - doc.clientHeight;
      const trackH = doc.clientHeight - thumb.offsetHeight;
      if (trackH <= 0) return;
      const dy = e.clientY - startY;
      const scrollRatio = dy / trackH;
      window.scrollTo({ top: startScroll + scrollRatio * maxScroll, behavior: "auto" });
    };
    const onUp = (e: PointerEvent) => {
      if (!dragging) return;
      dragging = false;
      rail.classList.remove("is-dragging");
      try {
        thumb.releasePointerCapture(e.pointerId);
      } catch {
        /* noop */
      }
      show();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", updateThumb, { passive: true });
    window.addEventListener("mousemove", onMove, { passive: true });
    thumb.addEventListener("pointerdown", onThumbDown);
    window.addEventListener("pointermove", onMoveDrag);
    window.addEventListener("pointerup", onUp);

    updateThumb();
    // Re-measure when fonts/images load
    const t1 = window.setTimeout(updateThumb, 600);
    const t2 = window.setTimeout(updateThumb, 1800);
    window.addEventListener("load", updateThumb);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", updateThumb);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("pointermove", onMoveDrag);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("load", updateThumb);
      thumb.removeEventListener("pointerdown", onThumbDown);
      window.clearTimeout(hideTimer);
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div ref={railRef} className="scrollbar-rail" aria-hidden="true">
      <div ref={thumbRef} className="scrollbar-thumb" />
    </div>
  );
}
