"use client";

import { useState } from "react";
import { Check, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { getContrastTextColor } from "@/lib/utils";
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
  const preview = normalized ?? normalizeHex(value) ?? "#000000";

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
        <DialogHeader className="flex flex-row items-start justify-between">
          <div className="space-y-1.5">
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>
              Pick a palette color or enter a custom hex value.
            </DialogDescription>
          </div>

          <DialogClose
            render={
              <Button variant="outline" size="icon">
                <X className="size-4" />
                <span className="sr-only">Close</span>
              </Button>
            }
          />
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm font-medium">Palette colors</p>

            {swatches.length > 0 ? (
              <div className="grid grid-cols-6 gap-2">
                {swatches.map((color) => {
                  const selected = color.hex === normalized;

                  return (
                    <button
                      key={color.id}
                      type="button"
                      onClick={() => commit(color.hex)}
                      aria-label={`Use ${color.hex}`}
                      aria-pressed={selected}
                      title={color.hex}
                      style={{ backgroundColor: color.hex }}
                      className={`flex size-10 items-center justify-center rounded-md ring-1 ring-inset ring-foreground/10 transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                        selected ? "ring-2 ring-ring" : ""
                      }`}
                    >
                      {selected && (
                        <Check
                          className="size-4"
                          style={{ color: getContrastTextColor(color.hex) }}
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            ) : (
              <p className="rounded-md border border-dashed p-3 text-xs text-muted-foreground">
                This palette has no valid colors to reuse.
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="viz-custom-color" className="text-sm font-medium">
              Custom color
            </label>

            <div className="flex items-center gap-2">
              <input
                type="color"
                value={preview.toLowerCase()}
                onChange={(event) =>
                  setHexInput(event.target.value.toUpperCase())
                }
                className="h-9 w-12 shrink-0 cursor-pointer rounded-md border border-input bg-transparent p-0.5"
                aria-label="Pick a custom color"
              />

              <Input
                id="viz-custom-color"
                value={hexInput}
                onChange={(event) => setHexInput(event.target.value)}
                placeholder="#RRGGBB"
                className="font-mono uppercase"
                aria-invalid={!normalized}
              />
            </div>

            {!normalized && hexInput.trim().length > 0 && (
              <p className="text-sm text-destructive" role="alert">
                Enter a valid hex, like #1A2B3C.
              </p>
            )}
          </div>
        </div>

        <DialogFooter className="sm:justify-between">
          <p className="self-center font-mono text-xs uppercase text-muted-foreground">
            {normalized ?? "Invalid hex"}
          </p>

          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>

            <Button
              onClick={() => normalized && commit(normalized)}
              disabled={!normalized}
            >
              Apply
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
