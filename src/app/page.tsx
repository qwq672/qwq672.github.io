"use client";

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

export default function Home() {
  return (
    <div id="top" className="relative flex min-h-screen flex-col">
      {/* Multi-layer ambient background for depth:
          Layer 1: base gradient (warm tint)
          Layer 2: large soft glows (accent + primary, parallax-ish positions)
          Layer 3: subtle noise/grain overlay for texture
          All fixed, pointer-events-none, behind content (-z-20) */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-20 overflow-hidden"
      >
        {/* Layer 1 — base radial tint */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% 0%, color-mix(in oklch, var(--accent) 8%, transparent), transparent 70%)",
          }}
        />
        {/* Layer 2 — multiple soft glows at different depths */}
        <div className="absolute -left-[15%] top-[8%] h-[50vh] w-[50vh] rounded-full bg-accent/10 blur-[140px]" />
        <div className="absolute right-[-12%] top-[40%] h-[45vh] w-[45vh] rounded-full bg-primary/8 blur-[140px]" />
        <div className="absolute left-[35%] top-[85%] h-[40vh] w-[40vh] rounded-full bg-accent/6 blur-[120px]" />
        <div className="absolute right-[20%] top-[140%] h-[35vh] w-[35vh] rounded-full bg-primary/6 blur-[100px]" />
        {/* Layer 3 — fine noise texture (SVG data URI, very subtle) */}
        <div
          className="absolute inset-0 opacity-[0.025] mix-blend-overlay"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          }}
        />
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
