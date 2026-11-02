const TONES = [
  "Earth Tones",
  "Jewel Tones",
  "Dusty",
  "Faded",
  "Chalky",
  "Creamy",
  "Smoky",
  "Inky",
  "Sunbaked",
  "Frosted",
  "Sorbet",
  "Warm Neutrals",
  "Cool Neutrals",
] as const;

export type Tone = (typeof TONES)[number];

export default TONES;
