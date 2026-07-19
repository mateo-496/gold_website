"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale } from "next-intl";
import { useEffect, useState } from "react";
import { routing } from "@/i18n/routing";

// LOGO_LIGHT sits on dark backgrounds (e.g. the home hero image).
// LOGO_DARK sits on light backgrounds (every other section/page).
// Drop the two files in public/images/logo/.
const LOGO_LIGHT = "/images/logo/logo-white.svg";
const LOGO_DARK = "/images/logo/logo-black.svg";

export function Logo() {
  const pathname = usePathname();
  const locale = useLocale();
  const [overDark, setOverDark] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [pastTop, setPastTop] = useState(false);
  const [scrolling, setScrolling] = useState(false);

  const segments = pathname.split("/").filter(Boolean);
  const isHome =
    segments.length === 1 &&
    (routing.locales as readonly string[]).includes(segments[0]);

  useEffect(() => {
    // Sections can opt in with data-logo-bg="dark" (e.g. the home hero image,
    // the gold chart, or a page's V-shaped banner). While any of them is in
    // view under the fixed logo, use the light mark; everywhere else, the dark mark.
    const targets = document.querySelectorAll('[data-logo-bg="dark"]');
    if (targets.length === 0) {
      setOverDark(false);
      return;
    }

    setOverDark(true); // the first section is dark, so start true to avoid a flash

    const intersecting = new Set<Element>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) intersecting.add(entry.target);
          else intersecting.delete(entry.target);
        }
        setOverDark(intersecting.size > 0);
      },
      { threshold: 0.4 }
    );
    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, [pathname]);

  useEffect(() => {
    // Elements can opt in with data-logo-hide="true" (e.g. the footer),
    // typically because the fixed logo has nowhere clean to sit once
    // they're on screen (short pages, overlapping text, etc).
    const targets = document.querySelectorAll('[data-logo-hide="true"]');
    if (targets.length === 0) {
      setHidden(false);
      return;
    }

    const intersecting = new Set<Element>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) intersecting.add(entry.target);
          else intersecting.delete(entry.target);
        }
        setHidden(intersecting.size > 0);
      },
      { threshold: 0.15 }
    );
    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, [pathname]);

  useEffect(() => {
    // Home is a single scrolling page: fade the logo out while actively
    // scrolling and back in once it settles. The scroll now happens on the
    // inner .snap-container wrapper, not window.
    if (!isHome) {
      setScrolling(false);
      return;
    }
    const target = document.querySelector(".snap-container");
    if (!target) return;
    let timeout: ReturnType<typeof setTimeout>;
    const onScroll = () => {
      setScrolling(true);
      clearTimeout(timeout);
      timeout = setTimeout(() => setScrolling(false), 250);
    };
    target.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      target.removeEventListener("scroll", onScroll);
      clearTimeout(timeout);
    };
  }, [isHome, pathname]);

  useEffect(() => {
    // Other pages: the logo only belongs at the very top; once the person
    // starts scrolling, fade it out and keep it out (no flicker back in).
    if (isHome) {
      setPastTop(false);
      return;
    }
    const onScroll = () => setPastTop(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome, pathname]);

  const handleClick = (e: React.MouseEvent) => {
    if (isHome) {
      e.preventDefault();
      document.querySelector(".snap-container")?.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <Link
      href={`/${locale}`}
      onClick={handleClick}
      className={`fixed top-4 md:top-8 left-1/2 -translate-x-1/2 z-40 block transition-opacity ease-out ${
        hidden || pastTop || scrolling
          ? "duration-300 opacity-0 pointer-events-none"
          : "duration-700 opacity-100"
      }`}
      aria-label="GoldAlp — home"
    >
      <div className="relative h-9 sm:h-11 md:h-16 aspect-[3/1]">
        <Image
          src={LOGO_DARK}
          alt="GoldAlp"
          fill
          priority
          className={`object-contain transition-opacity duration-500 ${overDark ? "opacity-0" : "opacity-100"}`}
        />
        <Image
          src={LOGO_LIGHT}
          alt="GoldAlp"
          fill
          priority
          className={`object-contain transition-opacity duration-500 ${overDark ? "opacity-100" : "opacity-0"}`}
        />
      </div>
    </Link>
  );
}