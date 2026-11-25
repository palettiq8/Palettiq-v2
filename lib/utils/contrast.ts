export interface ContrastColorInput {
  id: number;
  name: string | null;
  hex: string | null;
  role?: string | null;
}

export interface ContrastPair {
  colorA: ContrastColorInput & { hex: string };
  colorB: ContrastColorInput & { hex: string };
  ratio: number;
  normalTextAA: boolean;
  normalTextAAA: boolean;
  largeTextAA: boolean;
  largeTextAAA: boolean;
  uiComponents: boolean;
}

function getRelativeLuminance(hex: string): number | null {
  const normalized = hex.trim().replace(/^#/, "");

  if (!/^(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(normalized)) {
    return null;
  }

  const fullHex =
    normalized.length === 3
      ? normalized
          .split("")
          .map((char) => char + char)
          .join("")
      : normalized;

  const channels = [
    parseInt(fullHex.slice(0, 2), 16),
    parseInt(fullHex.slice(2, 4), 16),
    parseInt(fullHex.slice(4, 6), 16),
  ].map((value) => {
    const channel = value / 255;

    return channel <= 0.04045
      ? channel / 12.92
      : ((channel + 0.055) / 1.055) ** 2.4;
  });

  const [r, g, b] = channels;

  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function getContrastRatio(
  colorA: string,
  colorB: string,
): number | null {
  const luminanceA = getRelativeLuminance(colorA);
  const luminanceB = getRelativeLuminance(colorB);

  if (luminanceA === null || luminanceB === null) {
    return null;
  }

  const lighter = Math.max(luminanceA, luminanceB);
  const darker = Math.min(luminanceA, luminanceB);

  return Math.round(((lighter + 0.05) / (darker + 0.05)) * 100) / 100;
}

export function getPaletteContrastPairs(
  colors: ContrastColorInput[],
): ContrastPair[] {
  const validColors = colors.filter(
    (color): color is ContrastColorInput & { hex: string } =>
      typeof color.hex === "string" && getRelativeLuminance(color.hex) !== null,
  );

  const pairs: ContrastPair[] = [];

  for (let i = 0; i < validColors.length; i++) {
    for (let j = i + 1; j < validColors.length; j++) {
      const colorA = validColors[i];
      const colorB = validColors[j];

      const ratio = getContrastRatio(colorA.hex, colorB.hex);

      if (ratio === null) continue;

      pairs.push({
        colorA,
        colorB,
        ratio,
        normalTextAA: ratio >= 4.5,
        normalTextAAA: ratio >= 7,
        largeTextAA: ratio >= 3,
        largeTextAAA: ratio >= 4.5,
        uiComponents: ratio >= 3,
      });
    }
  }

  return pairs.sort((a, b) => b.ratio - a.ratio);
}
