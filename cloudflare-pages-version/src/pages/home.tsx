import * as React from "react";
import { useSearchParams } from "react-router-dom";
import { SiteNavbar } from "@/components/site-navbar";
import { HeroSection } from "@/components/sections/hero-section";
import { AboutSection } from "@/components/sections/about-section";
import { InterestsSection } from "@/components/sections/interests-section";
import { ProjectsSection } from "@/components/sections/projects-section";
import { GitHubContributionsSection } from "@/components/sections/github-contributions-section";
import { BlogSection } from "@/components/sections/blog-section";
import { PhotoWallSection } from "@/components/sections/photo-wall-section";
import { ResourcesSection } from "@/components/sections/resources-section";
import { ContactSection } from "@/components/sections/contact-section";
import { SiteFooter } from "@/components/site-footer";
import { PageIntro } from "@/components/page-intro";

/**
 * Home page — full single-page landing with all sections.
 * Mirrors the main project's src/app/page.tsx.
 *
 * Supports a `?s=<id>` query param so other pages (post detail, 404) can
 * link back to a specific section: e.g. `/?s=blog` scrolls to #blog.
 * (HashRouter uses the URL hash for routing, so we can't use plain
 * `#blog` anchors for cross-page navigation.)
 */
export function HomePage() {
  const [searchParams, setSearchParams] = useSearchParams();

  React.useEffect(() => {
    const sectionId = searchParams.get("s");
    if (sectionId) {
      // Defer until sections have mounted.
      const t = setTimeout(() => {
        document
          .getElementById(sectionId)
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 80);
      // Clear the param so a later refresh doesn't re-scroll.
      setSearchParams({}, { replace: true });
      return () => clearTimeout(t);
    }
  }, [searchParams, setSearchParams]);

  return (
    <div id="top" className="relative flex min-h-screen flex-col">
      {/* Ambient background — subtle moving glow that matches the theme */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-20 overflow-hidden"
      >
        <div className="absolute -left-[20%] top-[5%] h-[45vh] w-[45vh] rounded-full bg-accent/10 blur-[120px]" />
        <div className="absolute right-[-10%] top-[55%] h-[40vh] w-[40vh] rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute left-[30%] top-[120%] h-[40vh] w-[40vh] rounded-full bg-accent/8 blur-[120px]" />
      </div>

      <PageIntro />
      <SiteNavbar />

      <main className="flex-1">
        <HeroSection />
        <AboutSection />
        <InterestsSection />
        <ProjectsSection />
        <GitHubContributionsSection />
        <BlogSection />
        <PhotoWallSection />
        <ResourcesSection />
        <ContactSection />
      </main>

      <SiteFooter />
    </div>
  );
}
