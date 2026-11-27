"use client";

import { useEffect, useState } from "react";
import { Palette as PaletteIcon } from "lucide-react";

import { EmptyState } from "@/components/EmptyState";

import {
  useNormalSavedPalettes,
  useSavedPalettes,
} from "@/hooks/queries/usePaletteSaves";
import { useFavoritePalettes } from "@/hooks/queries/usePaletteFavorites";
import { usePaletteActions } from "@/hooks/usePaletteActions";

import { PaletteGrid } from "@/components/Palettes/PaletteGrid";
import { PalettePagination } from "@/components/Palettes/PalettePagination";
import AddToProjectsDialog from "@/components/Projects/AddToProjectsDialog";
import PaletteSkeleton from "../Palettes/PaletteSkeleton";

const PAGE_SIZE = 30;

export function AccountSavedPalettes() {
  const [page, setPage] = useState(1);

  const { data: normalSavedPaletteIds = [], isPending: isSavedIdsPending } =
    useNormalSavedPalettes();

  const { data: favoritePaletteIds = [] } = useFavoritePalettes();

  const { data, isPending, isError, error } = useSavedPalettes(page, PAGE_SIZE);

  const savedPalettes = data?.palettes ?? [];
  const totalCount = data?.totalCount ?? 0;
  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  const {
    handleToggleNormalSave,
    handleToggleFavorite,
    handleAddToProjects,
    handleDownloadPalette,
    savingPaletteId,
    favoritingPaletteId,
  } = usePaletteActions(normalSavedPaletteIds, favoritePaletteIds);

  const [selectedPaletteId, setSelectedPaletteId] = useState<number | null>(
    null,
  );
  const [addToProjectsOpen, setAddToProjectsOpen] = useState(false);

  useEffect(() => {
    if (!data) return;

    if (page > Math.max(1, totalPages)) {
      setPage(Math.max(1, totalPages));
    }
  }, [data, page, totalPages]);

  const openAddToProjects = async (paletteId: number) => {
    const authenticated = await handleAddToProjects(paletteId);

    if (!authenticated) return;

    setSelectedPaletteId(paletteId);
    setAddToProjectsOpen(true);
  };

  if (isPending || isSavedIdsPending) {
    return (
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 12 }).map((_, index) => (
          <PaletteSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (isError && !data) {
    return (
      <p className="text-sm text-destructive">
        Failed to load saved palettes: {error.message}
      </p>
    );
  }

  if (savedPalettes.length === 0) {
    return (
      <EmptyState
        icon={PaletteIcon}
        title="No saved palettes yet"
        description="Palettes you save will appear here."
      />
    );
  }

  return (
    <>
      <PaletteGrid
        palettes={savedPalettes}
        favoritePaletteIds={favoritePaletteIds}
        normalSavedPaletteIds={normalSavedPaletteIds}
        savingPaletteId={savingPaletteId}
        favoritingPaletteId={favoritingPaletteId}
        onToggleFavorite={handleToggleFavorite}
        onToggleSave={handleToggleNormalSave}
        onDownload={handleDownloadPalette}
        onAddToProjects={openAddToProjects}
        hideExploreSimilar
      />

      <PalettePagination
        page={page}
        totalPages={totalPages}
        pageSize={PAGE_SIZE}
        totalCount={totalCount}
        onPageChange={(nextPage) => {
          setPage(nextPage);

          document.getElementById("account-content")?.scrollTo({
            top: 0,
            behavior: "smooth",
          });
        }}
      />

      {selectedPaletteId !== null && (
        <AddToProjectsDialog
          paletteId={selectedPaletteId}
          open={addToProjectsOpen}
          onOpenChange={(open) => {
            setAddToProjectsOpen(open);

            if (!open) {
              setSelectedPaletteId(null);
            }
          }}
        />
      )}
    </>
  );
}
