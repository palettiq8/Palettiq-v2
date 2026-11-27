"use server";

import { fetchSimilarPalettes } from "@/lib/queries/palette-details";

export async function getSimilarPalettesAction(paletteId: number) {
  if (!Number.isSafeInteger(paletteId) || paletteId <= 0) {
    return [];
  }

  return fetchSimilarPalettes(paletteId);
}
