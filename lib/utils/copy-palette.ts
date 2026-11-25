import { converter, parse } from "culori";

import type { DownloadablePalette } from "@/lib/types";

export type PaletteCopyFormat =
  | "json"
  | "hex"
  | "hex-plain"
  | "rgb"
  | "rgba"
  | "hsl"
  | "hsla"
  | "hsv"
  | "cmyk"
  | "lab"
  | "lch"
  | "oklab"
  | "oklch"
  | "css"
  | "scss"
  | "tailwind"
  | "javascript"
  | "swift"
  | "android-xml";

type RGB = {
  r: number;
  g: number;
  b: number;
};

type HSL = {
  h?: number;
  s: number;
  l: number;
};

type HSV = {
  h?: number;
  s: number;
  v: number;
};

type Lab = {
  l: number;
  a: number;
  b: number;
};

type Lch = {
  l: number;
  c: number;
  h?: number;
};

type Oklab = {
  l: number;
  a: number;
  b: number;
};

type Oklch = {
  l: number;
  c: number;
  h?: number;
};

const toRGB = converter("rgb");
const toHSL = converter("hsl");
const toHSV = converter("hsv");
const toLab = converter("lab");
const toLch = converter("lch");
const toOklab = converter("oklab");
const toOklch = converter("oklch");

function round(value: number, precision = 2): string {
  return Number(value.toFixed(precision)).toString();
}

