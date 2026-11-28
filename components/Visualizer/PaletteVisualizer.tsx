"use client";

import { useState } from "react";

import type { Palette } from "@/lib/types";

import { usePaletteVisualizer } from "@/hooks/usePaletteVisualizer";
import { VisualizerHeader } from "./VisualizerHeader";
import { VisualizerPreview } from "./VisualizerPreview";
import { VisualizerSidebar } from "./VisualizerSidebar";

interface PaletteVisualizerProps {
  palette: Palette;
}

export function PaletteVisualizer({ palette }: PaletteVisualizerProps) {
  const visualizer = usePaletteVisualizer(palette);
  const [controlsOpen, setControlsOpen] = useState(false);

  return (
    <div className="flex h-svh flex-col overflow-hidden bg-muted/20">
      <VisualizerHeader
        palette={palette}
        canUndo={visualizer.canUndo}
        canRedo={visualizer.canRedo}
        onUndo={visualizer.undo}
        onRedo={visualizer.redo}
        canReset={visualizer.hasChanges}
        onReset={visualizer.resetVisualizer}
        controlsOpen={controlsOpen}
        onToggleControls={() => setControlsOpen((open) => !open)}
      />

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden lg:flex-row">
        <VisualizerSidebar
          className={`${controlsOpen ? "block" : "hidden"} lg:block`}
          colors={visualizer.colors}
          sources={visualizer.sources}
          origins={visualizer.origins}
          paletteColors={visualizer.paletteColors}
          hasManual={visualizer.hasManual}
          template={visualizer.template}
          theme={visualizer.theme}
          viewport={visualizer.viewport}
          onChangeRole={visualizer.setRoleColor}
          onResetRole={visualizer.resetRole}
          onResetAll={visualizer.resetAll}
          onTemplateChange={visualizer.setTemplate}
          onThemeChange={visualizer.setTheme}
          onViewportChange={visualizer.setViewport}
        />

        <VisualizerPreview
          colors={visualizer.colors}
          template={visualizer.template}
          theme={visualizer.theme}
          viewport={visualizer.viewport}
        />
      </div>
    </div>
  );
}
