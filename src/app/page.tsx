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
      <FixedBackground />

      <PageIntro />
      <SiteNavbar />

      <main className="relative flex-1">
        <HeroSection />

        {/* Frosted glass content panel — inline style ensures backdrop-filter
            works (Tailwind v4 strips it from CSS classes). No saturate (causes
            red tint). 90% opacity + 16px blur = clean frost, no color shift. */}
        <div
          className="relative"
          style={{
            backgroundColor: "color-mix(in oklch, var(--background) 90%, transparent)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
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
