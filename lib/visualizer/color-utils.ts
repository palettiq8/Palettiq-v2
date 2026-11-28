import { converter, parse } from "culori";

/**
 * Single color utility layer for the Visualizer.
 *
 * Contrast ratio is re-exported from the existing utility so the Visualizer,
 * and future Diagnostics, all share the same WCAG implementation.
 */
export { getContrastRatio } from "@/lib/utils/contrast";

export interface RGB {
  r: number;
  g: number;
  b: number;
}

export interface HSL {
  h: number;
  s: number;
  l: number;
}

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

const HEX_PATTERN = /^(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;

/**
 * Expands and uppercases a hex string. Accepts with or without leading `#`,
 * 3 or 6 digits. Returns `null` for anything invalid.
 */
export function normalizeHex(value: string): string | null {
  if (typeof value !== "string") return null;

  let hex = value.trim();

  if (hex.startsWith("#")) {
    hex = hex.slice(1);
  }

  if (!HEX_PATTERN.test(hex)) return null;

  if (hex.length === 3) {
    hex = hex
      .split("")
      .map((char) => char + char)
      .join("");
  }

  return `#${hex.toUpperCase()}`;
}

export function isValidHex(value: unknown): value is string {
  return typeof value === "string" && normalizeHex(value) !== null;
}

export function hexToRgb(hex: string): RGB | null {
  const normalized = normalizeHex(hex);

  if (!normalized) return null;

  const int = Number.parseInt(normalized.slice(1), 16);

  return {
    r: (int >> 16) & 0xff,
    g: (int >> 8) & 0xff,
    b: int & 0xff,
  };
}

export function rgbToHex({ r, g, b }: RGB): string {
  const toChannel = (channel: number) =>
    clamp(Math.round(channel), 0, 255).toString(16).padStart(2, "0");

  return `#${toChannel(r)}${toChannel(g)}${toChannel(b)}`.toUpperCase();
}

export function rgbToHsl({ r, g, b }: RGB): HSL {
  const red = clamp(r, 0, 255) / 255;
  const green = clamp(g, 0, 255) / 255;
  const blue = clamp(b, 0, 255) / 255;

  const max = Math.max(red, green, blue);
  const min = Math.min(red, green, blue);
  const delta = max - min;

  const l = (max + min) / 2;

  let h = 0;
  let s = 0;

  if (delta !== 0) {
    s = l > 0.5 ? delta / (2 - max - min) : delta / (max + min);

    switch (max) {
      case red:
        h = (green - blue) / delta + (green < blue ? 6 : 0);
        break;
      case green:
        h = (blue - red) / delta + 2;
        break;
      default:
        h = (red - green) / delta + 4;
        break;
    }

    h *= 60;
  }

  return { h, s: s * 100, l: l * 100 };
}

function hueToRgb(p: number, q: number, t: number): number {
  let channel = t;

  if (channel < 0) channel += 1;
  if (channel > 1) channel -= 1;

  if (channel < 1 / 6) return p + (q - p) * 6 * channel;
  if (channel < 1 / 2) return q;
  if (channel < 2 / 3) return p + (q - p) * (2 / 3 - channel) * 6;

  return p;
}

export function hslToRgb({ h, s, l }: HSL): RGB {
  const hue = (((h % 360) + 360) % 360) / 360;
  const saturation = clamp(s, 0, 100) / 100;
  const lightness = clamp(l, 0, 100) / 100;

  if (saturation === 0) {
    const value = Math.round(lightness * 255);
    return { r: value, g: value, b: value };
  }

  const q =
    lightness < 0.5
      ? lightness * (1 + saturation)
      : lightness + saturation - lightness * saturation;
  const p = 2 * lightness - q;

  return {
    r: Math.round(hueToRgb(p, q, hue + 1 / 3) * 255),
    g: Math.round(hueToRgb(p, q, hue) * 255),
    b: Math.round(hueToRgb(p, q, hue - 1 / 3) * 255),
  };
}

export function hexToHsl(hex: string): HSL | null {
  const rgb = hexToRgb(hex);
  if (!rgb) return null;
  return rgbToHsl(rgb);
}

function linearizeChannel(value: number): number {
  const channel = value / 255;
  return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
}

export function getRelativeLuminance(hex: string): number | null {
  const rgb = hexToRgb(hex);

  if (!rgb) return null;

  const r = linearizeChannel(rgb.r);
  const g = linearizeChannel(rgb.g);
  const b = linearizeChannel(rgb.b);

  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function getLightness(hex: string): number | null {
  const hsl = hexToHsl(hex);
  return hsl ? hsl.l : null;
}

export function getSaturation(hex: string): number | null {
  const hsl = hexToHsl(hex);
  return hsl ? hsl.s : null;
}

export function getHue(hex: string): number | null {
  const hsl = hexToHsl(hex);
  return hsl ? hsl.h : null;
}

export function isLightColor(hex: string, luminanceThreshold = 0.5): boolean {
  const luminance = getRelativeLuminance(hex);
  return luminance !== null && luminance > luminanceThreshold;
}

export function isDarkColor(hex: string, luminanceThreshold = 0.5): boolean {
  const luminance = getRelativeLuminance(hex);
  return luminance !== null && luminance <= luminanceThreshold;
}

export function isLowSaturation(
  hex: string,
  saturationThreshold = 20,
): boolean {
  const saturation = getSaturation(hex);
  return saturation !== null && saturation < saturationThreshold;
}

const toOklab = converter("oklab");

interface Oklab {
  l: number;
  a: number;
  b: number;
}

function hexToOklab(hex: string): Oklab | null {
  const normalized = normalizeHex(hex);

  if (!normalized) return null;

  const parsed = parse(normalized);

  if (!parsed) return null;

  const lab = toOklab(parsed);

  if (!lab) return null;

  return { l: lab.l, a: lab.a ?? 0, b: lab.b ?? 0 };
}

/**
 * Perceptual distance between two colors in OKLab space.
 * Returns `null` when either color is invalid.
 */
export function getColorDistance(
  colorA: string,
  colorB: string,
): number | null {
  const a = hexToOklab(colorA);
  const b = hexToOklab(colorB);

  if (!a || !b) return null;

  const dl = a.l - b.l;
  const da = a.a - b.a;
  const db = a.b - b.b;

  return Math.sqrt(dl * dl + da * da + db * db);
}

export function areColorsSimilar(
  colorA: string,
  colorB: string,
  threshold = 0.08,
): boolean {
  const distance = getColorDistance(colorA, colorB);
  return distance !== null && distance <= threshold;
}
