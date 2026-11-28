import { getContrastTextColor } from "@/lib/utils";

import {
  getColorDistance,
  getContrastRatio,
} from "./color-utils";
import type { ColorMapping, ColorRole, ThemeMode } from "./types";

/**
 * Diagnostics preparation layer.
 *
 * This is NOT the Diagnostics product. It exposes the data a future
 * Diagnostics UI can consume for the current mapping/theme: the actual
 * foreground/background combinations rendered in the preview, their WCAG
 * contrast, and color-role distinctness. A contrast ratio alone does not prove
 * accessibility — callers must interpret results against the real text sizes
 * and rendered elements.
 */

export type DiagnosticStatus = "pass" | "warn" | "fail";

export interface DiagnosticPair {
  id: string;
  label: string;
  foregroundRole: ColorRole | null;
  backgroundRole: ColorRole | null;
  foreground: string;
  background: string;
  ratio: number | null;
  requiredRatio: number;
  status: DiagnosticStatus;
}

export interface DiagnosticConflict {
  id: string;
  label: string;
  roleA: ColorRole;
  roleB: ColorRole;
  distance: number | null;
  status: DiagnosticStatus;
}

export interface DiagnosticsReport {
  theme: ThemeMode;
  pairs: DiagnosticPair[];
  conflicts: DiagnosticConflict[];
  distinctness: {
    backgroundSurfaceDistance: number | null;
    status: DiagnosticStatus;
  };
}

const TEXT_AA_RATIO = 4.5;

function contrastStatus(
  ratio: number | null,
  required: number,
): DiagnosticStatus {
  if (ratio === null) return "fail";
  if (ratio >= required) return "pass";
  // Large text / lower-emphasis allowance before hard failure.
  if (ratio >= required - 1.5) return "warn";
  return "fail";
}

function distinctnessStatus(distance: number | null): DiagnosticStatus {
  if (distance === null) return "fail";
  if (distance >= 0.03) return "pass";
  if (distance >= 0.015) return "warn";
  return "fail";
}

function textPair(
  id: string,
  label: string,
  foregroundRole: ColorRole,
  backgroundRole: ColorRole,
  colors: ColorMapping,
): DiagnosticPair {
  const foreground = colors[foregroundRole];
  const background = colors[backgroundRole];
  const ratio = getContrastRatio(foreground, background);

  return {
    id,
    label,
    foregroundRole,
    backgroundRole,
    foreground,
    background,
    ratio,
    requiredRatio: TEXT_AA_RATIO,
    status: contrastStatus(ratio, TEXT_AA_RATIO),
  };
}

function onColorPair(
  id: string,
  label: string,
  background: string,
): DiagnosticPair {
  const foreground = getContrastTextColor(background);
  const ratio = getContrastRatio(foreground, background);

  return {
    id,
    label,
    foregroundRole: null,
    backgroundRole: null,
    foreground,
    background,
    ratio,
    requiredRatio: TEXT_AA_RATIO,
    status: contrastStatus(ratio, TEXT_AA_RATIO),
  };
}

const CONFLICT_PAIRS: {
  id: string;
  label: string;
  roleA: ColorRole;
  roleB: ColorRole;
}[] = [
  { id: "primary-secondary", label: "Primary vs Secondary", roleA: "primary", roleB: "secondary" },
  { id: "primary-accent", label: "Primary vs Accent", roleA: "primary", roleB: "accent" },
  { id: "secondary-accent", label: "Secondary vs Accent", roleA: "secondary", roleB: "accent" },
  { id: "text-muted", label: "Text vs Muted", roleA: "text", roleB: "muted" },
];

export function buildDiagnostics(
  colors: ColorMapping,
  theme: ThemeMode,
): DiagnosticsReport {
  const pairs: DiagnosticPair[] = [
    textPair("text-background", "Text on background", "text", "background", colors),
    textPair("text-surface", "Text on surface", "text", "surface", colors),
    textPair("muted-background", "Muted text on background", "muted", "background", colors),
    textPair("muted-surface", "Muted text on surface", "muted", "surface", colors),
    onColorPair("primary-button", "Button label on primary", colors.primary),
    onColorPair("secondary-button", "Button label on secondary", colors.secondary),
    onColorPair("accent-badge", "Badge label on accent", colors.accent),
  ];

  const conflicts: DiagnosticConflict[] = CONFLICT_PAIRS.map(
    ({ id, label, roleA, roleB }) => {
      const distance = getColorDistance(colors[roleA], colors[roleB]);

      return {
        id,
        label,
        roleA,
        roleB,
        distance,
        status: distinctnessStatus(distance),
      };
    },
  );

  const backgroundSurfaceDistance = getColorDistance(
    colors.background,
    colors.surface,
  );

  return {
    theme,
    pairs,
    conflicts,
    distinctness: {
      backgroundSurfaceDistance,
      status: distinctnessStatus(backgroundSurfaceDistance),
    },
  };
}
