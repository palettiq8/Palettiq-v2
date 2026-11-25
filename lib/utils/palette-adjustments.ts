import { converter, formatHex, parse } from "culori";

export type AdjustmentKey =
  | "hue"
  | "saturation"
  | "brightness"
  | "temperature"
  | "contrast"
  | "vibrance"
  | "tint";

export type Adjustments = Record<AdjustmentKey, number>;

export const DEFAULT_ADJUSTMENTS: Adjustments = {
  hue: 0,
  saturation: 0,
  brightness: 0,
  temperature: 0,
  contrast: 0,
  vibrance: 0,
  tint: 0,
};

const toOklch = converter("oklch");
const toRgb = converter("rgb");

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

function shiftHue(hue: number, amount: number) {
  return (hue + amount + 360) % 360;
}

export function adjustColor(hex: string, adjustments: Adjustments): string {
  const parsed = parse(hex);

  if (!parsed) return hex;

  const original = toOklch(parsed);

  if (!original) return hex;

  let l = original.l;
  let c = original.c;
  let h = original.h ?? 0;

  // Hue
  h = shiftHue(h, adjustments.hue);

  // Saturation
  c *= 1 + adjustments.saturation / 100;

  // Vibrance: stronger effect on less saturated colors
  const vibranceStrength = adjustments.vibrance / 100;
  const vibranceFactor = 1 + vibranceStrength * (1 - clamp(c / 0.4, 0, 1));

  c *= vibranceFactor;

  // Temperature: warm toward yellow, cool toward blue
  h = shiftHue(h, adjustments.temperature * 0.25);

  // Tint: magenta vs green
  h = shiftHue(h, adjustments.tint * 0.2);

  // Brightness
  l += adjustments.brightness / 200;

  // Contrast around perceptual midpoint
  const contrast = 1 + adjustments.contrast / 100;
  l = (l - 0.5) * contrast + 0.5;

  l = clamp(l, 0, 1);
  c = clamp(c, 0, 0.4);

  const adjusted = toRgb({
    mode: "oklch",
    l,
    c,
    h,
  });

  if (!adjusted) return hex;

  return formatHex({
    mode: "rgb",
    r: clamp(adjusted.r, 0, 1),
    g: clamp(adjusted.g, 0, 1),
    b: clamp(adjusted.b, 0, 1),
  });
}
