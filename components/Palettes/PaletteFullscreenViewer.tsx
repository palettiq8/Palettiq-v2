"use client";

import {
  type CSSProperties,
  type Ref,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { toast } from "sonner";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getContrastTextColor, getShowcaseBackground } from "@/lib/utils";
import type { Palette } from "@/lib/types";

const SHOWCASE_OFFSETS = [
  { x: -60, y: -60 },
  { x: 0, y: -70 },
  { x: 60, y: -60 },
  { x: -60, y: 60 },
  { x: 0, y: 70 },
  { x: 60, y: 60 },
];

export interface PaletteFullscreenViewerHandle {
  openFullscreen: () => void;
  openViewMode: () => void;
}

interface PaletteFullscreenViewerProps {
  palette: Palette;
  ref?: Ref<PaletteFullscreenViewerHandle>;
}

export function PaletteFullscreenViewer({
  palette,
  ref,
}: PaletteFullscreenViewerProps) {
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

  useImperativeHandle(ref, () => ({
    openFullscreen: () => {
      void openFullscreen("standard");
    },
    openViewMode: () => {
      void openFullscreen("showcase");
    },
  }));

  const closeButtonColor = palette.colors[0]?.hex ?? "#FFFFFF";
  const closeButtonTextColor = getContrastTextColor(closeButtonColor);

  return (
    <div
      ref={fullscreenRef}
      hidden={!isFullscreenOpen}
      className={`fixed inset-0 z-100 flex h-screen w-screen overflow-hidden ${
        fullscreenMode === "showcase"
          ? "items-center justify-center"
          : "bg-background"
      }`}
    >
      {fullscreenMode === "showcase" && (
        <div
          className={`absolute inset-0 ${
            isFullscreenOpen ? "animate-[showcase-bg-in_700ms_ease-out_both]" : ""
          }`}
          style={{
            backgroundColor: getShowcaseBackground(palette.colors),
          }}
        />
      )}
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
        <div className="relative z-10 flex h-[clamp(220px,58vh,420px)] w-[min(86vw,900px)] items-stretch justify-center">
          {palette.colors.map((color, index) => {
            const offset = SHOWCASE_OFFSETS[index % SHOWCASE_OFFSETS.length];

            return (
              <div
                key={color.id}
                className={`relative min-w-0 flex-1 rounded-full shadow-sm ${
                  index === 0 ? "" : "-ml-[clamp(16px,3vw,40px)]"
                }`}
                style={
                  {
                    backgroundColor: color.hex ?? "transparent",
                    zIndex: index + 1,
                    "--sc-x": `${offset.x}px`,
                    "--sc-y": `${offset.y}px`,
                    animation: isFullscreenOpen
                      ? `showcase-color-in 700ms cubic-bezier(0.16,1,0.3,1) ${index * 90}ms both`
                      : undefined,
                  } as CSSProperties
                }
              />
            );
          })}
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
  );
}
