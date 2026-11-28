import type { CSSProperties } from "react";

import { getContrastTextColor } from "@/lib/utils";
import { hexToRgb, rgbToHex } from "./color-utils";
import type { ColorMapping, ColorRole } from "./types";

/**
 * CSS custom properties that make up the preview token system. Templates must
 * use these tokens instead of hardcoded colors.
 */
export const PREVIEW_TOKEN_VARS: Record<ColorRole, string> = {
  primary: "--viz-primary",
  secondary: "--viz-secondary",
  accent: "--viz-accent",
  background: "--viz-background",
  surface: "--viz-surface",
  text: "--viz-text",
  muted: "--viz-muted",
};

export interface PreviewTokenStyle extends CSSProperties {
  "--viz-primary": string;
  "--viz-secondary": string;
  "--viz-accent": string;
  "--viz-background": string;
  "--viz-surface": string;
  "--viz-text": string;
  "--viz-muted": string;
  "--viz-on-primary": string;
  "--viz-on-secondary": string;
  "--viz-on-accent": string;
  "--viz-border": string;
}

function mixHex(from: string, to: string, amount: number): string {
  const a = hexToRgb(from);
  const b = hexToRgb(to);

  if (!a || !b) return from;

  const mix = (start: number, end: number) =>
    Math.round(start + (end - start) * amount);

  return rgbToHex({
    r: mix(a.r, b.r),
    g: mix(a.g, b.g),
    b: mix(a.b, b.b),
  });
}

/**
 * Turns a semantic role mapping into an inline style object that scopes the
 * preview tokens to a container. Changing the mapping re-computes this object,
 * so every component reading the tokens updates immediately.
 */
export function buildPreviewTokenStyle(colors: ColorMapping): PreviewTokenStyle {
  return {
    "--viz-primary": colors.primary,
    "--viz-secondary": colors.secondary,
    "--viz-accent": colors.accent,
    "--viz-background": colors.background,
    "--viz-surface": colors.surface,
    "--viz-text": colors.text,
    "--viz-muted": colors.muted,
    "--viz-on-primary": getContrastTextColor(colors.primary),
    "--viz-on-secondary": getContrastTextColor(colors.secondary),
    "--viz-on-accent": getContrastTextColor(colors.accent),
    "--viz-border": mixHex(colors.text, colors.background, 0.82),
  };
}
