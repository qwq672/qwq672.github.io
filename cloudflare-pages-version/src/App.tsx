import { Routes, Route } from "react-router-dom";
import HomePage from "@/pages/home";
import PostPage from "@/pages/post";

/**
 * Route table.
 *
 * We use HashRouter (see main.tsx) so the SPA works on any static host
 * (Cloudflare Pages *or* GitHub Pages) with zero server-side rewrite
 * configuration. All in-page section scrolling (#about, #blog, …) is
 * JS-based (scrollIntoView), so it doesn't conflict with the hash route.
 */
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/posts/:slug" element={<PostPage />} />
      <Route path="*" element={<HomePage />} />
    </Routes>
  );
}
