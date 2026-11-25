import { converter, differenceCiede2000, formatHex } from "culori";

export type ColorBlindnessType =
  | "protanopia"
  | "deuteranopia"
  | "tritanopia"
  | "achromatopsia";

export interface PaletteColorInput {
  id: number;
  name: string | null;
  hex: string | null;
  role?: string | null;
}

export interface ColorConfusion {
  type: ColorBlindnessType;
  colorA: PaletteColorInput & { hex: string };
  colorB: PaletteColorInput & { hex: string };
  simulatedHexA: string;
  simulatedHexB: string;
  difference: number;
  severity: "very-close" | "close";
}

export const colorBlindnessTypes: {
  key: ColorBlindnessType;
  label: string;
  description: string;
}[] = [
  {
    key: "protanopia",
    label: "Protanopia",
    description: "Red color vision deficiency",
  },
  {
    key: "deuteranopia",
    label: "Deuteranopia",
    description: "Green color vision deficiency",
  },
  {
    key: "tritanopia",
    label: "Tritanopia",
    description: "Blue color vision deficiency",
  },
  {
    key: "achromatopsia",
    label: "Achromatopsia",
    description: "Complete color blindness",
  },
];

// Machado et al. (2009), severity 100%.
// Matrices operate on linear-light sRGB.
const simulationMatrices = {
  protanopia: [
    [0.152286, 1.052583, -0.204868],
    [0.114503, 0.786281, 0.099216],
    [-0.003882, -0.048116, 1.051998],
  ],
  deuteranopia: [
    [0.367322, 0.860646, -0.227968],
    [0.280085, 0.672501, 0.047413],
    [-0.01182, 0.04294, 0.968881],
  ],
  tritanopia: [
    [1.255528, -0.076749, -0.178779],
    [-0.078411, 0.930809, 0.147602],
    [0.004733, 0.691367, 0.3039],
  ],
} as const;

const toLinearRgb = converter("lrgb");
const differenceCIEDE2000 = differenceCiede2000();

function clamp(value: number) {
  return Math.min(1, Math.max(0, value));
}

export function simulateColorBlindness(
  hex: string,
  type: ColorBlindnessType,
): string {
  const color = toLinearRgb(hex);

  if (!color || color.mode !== "lrgb") {
    return hex.toUpperCase();
  }

  const { r, g, b } = color;

  let simulated: number[];

  if (type === "achromatopsia") {
    // Relative luminance in linear-light sRGB.
    const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;

    simulated = [luminance, luminance, luminance];
  } else {
    const matrix = simulationMatrices[type];

    simulated = matrix.map((row) => row[0] * r + row[1] * g + row[2] * b);
  }

  return (
    formatHex({
      mode: "lrgb",
      r: clamp(simulated[0]),
      g: clamp(simulated[1]),
      b: clamp(simulated[2]),
    })?.toUpperCase() ?? hex.toUpperCase()
  );
}

/**
 * CIEDE2000 perceptual color difference.
 * Returns null for invalid colors.
 */
export function getColorDifference(
  colorA: string,
  colorB: string,
): number | null {
  const difference = differenceCIEDE2000(colorA, colorB);

  if (!Number.isFinite(difference)) {
    return null;
  }

  return Math.round(difference * 100) / 100;
}

/**
 * Detects potentially similar color pairs after CVD simulation.
 *
 * These thresholds are product heuristics, not clinical
 * or WCAG accessibility pass/fail criteria.
 */
export function getPaletteColorConfusions(
  colors: PaletteColorInput[],
  threshold = 5,
): ColorConfusion[] {
  const validColors = colors.filter(
    (color): color is PaletteColorInput & { hex: string } => Boolean(color.hex),
  );

  const confusions: ColorConfusion[] = [];

  for (const type of colorBlindnessTypes) {
    const simulatedColors = validColors.map((color) => ({
      ...color,
      simulatedHex: simulateColorBlindness(color.hex, type.key),
    }));

    for (let i = 0; i < simulatedColors.length; i++) {
      for (let j = i + 1; j < simulatedColors.length; j++) {
        const first = simulatedColors[i];
        const second = simulatedColors[j];

        const difference = getColorDifference(
          first.simulatedHex,
          second.simulatedHex,
        );

        if (difference === null || difference >= threshold) {
          continue;
        }

        confusions.push({
          type: type.key,
          colorA: first,
          colorB: second,
          simulatedHexA: first.simulatedHex,
          simulatedHexB: second.simulatedHex,
          difference,
          severity: difference < 2 ? "very-close" : "close",
        });
      }
    }
  }

  return confusions.sort((a, b) => a.difference - b.difference);
}
