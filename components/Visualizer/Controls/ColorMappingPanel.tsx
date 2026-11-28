"use client";

import { RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  COLOR_ROLES,
  type ColorMapping,
  type ColorRole,
  type MappedColorOrigin,
  type RoleSources,
  type VisualizerColorInput,
} from "@/lib/visualizer/types";

import { ColorRoleItem } from "./ColorRoleItem";

interface ColorMappingPanelProps {
  colors: ColorMapping;
  sources: RoleSources;
  origins: Record<ColorRole, MappedColorOrigin>;
  paletteColors: VisualizerColorInput[];
  hasManual: boolean;
  onChangeRole: (role: ColorRole, hex: string) => void;
  onResetRole: (role: ColorRole) => void;
  onResetAll: () => void;
}

export function ColorMappingPanel({
  colors,
  sources,
  origins,
  paletteColors,
  hasManual,
  onChangeRole,
  onResetRole,
  onResetAll,
}: ColorMappingPanelProps) {
  return (
    <section className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-xs font-semibold">
          Color mapping
        </h2>

        <Button
          variant="ghost"
          size="xs"
          disabled={!hasManual}
          onClick={onResetAll}
          title="Reset all to automatic"
        >
          <RotateCcw />
          Reset all
        </Button>
      </div>

      <ul className="space-y-0.5">
        {COLOR_ROLES.map((role) => (
          <ColorRoleItem
            key={role}
            role={role}
            color={colors[role]}
            source={sources[role]}
            origin={origins[role]}
            paletteColors={paletteColors}
            onChange={(hex) => onChangeRole(role, hex)}
            onReset={() => onResetRole(role)}
          />
        ))}
      </ul>
    </section>
  );
}
