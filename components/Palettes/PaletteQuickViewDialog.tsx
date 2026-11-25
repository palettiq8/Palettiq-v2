"use client";

import { useMemo } from "react";
import {
  Bookmark,
  DownloadIcon,
  FileCode,
  FileImage,
  Star,
} from "lucide-react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { usePaletteActionsContext } from "./PaletteActionsContext";
import { useNormalSavedPalettes } from "@/hooks/queries/usePaletteSaves";
import { useFavoritePalettes } from "@/hooks/queries/usePaletteFavorites";
import { usePaletteActions } from "@/hooks/usePaletteActions";
import { ScrollArea } from "@/components/ui/scroll-area";

interface PaletteQuickViewDialogProps {
  paletteId: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PaletteQuickViewDialog({
  paletteId,
  open,
  onOpenChange,
}: PaletteQuickViewDialogProps) {
  const { palettes } = usePaletteActionsContext();

  const palette = useMemo(
    () => palettes.find((item) => item.id === paletteId) ?? null,
    [palettes, paletteId],
  );

  const { data: normalSavedPaletteIds = [] } = useNormalSavedPalettes();
  const { data: favoritePaletteIds = [] } = useFavoritePalettes();

  const {
    handleToggleNormalSave,
    handleToggleFavorite,
    handleDownloadPalette,
    savingPaletteId,
    favoritingPaletteId,
  } = usePaletteActions(normalSavedPaletteIds, favoritePaletteIds);

  if (!open || !palette) return null;

  const isSaved = normalSavedPaletteIds.includes(paletteId);
  const isFavorite = favoritePaletteIds.includes(paletteId);

  const colors = [...palette.colors].sort(
    (a, b) => (a.position ?? 0) - (b.position ?? 0),
  );

  const bestForItems =
    palette.identity?.best_for
      ?.split(/[,;\n]/)
      .map((item) => item.trim())
      .filter(Boolean) ?? [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex h-[90vh] max-h-225 flex-col gap-0 overflow-hidden p-0 sm:max-w-2xl">
        {/* Palette Preview */}
        <div className="flex h-56 w-full shrink-0 overflow-hidden sm:h-64">
          {colors.map((color) => (
            <div
              key={color.id}
              className="min-w-0 flex-1"
              style={{ backgroundColor: color.hex ?? "transparent" }}
              title={color.hex ?? undefined}
            />
          ))}
        </div>

        {/* Scrollable Content */}
        <ScrollArea className="min-h-0 flex-1">
          <div className="space-y-8 p-5 sm:p-6">
            {/* Palette Header */}
            <section className="space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1 space-y-2">
                  <DialogHeader className="text-left">
                    <DialogTitle className="text-2xl font-bold tracking-tight sm:text-3xl">
                      {palette.identity?.name ?? "Untitled palette"}
                    </DialogTitle>

                    {palette.identity?.short_description && (
                      <DialogDescription className="text-sm leading-relaxed sm:text-base">
                        {palette.identity.short_description}
                      </DialogDescription>
                    )}
                  </DialogHeader>
                </div>

                {/* Palette Actions */}
                <div className="flex shrink-0 items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    aria-label={
                      isFavorite ? "Remove from favorites" : "Add to favorites"
                    }
                    aria-pressed={isFavorite}
                    disabled={favoritingPaletteId === paletteId}
                    onClick={() => void handleToggleFavorite(paletteId)}
                  >
                    <Star
                      className={
                        isFavorite
                          ? "fill-yellow-500 text-yellow-500"
                          : "text-foreground"
                      }
                    />
                  </Button>

                  <Button
                    variant="outline"
                    size="icon"
                    aria-label={isSaved ? "Unsave palette" : "Save palette"}
                    aria-pressed={isSaved}
                    disabled={savingPaletteId === paletteId}
                    onClick={() => void handleToggleNormalSave(paletteId)}
                  >
                    <Bookmark
                      className={
                        isSaved
                          ? "fill-current text-foreground"
                          : "text-foreground"
                      }
                    />
                  </Button>

                  <DropdownMenu>
                    <DropdownMenuTrigger
                      render={
                        <Button
                          variant="outline"
                          size="icon"
                          aria-label="Download palette"
                        >
                          <DownloadIcon />
                        </Button>
                      }
                    />
                    <DropdownMenuContent align="end">
                      <DropdownMenuGroup>
                        <DropdownMenuItem
                          onClick={() => handleDownloadPalette(palette, "png")}
                        >
                          <FileImage />
                          Download as PNG
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDownloadPalette(palette, "svg")}
                        >
                          <FileCode />
                          Download as SVG
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </section>

            {/* Long Description */}
            {palette.identity?.long_description && (
              <section className="space-y-3">
                <div className="space-y-1">
                  <h3 className="text-base font-semibold tracking-tight">
                    About this palette
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Long description
                  </p>
                </div>

                <p className="text-sm leading-7 text-muted-foreground">
                  {palette.identity.long_description}
                </p>
              </section>
            )}

            {/* Colors */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h3 className="text-base font-semibold tracking-tight">
                    Color breakdown
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Explore every color in this palette
                  </p>
                </div>

                <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                  {colors.length} colors
                </span>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {colors.map((color) => (
                  <div
                    key={color.id}
                    className="group overflow-hidden rounded-xl border bg-card transition-colors hover:bg-muted/30"
                  >
                    <div
                      className="h-24 w-full"
                      style={{
                        backgroundColor: color.hex ?? "transparent",
                      }}
                    />

                    <div className="space-y-2 p-3">
                      <div className="flex items-center justify-between gap-2">
                        <p className="truncate text-sm font-semibold">
                          {color.name || "Unnamed color"}
                        </p>

                        {color.role && (
                          <span className="shrink-0 rounded-md bg-muted px-2 py-1 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                            {color.role}
                          </span>
                        )}
                      </div>

                      <p className="font-mono text-xs tracking-wide text-muted-foreground">
                        {color.hex ?? "No HEX value"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Best For */}
            {bestForItems.length > 0 && (
              <section className="space-y-4">
                <div className="space-y-1">
                  <h3 className="text-base font-semibold tracking-tight">
                    Best for
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Ideal applications for this color palette
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {bestForItems.map((item, index) => (
                    <div
                      key={`${item}-${index}`}
                      className="flex items-center gap-3 rounded-xl border bg-card p-3 transition-colors hover:bg-muted/40"
                    >
                      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <span className="text-sm font-semibold">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                      </div>

                      <p className="text-sm font-medium leading-relaxed">
                        {item}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Inspiration Sources */}
            {palette.inspiration_sources && (
              <section className="space-y-3">
                <div className="space-y-1">
                  <h3 className="text-base font-semibold tracking-tight">
                    Inspiration sources
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    The inspiration behind this palette
                  </p>
                </div>

                <div className="rounded-xl border bg-muted/30 p-4">
                  <p className="text-sm leading-7 text-muted-foreground">
                    {palette.inspiration_sources}
                  </p>
                </div>
              </section>
            )}

            {/* View Details */}
            <div className="pb-2">
              <Button
                className="w-full"
                size="lg"
                onClick={() =>
                  toast.info("Palette details page is coming soon.")
                }
              >
                View more details
              </Button>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
