const SEASONS = ["Spring", "Summer", "Monsoon", "Autumn", "Winter"] as const;

export type Season = (typeof SEASONS)[number];

export default SEASONS;
