const TEMPERATURES = ["Warm", "Cool", "Neutral"] as const;

export type Temperature = (typeof TEMPERATURES)[number];

export default TEMPERATURES;
