import {
  Activity,
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
  View,
} from "lucide-react";

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

interface PaletteCardActionsProps {
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

export function PaletteCardActions({
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
}: PaletteCardActionsProps) {
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
            <DropdownMenuItem onClick={() => onCopy(palette)}>
              <Copy />
              Copy
            </DropdownMenuItem>

            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <Clipboard />
                Copy as
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuItem>HEX</DropdownMenuItem>
                <DropdownMenuItem>HEX (Without #)</DropdownMenuItem>
                <DropdownMenuItem>RGB</DropdownMenuItem>
                <DropdownMenuItem>RGBA</DropdownMenuItem>
                <DropdownMenuItem>HSL</DropdownMenuItem>
                <DropdownMenuItem>HSLA</DropdownMenuItem>
                <DropdownMenuItem>HSV / HSB</DropdownMenuItem>
                <DropdownMenuItem>CMYK</DropdownMenuItem>
                <DropdownMenuItem>LAB</DropdownMenuItem>
                <DropdownMenuItem>LCH</DropdownMenuItem>
                <DropdownMenuItem>OKLAB</DropdownMenuItem>
                <DropdownMenuItem>OKLCH</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>CSS Variables</DropdownMenuItem>
                <DropdownMenuItem>SCSS Variables</DropdownMenuItem>
                <DropdownMenuItem>Tailwind CSS</DropdownMenuItem>
                <DropdownMenuItem>JSON</DropdownMenuItem>
                <DropdownMenuItem>JavaScript Array</DropdownMenuItem>
                <DropdownMenuItem>Swift</DropdownMenuItem>
                <DropdownMenuItem>Android XML</DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>

            <DropdownMenuItem onClick={() => onAddToProjects(palette.id)}>
              <FolderPlus />
              Add to projects
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Eye />
              Quick view
            </DropdownMenuItem>
            <DropdownMenuItem>
              <View />
              View details
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Maximize2 />
              Open on screen
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Columns3 />
              View mode
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Activity />
              Visualize palette
            </DropdownMenuItem>
            <DropdownMenuItem>
              <TextSearch />
              Explore similar
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
