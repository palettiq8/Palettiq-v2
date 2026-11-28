import type {
  ColorMapping,
  ColorRole,
  MappedColorOrigin,
  RoleMappingSource,
  RoleSources,
  TemplateType,
  ThemeMode,
  VisualizerColorInput,
  VisualizerMapping,
} from "./types";
import { COLOR_ROLES } from "./types";
import {
  getColorDistance,
  getContrastRatio,
  hexToHsl,
  hslToRgb,
  normalizeHex,
  rgbToHex,
} from "./color-utils";

export interface AutoMappingResult extends VisualizerMapping {
  origins: Record<ColorRole, MappedColorOrigin>;
}

interface AnalyzedColor {
  hex: string;
  h: number;
  s: number;
  l: number;
}

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

/**
 * Template-specific tuning. The mapping engine stays independent from React
 * templates; templates only influence these constants.
 */
const TEMPLATE_TUNING: Record<TemplateType, { backgroundSaturation: number }> = {
  website: { backgroundSaturation: 14 },
};

function analyze(hex: string): AnalyzedColor | null {
  const normalized = normalizeHex(hex);

  if (!normalized) return null;

  const hsl = hexToHsl(normalized);

  if (!hsl) return null;

  return { hex: normalized, h: hsl.h, s: hsl.s, l: hsl.l };
}

function fromHsl(h: number, s: number, l: number): string {
  return rgbToHex(hslToRgb({ h, s: clamp(s, 0, 100), l: clamp(l, 0, 100) }));
}

function vividScore(color: AnalyzedColor): number {
  return color.s - Math.abs(color.l - 50) * 0.9;
}

function createRoleSources(value: RoleMappingSource): RoleSources {
  return Object.fromEntries(
    COLOR_ROLES.map((role) => [role, value]),
  ) as RoleSources;
}

function createOrigins(
  value: MappedColorOrigin,
): Record<ColorRole, MappedColorOrigin> {
  return Object.fromEntries(
    COLOR_ROLES.map((role) => [role, value]),
  ) as Record<ColorRole, MappedColorOrigin>;
}

function createFallbackMapping(theme: ThemeMode): AutoMappingResult {
  const colors: ColorMapping =
    theme === "light"
      ? {
          primary: "#2563EB",
          secondary: "#0F766E",
          accent: "#EA580C",
          background: "#F8FAFC",
          surface: "#FFFFFF",
          text: "#0F172A",
          muted: "#64748B",
        }
      : {
          primary: "#38BDF8",
          secondary: "#2DD4BF",
          accent: "#FBBF24",
          background: "#0B1120",
          surface: "#111827",
          text: "#F8FAFC",
          muted: "#94A3B8",
        };

  return {
    colors,
    sources: createRoleSources("auto"),
    origins: createOrigins("derived"),
  };
}

/**
 * Maps a palette to semantic UI roles.
 *
 * Runs entirely on color properties (hue, saturation, lightness, contrast,
 * perceptual distance) and never relies on palette order. The same palette
 * color may be reused across roles, and derived shades/tints are used when the
 * palette has no suitable color for a role. Original palette colors are never
 * mutated — derived values are marked via `origins`.
 */
