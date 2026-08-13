"use client";

import { SiteNavbar } from "@/components/site-navbar";
import { FixedBackground } from "@/components/fixed-background";
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

export default function Home() {
  return (
    <div id="top" className="relative flex min-h-screen flex-col">
      {/* Fixed background — hero image stays in place while content scrolls.
          Content sections use frosted glass to let this show through. */}
      <FixedBackground />

      <PageIntro />
      <SiteNavbar />

      <main className="relative flex-1">
        {/* Hero — transparent, the fixed background shows through here */}
        <HeroSection />

        {/* Content sections — frosted glass panel over the fixed background.
            Inline style ensures backdrop-filter works (CSS class was
            overridden by Tailwind's @apply). ~80% opacity + heavy blur. */}
        <div
          className="relative"
          style={{
            backgroundColor: "color-mix(in oklch, var(--background) 80%, transparent)",
            backdropFilter: "blur(30px) saturate(150%)",
            WebkitBackdropFilter: "blur(30px) saturate(150%)",
          }}
        >
          <AboutSection />
          <InterestsSection />
          <ProjectsSection />
          <GitHubContributionsSection />
          <BlogSection />
          <PhotoWallSection />
          <ResourcesSection />
          <ContactSection />
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
