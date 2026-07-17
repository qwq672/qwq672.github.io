"use client";

import * as React from "react";
import { Heart, ArrowUp } from "lucide-react";

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-auto border-t border-border/40 bg-card/30">
      <div className="mx-auto max-w-5xl px-6 py-12">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <div className="flex items-center gap-2.5">
            <span className="relative h-8 w-8 overflow-hidden rounded-full border border-border/60">
              <img
                src="/avatar.webp"
                alt="qwq672"
                className="h-full w-full object-cover"
              />
            </span>
            <div className="text-sm">
              <div className="font-display font-semibold text-foreground">qwq672</div>
              <div className="text-xs text-muted-foreground">
                © {year} · 随便折腾，别太当真
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              Made with
              <Heart className="h-3.5 w-3.5 fill-accent text-accent" />
              &amp; a lot of 碎碎念
            </span>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="inline-flex items-center gap-1 rounded-full border border-border/60 px-3 py-1.5 transition-colors hover:border-accent/40 hover:text-accent"
            >
              回到顶部
              <ArrowUp className="h-3 w-3" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
