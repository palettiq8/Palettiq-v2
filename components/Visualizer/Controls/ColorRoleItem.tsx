"use client";

import { useState } from "react";
import { RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  COLOR_ROLE_LABELS,
  type ColorRole,
  type MappedColorOrigin,
  type RoleMappingSource,
  type VisualizerColorInput,
} from "@/lib/visualizer/types";
import { Badge } from "@/components/ui/badge";
import { ColorPickerDialog } from "./ColorPickerDialog";

interface ColorRoleItemProps {
  role: ColorRole;
  color: string;
  source: RoleMappingSource;
  origin: MappedColorOrigin;
  paletteColors: VisualizerColorInput[];
  onChange: (hex: string) => void;
  onReset: () => void;
}

export function ColorRoleItem({
  role,
  color,
  source,
  origin,
  paletteColors,
  onChange,
  onReset,
}: ColorRoleItemProps) {
  const [open, setOpen] = useState(false);

  const label = COLOR_ROLE_LABELS[role];
  const isManual = source === "manual";
  const isDerived = source === "auto" && origin === "derived";

  return (
    <li className="flex items-center gap-1.5">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="group flex min-w-0 flex-1 items-center gap-2.5 rounded-lg px-1.5 py-1.5 text-left transition-colors hover:bg-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        aria-label={`Change ${label} color, currently ${color}`}
      >
        <span
          className="size-8 shrink-0 rounded-md ring-1 ring-inset ring-black/10"
          style={{ backgroundColor: color }}
        />

        <span className="min-w-0 flex-1 space-y-1">
          <span className="block truncate text-xs font-medium">{label}</span>

          <span className="flex items-center gap-1.5">
            <span className="text-xs uppercase text-muted-foreground">
              {color}
            </span>

            {isDerived && (
              <span className="text-xs text-muted-foreground">derived</span>
            )}
          </span>
        </span>

        <Badge
          className={"bg-muted text-muted-foreground"}
          variant={"secondary"}
        >
          {isManual ? "Manual" : "Auto"}
        </Badge>
      </button>

      {isManual && (
        <Button
          variant="ghost"
          size="icon-xs"
          aria-label={`Reset ${label} to automatic`}
          title="Reset to auto"
          onClick={onReset}
        >
          <RotateCcw />
        </Button>
      )}

      {open && (
        <ColorPickerDialog
          open
          onOpenChange={setOpen}
          title={`${label} color`}
          value={color}
          paletteColors={paletteColors}
          onSelect={onChange}
        />
      )}
    </li>
  );
}
