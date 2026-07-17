"use client";

import { SiteNavbar } from "@/components/site-navbar";
import { HeroSection } from "@/components/sections/hero-section";
import { AboutSection } from "@/components/sections/about-section";
import { InterestsSection } from "@/components/sections/interests-section";
import { ProjectsSection } from "@/components/sections/projects-section";
import { BlogSection } from "@/components/sections/blog-section";
import { PhotoWallSection } from "@/components/sections/photo-wall-section";
import { ResourcesSection } from "@/components/sections/resources-section";
import { ContactSection } from "@/components/sections/contact-section";
import { SiteFooter } from "@/components/site-footer";
import { PageIntro } from "@/components/page-intro";

export default function Home() {
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
        <BlogSection />
        <PhotoWallSection />
        <ResourcesSection />
        <ContactSection />
      </main>

      <SiteFooter />
    </div>
  );
}
