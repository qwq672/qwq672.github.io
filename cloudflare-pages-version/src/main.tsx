import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";
import App from "@/App";
import { ThemeProvider } from "@/components/theme-provider";
import { Scrollbar } from "@/components/scrollbar";
import "@/index.css";

/**
 * App entry.
 *
 * HashRouter keeps the SPA fully static-host-friendly: routes resolve
 * client-side via the URL hash, so there's no need for a `_redirects`
 * (Cloudflare Pages) or `404.html` (GitHub Pages) SPA-fallback hack.
 *
 * ThemeProvider sets `attribute="class"` + `defaultTheme="dark"` to match
 * the main Next.js site. The inline script in index.html applies the
 * same default before React mounts to avoid a flash.
 */
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <HashRouter>
        <App />
      </HashRouter>
      <Scrollbar />
    </ThemeProvider>
  </React.StrictMode>
);
