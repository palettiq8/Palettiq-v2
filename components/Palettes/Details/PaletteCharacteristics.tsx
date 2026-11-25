import type { PaletteDetails } from "@/lib/queries/palette-details";
import {
  Palette,
  SlidersHorizontal,
  Thermometer,
  Contrast,
  Sun,
  Droplets,
  CircleDot,
  Blend,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface PaletteCharacteristicsProps {
  filters: PaletteDetails["filters"];
}

interface ColorFamily {
  name: string;
  hex: string;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function getStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];

  return value.filter((item): item is string => typeof item === "string");
}

function getColorFamilies(value: unknown): ColorFamily[] {
  if (!Array.isArray(value)) return [];

  return value.filter(
    (item): item is ColorFamily =>
      isRecord(item) &&
      typeof item.name === "string" &&
      typeof item.hex === "string",
  );
}

function formatValue(value: string) {
  return value.replaceAll("-", " ");
}

const propertyIcons = {
  "Color mode": Palette,
  "Color harmony": Blend,
  Temperature: Thermometer,
  Tone: CircleDot,
  Brightness: Sun,
  Saturation: Droplets,
  Contrast: Contrast,
};

export function PaletteCharacteristics({
  filters,
}: PaletteCharacteristicsProps) {
  if (!isRecord(filters)) return null;

  const groups = [
    {
      title: "Color properties",
      description: "The fundamental color relationships.",
      icon: Palette,
      items: [
        { label: "Color mode", values: getStringArray(filters.modes) },
        { label: "Color harmony", values: getStringArray(filters.harmonies) },
        {
          label: "Temperature",
          values: getStringArray(filters.temperatures),
        },
      ],
    },
    {
      title: "Visual characteristics",
      description: "The overall visual appearance of the palette.",
      icon: SlidersHorizontal,
      items: [
        { label: "Tone", values: getStringArray(filters.tones) },
        {
          label: "Brightness",
          values: getStringArray(filters.brightness_levels),
        },
        {
          label: "Saturation",
          values: getStringArray(filters.saturation_levels),
        },
        {
          label: "Contrast",
          values: getStringArray(filters.contrast_levels),
        },
      ],
    },
  ];

  const colorFamilies = getColorFamilies(filters.color_families);

  const visibleGroups = groups
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => item.values.length > 0),
    }))
    .filter((group) => group.items.length > 0);

  if (visibleGroups.length === 0 && colorFamilies.length === 0) {
    return null;
  }

  return (
    <section className="space-y-6">
      {/* Section Heading */}
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-semibold tracking-tight">
          Palette characteristics
        </h2>

        <p className="text-sm text-muted-foreground">
          Explore the color relationships, visual qualities, and families that
          define this palette.
        </p>
      </div>

      <Separator />

      {/* Property Groups */}
      {visibleGroups.length > 0 && (
        <div className="grid gap-6 lg:grid-cols-2">
          {visibleGroups.map((group) => {
            return (
              <div
                key={group.title}
                className="overflow-hidden rounded-2xl border bg-card"
              >
                {/* Card Header */}
                <div className="space-y-1 border-b bg-muted/30 px-5 py-4">
                  <h3 className="text-sm font-semibold tracking-tight">
                    {group.title}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {group.description}
                  </p>
                </div>

                {/* Properties */}
                <div className="divide-y divide-border/60 px-5">
                  {group.items.map((item) => {
                    const ItemIcon =
                      propertyIcons[item.label as keyof typeof propertyIcons];

                    return (
                      <div
                        key={item.label}
                        className="flex items-start justify-between gap-4 py-4"
                      >
                        <div className="flex min-w-0 items-center gap-2.5">
                          <ItemIcon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />

                          <span className="text-sm text-muted-foreground">
                            {item.label}
                          </span>
                        </div>

                        <div className="flex max-w-[65%] flex-wrap justify-end gap-1.5">
                          {item.values.map((value) => (
                            <Badge key={value} variant={"outline"}>
                              {formatValue(value)}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Color Families */}
      {colorFamilies.length > 0 && (
        <div className="overflow-hidden rounded-2xl border bg-card">
          <div className="flex items-center justify-between gap-4 border-b bg-muted/30 px-5 py-4">
            <div className="space-y-1">
              <h3 className="text-sm font-semibold tracking-tight">
                Color families
              </h3>
              <p className="text-xs text-muted-foreground">
                The color families represented in this palette.
              </p>
            </div>

            <span className="shrink-0 rounded-full border bg-background px-2.5 py-1 text-xs font-medium tabular-nums text-muted-foreground">
              {colorFamilies.length}{" "}
              {colorFamilies.length === 1 ? "family" : "families"}
            </span>
          </div>

          <div className="grid grid-cols-1 px-5 sm:grid-cols-2 lg:grid-cols-3">
            {colorFamilies.map((family) => (
              <div
                key={`${family.name}-${family.hex}`}
                className="flex min-w-0 items-center gap-3 py-3 sm:pr-4 lg:pr-4"
              >
                <div
                  className="size-10 shrink-0 rounded-md border border-black/10"
                  style={{ backgroundColor: family.hex }}
                />

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium capitalize">
                    {family.name}
                  </p>
                  <p className="mt-0.5 font-mono text-xs uppercase text-muted-foreground">
                    {family.hex}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
