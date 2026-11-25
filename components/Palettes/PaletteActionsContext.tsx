"use client";

import { createContext, useContext } from "react";
import type { Palette } from "@/lib/types";

export type PaletteAction =
  | "quick-view"
  | "details"
  | "fullscreen"
  | "view-mode"
  | "visualize"
  | "similar";

interface PaletteActionsContextValue {
  palettes: Palette[];
  activePaletteId: number | null;
  activeAction: PaletteAction | null;
  openPaletteAction: (paletteId: number, action: PaletteAction) => void;
  closePaletteAction: () => void;
}

export const PaletteActionsContext =
  createContext<PaletteActionsContextValue | null>(null);

export function usePaletteActionsContext() {
  const context = useContext(PaletteActionsContext);

  if (!context) {
    throw new Error(
      "usePaletteActionsContext must be used within PaletteActionsProvider",
    );
  }

  return context;
}
