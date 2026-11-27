"use client";

import { useRef, useState } from "react";

import type { Palette } from "@/lib/types";
import { useNormalSavedPalettes } from "@/hooks/queries/usePaletteSaves";
import { useFavoritePalettes } from "@/hooks/queries/usePaletteFavorites";
import { usePaletteActions } from "@/hooks/usePaletteActions";
import AddToProjectsDialog from "@/components/Projects/AddToProjectsDialog";

import { PaletteCardActions } from "../PaletteCardActions";
import {
  PaletteFullscreenViewer,
  type PaletteFullscreenViewerHandle,
} from "../PaletteFullscreenViewer";
import { PaletteActionsProvider } from "../PaletteActionsProvider";

interface PaletteDetailsActionsProps {
  palette: Palette;
}

export function PaletteDetailsActions({ palette }: PaletteDetailsActionsProps) {
  const { data: normalSavedPaletteIds = [] } = useNormalSavedPalettes();
  const { data: favoritePaletteIds = [] } = useFavoritePalettes();

  const {
    handleToggleNormalSave,
    handleToggleFavorite,
    handleAddToProjects,
    handleDownloadPalette,
    savingPaletteId,
    favoritingPaletteId,
  } = usePaletteActions(normalSavedPaletteIds, favoritePaletteIds);

  const [addToProjectsOpen, setAddToProjectsOpen] = useState(false);
  const [selectedPaletteId, setSelectedPaletteId] = useState<number | null>(
    null,
  );
  const fullscreenViewerRef = useRef<PaletteFullscreenViewerHandle>(null);

  const openAddToProjects = async (paletteId: number) => {
    const authenticated = await handleAddToProjects(paletteId);

    if (!authenticated) return;

    setSelectedPaletteId(paletteId);
    setAddToProjectsOpen(true);
  };

  return (
    <PaletteActionsProvider palettes={[palette]}>
      <PaletteCardActions
        palette={palette}
        isFavorite={favoritePaletteIds.includes(palette.id)}
        isSaved={normalSavedPaletteIds.includes(palette.id)}
        isSaving={savingPaletteId === palette.id}
        isFavoriting={favoritingPaletteId === palette.id}
        onToggleFavorite={handleToggleFavorite}
        onToggleSave={handleToggleNormalSave}
        onDownload={handleDownloadPalette}
        onAddToProjects={openAddToProjects}
        hideViewDetails
        hideExploreSimilar
        onOpenFullscreen={() =>
          fullscreenViewerRef.current?.openFullscreen()
        }
        onOpenViewMode={() => fullscreenViewerRef.current?.openViewMode()}
      />

      <PaletteFullscreenViewer ref={fullscreenViewerRef} palette={palette} />

      {selectedPaletteId !== null && (
        <AddToProjectsDialog
          paletteId={selectedPaletteId}
          open={addToProjectsOpen}
          onOpenChange={(open) => {
            setAddToProjectsOpen(open);
            if (!open) setSelectedPaletteId(null);
          }}
        />
      )}
    </PaletteActionsProvider>
  );
}
