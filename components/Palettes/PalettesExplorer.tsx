"use client";

import { usePalettes } from "@/hooks/queries/usePalettes";
import { PaletteColor } from "@/lib/types";
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyMedia,
} from "../ui/empty";
import { PaletteIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton"

export default function PalettesExplorer() {
  const { data: palettes, isPending, isError, error } = usePalettes();

  if (isPending) {
    return (
      <div className="w-full px-6 py-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Skeleton className="w-full h-40 rounded-xl" />
        <Skeleton className="w-full h-40 rounded-xl" />
        <Skeleton className="w-full h-40 rounded-xl" />
        <Skeleton className="w-full h-40 rounded-xl" />
        <Skeleton className="w-full h-40 rounded-xl" />
        <Skeleton className="w-full h-40 rounded-xl" />
        <Skeleton className="w-full h-40 rounded-xl" />
        <Skeleton className="w-full h-40 rounded-xl" />
        <Skeleton className="w-full h-40 rounded-xl" />
        <Skeleton className="w-full h-40 rounded-xl" />
        <Skeleton className="w-full h-40 rounded-xl" />
        <Skeleton className="w-full h-40 rounded-xl" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-full px-6 py-8">
        <p className="text-destructive">
          Failed to load palettes: {error.message}
        </p>
      </div>
    );
  }

  if (!palettes?.length) {
    return (
      <div className="w-full px-6 py-8 grid place-content-center">
        <Empty className="border border-dashed">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <PaletteIcon />
            </EmptyMedia>
            <EmptyTitle>No palettes found</EmptyTitle>
            <EmptyDescription>
              Adjust your search or filters to find palettes that match your taste.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      </div>
    );
  }

  return (
    <div className="w-full px-6 py-8">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {palettes.map((palette) => (
          <div
            key={palette.id}
            className="overflow-hidden rounded-xl border bg-card"
          >
            <div className="flex h-40">
              {palette.colors.map((color: PaletteColor) => (
                <div
                  key={color.id}
                  className="h-full flex-1"
                  style={{ backgroundColor: color.hex }}
                  title={color.hex}
                />
              ))}
            </div>

            <div className="p-4">
              <h3 className="font-semibold">{palette.identity?.name}</h3>

              <p className="mt-1 text-sm text-muted-foreground">
                {palette.identity?.short_description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
