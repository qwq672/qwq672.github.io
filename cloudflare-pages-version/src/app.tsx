import { HashRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { Scrollbar } from "@/components/scrollbar";
import { HomePage } from "@/pages/home";
import { PostPage } from "@/pages/post-page";
import { NotFoundPage } from "@/pages/not-found";
import { ErrorPage } from "@/pages/error";

/**
 * App shell — sets up HashRouter (so the site works on GitHub Pages /
 * Cloudflare Pages without SPA-fallback config) + ThemeProvider + the
 * custom overlay scrollbar.
 *
 * Routes:
 *   /                → HomePage (all landing sections)
 *   /posts/:slug     → PostPage (article detail)
 *   *                → NotFoundPage (404)
 *
 * The pathless parent route provides errorElement for all children, so
 * any uncaught render error shows the friendly error UI instead of a
 * blank screen.
 */
export function App() {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      disableTransitionOnChange={false}
    >
      <HashRouter>
        <Routes>
          <Route errorElement={<ErrorPage />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/posts/:slug" element={<PostPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </HashRouter>
      <Scrollbar />
    </ThemeProvider>
  );
}
