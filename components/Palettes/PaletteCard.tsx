import { Badge } from "@/components/ui/badge";
import { formatRelativeTime } from "@/lib/utils";
import type { Palette } from "@/lib/types";
import { PaletteCardActions } from "./PaletteCardActions";

interface PaletteCardProps {
  palette: Palette;
  isFavorite: boolean;
  isSaved: boolean;
  isSaving: boolean;
  isFavoriting: boolean;
  onToggleFavorite: (paletteId: number) => void;
  onToggleSave: (paletteId: number) => void;
  onDownload: (palette: Palette, format: "png" | "svg") => void;
  onCopy: (palette: Palette) => void;
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
  onCopy,
  onAddToProjects,
}: PaletteCardProps) {
  return (
    <article className="overflow-hidden rounded-xl border bg-card">
      <div className="flex h-40">
        {palette.colors.map((color) => (
          <div
            key={color.id}
            className="h-full flex-1"
            style={{ backgroundColor: color.hex ?? "transparent" }}
            title={color.hex ?? "Unknown color"}
          />
        ))}
      </div>

      <div className="p-4">
        <div className="flex w-full items-center justify-between">
          <h3 className="font-semibold">{palette.identity?.name}</h3>

          <PaletteCardActions
            palette={palette}
            isFavorite={isFavorite}
            isSaved={isSaved}
            isSaving={isSaving}
            isFavoriting={isFavoriting}
            onToggleFavorite={onToggleFavorite}
            onToggleSave={onToggleSave}
            onDownload={onDownload}
            onCopy={onCopy}
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
