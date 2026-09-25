import { Routes, Route, HashRouter } from "react-router-dom";
import { HomePage } from "@/pages/home";
import PostPage from "@/pages/post";

/**
 * Route table using HashRouter for static hosting compatibility.
 */
export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/posts/:slug" element={<PostPage />} />
        <Route path="*" element={<HomePage />} />
      </Routes>
    </HashRouter>
  );
}
