"use client";

import { useQuery } from "@tanstack/react-query";

import { getSimilarPalettesAction } from "@/app/actions/palettes";

export function useSimilarPalettes(paletteId: number | null) {
  return useQuery({
    queryKey: ["similar-palettes", paletteId],
    queryFn: () => getSimilarPalettesAction(paletteId as number),
    enabled: paletteId !== null,
    staleTime: 5 * 60 * 1000,
  });
}
