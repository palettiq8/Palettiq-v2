"use client";

import { useState } from "react";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Skeleton } from "@/components/ui/skeleton";
import { Palette as PaletteIcon } from "lucide-react";
import { toast } from "sonner";

import { usePalettes } from "@/hooks/queries/usePalettes";
import { useNormalSavedPalettes } from "@/hooks/queries/usePaletteSaves";
import { useFavoritePalettes } from "@/hooks/queries/usePaletteFavorites";
import { usePaletteExploreUrl } from "@/hooks/usePaletteExploreUrl";
import { usePaletteActions } from "@/hooks/usePaletteActions";

import AddToProjectsDialog from "@/components/Projects/AddToProjectsDialog";
import { PaletteGrid } from "@/components/Palettes/PaletteGrid";
import { PalettePagination } from "@/components/Palettes/PalettePagination";

const PAGE_SIZE = 30;

export default function PalettesExplorer() {
  const { page, debouncedSearch, appliedFilters, sortBy, handlePageChange } =
    usePaletteExploreUrl();

  const { data, isPending, isError, error } = usePalettes({
    filters: appliedFilters,
    sortBy,
    search: debouncedSearch,
    page,
    pageSize: PAGE_SIZE,
  });

  const palettes = data?.palettes ?? [];
  const totalCount = data?.totalCount ?? 0;
  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  const { data: normalSavedPaletteIds = [] } = useNormalSavedPalettes();
  const { data: favoritePaletteIds = [] } = useFavoritePalettes();

  const {
    handleToggleNormalSave,
    handleToggleFavorite,
    handleAddToProjects,
    handleDownloadPalette,
    handleCopyPalette,
    savingPaletteId,
    favoritingPaletteId,
  } = usePaletteActions(normalSavedPaletteIds, favoritePaletteIds);

  const [addToProjectsOpen, setAddToProjectsOpen] = useState(false);
  const [selectedPaletteId, setSelectedPaletteId] = useState<number | null>(
    null,
  );

  const openAddToProjects = async (paletteId: number) => {
    const authenticated = await handleAddToProjects(paletteId);
    if (!authenticated) return;

    setSelectedPaletteId(paletteId);
    setAddToProjectsOpen(true);
  };

  if (isPending) {
    return (
      <div className="grid w-full grid-cols-1 gap-3 p-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 9 }).map((_, index) => (
          <Skeleton key={index} className="h-50 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (isError && !data) {
    return (
      <div className="w-full p-6">
        <p className="text-destructive">
          Failed to load palettes: {error.message}
        </p>
      </div>
    );
  }

  if (palettes.length === 0) {
    return (
      <div className="grid w-full place-content-center p-6">
        <Empty className="border border-dashed">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <PaletteIcon />
            </EmptyMedia>
            <EmptyTitle>No palettes found</EmptyTitle>
            <EmptyDescription>
              Adjust your search or filters to find palettes that match your
              taste.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      </div>
    );
  }

  return (
    <div className="w-full p-6">
      <PaletteGrid
        palettes={palettes}
        favoritePaletteIds={favoritePaletteIds}
        normalSavedPaletteIds={normalSavedPaletteIds}
        savingPaletteId={savingPaletteId}
        favoritingPaletteId={favoritingPaletteId}
        onToggleFavorite={handleToggleFavorite}
        onToggleSave={handleToggleNormalSave}
        onDownload={handleDownloadPalette}
        onCopy={handleCopyPalette}
        onAddToProjects={openAddToProjects}
      />

      <PalettePagination
        page={page}
        totalPages={totalPages}
        pageSize={PAGE_SIZE}
        totalCount={totalCount}
        onPageChange={(nextPage) => handlePageChange(nextPage, totalPages)}
      />

      {selectedPaletteId !== null && (
        <AddToProjectsDialog
          paletteId={selectedPaletteId}
          open={addToProjectsOpen}
          onOpenChange={(open) => {
            setAddToProjectsOpen(open);
            if (!open) setSelectedPaletteId(null);
          }}
          onSaved={() => toast.success("Palette added to your projects.")}
        />
      )}
    </div>
  );
}
