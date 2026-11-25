"use client";

import { toast } from "sonner";
import { Copy } from "lucide-react";
import { converter, formatHex } from "culori";

import { CopyColorButton } from "./CopyColorButton";
import { PaletteBlindnessOverview } from "./PaletteBlindnessOverview";
import { PaletteContrastOverview } from "./PaletteContrastOverview";

import { generateColorVariations } from "@/lib/utils/color-variations";
import { calculatePaletteUsage } from "@/lib/utils/palette-usage";
import type { PaletteDetails } from "@/lib/queries/palette-details";
import { Separator } from "@/components/ui/separator";
import { getContrastTextColor } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  colorBlindnessTypes,
  simulateColorBlindness,
} from "@/lib/utils/color-blindness";

interface PaletteColorBreakdownProps {
  colors: PaletteDetails["colors"];
}

type ColorHarmony = {
  label: string;
  colors: string[];
};

const toHsl = converter("hsl");

const harmonyTypes = [
  { label: "Complementary", angles: [180] },
  { label: "Analogous", angles: [-30, 30] },
  { label: "Split Complementary", angles: [150, 210] },
  { label: "Triadic", angles: [120, 240] },
  { label: "Tetradic", angles: [60, 180, 240] },
  { label: "Square", angles: [90, 180, 270] },
] as const;

const variationGroups = [
  { key: "tints", label: "Tints" },
  { key: "shades", label: "Shades" },
  { key: "tones", label: "Tones" },
] as const;

function generateColorHarmonies(hex: string): ColorHarmony[] {
  const color = toHsl(hex);

  if (!color) return [];

  const baseHue = color.h ?? 0;
  const saturation = color.s ?? 0;
  const lightness = color.l ?? 0;

  const hueHarmonies: ColorHarmony[] = harmonyTypes.map((harmony) => ({
    label: harmony.label,
    colors: harmony.angles
      .map((angle) => {
        const hue = (((baseHue + angle) % 360) + 360) % 360;

        return formatHex({
          mode: "hsl",
          h: hue,
          s: saturation,
          l: lightness,
        })?.toUpperCase();
      })
      .filter((hex): hex is string => Boolean(hex)),
  }));

  const monochromatic: ColorHarmony = {
    label: "Monochromatic",
    colors: [0.15, 0.3, 0.45, 0.7, 0.85]
      .map((lightness) =>
        formatHex({
          mode: "hsl",
          h: baseHue,
          s: saturation,
          l: lightness,
        })?.toUpperCase(),
      )
      .filter((hex): hex is string => Boolean(hex)),
  };

  return [...hueHarmonies, monochromatic];
}

