const BRIGHTNESS_LEVELS = [
  "Very Dark",
  "Dark",
  "Medium",
  "Light",
  "Very Light",
] as const;

export type BrightnessLevel = (typeof BRIGHTNESS_LEVELS)[number];

export default BRIGHTNESS_LEVELS;
