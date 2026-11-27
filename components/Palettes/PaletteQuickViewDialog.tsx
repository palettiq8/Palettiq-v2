"use client";

import { useMemo } from "react";
import Link from "next/link";
import {
  Bookmark,
  Check,
  Copy,
  DownloadIcon,
  FileCode,
  FileImage,
  Star,
} from "lucide-react";
import { toast } from "sonner";
import { capitalizeFirst, getContrastTextColor } from "@/lib/utils";

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

  async function handleCopyColor(hex: string) {
    try {
      await navigator.clipboard.writeText(hex.toUpperCase());
      toast.success(`${hex.toUpperCase()} copied`);
    } catch {
      toast.error("Failed to copy color");
    }
  }

  if (!open || !palette) return null;

  const isSaved = normalSavedPaletteIds.includes(paletteId);
  const isFavorite = favoritePaletteIds.includes(paletteId);

  const colors = [...palette.colors].sort(
    (a, b) => (a.position ?? 0) - (b.position ?? 0),
  );

  const bestForItems =
    palette.identity?.best_for
      ?.split(/[,;\n]/)
      .map((item) => capitalizeFirst(item.trim()))
      .filter(Boolean) ?? [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex h-[90vh] max-h-225 flex-col gap-0 overflow-hidden p-0 sm:max-w-2xl">
        {/* Palette Preview */}
        <div className="flex h-34 w-full shrink-0 overflow-hidden sm:h-40">
          {colors.map((color) => (
            <button
              key={color.id}
              type="button"
              disabled={!color.hex}
              onClick={() => color.hex && handleCopyColor(color.hex)}
              className="group relative min-w-0 flex-1 disabled:cursor-default focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
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
            <section className="space-y-3">
              <div className="flex items-baseline justify-between gap-2">
                <h3 className="text-base font-semibold tracking-tight">
                  Colors
                </h3>

                <span className="text-xs text-muted-foreground">
                  {colors.length} colors
                </span>
              </div>

              <ul className="divide-y divide-border/70 overflow-hidden rounded-xl border border-border/70">
                {colors.map((color) => (
                  <li
                    key={color.id}
                    className="flex items-center gap-3 px-4 py-3"
                  >
                    <span
                      className="size-9 shrink-0 rounded-md ring-1 ring-inset ring-black/10"
                      style={{
                        backgroundColor: color.hex ?? "transparent",
                      }}
                    />

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">
                        {color.name || "Unnamed color"}
                      </p>

                      {color.role && (
                        <p className="truncate text-xs capitalize text-muted-foreground">
                          {color.role}
                        </p>
                      )}
                    </div>

                    <span className="shrink-0 font-mono text-xs tabular-nums text-muted-foreground">
                      {color.hex ?? "—"}
                    </span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Best For */}
            {bestForItems.length > 0 && (
              <section className="space-y-3">
                <h3 className="text-base font-semibold tracking-tight">
                  Best for
                </h3>

                <ul className="grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2">
                  {bestForItems.map((item, index) => (
                    <li
                      key={`${item}-${index}`}
                      className="flex items-start gap-2.5 text-sm leading-relaxed"
                    >
                      <Check className="mt-0.5 size-4 shrink-0 text-foreground/50" />

                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Inspiration Sources */}
            {palette.inspiration_sources && (
              <section className="space-y-3">
                <h3 className="text-base font-semibold tracking-tight">
                  Inspiration sources
                </h3>

                <p className="border-l-2 border-border pl-4 text-sm leading-7 text-muted-foreground">
                  {palette.inspiration_sources}
                </p>
              </section>
            )}

            {/* View Details */}
            <Button
              className="w-full"
              size="lg"
              nativeButton={false}
              render={
                <Link
                  href={`/palettes/${palette.id}-${palette.identity?.slug}`}
                />
              }
            >
              View more details
            </Button>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
