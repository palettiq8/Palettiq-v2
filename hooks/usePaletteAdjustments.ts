"use client";

import { useMemo, useState } from "react";
import {
  adjustColor,
  DEFAULT_ADJUSTMENTS,
  type AdjustmentKey,
  type Adjustments,
} from "@/lib/utils/palette-adjustments";

interface PaletteColorInput {
  id: number;
  hex: string | null;
  name: string | null;
}

export function usePaletteAdjustments(colors: PaletteColorInput[]) {
  const [adjustments, setAdjustments] =
    useState<Adjustments>(DEFAULT_ADJUSTMENTS);

  const adjustedColors = useMemo(
    () =>
      colors.map((color) => ({
        ...color,
        hex: color.hex
          ? adjustColor(color.hex, adjustments).toUpperCase()
          : color.hex,
      })),
    [colors, adjustments],
  );

  function updateAdjustment(key: AdjustmentKey, value: number) {
    setAdjustments((current) => ({
      ...current,
      [key]: value,
    }));
  }

  function resetAdjustments() {
    setAdjustments(DEFAULT_ADJUSTMENTS);
  }

  return {
    adjustments,
    adjustedColors,
    updateAdjustment,
    resetAdjustments,
  };
}
