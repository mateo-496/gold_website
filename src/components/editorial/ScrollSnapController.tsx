"use client";

import { usePathname } from "next/navigation";
import { routing } from "@/i18n/routing";

export function ScrollSnapController({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  const isHome =
    segments.length === 1 &&
    (routing.locales as readonly string[]).includes(segments[0]);

  return <div className={isHome ? "snap-container" : undefined}>{children}</div>;
}