export function mapPaletteToRoles(
  paletteColors: VisualizerColorInput[],
  template: TemplateType,
  theme: ThemeMode,
): AutoMappingResult {
  const tuning = TEMPLATE_TUNING[template];

  const analyzed = paletteColors
    .map((color) => (color.hex ? analyze(color.hex) : null))
    .filter((color): color is AnalyzedColor => color !== null);

  if (analyzed.length === 0) {
    return createFallbackMapping(theme);
  }

  const isLight = theme === "light";
  const origins = createOrigins("derived");

  const sortedByLightness = [...analyzed].sort((a, b) => a.l - b.l);
  const lightest = sortedByLightness[sortedByLightness.length - 1];
  const darkest = sortedByLightness[0];
  const hueSource = isLight ? lightest : darkest;
  const hue = hueSource.h;

  // Background: prefer a suitable low-saturation palette color, otherwise
  // derive a near-neutral tint from the palette hue.
  const backgroundTarget = isLight ? 97 : 12;
  const backgroundCandidates = analyzed.filter(
    (color) => color.s <= 30 && (isLight ? color.l >= 82 : color.l <= 30),
  );

  let background: string;

  if (backgroundCandidates.length > 0) {
    const best = backgroundCandidates.reduce((current, candidate) =>
      Math.abs(candidate.l - backgroundTarget) <
      Math.abs(current.l - backgroundTarget)
        ? candidate
        : current,
    );

    background = best.hex;
    origins.background = "palette";
  } else {
    background = fromHsl(hue, tuning.backgroundSaturation, backgroundTarget);
  }

  const backgroundHsl = hexToHsl(background) ?? {
    h: hue,
    s: 0,
    l: backgroundTarget,
  };

  // Surface: a subtle step away from the background.
  const surface = fromHsl(
    backgroundHsl.h,
    Math.min(backgroundHsl.s, tuning.backgroundSaturation),
    backgroundHsl.l + (isLight ? 3 : 6),
  );

  const withContrast = analyzed
    .map((color) => ({
      color,
      ratio: getContrastRatio(color.hex, background) ?? 0,
    }))
    .sort((a, b) => b.ratio - a.ratio);

  // Text: highest-contrast palette color when it is genuinely readable,
  // otherwise a strong tint/shade of the palette hue.
  let text: string;
  const textCandidate = withContrast
    .filter(({ ratio }) => ratio >= 7)
    .sort((a, b) => a.color.s - b.color.s || b.ratio - a.ratio)[0];

  if (textCandidate) {
    text = textCandidate.color.hex;
    origins.text = "palette";
  } else {
    text = fromHsl(hue, Math.min(hueSource.s, 25), isLight ? 14 : 94);
  }

  // Muted: a lower-emphasis but readable low-saturation color.
  const mutedCandidate = withContrast
    .filter(
      ({ color, ratio }) =>
        color.hex !== text && color.s <= 35 && ratio >= 4.5 && ratio < 7,
    )
    .sort((a, b) => a.ratio - b.ratio)[0];

  let muted: string;

  if (mutedCandidate) {
    muted = mutedCandidate.color.hex;
    origins.muted = "palette";
  } else {
    muted = fromHsl(hue, Math.min(hueSource.s, 18), isLight ? 45 : 68);
  }

  // Primary: the most vivid, mid-lightness palette color.
  const primaryColor = [...analyzed].sort(
    (a, b) => vividScore(b) - vividScore(a),
  )[0];
  const primary = primaryColor.hex;
  origins.primary = "palette";

  const primaryHsl = hexToHsl(primary) ?? { h: hue, s: 60, l: 50 };

  // Secondary: the most perceptually distinct remaining palette color, or a
  // supporting shade of the primary.
  const secondaryCandidate = analyzed
    .filter((color) => color.hex !== primary)
    .map((color) => ({
      color,
      distance: getColorDistance(color.hex, primary) ?? 0,
    }))
    .sort((a, b) => b.distance - a.distance)[0];

  let secondary: string;

  if (
    secondaryCandidate &&
    secondaryCandidate.distance >= 0.1 &&
    secondaryCandidate.color.s >= 20
  ) {
    secondary = secondaryCandidate.color.hex;
    origins.secondary = "palette";
  } else {
    secondary = fromHsl(
      primaryHsl.h,
      Math.max(primaryHsl.s * 0.85, 30),
      primaryHsl.l - 14,
    );
  }

  // Accent: a distinct highlight, derived from a hue shift when needed.
  const accentCandidate = analyzed
    .filter(
      (color) => color.hex !== primary && color.hex !== secondary,
    )
    .map((color) => ({
      color,
      distance: Math.min(
        getColorDistance(color.hex, primary) ?? 0,
        getColorDistance(color.hex, secondary) ?? 0,
      ),
    }))
    .sort((a, b) => b.distance - a.distance)[0];

  let accent: string;

  if (
    accentCandidate &&
    accentCandidate.distance >= 0.1 &&
    accentCandidate.color.s >= 25
  ) {
    accent = accentCandidate.color.hex;
    origins.accent = "palette";
  } else {
    accent = fromHsl(
      (primaryHsl.h + 150) % 360,
      Math.max(primaryHsl.s, 55),
      55,
    );
  }

  const colors: ColorMapping = {
    primary,
    secondary,
    accent,
    background,
    surface,
    text,
    muted,
  };

  return {
    colors,
    sources: createRoleSources("auto"),
    origins,
  };
}
