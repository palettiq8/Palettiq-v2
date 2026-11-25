const HARMONIES = [
  "Monochromatic",
  "Analogous",
  "Complementary",
  "Split Complementary",
  "Double Split Complementary",
  "Triadic",
  "Tetradic",
  "Achromatic",
] as const;

export type Harmony = (typeof HARMONIES)[number];

export default HARMONIES;