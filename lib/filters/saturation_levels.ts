const SATURATION_LEVELS = [
  "Very Low",
  "Low",
  "Medium",
  "High",
  "Very High",
] as const;

export type SaturationLevel = (typeof SATURATION_LEVELS)[number];

export default SATURATION_LEVELS;