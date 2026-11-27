"use client";

import Link from "next/link";
import { useState } from "react";
import { Palette as PaletteIcon } from "lucide-react";

import { useNormalSavedPalettes } from "@/hooks/queries/usePaletteSaves";
import { useFavoritePalettes } from "@/hooks/queries/usePaletteFavorites";
import { useRecentNormalSavedPalettes } from "@/hooks/queries/usePaletteSaves";
import { useRecentFavoritePalettes } from "@/hooks/queries/usePaletteFavorites";
import { usePaletteActions } from "@/hooks/usePaletteActions";
import { PaletteGrid } from "@/components/Palettes/PaletteGrid";
import AddToProjectsDialog from "@/components/Projects/AddToProjectsDialog";
import PaletteSkeleton from "../Palettes/PaletteSkeleton";
import { useParams } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { Button } from "../ui/button";

export function AccountRecentPalettes() {
  const { data: normalSavedPaletteIds = [] } = useNormalSavedPalettes();
  const { data: favoritePaletteIds = [] } = useFavoritePalettes();

  const {
    data: recentSaves = [],
    isPending: isSavesPending,
    isError: isSavesError,
  } = useRecentNormalSavedPalettes();

  const {
    data: recentFavorites = [],
    isPending: isFavoritesPending,
    isError: isFavoritesError,
  } = useRecentFavoritePalettes();

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

  const { userId } = useParams<{ userId: string }>();

  const openAddToProjects = async (paletteId: number) => {
    const authenticated = await handleAddToProjects(paletteId);

    if (!authenticated) return;

    setSelectedPaletteId(paletteId);
    setAddToProjectsOpen(true);
  };

  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <section className="min-w-0 space-y-3 rounded-xl border bg-card p-4 h-max">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold tracking-tight">Recent Saves</h2>

            <Link
              href={`/a/${userId}/saved`}
              aria-label="View all saved palettes"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              <Button variant={"outline"} size={"icon"}>
                <ChevronRight />
              </Button>
            </Link>
          </div>

          {isSavesPending ? (
            <div className="space-y-2">
              {Array.from({ length: 2 }).map((_, index) => (
                <PaletteSkeleton key={index} />
              ))}
            </div>
          ) : isSavesError ? (
            <p className="text-sm text-destructive">
              Failed to load recent saves.
            </p>
          ) : recentSaves.length === 0 ? (
            <div className="flex min-h-40 flex-col items-center justify-center gap-2 text-center">
              <PaletteIcon className="size-8 text-muted-foreground" />
              <p className="text-sm font-medium">No saved palettes yet</p>
              <p className="text-xs text-muted-foreground">
                Palettes you save recently will appear here.
              </p>
            </div>
          ) : (
            <PaletteGrid
              palettes={recentSaves}
              favoritePaletteIds={favoritePaletteIds}
              normalSavedPaletteIds={normalSavedPaletteIds}
              savingPaletteId={savingPaletteId}
              favoritingPaletteId={favoritingPaletteId}
              onToggleFavorite={handleToggleFavorite}
              onToggleSave={handleToggleNormalSave}
              onDownload={handleDownloadPalette}
              onAddToProjects={openAddToProjects}
              className="grid grid-cols-1 gap-2"
              hideExploreSimilar
            />
          )}
        </section>

        <section className="min-w-0 space-y-3 rounded-xl border bg-card p-4 h-max">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold tracking-tight">Recent Favorites</h2>

            <Link
              href={`/a/${userId}/favorites`}
              aria-label="View all favorite palettes"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              <Button variant={"outline"} size={"icon"}>
                <ChevronRight />
              </Button>
            </Link>
          </div>

          {isFavoritesPending ? (
            <div className="space-y-2">
              {Array.from({ length: 2 }).map((_, index) => (
                <PaletteSkeleton key={index} />
              ))}
            </div>
          ) : isFavoritesError ? (
            <p className="text-sm text-destructive">
              Failed to load recent favorites.
            </p>
          ) : recentFavorites.length === 0 ? (
            <div className="flex min-h-40 flex-col items-center justify-center gap-2 text-center">
              <PaletteIcon className="size-8 text-muted-foreground" />
              <p className="text-sm font-medium">No favorite palettes yet</p>
              <p className="text-xs text-muted-foreground">
                Palettes you favorite recently will appear here.
              </p>
            </div>
          ) : (
            <PaletteGrid
              palettes={recentFavorites}
              favoritePaletteIds={favoritePaletteIds}
              normalSavedPaletteIds={normalSavedPaletteIds}
              savingPaletteId={savingPaletteId}
              favoritingPaletteId={favoritingPaletteId}
              onToggleFavorite={handleToggleFavorite}
              onToggleSave={handleToggleNormalSave}
              onDownload={handleDownloadPalette}
              onAddToProjects={openAddToProjects}
              className="grid grid-cols-1 gap-2"
              hideExploreSimilar
            />
          )}
        </section>
      </div>

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
