"use client";

import { useMemo, useReducer, useState } from "react";

import type { Palette } from "@/lib/types";
import type {
  ColorMapping,
  ColorRole,
  RoleSources,
  TemplateType,
  ThemeMode,
  ViewportSize,
  VisualizerColorInput,
} from "@/lib/visualizer/types";
import { COLOR_ROLES } from "@/lib/visualizer/types";
import { mapPaletteToRoles } from "@/lib/visualizer/color-mapping";
import {
  createInitialHistory,
  DEFAULT_TEMPLATE,
  DEFAULT_THEME,
  reducer,
} from "@/lib/visualizer/history";

const DEFAULT_VIEWPORT: ViewportSize = "desktop";

export function usePaletteVisualizer(palette: Palette) {
  const [history, dispatch] = useReducer(
    reducer,
    undefined,
    createInitialHistory,
  );

  // Viewport is a preview setting, not an undoable design change.
  const [viewport, setViewport] = useState<ViewportSize>(DEFAULT_VIEWPORT);

  const { overrides, template, theme } = history.present;

  const paletteColors = useMemo<VisualizerColorInput[]>(
    () =>
      palette.colors.map((color) => ({
        id: color.id,
        hex: color.hex,
        name: color.name,
      })),
    [palette.colors],
  );

  const autoMapping = useMemo(
    () => mapPaletteToRoles(paletteColors, template, theme),
    [paletteColors, template, theme],
  );

  const colors = useMemo<ColorMapping>(
    () => ({ ...autoMapping.colors, ...overrides }),
    [autoMapping.colors, overrides],
  );

  const sources = useMemo<RoleSources>(() => {
    const next = { ...autoMapping.sources };

    for (const role of COLOR_ROLES) {
      if (overrides[role]) {
        next[role] = "manual";
      }
    }

    return next;
  }, [autoMapping.sources, overrides]);

  const hasManual = Object.keys(overrides).length > 0;
  const canUndo = history.past.length > 0;
  const canRedo = history.future.length > 0;
  const hasChanges =
    hasManual ||
    template !== DEFAULT_TEMPLATE ||
    theme !== DEFAULT_THEME ||
    viewport !== DEFAULT_VIEWPORT;

  return {
    template,
    theme,
    viewport,
    paletteColors,
    colors,
    sources,
    origins: autoMapping.origins,
    hasManual,
    canUndo,
    canRedo,
    hasChanges,
    setTemplate: (value: TemplateType) =>
      dispatch({ type: "setTemplate", template: value }),
    setTheme: (value: ThemeMode) => dispatch({ type: "setTheme", theme: value }),
    setViewport,
    setRoleColor: (role: ColorRole, hex: string) =>
      dispatch({ type: "setRoleColor", role, hex }),
    resetRole: (role: ColorRole) => dispatch({ type: "resetRole", role }),
    resetAll: () => dispatch({ type: "resetAllOverrides" }),
    undo: () => dispatch({ type: "undo" }),
    redo: () => dispatch({ type: "redo" }),
    resetVisualizer: () => {
      dispatch({ type: "resetToDefaults" });
      setViewport(DEFAULT_VIEWPORT);
    },
  };
}
