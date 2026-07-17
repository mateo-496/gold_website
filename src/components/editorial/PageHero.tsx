"use client";

import { useEffect } from "react";
import { PageNav } from "@/components/editorial/PageNav";

type PageHeroProps = {
  breadcrumbLabel?: React.ReactNode;
  imageSrc?: string;
};

export function PageHero({ imageSrc = "/images/backgrounds/mountain1.jpeg" }: PageHeroProps) {
  useEffect(() => {
    // Prevent Next.js/browser scroll restoration from landing the page
    // already scrolled past the hero image on load.
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  return (
    <section
      className="relative w-full h-[62vh] min-h-[420px] max-h-[720px] bg-white overflow-hidden"
      data-logo-bg="dark"
    >
      <div
        className="absolute inset-0 bg-neutral-900 bg-cover bg-center"
        style={{
          backgroundImage: `url(${imageSrc})`,
          clipPath: "polygon(0 0, 100% 0, 100% 62%, 50% 100%, 0 62%)",
        }}
      />
      <div
        className="absolute inset-0 bg-black/25"
        style={{ clipPath: "polygon(0 0, 100% 0, 100% 62%, 50% 100%, 0 62%)" }}
      />
      <div className="absolute top-6 left-6 md:top-8 md:left-10">
        <PageNav />
      </div>
    </section>
  );
}