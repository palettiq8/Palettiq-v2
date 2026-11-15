import type { Palette } from "@/lib/types";
import { PaletteCard } from "./PaletteCard";

interface PaletteGridProps {
  palettes: Palette[];
  favoritePaletteIds: number[];
  normalSavedPaletteIds: number[];
  savingPaletteId: number | null;
  favoritingPaletteId: number | null;
  onToggleFavorite: (paletteId: number) => void;
  onToggleSave: (paletteId: number) => void;
  onDownload: (palette: Palette, format: "png" | "svg") => void;
  onCopy: (palette: Palette) => void;
  onAddToProjects: (paletteId: number) => void;
}

export function PaletteGrid({
  palettes,
  favoritePaletteIds,
  normalSavedPaletteIds,
  savingPaletteId,
  favoritingPaletteId,
  onToggleFavorite,
  onToggleSave,
  onDownload,
  onCopy,
  onAddToProjects,
}: PaletteGridProps) {
  const favoriteIds = new Set(favoritePaletteIds);
  const savedIds = new Set(normalSavedPaletteIds);

  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
      {palettes.map((palette) => (
        <PaletteCard
          key={palette.id}
          palette={palette}
          isFavorite={favoriteIds.has(palette.id)}
          isSaved={savedIds.has(palette.id)}
          isSaving={savingPaletteId === palette.id}
          isFavoriting={favoritingPaletteId === palette.id}
          onToggleFavorite={onToggleFavorite}
          onToggleSave={onToggleSave}
          onDownload={onDownload}
          onCopy={onCopy}
          onAddToProjects={onAddToProjects}
        />
      ))}
    </div>
  );
}
