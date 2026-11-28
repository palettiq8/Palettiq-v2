"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

import { isPaletteVisualizerPath } from "@/lib/utils/palette-route";

interface HideOnVisualizerProps {
  children: ReactNode;
}

export function HideOnVisualizer({ children }: HideOnVisualizerProps) {
  const pathname = usePathname();

  if (pathname && isPaletteVisualizerPath(pathname)) {
    return null;
  }

  return <>{children}</>;
}
