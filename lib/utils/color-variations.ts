import { converter, formatHex, parse } from "culori";

const toOklch = converter("oklch");
const toRgb = converter("rgb");

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

function createHex(l: number, c: number, h: number): string {
  const rgb = toRgb({
    mode: "oklch",
    l: clamp(l, 0, 1),
    c: Math.max(0, c),
    h,
  });

  if (!rgb) return "#000000";

  return (
    formatHex({
      mode: "rgb",
      r: clamp(rgb.r, 0, 1),
      g: clamp(rgb.g, 0, 1),
      b: clamp(rgb.b, 0, 1),
    })?.toUpperCase() ?? "#000000"
  );
}

export interface ColorVariations {
  tints: string[];
  shades: string[];
  tones: string[];
}

export function generateColorVariations(hex: string): ColorVariations {
  const parsed = parse(hex);

  if (!parsed) {
    return {
      tints: [],
      shades: [],
      tones: [],
    };
  }

  const color = toOklch(parsed);

  if (!color) {
    return {
      tints: [],
      shades: [],
      tones: [],
    };
  }

  const { l, c, h = 0 } = color;

  const tints = Array.from({ length: 15 }, (_, index) => {
    const progress = (index + 1) / 16;
    const lightness = l + (0.98 - l) * progress;

    return createHex(lightness, c, h);
  });

  const shades = Array.from({ length: 15 }, (_, index) => {
    const progress = (index + 1) / 16;
    const lightness = l + (0.08 - l) * progress;

    return createHex(lightness, c, h);
  });

  const tones = Array.from({ length: 15 }, (_, index) => {
    const progress = (index + 1) / 16;
    const chroma = c * (1 - progress);

    return createHex(l, chroma, h);
  });

  return {
    tints,
    shades,
    tones,
  };
}
