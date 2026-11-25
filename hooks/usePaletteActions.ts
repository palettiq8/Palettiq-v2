"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useToggleNormalPaletteSave } from "@/hooks/queries/usePaletteSaves";
import { useSetPaletteFavorite } from "@/hooks/queries/usePaletteFavorites";
import { createClient } from "@/lib/supabase/client";
import { useAuthDialogStore } from "@/store/useAuthDialogStore";
import {
  downloadPaletteAsPng,
  downloadPaletteAsSvg,
} from "@/lib/utils/download-palette";
import type { DownloadablePalette } from "@/lib/types";
import { useQueryClient } from "@tanstack/react-query";

export function usePaletteActions(
  normalSavedPaletteIds: number[],
  favoritePaletteIds: number[],
) {
  const queryClient = useQueryClient();
  const toggleNormalSaveMutation = useToggleNormalPaletteSave();
  const favoriteMutation = useSetPaletteFavorite();
  const openAuthDialog = useAuthDialogStore((state) => state.openAuthDialog);

  const [savingPaletteId, setSavingPaletteId] = useState<number | null>(null);
  const [favoritingPaletteId, setFavoritingPaletteId] = useState<number | null>(
    null,
  );

  const checkAuthentication = async () => {
    const supabase = createClient();
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (error) {
      toast.error(error.message);
      return false;
    }

    if (!session) {
      openAuthDialog();
      return false;
    }

    return true;
  };

  const handleToggleNormalSave = async (paletteId: number) => {
    if (!(await checkAuthentication())) return;

    const isSaved = normalSavedPaletteIds.includes(paletteId);
    setSavingPaletteId(paletteId);

    toggleNormalSaveMutation.mutate(
      { paletteId, isSaved: !isSaved },
      {
        onSuccess: () => {
          toast.success(
            isSaved
              ? "Palette removed from saved."
              : "Palette saved successfully.",
          );
        },
        onError: (error) => {
          toast.error(error.message || "Failed to update saved palette.");
        },
        onSettled: () => setSavingPaletteId(null),
      },
    );
  };

  const handleToggleFavorite = async (paletteId: number) => {
    if (!(await checkAuthentication())) return;

    const isFavorite = favoritePaletteIds.includes(paletteId);
    setFavoritingPaletteId(paletteId);

    favoriteMutation.mutate(
      { paletteId, isFavorite: !isFavorite },
      {
        onSuccess: () => {
          toast.success(
            isFavorite ? "Removed from favorites." : "Added to favorites.",
          );
        },
        onError: (error) => {
          toast.error(error.message || "Failed to update favorites.");
        },
        onSettled: () => setFavoritingPaletteId(null),
      },
    );
  };

  const handleAddToProjects = async (paletteId: number) => {
    if (!(await checkAuthentication())) return false;
    return true;
  };

  const handleDownloadPalette = async (
    palette: DownloadablePalette,
    format: "png" | "svg",
  ) => {
    try {
      if (format === "png") {
        await downloadPaletteAsPng(palette);
      } else {
        downloadPaletteAsSvg(palette);
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to download palette.",
      );
      return;
    }

    const supabase = createClient();
    const { error } = await supabase.rpc("increment_palette_downloads", {
      p_palette_id: palette.id,
    });

    if (error) {
      console.error("Failed to update palette download count:", error);
      toast.success(`Palette downloaded as ${format.toUpperCase()}.`);
      toast.error("Download count could not be updated.");
      return;
    }

    await queryClient.invalidateQueries({
      queryKey: ["palettes"],
    });

    toast.success(`Palette downloaded as ${format.toUpperCase()}.`);
  };

  return {
    handleToggleNormalSave,
    handleToggleFavorite,
    handleAddToProjects,
    handleDownloadPalette,
    savingPaletteId,
    favoritingPaletteId,
  };
}
