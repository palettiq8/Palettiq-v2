"use client";

import { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import type { PaletteDetails } from "@/lib/queries/palette-details";
import { PaletteBackButton } from "./PaletteBackButton";
import { Crown, WandSparkles } from "lucide-react";
import { PaletteDetailsActions } from "./PaletteDetailsActions";
import { PaletteAdjustmentEditor } from "./PaletteAdjustmentEditor";
import { usePaletteAdjustments } from "@/hooks/usePaletteAdjustments";
import { Copy } from "lucide-react";
import { toast } from "sonner";
import { capitalizeFirst, getContrastTextColor } from "@/lib/utils";

interface PaletteHeroProps {
  palette: PaletteDetails;
}

export function PaletteHero({ palette }: PaletteHeroProps) {
  const { id, identity, colors, is_free, creation_method } = palette;

  const validColors = useMemo(
    () =>
      colors.filter((color): color is typeof color & { hex: string } =>
        Boolean(color.hex),
      ),
    [colors],
  );

  const { adjustments, adjustedColors, updateAdjustment, resetAdjustments } =
    usePaletteAdjustments(validColors);

  const bestForItems = identity?.best_for
    ?.split(",")
    .map((item) => capitalizeFirst(item.trim()))
    .filter(Boolean);

  return (
    <section className="space-y-5">
      <PaletteBackButton />

      {/* Palette Hero */}
      <div className="overflow-hidden rounded-3xl border border-border/60 bg-card/60 p-5 shadow-sm backdrop-blur-xl sm:p-6">
        <div className="grid items-stretch gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:gap-8">
          {/* Left: Palette Preview */}
          <div className="flex h-full min-h-65 flex-col overflow-hidden rounded-2xl border border-border/60 bg-background/50 shadow-sm sm:min-h-80">
            {/* Original + Adjusted Palette */}
            <div className="flex min-h-55 flex-1 flex-col sm:min-h-70">
              {/* Original Palette */}
              <div className="flex min-h-0 flex-1">
                {validColors.map((color) => (
                  <button
                    key={color.id}
                    type="button"
                    onClick={async () => {
                      try {
                        await navigator.clipboard.writeText(color.hex);
                        toast.success(`${color.hex} copied`);
                      } catch {
                        toast.error("Failed to copy color");
                      }
                    }}
                    className="group relative min-w-0 flex-1 cursor-pointer transition-colors duration-150"
                    style={{ backgroundColor: color.hex }}
                    title={`Copy ${color.hex}`}
                    aria-label={`Copy original color ${color.hex}`}
                  >
                    <span className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-150 group-hover:opacity-100">
                      <Copy
                        className="size-4 drop-shadow-sm"
                        style={{ color: getContrastTextColor(color.hex) }}
                      />
                    </span>
                  </button>
                ))}
              </div>

              {/* Adjusted Palette */}
              <div className="flex min-h-0 flex-1">
                {adjustedColors.map((color) => (
                  <button
                    key={color.id}
                    type="button"
                    onClick={async () => {
                      if (!color.hex) return;

                      try {
                        await navigator.clipboard.writeText(color.hex);
                        toast.success(`${color.hex} copied`);
                      } catch {
                        toast.error("Failed to copy color");
                      }
                    }}
                    disabled={!color.hex}
                    className="group relative min-w-0 flex-1 cursor-pointer transition-colors duration-150 disabled:cursor-not-allowed"
                    style={{ backgroundColor: color.hex ?? "transparent" }}
                    title={color.hex ? `Copy ${color.hex}` : undefined}
                    aria-label={
                      color.hex
                        ? `Copy adjusted color ${color.hex}`
                        : "No color available"
                    }
                  >
                    <span className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-150 group-hover:opacity-100">
                      {color.hex && (
                        <Copy
                          className="size-4 drop-shadow-sm"
                          style={{ color: getContrastTextColor(color.hex) }}
                        />
                      )}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Palette Footer */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border/60 bg-background/70 px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">
                  {validColors.length} colors
                </span>

                <span className="text-muted-foreground">·</span>

                <span className="text-sm text-muted-foreground">
                  Color palette
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                {validColors.map((color) => (
                  <span
                    key={color.id}
                    className="size-5 rounded-full border border-black/10"
                    style={{ backgroundColor: color.hex }}
                    title={color.hex}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Right: Palette Information */}
          <div className="flex flex-col justify-center space-y-4">
            <div className="flex w-full items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline" className="capitalize">
                  <Crown />
                  {is_free ? "Free" : "Premium"}
                </Badge>

                {creation_method && (
                  <Badge variant="outline" className="capitalize">
                    <WandSparkles />
                    {creation_method.replace("-", " ")}
                  </Badge>
                )}
              </div>

              <PaletteDetailsActions palette={palette} />
            </div>

            <div className="space-y-2">
              {identity?.name && (
                <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                  {identity.name}
                </h1>
              )}

              {identity?.tagline && (
                <p className="text-base font-medium text-muted-foreground">
                  {identity.tagline}
                </p>
              )}

              {identity?.short_description && (
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {identity.short_description}
                </p>
              )}
            </div>

            {bestForItems && bestForItems.length > 0 && (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">Best for:</p>

                <div className="flex flex-wrap gap-1.5">
                  {bestForItems.map((item) => (
                    <Badge key={item} variant="secondary">
                      {item}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-border/60 pt-3 text-xs text-muted-foreground">
              {identity?.author && (
                <span>
                  By{" "}
                  <span className="font-medium text-foreground">
                    {identity.author}
                  </span>
                </span>
              )}

              <span>
                Palette ID:{" "}
                <span className="font-medium text-foreground">{id}</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Palette Adjustment Controls */}
      <PaletteAdjustmentEditor
        adjustments={adjustments}
        onAdjustmentChange={updateAdjustment}
        onReset={resetAdjustments}
      />
    </section>
  );
}
