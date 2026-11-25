const MOODS = [
  "Calm",
  "Peaceful",
  "Relaxing",
  "Cozy",
  "Cheerful",
  "Playful",
  "Energetic",
  "Dramatic",
  "Mysterious",
  "Moody",
  "Elegant",
  "Sophisticated",
  "Luxurious",
  "Romantic",
  "Dreamy",
  "Nostalgic",
  "Whimsical",
  "Uplifting",
  "Confident",
  "Powerful",
  "Serious",
  "Edgy",
  "Festive",
  "Gentle",
  "Soft",
] as const;

export type Mood = (typeof MOODS)[number];

export default MOODS;