function normalizeHex(hex: string): string | null {
  const value = hex.trim().replace(/^#/, "");

  if (/^[0-9a-fA-F]{3}$/.test(value)) {
    return `#${value
      .split("")
      .map((char) => char + char)
      .join("")
      .toUpperCase()}`;
  }

  if (/^[0-9a-fA-F]{6}$/.test(value)) {
    return `#${value.toUpperCase()}`;
  }

  return null;
}

function getColor(hex: string) {
  const normalized = normalizeHex(hex);

  if (!normalized) {
    throw new Error(`Invalid HEX color: ${hex}`);
  }

  const color = parse(normalized);

  if (!color) {
    throw new Error(`Unable to parse color: ${hex}`);
  }

  return color;
}

function getRGB(hex: string): RGB {
  const color = toRGB(getColor(hex)) as RGB | undefined;

  if (!color) {
    throw new Error(`Unable to convert ${hex} to RGB.`);
  }

  return color;
}

function formatHEX(hex: string): string {
  const normalized = normalizeHex(hex);

  if (!normalized) {
    throw new Error(`Invalid HEX color: ${hex}`);
  }

  return normalized;
}

function formatRGB(hex: string): string {
  const { r, g, b } = getRGB(hex);

  return `rgb(${[r, g, b].map((value) => Math.round(value * 255)).join(", ")})`;
}

function formatRGBA(hex: string): string {
  const { r, g, b } = getRGB(hex);

  return `rgba(${[
    Math.round(r * 255),
    Math.round(g * 255),
    Math.round(b * 255),
    1,
  ].join(", ")})`;
}

function formatHSL(hex: string): string {
  const color = toHSL(getColor(hex)) as HSL | undefined;

  if (!color) throw new Error(`Unable to convert ${hex} to HSL.`);

  return `hsl(${round(color.h ?? 0)} ${round(color.s * 100)}% ${round(
    color.l * 100,
  )}%)`;
}

function formatHSLA(hex: string): string {
  const color = toHSL(getColor(hex)) as HSL | undefined;

  if (!color) throw new Error(`Unable to convert ${hex} to HSLA.`);

  return `hsla(${round(color.h ?? 0)}, ${round(
    color.s * 100,
  )}%, ${round(color.l * 100)}%, 1)`;
}

function formatHSV(hex: string): string {
  const color = toHSV(getColor(hex)) as HSV | undefined;

  if (!color) throw new Error(`Unable to convert ${hex} to HSV.`);

  return `hsv(${round(color.h ?? 0)} ${round(color.s * 100)}% ${round(
    color.v * 100,
  )}%)`;
}

function formatCMYK(hex: string): string {
  const { r, g, b } = getRGB(hex);

  const k = 1 - Math.max(r, g, b);

  const c = k === 1 ? 0 : (1 - r - k) / (1 - k);
  const m = k === 1 ? 0 : (1 - g - k) / (1 - k);
  const y = k === 1 ? 0 : (1 - b - k) / (1 - k);

  return `cmyk(${[c, m, y, k]
    .map((value) => `${round(value * 100)}%`)
    .join(", ")})`;
}

function formatLAB(hex: string): string {
  const color = toLab(getColor(hex)) as Lab | undefined;

  if (!color) throw new Error(`Unable to convert ${hex} to LAB.`);

  return `lab(${round(color.l)}% ${round(color.a)} ${round(color.b)})`;
}

function formatLCH(hex: string): string {
  const color = toLch(getColor(hex)) as Lch | undefined;

  if (!color) throw new Error(`Unable to convert ${hex} to LCH.`);

  return `lch(${round(color.l)}% ${round(color.c)} ${round(color.h ?? 0)})`;
}

function formatOKLAB(hex: string): string {
  const color = toOklab(getColor(hex)) as Oklab | undefined;

  if (!color) throw new Error(`Unable to convert ${hex} to OKLAB.`);

  return `oklab(${round(color.l)} ${round(color.a)} ${round(color.b)})`;
}

function formatOKLCH(hex: string): string {
  const color = toOklch(getColor(hex)) as Oklch | undefined;

  if (!color) throw new Error(`Unable to convert ${hex} to OKLCH.`);

  return `oklch(${round(color.l)} ${round(color.c)} ${round(color.h ?? 0)})`;
}

function getPaletteColors(palette: DownloadablePalette): string[] {
  const colors = [...palette.colors]
    .sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
    .map((color) => color.hex)
    .filter((hex): hex is string => hex !== null)
    .map((hex) => normalizeHex(hex))
    .filter((hex): hex is string => hex !== null);

  if (colors.length === 0) {
    throw new Error("This palette has no valid colors to copy.");
  }

  return colors;
}

function getPaletteName(palette: DownloadablePalette): string {
  return palette.identity?.name ?? "Untitled Palette";
}

function formatJSON(palette: DownloadablePalette, colors: string[]): string {
  return JSON.stringify(
    {
      name: getPaletteName(palette),
      colors,
    },
    null,
    2,
  );
}

function formatCSS(colors: string[]): string {
  return `:root {\n${colors
    .map((color, index) => `  --palette-${index + 1}: ${color};`)
    .join("\n")}\n}`;
}

function formatSCSS(colors: string[]): string {
  return colors
    .map((color, index) => `$palette-${index + 1}: ${color};`)
    .join("\n");
}

function formatTailwind(colors: string[]): string {
  return `{
  theme: {
    extend: {
      colors: {
        palette: {
${colors
  .map((color, index) => `          ${index + 1}: "${color}",`)
  .join("\n")}
        },
      },
    },
  },
}`;
}

function formatJavaScript(colors: string[]): string {
  return `const palette = ${JSON.stringify(colors, null, 2)};`;
}

function formatSwift(colors: string[]): string {
  const swiftColors = colors.map((hex) => {
    const { r, g, b } = getRGB(hex);

    return `  Color(red: ${round(r)}, green: ${round(g)}, blue: ${round(b)})`;
  });

  return `import SwiftUI

let palette: [Color] = [
${swiftColors.join(",\n")}
]`;
}

function formatAndroidXML(colors: string[]): string {
  const xmlColors = colors
    .map(
      (color, index) =>
        `    <color name="palette_${index + 1}">${color}</color>`,
    )
    .join("\n");

  return `<resources>
${xmlColors}
</resources>`;
}

export function getPaletteCopyContent(
  palette: DownloadablePalette,
  format: PaletteCopyFormat = "json",
): string {
  const colors = getPaletteColors(palette);

  switch (format) {
    case "json":
      return formatJSON(palette, colors);

    case "hex":
      return colors.join("\n");

    case "hex-plain":
      return colors.map((color) => color.slice(1)).join("\n");

    case "rgb":
      return colors.map(formatRGB).join("\n");

    case "rgba":
      return colors.map(formatRGBA).join("\n");

    case "hsl":
      return colors.map(formatHSL).join("\n");

    case "hsla":
      return colors.map(formatHSLA).join("\n");

    case "hsv":
      return colors.map(formatHSV).join("\n");

    case "cmyk":
      return colors.map(formatCMYK).join("\n");

    case "lab":
      return colors.map(formatLAB).join("\n");

    case "lch":
      return colors.map(formatLCH).join("\n");

    case "oklab":
      return colors.map(formatOKLAB).join("\n");

    case "oklch":
      return colors.map(formatOKLCH).join("\n");

    case "css":
      return formatCSS(colors);

    case "scss":
      return formatSCSS(colors);

    case "tailwind":
      return formatTailwind(colors);

    case "javascript":
      return formatJavaScript(colors);

    case "swift":
      return formatSwift(colors);

    case "android-xml":
      return formatAndroidXML(colors);

    default:
      return formatJSON(palette, colors);
  }
}

export async function copyPalette(
  palette: DownloadablePalette,
  format: PaletteCopyFormat = "json",
): Promise<void> {
  const content = getPaletteCopyContent(palette, format);

  await navigator.clipboard.writeText(content);
}

// Backward compatibility with the previous function.
export async function copyPaletteAsJson(
  palette: DownloadablePalette,
): Promise<void> {
  await copyPalette(palette, "json");
}
