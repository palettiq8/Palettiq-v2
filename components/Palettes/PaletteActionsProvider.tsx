"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import type { Palette } from "@/lib/types";

import {
  PaletteActionsContext,
  type PaletteAction,
} from "./PaletteActionsContext";

import { PaletteQuickViewDialog } from "./PaletteQuickViewDialog";

interface PaletteActionsProviderProps {
  palettes: Palette[];
  children: ReactNode;
}

export function PaletteActionsProvider({
  palettes,
  children,
}: PaletteActionsProviderProps) {
  const [activePaletteId, setActivePaletteId] = useState<number | null>(null);
  const [activeAction, setActiveAction] = useState<PaletteAction | null>(null);

  const openPaletteAction = (paletteId: number, action: PaletteAction) => {
    setActivePaletteId(paletteId);
    setActiveAction(action);
  };

  const closePaletteAction = () => {
    setActivePaletteId(null);
    setActiveAction(null);
  };

  return (
    <PaletteActionsContext.Provider
      value={{
        palettes,
        activePaletteId,
        activeAction,
        openPaletteAction,
        closePaletteAction,
      }}
    >
      {children}

      {activeAction === "quick-view" && activePaletteId !== null && (
        <PaletteQuickViewDialog
          paletteId={activePaletteId}
          open
          onOpenChange={(open) => {
            if (!open) closePaletteAction();
          }}
        />
      )}
    </PaletteActionsContext.Provider>
  );
}
