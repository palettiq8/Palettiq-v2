"use client";

import {
  ActivityIcon,
  Bookmark,
  Clipboard,
  Columns3,
  Copy,
  DownloadIcon,
  EllipsisVertical,
  Eye,
  FileCode,
  FileImage,
  FolderPlus,
  Maximize2,
  Star,
  TextSearch,
  Trash2,
  View,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Palette } from "@/lib/types";
import { copyPalette, type PaletteCopyFormat } from "@/lib/utils/copy-palette";

import { usePaletteActionsContext } from "./PaletteActionsContext";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";

interface PaletteCardActionsProps {
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
  onOpenFullscreen: () => void;
}

export function PaletteCardActions({
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
  onOpenFullscreen,
}: PaletteCardActionsProps) {
  const [removeDialogOpen, setRemoveDialogOpen] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  const handleRemove = async () => {
    if (!onRemove || isRemoving) return;

    setIsRemoving(true);

    try {
      await onRemove(palette.id);
      setRemoveDialogOpen(false);
    } finally {
      setIsRemoving(false);
    }
  };
  const { openPaletteAction } = usePaletteActionsContext();

  const handleCopy = async (format: PaletteCopyFormat = "json") => {
    try {
      await copyPalette(palette, format);

      toast.success(
        format === "json"
          ? "Palette copied to clipboard"
          : `${format.toUpperCase()} copied to clipboard`,
      );
    } catch (error) {
      console.error("Failed to copy palette:", error);
      toast.error("Failed to copy palette");
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="icon"
        aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        aria-pressed={isFavorite}
        onClick={() => onToggleFavorite(palette.id)}
        disabled={isFavoriting}
      >
        <Star
          className={
            isFavorite ? "fill-yellow-500 text-yellow-500" : "text-foreground"
          }
        />
      </Button>

      <Button
        variant="outline"
        size="icon"
        aria-label={isSaved ? "Unsave palette" : "Save palette"}
        aria-pressed={isSaved}
        disabled={isSaving}
        onClick={() => onToggleSave(palette.id)}
      >
        <Bookmark
          className={
            isSaved ? "fill-current text-foreground" : "text-foreground"
          }
        />
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button variant="outline" size="icon" aria-label="Download palette">
              <DownloadIcon />
            </Button>
          }
        />

        <DropdownMenuContent align="end">
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={() => onDownload(palette, "png")}>
              <FileImage />
              Download as PNG
            </DropdownMenuItem>

            <DropdownMenuItem onClick={() => onDownload(palette, "svg")}>
              <FileCode />
              Download as SVG
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              variant="outline"
              size="icon"
              aria-label="More palette options"
            >
              <EllipsisVertical />
            </Button>
          }
        />

        <DropdownMenuContent>
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={() => handleCopy("json")}>
              <Copy />
              Copy
            </DropdownMenuItem>

            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <Clipboard />
                Copy as
              </DropdownMenuSubTrigger>

              <DropdownMenuSubContent>
                <DropdownMenuItem onClick={() => handleCopy("hex")}>
                  HEX
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleCopy("hex-plain")}>
                  HEX (Without #)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleCopy("rgb")}>
                  RGB
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleCopy("rgba")}>
                  RGBA
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleCopy("hsl")}>
                  HSL
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleCopy("hsla")}>
                  HSLA
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleCopy("hsv")}>
                  HSV / HSB
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleCopy("cmyk")}>
                  CMYK
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleCopy("lab")}>
                  LAB
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleCopy("lch")}>
                  LCH
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleCopy("oklab")}>
                  OKLAB
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleCopy("oklch")}>
                  OKLCH
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem onClick={() => handleCopy("css")}>
                  CSS Variables
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleCopy("scss")}>
                  SCSS Variables
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleCopy("tailwind")}>
                  Tailwind CSS
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleCopy("json")}>
                  JSON
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleCopy("javascript")}>
                  JavaScript Array
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleCopy("swift")}>
                  Swift
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleCopy("android-xml")}>
                  Android XML
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>

            <DropdownMenuItem onClick={() => onAddToProjects(palette.id)}>
              <FolderPlus />
              Add to projects
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => openPaletteAction(palette.id, "quick-view")}
            >
              <Eye />
              Quick view
            </DropdownMenuItem>

            {!hideViewDetails && (
              <DropdownMenuItem
                render={
                  <Link
                    href={`/palettes/${palette.id}-${palette.identity?.slug}`}
                  />
                }
              >
                <View />
                View details
              </DropdownMenuItem>
            )}
            <DropdownMenuItem onClick={onOpenFullscreen}>
              <Maximize2 />
              Open fullscreen
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Columns3 />
              View mode
            </DropdownMenuItem>
            <DropdownMenuItem>
              <ActivityIcon />
              Visualize palette
            </DropdownMenuItem>
            {!hideExploreSimilar && (
              <DropdownMenuItem>
                <TextSearch />
                Explore similar
              </DropdownMenuItem>
            )}
            {showDelete && onRemove && (
              <DropdownMenuItem
                variant="destructive"
                onClick={() => setRemoveDialogOpen(true)}
              >
                <Trash2 />
                Remove
              </DropdownMenuItem>
            )}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      {showDelete && (
        <AlertDialog
          open={removeDialogOpen}
          onOpenChange={(open) => {
            if (!isRemoving) setRemoveDialogOpen(open);
          }}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Remove palette from project?</AlertDialogTitle>

              <AlertDialogDescription>
                This palette will be removed from this project. The original
                palette will not be deleted.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter>
              <AlertDialogCancel disabled={isRemoving}>
                Cancel
              </AlertDialogCancel>

              <AlertDialogAction
                variant="destructive"
                onClick={(event) => {
                  event.preventDefault();
                  void handleRemove();
                }}
                disabled={isRemoving}
              >
                {isRemoving ? "Removing..." : "Remove"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}
