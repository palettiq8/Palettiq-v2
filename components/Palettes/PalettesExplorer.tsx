"use client";

import { useEffect, useState } from "react";
import { EmptyState } from "@/components/EmptyState";
import { ArrowLeft, Palette as PaletteIcon } from "lucide-react";
import { usePalettes } from "@/hooks/queries/usePalettes";
import { useNormalSavedPalettes } from "@/hooks/queries/usePaletteSaves";
import { useFavoritePalettes } from "@/hooks/queries/usePaletteFavorites";
import { usePaletteExploreUrl } from "@/hooks/usePaletteExploreUrl";
import { usePaletteActions } from "@/hooks/usePaletteActions";
import { useSimilarPalettes } from "@/hooks/queries/useSimilarPalettes";
import { usePalettesExploreStore } from "@/store/usePalettesExploreStore";
import { Button } from "@/components/ui/button";
import AddToProjectsDialog from "@/components/Projects/AddToProjectsDialog";
import { PaletteGrid } from "@/components/Palettes/PaletteGrid";
import { PalettePagination } from "@/components/Palettes/PalettePagination";
import PaletteSkeleton from "./PaletteSkeleton";

const PAGE_SIZE = 30;

export default function PalettesExplorer() {
  const { page, debouncedSearch, appliedFilters, sortBy, handlePageChange } =
    usePaletteExploreUrl();

  const { data, isPending, isError } = usePalettes({
    filters: appliedFilters,
    sortBy,
    search: debouncedSearch,
    page,
    pageSize: PAGE_SIZE,
  });

  const palettes = data?.palettes ?? [];
  const totalCount = data?.totalCount ?? 0;
  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  const similarPalette = usePalettesExploreStore(
    (state) => state.similarPalette,
  );
  const setSimilarPalette = usePalettesExploreStore(
    (state) => state.setSimilarPalette,
  );

  const similarPaletteId = similarPalette?.id ?? null;

  useEffect(() => {
    if (similarPaletteId !== null) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [similarPaletteId]);

  const {
    data: similarPalettes = [],
    isPending: isSimilarPending,
    isError: isSimilarError,
  } = useSimilarPalettes(similarPaletteId);

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

  if (similarPalette !== null) {
    return (
      <div className="w-full p-4 pt-0">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div className="min-w-0 flex items-center gap-3">
            <h2 className="text-base font-medium tracking-tight">
              Similar palettes
            </h2>

            {similarPalette && (
              <div className="mt-1 flex h-6 w-32 overflow-hidden rounded-full border border-border/60">
                {[...similarPalette.colors]
                  .sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
                  .map((color) => (
                    <span
                      key={color.id}
                      className="flex-1"
                      style={{ backgroundColor: color.hex ?? "transparent" }}
                    />
                  ))}
              </div>
            )}
          </div>

          <Button
            variant="outline"
            className="shrink-0"
            onClick={() => setSimilarPalette(null)}
          >
            <ArrowLeft />
            Back to explore
          </Button>
        </div>

        {isSimilarPending ? (
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <PaletteSkeleton key={index} />
            ))}
          </div>
        ) : isSimilarError ? (
          <p className="text-destructive">Failed to load similar palettes.</p>
        ) : similarPalettes.length === 0 ? (
          <EmptyState
            icon={PaletteIcon}
            title="No similar palettes found"
            description="Try exploring palettes with different filters."
          />
        ) : (
          <PaletteGrid
            palettes={similarPalettes}
            favoritePaletteIds={favoritePaletteIds}
            normalSavedPaletteIds={normalSavedPaletteIds}
            savingPaletteId={savingPaletteId}
            favoritingPaletteId={favoritingPaletteId}
            onToggleFavorite={handleToggleFavorite}
            onToggleSave={handleToggleNormalSave}
            onDownload={handleDownloadPalette}
            onAddToProjects={openAddToProjects}
          />
        )}

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
      </div>
    );
  }

  if (isPending) {
    return (
      <div className="grid min-h-[calc(100dvh_-_3.5rem)] w-full content-start grid-cols-1 gap-2 p-4 pt-0 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 12 }).map((_, index) => (
          <PaletteSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (isError && !data) {
    return (
      <div className="w-full p-4 pt-0">
        <p className="text-destructive">
          Failed to load palettes:
        </p>
      </div>
    );
  }

  if (palettes.length === 0) {
    return (
      <div className="w-full p-4 pt-0">
        <EmptyState
          icon={PaletteIcon}
          title="No palettes found"
          description="Adjust your search or filters to find palettes that match your taste."
        />
      </div>
    );
  }

  return (
    <div className="w-full p-4 pt-0">
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
        />
      )}
    </div>
  );
}
