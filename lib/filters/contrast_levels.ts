const CONTRAST_LEVELS = [
  "Very Low",
  "Low",
  "Medium",
  "High",
  "Very High",
] as const;

export type ContrastLevel = (typeof CONTRAST_LEVELS)[number];

export default CONTRAST_LEVELS;