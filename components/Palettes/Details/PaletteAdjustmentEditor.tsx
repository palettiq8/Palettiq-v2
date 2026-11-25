"use client";

import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  type AdjustmentKey,
  type Adjustments,
} from "@/lib/utils/palette-adjustments";

interface PaletteAdjustmentEditorProps {
  adjustments: Adjustments;
  onAdjustmentChange: (key: AdjustmentKey, value: number) => void;
  onReset: () => void;
}

const adjustmentOptions: {
  key: AdjustmentKey;
  label: string;
  min: number;
  max: number;
  unit?: string;
}[] = [
  { key: "hue", label: "Hue", min: -180, max: 180, unit: "°" },
  { key: "saturation", label: "Saturation", min: -100, max: 100 },
  { key: "brightness", label: "Brightness", min: -100, max: 100 },
  { key: "temperature", label: "Temperature", min: -100, max: 100 },
  { key: "contrast", label: "Contrast", min: -100, max: 100 },
  { key: "vibrance", label: "Vibrance", min: -100, max: 100 },
  { key: "tint", label: "Tint", min: -100, max: 100 },
];

export function PaletteAdjustmentEditor({
  adjustments,
  onAdjustmentChange,
  onReset,
}: PaletteAdjustmentEditorProps) {
  const hasAdjustments = Object.values(adjustments).some(
    (value) => value !== 0,
  );

  return (
    <div className="rounded-2xl border border-border/60 bg-card/60 p-5 shadow-sm backdrop-blur-xl sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold tracking-tight">
            Adjust palette
          </h2>
          <p className="text-sm text-muted-foreground">
            Fine-tune the colors to match your vision.
          </p>
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onReset}
          disabled={!hasAdjustments}
        >
          <RotateCcw className="size-3.5" />
          Reset
        </Button>
      </div>

      <div className="mt-6 grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
        {adjustmentOptions.map((option) => {
          const value = adjustments[option.key];

          return (
            <div key={option.key} className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <label className="text-sm font-medium">{option.label}</label>

                <span className="min-w-10 text-right text-sm tabular-nums text-muted-foreground">
                  {value > 0 ? "+" : ""}
                  {value}
                  {option.unit ?? ""}
                </span>
              </div>

              <Slider
                value={[value]}
                min={option.min}
                max={option.max}
                step={1}
                onValueChange={(values) =>
                  onAdjustmentChange(
                    option.key,
                    typeof values === "number" ? values : (values[0] ?? 0),
                  )
                }
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
