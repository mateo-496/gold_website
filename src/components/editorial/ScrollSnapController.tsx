"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { routing } from "@/i18n/routing";

export function ScrollSnapController() {
  const pathname = usePathname();

  useEffect(() => {
    const segments = pathname.split("/").filter(Boolean);
    const isHome =
      segments.length === 1 &&
      (routing.locales as readonly string[]).includes(segments[0]);

    document.documentElement.classList.toggle("snap-container", isHome);
    return () => {
      document.documentElement.classList.remove("snap-container");
    };
  }, [pathname]);

  return null;
}