"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";

import type { Palette } from "@/lib/types";

import { Button } from "@/components/ui/button";
import { PaletteGrid } from "@/components/Palettes/PaletteGrid";
import AddToProjectsDialog from "@/components/Projects/AddToProjectsDialog";

import { useNormalSavedPalettes } from "@/hooks/queries/usePaletteSaves";
import { useFavoritePalettes } from "@/hooks/queries/usePaletteFavorites";
import { usePaletteActions } from "@/hooks/usePaletteActions";
import { ArrowRight } from "lucide-react";

interface SimilarPalettesProps {
  palettes: Palette[];
}

export function SimilarPalettes({ palettes }: SimilarPalettesProps) {
  const [addToProjectsOpen, setAddToProjectsOpen] = useState(false);
  const [selectedPaletteId, setSelectedPaletteId] = useState<number | null>(
    null,
  );

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

  if (palettes.length === 0) return null;

  const openAddToProjects = async (paletteId: number) => {
    const authenticated = await handleAddToProjects(paletteId);

    if (!authenticated) return;

    setSelectedPaletteId(paletteId);
    setAddToProjectsOpen(true);
  };

  return (
    <section className="space-y-6">
      {/* Section Heading */}
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-semibold tracking-tight">
          Similar palettes
        </h2>

        <p className="text-sm text-muted-foreground">
          Discover more palettes with similar colors, moods, and styles.
        </p>
      </div>

      <PaletteGrid
        palettes={palettes.slice(0, 15)}
        favoritePaletteIds={favoritePaletteIds}
        normalSavedPaletteIds={normalSavedPaletteIds}
        savingPaletteId={savingPaletteId}
        favoritingPaletteId={favoritingPaletteId}
        onToggleFavorite={handleToggleFavorite}
        onToggleSave={handleToggleNormalSave}
        onDownload={handleDownloadPalette}
        onAddToProjects={openAddToProjects}
      />

      <div className="flex justify-center pt-2">
        <Button
          variant="outline"
          nativeButton={false}
          render={<Link href="/" />}
        >
          Explore more
          <ArrowRight />
        </Button>
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
          onSaved={() => toast.success("Palette added to your projects.")}
        />
      )}
    </section>
  );
}
