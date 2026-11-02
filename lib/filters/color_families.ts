import { ColorFamily } from "../types";

export const COLOR_FAMILIES: ColorFamily[] = [
  { name: "Black", hex: "#000000" },
  { name: "White", hex: "#FFFFFF" },
  { name: "Gray", hex: "#808080" },
  { name: "Red", hex: "#E53935" },
  { name: "Orange", hex: "#FB8C00" },
  { name: "Yellow", hex: "#FDD835" },
  { name: "Lime", hex: "#C0CA33" },
  { name: "Green", hex: "#43A047" },
  { name: "Cyan", hex: "#00ACC1" },
  { name: "Blue", hex: "#1E88E5" },
  { name: "Indigo", hex: "#3949AB" },
  { name: "Violet", hex: "#8E24AA" },
  { name: "Purple", hex: "#6A1B9A" },
  { name: "Pink", hex: "#EC407A" },
  { name: "Brown", hex: "#795548" },
] as const;

export type Family = (typeof COLOR_FAMILIES)[number];
export type FamilyName = Family["name"];

export const COLOR_FAMILY_NAMES = COLOR_FAMILIES.map((f) => f.name) as [
  FamilyName,
  ...FamilyName[],
];

export default COLOR_FAMILIES;
