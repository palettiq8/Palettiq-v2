"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Copy, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  formatRelativeTime,
  getContrastTextColor,
  getShowcaseBackground,
} from "@/lib/utils";
import type { Palette } from "@/lib/types";
import { PaletteCardActions } from "./PaletteCardActions";
import Link from "next/link";
import { Button } from "@/components/ui/button";

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
  hideViewDetails?: boolean;
  hideExploreSimilar?: boolean;
  showDelete?: boolean;
  onRemove?: (paletteId: number) => Promise<void>;
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
  hideViewDetails = false,
  hideExploreSimilar = false,
  showDelete = false,
  onRemove,
}: PaletteCardProps) {
  const [isFullscreenOpen, setIsFullscreenOpen] = useState(false);
  const [fullscreenMode, setFullscreenMode] = useState<"standard" | "showcase">(
    "standard",
  );
  const fullscreenRef = useRef<HTMLDivElement>(null);

  async function openFullscreen(mode: "standard" | "showcase") {
    const element = fullscreenRef.current;

    if (!element) return;

    element.hidden = false;
    setFullscreenMode(mode);

    try {
      await element.requestFullscreen();
      setIsFullscreenOpen(true);
    } catch (error) {
      element.hidden = true;
      setIsFullscreenOpen(false);
      console.error("Failed to open fullscreen:", error);
      toast.error("Unable to open fullscreen");
    }
  }

  const handleOpenFullscreen = () => openFullscreen("standard");
  const handleOpenViewMode = () => openFullscreen("showcase");

  function closeFullscreen() {
    if (document.fullscreenElement === fullscreenRef.current) {
      void document.exitFullscreen();
    } else {
      setIsFullscreenOpen(false);
    }
  }

  useEffect(() => {
    function handleFullscreenChange() {
      const isFullscreen = document.fullscreenElement === fullscreenRef.current;

      setIsFullscreenOpen(isFullscreen);

      if (!isFullscreen && fullscreenRef.current) {
        fullscreenRef.current.hidden = true;
      }
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  const closeButtonColor = palette.colors[0]?.hex ?? "#FFFFFF";
  const closeButtonTextColor = getContrastTextColor(closeButtonColor);

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
      <div
        ref={fullscreenRef}
        hidden={!isFullscreenOpen}
        className={`fixed inset-0 z-100 flex h-screen w-screen ${
          fullscreenMode === "showcase"
            ? "items-center justify-center"
            : "bg-background"
        } ${
          isFullscreenOpen ? "animate-in fade-in zoom-in-95 duration-300" : ""
        }`}
        style={
          fullscreenMode === "showcase"
            ? { backgroundColor: getShowcaseBackground(palette.colors) }
            : undefined
        }
      >
        {fullscreenMode === "standard" ? (
          <div className="flex h-full w-full animate-in fade-in duration-500">
            {palette.colors.map((color) => (
              <div
                key={color.id}
                className="h-full min-w-0 flex-1"
                style={{ backgroundColor: color.hex ?? "transparent" }}
              />
            ))}
          </div>
        ) : (
          <div className="flex h-[clamp(220px,58vh,420px)] w-[min(86vw,980px)] items-stretch justify-center animate-in fade-in zoom-in-95 duration-500">
            {palette.colors.map((color, index) => (
              <div
                key={color.id}
                className="relative min-w-0 flex-1 rounded-full shadow-sm"
                style={{
                  backgroundColor: color.hex ?? "transparent",
                  marginLeft: index === 0 ? 0 : "-clamp(10px, 2vw, 28px)",
                  zIndex: index + 1,
                }}
              />
            ))}
          </div>
        )}

        <Button
          variant="ghost"
          size="icon"
          aria-label="Close fullscreen"
          onClick={closeFullscreen}
          className="absolute right-4 top-4 z-50 rounded-full shadow-md animate-in fade-in zoom-in-75 duration-300 hover:opacity-90"
          style={{
            backgroundColor: closeButtonColor,
            color: closeButtonTextColor,
          }}
        >
          <X />
        </Button>
      </div>
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
            hideViewDetails={hideViewDetails}
            hideExploreSimilar={hideExploreSimilar}
            showDelete={showDelete}
            onRemove={onRemove}
            onOpenFullscreen={handleOpenFullscreen}
            onOpenViewMode={handleOpenViewMode}
          />
        </div>

        <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
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
