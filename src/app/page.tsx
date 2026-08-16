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

        {/* Content panel — frosted glass over the fixed background.
            No saturate (it amplifies warm tones causing red tint).
            92% opacity + blur(12px) = subtle frost without color shift. */}
        <div
          className="relative frosted-panel"
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
