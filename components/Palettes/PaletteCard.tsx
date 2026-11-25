"use client";

import { toast } from "sonner";
import { Copy } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatRelativeTime, getContrastTextColor } from "@/lib/utils";
import type { Palette } from "@/lib/types";
import { PaletteCardActions } from "./PaletteCardActions";
import Link from "next/link";

interface PaletteCardProps {
  palette: Palette;
  isFavorite: boolean;
  isSaved: boolean;
  isSaving: boolean;
  isFavoriting: boolean;
  onToggleFavorite: (paletteId: number) => void;
  onToggleSave: (paletteId: number) => void;
  onDownload: (palette: Palette, format: "png" | "svg") => void;
  onAddToProjects: (paletteId: number) => void;
}

export function PaletteCard({
  palette,
  isFavorite,
  isSaved,
  isSaving,
  isFavoriting,
  onToggleFavorite,
  onToggleSave,
  onDownload,
  onAddToProjects,
}: PaletteCardProps) {
  async function handleCopyColor(hex: string) {
    try {
      await navigator.clipboard.writeText(hex.toUpperCase());
      toast.success(`${hex.toUpperCase()} copied`);
    } catch {
      toast.error("Failed to copy color");
    }
  }

  return (
    <article className="overflow-hidden rounded-xl border bg-card">
      <div className="flex h-40">
        {palette.colors.map((color) => (
          <button
            key={color.id}
            type="button"
            disabled={!color.hex}
            onClick={() => color.hex && handleCopyColor(color.hex)}
            className="group relative h-full min-w-0 flex-1 disabled:cursor-default focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
            style={{ backgroundColor: color.hex ?? "transparent" }}
            title={
              color.hex ? `Copy ${color.hex.toUpperCase()}` : "Unknown color"
            }
            aria-label={
              color.hex
                ? `Copy color ${color.hex.toUpperCase()}`
                : "Unknown color"
            }
          >
            {color.hex && (
              <span className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100">
                <Copy
                  className="size-4 drop-shadow-sm"
                  style={{ color: getContrastTextColor(color.hex) }}
                />
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="p-4">
        <div className="flex w-full items-center justify-between">
          <Link
            href={`/palettes/${palette.id}-${palette.identity?.slug}`}
            className="font-semibold"
          >
            {palette.identity?.name}
          </Link>

          <PaletteCardActions
            palette={palette}
            isFavorite={isFavorite}
            isSaved={isSaved}
            isSaving={isSaving}
            isFavoriting={isFavoriting}
            onToggleFavorite={onToggleFavorite}
            onToggleSave={onToggleSave}
            onDownload={onDownload}
            onAddToProjects={onAddToProjects}
          />
        </div>

        <p className="mt-1 text-sm text-muted-foreground">
          {palette.identity?.short_description}
        </p>

        <div className="mt-3 flex w-full items-center justify-between">
          <span className="truncate text-xs text-muted-foreground">
            {formatRelativeTime(palette.created_at)}
          </span>
          <Badge variant="secondary">{palette.creation_method}</Badge>
        </div>
      </div>
    </article>
  );
}
