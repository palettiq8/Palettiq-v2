"use client";

import { usePalettes } from "@/hooks/queries/usePalettes";
import { PaletteColor } from "@/lib/types";
import { useEffect } from "react";

export default function PalettesExplorer() {
  const { data: palettes, isPending, isError, error} = usePalettes();

  useEffect(() => {
    console.log(palettes);
  }, [palettes])

  if (isPending) {
    return (
      <div className="w-full px-6 py-8">
        <p className="text-muted-foreground">Loading palettes...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-full px-6 py-8">
        <p className="text-destructive">
          Failed to load palettes: {error.message}
        </p>
      </div>
    );
  }

  if (!palettes?.length) {
    return (
      <div className="w-full px-6 py-8">
        <p className="text-muted-foreground">No palettes found.</p>
      </div>
    );
  }

  return (
    <div className="w-full px-6 py-8">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {palettes.map((palette) => (
          <div
            key={palette.id}
            className="overflow-hidden rounded-xl border bg-card"
          >
            <div className="flex h-40">
              {palette.colors.map((color: PaletteColor) => (
                <div
                  key={color.id}
                  className="h-full flex-1"
                  style={{ backgroundColor: color.hex }}
                  title={color.hex}
                />
              ))}
            </div>

            <div className="p-4">
              <h3 className="font-semibold">{palette.identity?.name}</h3>

              <p className="mt-1 text-sm text-muted-foreground">
                {palette.identity?.short_description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
