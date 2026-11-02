const ERAS = [
  "Ancient",
  "Medieval",
  "Renaissance",
  "Baroque",
  "Victorian",
  "Edwardian",
  "1920s",
  "1930s",
  "1940s",
  "1950s",
  "1960s",
  "1970s",
  "1980s",
  "1990s",
  "2000s",
  "2010s",
  "2020s",
] as const;

export type Era = (typeof ERAS)[number];

export default ERAS;
