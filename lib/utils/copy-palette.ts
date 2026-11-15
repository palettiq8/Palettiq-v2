import type { DownloadablePalette } from "@/lib/types";

export async function copyPaletteAsJson(palette: DownloadablePalette) {
  const paletteData = {
    name: palette.identity?.name ?? "Untitled Palette",
    colors: [...palette.colors]
      .sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
      .map((color) => color.hex)
      .filter((hex): hex is string => Boolean(hex)),
  };

  await navigator.clipboard.writeText(JSON.stringify(paletteData, null, 2));
}
