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
      <div className="grid min-h-[calc(100vh-4rem)] w-full content-start grid-cols-1 gap-2 px-6 pb-6 pt-0 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 12 }).map((_, index) => (
          <div
            key={index}
            className="w-full overflow-hidden rounded-xl border bg-card"
          >
            <Skeleton className="h-40 w-full rounded-none" />
            <div className="w-full p-4">
              <div className="flex w-full items-center justify-between">
                <Skeleton className="h-5 w-1/3 rounded-full" />
                <div className="flex items-center gap-2">
                  <Skeleton className="size-8 rounded-full" />
                  <Skeleton className="size-8 rounded-full" />
                  <Skeleton className="size-8 rounded-full" />
                </div>
              </div>
              <Skeleton className="mt-2 h-4 w-full rounded-full" />
              <Skeleton className="mt-1 h-4 w-3/4 rounded-full" />
              <div className="mt-3 flex w-full items-center justify-between">
                <Skeleton className="h-5 w-1/4 rounded-full" />
                <Skeleton className="h-5 w-1/4 rounded-full" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (isError && !data) {
    return (
      <div className="w-full px-6 pb-6 pt-0">
        <p className="text-destructive">
          Failed to load palettes: {error.message}
        </p>
      </div>
    );
  }

  if (palettes.length === 0) {
    return (
      <div className="grid w-full place-content-center px-6 pb-6 pt-0">
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
    <div className="w-full px-6 pb-6 pt-0">
      <PaletteGrid
        palettes={palettes}
        favoritePaletteIds={favoritePaletteIds}
        normalSavedPaletteIds={normalSavedPaletteIds}
        savingPaletteId={savingPaletteId}
        favoritingPaletteId={favoritingPaletteId}
        onToggleFavorite={handleToggleFavorite}
        onToggleSave={handleToggleNormalSave}
        onDownload={handleDownloadPalette}
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
