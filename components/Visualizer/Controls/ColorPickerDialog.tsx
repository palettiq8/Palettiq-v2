"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { normalizeHex } from "@/lib/visualizer/color-utils";
import type { VisualizerColorInput } from "@/lib/visualizer/types";

interface ColorPickerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  value: string;
  paletteColors: VisualizerColorInput[];
  onSelect: (hex: string) => void;
}

export function ColorPickerDialog({
  open,
  onOpenChange,
  title,
  value,
  paletteColors,
  onSelect,
}: ColorPickerDialogProps) {
  const [hexInput, setHexInput] = useState(value);

  const normalized = normalizeHex(hexInput);

  const swatches = paletteColors
    .map((color) => ({
      id: color.id,
      hex: color.hex ? normalizeHex(color.hex) : null,
    }))
    .filter(
      (color): color is { id: number | string; hex: string } =>
        color.hex !== null,
    );

  function commit(hex: string) {
    onSelect(hex);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-5">
          <section className="space-y-2">
            <p className="text-xs font-semibold text-muted-foreground">
              Palette colors
            </p>

            {swatches.length > 0 ? (
              <div className="grid grid-cols-6 gap-2">
                {swatches.map((color) => (
                  <button
                    key={color.id}
                    type="button"
                    onClick={() => commit(color.hex)}
                    className="size-9 rounded-md ring-1 ring-inset ring-black/10 transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    style={{ backgroundColor: color.hex }}
                    title={color.hex}
                    aria-label={`Use ${color.hex}`}
                  />
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">
                This palette has no valid colors to reuse.
              </p>
            )}
          </section>

          <section className="space-y-2">
            <p className="text-xs font-semibold text-muted-foreground">
              Custom color
            </p>

            <div className="flex items-center gap-2">
              <input
                type="color"
                value={(normalized ?? "#000000").toLowerCase()}
                onChange={(event) =>
                  setHexInput(event.target.value.toUpperCase())
                }
                className="size-9 shrink-0 cursor-pointer rounded-md border border-border bg-transparent p-0.5"
                aria-label="Pick a custom color"
              />

              <Input
                value={hexInput}
                onChange={(event) => setHexInput(event.target.value)}
                placeholder="#RRGGBB"
                className="font-mono uppercase"
                aria-invalid={!normalized}
                aria-label="Hex color value"
              />

              <Button
                onClick={() => normalized && commit(normalized)}
                disabled={!normalized}
              >
                Apply
              </Button>
            </div>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
}