export function PaletteColorBreakdown({ colors }: PaletteColorBreakdownProps) {
  const validColors = colors.filter(
    (color): color is typeof color & { hex: string } => Boolean(color.hex),
  );

  if (validColors.length === 0) return null;

  const usagePercentages = calculatePaletteUsage(validColors);

  async function copyColor(hex: string) {
    try {
      await navigator.clipboard.writeText(hex);
      toast.success(`${hex} copied`);
    } catch {
      toast.error("Failed to copy color");
    }
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-semibold tracking-tight">
          Color breakdown
        </h2>

        <p className="text-sm text-muted-foreground">
          Explore the individual colors, their roles, and HEX values.
        </p>
      </div>

      <Separator />

      <Tabs defaultValue={String(validColors[0].id)} className="w-full">
        <TabsList className="w-full">
          {validColors.map((color, index) => (
            <TabsTrigger key={color.id} value={String(color.id)}>
              <span
                className="size-3 shrink-0 rounded-full border border-black/10"
                style={{ backgroundColor: color.hex }}
              />

              <span className="max-w-32 truncate">
                {color.name || `Color ${index + 1}`}
              </span>
            </TabsTrigger>
          ))}
        </TabsList>

        {validColors.map((color, index) => {
          const variations = generateColorVariations(color.hex);
          const usage = usagePercentages[color.id] ?? 0;
          const harmonies = generateColorHarmonies(color.hex);

          return (
            <TabsContent
              key={color.id}
              value={String(color.id)}
              className="mt-5 focus-visible:outline-none"
            >
              <div className="grid items-stretch gap-4 lg:grid-cols-[0.6fr_1.4fr]">
                <article className="flex h-full min-w-0 flex-col overflow-hidden rounded-xl border border-border/60 bg-card">
                  <div
                    className="relative min-h-52 flex-1"
                    style={{ backgroundColor: color.hex }}
                  >
                    <span
                      className="absolute left-3 top-3 grid size-7 place-content-center rounded-full bg-black/20 text-xs font-medium backdrop-blur-sm"
                      style={{ color: getContrastTextColor(color.hex) }}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <div className="space-y-3 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0 space-y-1">
                        <p className="truncate text-sm font-semibold">
                          {color.name || "Unnamed color"}
                        </p>

                        {color.role && (
                          <p className="text-xs capitalize text-muted-foreground">
                            {color.role}
                          </p>
                        )}
                      </div>

                      <span
                        className="shrink-0 text-xs font-semibold tabular-nums text-muted-foreground"
                        title="Recommended usage proportion"
                      >
                        {usage}% usage
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-2 rounded-lg border border-border/50 bg-muted/40 px-3 py-2">
                      <span className="font-mono text-sm font-medium uppercase tracking-wide">
                        {color.hex.toUpperCase()}
                      </span>

                      <CopyColorButton hex={color.hex.toUpperCase()} />
                    </div>
                  </div>
                </article>

                <div className="flex min-w-0 flex-col justify-between gap-5">
                  {variationGroups.map((group) => (
                    <div key={group.key} className="min-w-0 space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-semibold tracking-tight">
                          {group.label}
                        </h3>

                        <span className="text-xs tabular-nums text-muted-foreground">
                          {variations[group.key].length} colors
                        </span>
                      </div>

                      <div className="grid h-16 grid-cols-15 overflow-hidden rounded-md border border-black/10">
                        {variations[group.key].map((hex, variationIndex) => (
                          <button
                            key={`${hex}-${variationIndex}`}
                            type="button"
                            onClick={() => copyColor(hex)}
                            className="group relative min-w-0 focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
                            style={{ backgroundColor: hex }}
                            title={`Copy ${hex}`}
                            aria-label={`Copy ${group.label} color ${hex}`}
                          >
                            <span className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-150 group-hover:opacity-100">
                              <Copy
                                className="size-4 drop-shadow-sm"
                                style={{ color: getContrastTextColor(hex) }}
                              />
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {harmonies.length > 0 && (
                <div className="mt-6 space-y-4">
                  <div className="flex flex-col gap-1">
                    <h3 className="text-base font-semibold tracking-tight">
                      Color harmonies
                    </h3>

                    <p className="text-sm text-muted-foreground">
                      Explore colors that naturally complement this color
                      through different harmony relationships.
                    </p>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {harmonies.map((harmony) => (
                      <div
                        key={harmony.label}
                        className="min-w-0 rounded-xl border border-border/60 bg-card p-4"
                      >
                        <div className="mb-3 flex items-center justify-between gap-2">
                          <h4 className="text-sm font-semibold tracking-tight">
                            {harmony.label}
                          </h4>

                          <span className="text-xs tabular-nums text-muted-foreground">
                            {harmony.colors.length}{" "}
                            {harmony.colors.length === 1 ? "color" : "colors"}
                          </span>
                        </div>

                        <div className="grid h-24 w-full grid-flow-col auto-cols-fr overflow-hidden rounded-md">
                          {harmony.colors.map((hex, i) => (
                            <button
                              key={i}
                              type="button"
                              onClick={() => copyColor(hex)}
                              className="group relative min-w-0 focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
                              style={{ backgroundColor: hex }}
                              title={`Copy ${hex}`}
                              aria-label={`Copy ${harmony.label} color ${hex}`}
                            >
                              <span className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-150 group-hover:opacity-100">
                                <Copy
                                  className="size-4 drop-shadow-sm"
                                  style={{ color: getContrastTextColor(hex) }}
                                />
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-6 space-y-4">
                <div className="flex flex-col gap-1">
                  <h3 className="text-base font-semibold tracking-tight">
                    Color vision simulation
                  </h3>

                  <p className="text-sm text-muted-foreground">
                    Compare how this color may appear under different types of
                    color vision deficiency.
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {colorBlindnessTypes.map((type) => {
                    const simulatedColor = simulateColorBlindness(
                      color.hex,
                      type.key,
                    );

                    return (
                      <div
                        key={type.key}
                        className="min-w-0 rounded-xl border border-border/60 bg-card p-4"
                      >
                        <div className="mb-3 flex items-center justify-between gap-2">
                          <h4 className="text-sm font-semibold tracking-tight">
                            {type.label}
                          </h4>

                          <span className="text-xs tabular-nums text-muted-foreground">
                            2 colors
                          </span>
                        </div>

                        <div className="grid h-24 w-full grid-flow-col auto-cols-fr overflow-hidden rounded-md">
                          <button
                            type="button"
                            onClick={() => copyColor(color.hex.toUpperCase())}
                            className="group relative min-w-0 focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
                            style={{ backgroundColor: color.hex }}
                            title={`Copy original ${color.hex.toUpperCase()}`}
                            aria-label={`Copy original color ${color.hex}`}
                          >
                            <span className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-150 group-hover:opacity-100">
                              <Copy
                                className="size-4 drop-shadow-sm"
                                style={{
                                  color: getContrastTextColor(color.hex),
                                }}
                              />
                            </span>
                          </button>

                          <button
                            type="button"
                            onClick={() => copyColor(simulatedColor)}
                            className="group relative min-w-0 focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
                            style={{ backgroundColor: simulatedColor }}
                            title={`Copy simulated ${simulatedColor}`}
                            aria-label={`Copy ${type.label} simulated color ${simulatedColor}`}
                          >
                            <span className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-150 group-hover:opacity-100">
                              <Copy
                                className="size-4 drop-shadow-sm"
                                style={{
                                  color: getContrastTextColor(simulatedColor),
                                }}
                              />
                            </span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </TabsContent>
          );
        })}
      </Tabs>

      <PaletteBlindnessOverview colors={validColors} onCopyColor={copyColor} />
      <PaletteContrastOverview colors={validColors} />
    </section>
  );
}
