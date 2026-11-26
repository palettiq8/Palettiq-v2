import type { Palette } from "@/lib/types";
import { PaletteCard } from "./PaletteCard";
import { PaletteActionsProvider } from "./PaletteActionsProvider";

interface PaletteGridProps {
  palettes: Palette[];
  favoritePaletteIds: number[];
  normalSavedPaletteIds: number[];
  savingPaletteId: number | null;
  favoritingPaletteId: number | null;
  onToggleFavorite: (paletteId: number) => void;
  onToggleSave: (paletteId: number) => void;
  onDownload: (palette: Palette, format: "png" | "svg") => void;
  onAddToProjects: (paletteId: number) => void;
  className?: string;
  hideViewDetails?: boolean;
  hideExploreSimilar?: boolean;
  showDelete?: boolean;
  onRemove?: (paletteId: number) => Promise<void>;
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
  onAddToProjects,
  className,
  hideViewDetails = false,
  hideExploreSimilar = false,
  showDelete = false,
  onRemove
}: PaletteGridProps) {
  const favoriteIds = new Set(favoritePaletteIds);
  const savedIds = new Set(normalSavedPaletteIds);

  return (
    <PaletteActionsProvider palettes={palettes}>
      <div
        className={
          className ?? "grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3"
        }
      >
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
            onAddToProjects={onAddToProjects}
            hideViewDetails={hideViewDetails}
            hideExploreSimilar={hideExploreSimilar}
            showDelete={showDelete}
            onRemove={onRemove}
          />
        ))}
      </div>
    </PaletteActionsProvider>
  );
}
