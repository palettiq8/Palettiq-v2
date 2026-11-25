"use client";

import { useMemo, useState } from "react";
import { AlertTriangle, Copy } from "lucide-react";
import { getContrastTextColor } from "@/lib/utils";
import {
  colorBlindnessTypes,
  getPaletteColorConfusions,
  simulateColorBlindness,
  type ColorBlindnessType,
  type PaletteColorInput,
} from "@/lib/utils/color-blindness";

interface PaletteBlindnessOverviewProps {
  colors: PaletteColorInput[];
  onCopyColor: (hex: string) => void;
}

export function PaletteBlindnessOverview({
  colors,
  onCopyColor,
}: PaletteBlindnessOverviewProps) {
  const [activeType, setActiveType] =
    useState<ColorBlindnessType>("protanopia");

  const validColors = useMemo(
    () =>
      colors.filter((color): color is PaletteColorInput & { hex: string } =>
        Boolean(color.hex),
      ),
    [colors],
  );

  const simulatedColors = useMemo(
    () =>
      validColors.map((color) => ({
        ...color,
        simulatedHex: simulateColorBlindness(color.hex, activeType),
      })),
    [validColors, activeType],
  );

  const confusions = useMemo(
    () => getPaletteColorConfusions(validColors),
    [validColors],
  );

  const activeConfusions = confusions.filter(
    (confusion) => confusion.type === activeType,
  );

  const activeTypeInfo = colorBlindnessTypes.find(
    (type) => type.key === activeType,
  );

  if (validColors.length === 0) return null;

  return (
    <section className="mt-10 space-y-4">
      <div className="flex flex-col gap-1">
        <h3 className="text-base font-semibold tracking-tight">
          Color vision accessibility
        </h3>
        <p className="text-sm text-muted-foreground">
          Preview how this palette may appear under different types of color
          vision deficiency.
        </p>
      </div>

      {/* Simulation modes */}
      <div className="flex flex-wrap gap-2">
        {colorBlindnessTypes.map((type) => {
          const isActive = activeType === type.key;

          return (
            <button
              key={type.key}
              type="button"
              onClick={() => setActiveType(type.key)}
              aria-pressed={isActive}
              className={`rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${
                isActive
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              {type.label}
            </button>
          );
        })}
      </div>

      {/* Full palette simulation */}
      <div className="overflow-hidden rounded-2xl border bg-card">
        <div className="space-y-1 border-b bg-muted/30 px-5 py-4">
          <h3 className="text-sm font-semibold tracking-tight">
            {activeTypeInfo?.label} preview
          </h3>
          <p className="text-xs text-muted-foreground">
            {activeTypeInfo?.description}
          </p>
        </div>

        <div className="p-5">
          <div className="flex h-28 w-full overflow-hidden rounded-xl border border-black/10">
            {simulatedColors.map((color) => (
              <button
                key={color.id}
                type="button"
                onClick={() => onCopyColor(color.simulatedHex)}
                className="group relative min-w-0 flex-1 focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
                style={{ backgroundColor: color.simulatedHex }}
                title={`Copy ${color.simulatedHex}`}
                aria-label={`Copy simulated ${color.name ?? "color"} ${color.simulatedHex}`}
              >
                <span className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100">
                  <Copy
                    className="size-4 drop-shadow-sm"
                    style={{
                      color: getContrastTextColor(color.simulatedHex),
                    }}
                  />
                </span>
              </button>
            ))}
          </div>

          <div className="mt-4 grid gap-x-4 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
            {simulatedColors.map((color) => (
              <div key={color.id} className="flex min-w-0 items-center gap-3">
                <div
                  className="size-8 shrink-0 rounded-md border border-black/10"
                  style={{ backgroundColor: color.simulatedHex }}
                />
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">
                    {color.name || "Unnamed color"}
                  </p>
                  <p className="font-mono text-xs uppercase text-muted-foreground">
                    {color.simulatedHex}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Potential color confusion */}
      <div className="overflow-hidden rounded-2xl border bg-card">
        <div className="space-y-1 border-b bg-muted/30 px-5 py-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="size-4 text-muted-foreground" />
            <h3 className="text-sm font-semibold tracking-tight">
              Potential color confusion
            </h3>
          </div>
          <p className="text-xs text-muted-foreground">
            Color pairs that may be difficult to distinguish under the selected
            color vision simulation.
          </p>
        </div>

        <div className="p-5">
          {activeConfusions.length > 0 ? (
            <div className="space-y-4">
              {activeConfusions.map((confusion) => (
                <div
                  key={`${confusion.colorA.id}-${confusion.colorB.id}`}
                  className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex shrink-0 overflow-hidden rounded-md border border-black/10">
                      <div
                        className="size-9"
                        style={{ backgroundColor: confusion.simulatedHexA }}
                      />
                      <div
                        className="size-9"
                        style={{ backgroundColor: confusion.simulatedHexB }}
                      />
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">
                        {confusion.colorA.name || "Unnamed color"}
                        <span className="px-1.5 text-muted-foreground">
                          and
                        </span>
                        {confusion.colorB.name || "Unnamed color"}
                      </p>

                      <p className="text-xs text-muted-foreground">
                        {[confusion.colorA.role, confusion.colorB.role]
                          .filter(Boolean)
                          .map((role) => role!.replaceAll("_", " "))
                          .join(" · ") || "No color roles assigned"}
                      </p>
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    <span className="text-xs tabular-nums text-muted-foreground">
                      ΔE00: {confusion.difference.toFixed(2)}
                    </span>

                    <span
                      className={`rounded-md px-2 py-1 text-xs font-medium ${
                        confusion.severity === "very-close"
                          ? "bg-destructive/10 text-destructive"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {confusion.severity === "very-close"
                        ? "Very close"
                        : "Close"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-4 text-center">
              <p className="text-sm font-medium">
                No closely matching color pairs detected
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                No color pairs fell below the current similarity threshold in
                this simulation.
              </p>
            </div>
          )}
        </div>
      </div>

      <p className="text-xs leading-relaxed text-muted-foreground">
        Simulations are approximations, not clinical assessments. Color-pair
        warnings use CIE76 color difference as a heuristic and do not guarantee
        accessibility.
      </p>
    </section>
  );
}
