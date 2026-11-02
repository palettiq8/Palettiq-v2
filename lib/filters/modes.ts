const MODES = ["Light", "Dark"] as const;

export type Mode = (typeof MODES)[number];

export default MODES;
