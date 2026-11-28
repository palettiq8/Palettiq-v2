/**
 * Visualizer-specific types.
 *
 * These are intentionally kept separate from the database `Palette` type.
 * Visualizer state is temporary and never written back to the palette record.
 */

export type ColorRole =
  | "primary"
  | "secondary"
  | "accent"
  | "background"
  | "surface"
  | "text"
  | "muted";

export const COLOR_ROLES: readonly ColorRole[] = [
  "primary",
  "secondary",
  "accent",
  "background",
  "surface",
  "text",
  "muted",
];

export const COLOR_ROLE_LABELS: Record<ColorRole, string> = {
  primary: "Primary",
  secondary: "Secondary",
  accent: "Accent",
  background: "Background",
  surface: "Surface",
  text: "Text",
  muted: "Muted",
};

export type ColorMapping = Record<ColorRole, string>;

export type RoleMappingSource = "auto" | "manual";

export type RoleSources = Record<ColorRole, RoleMappingSource>;

export type TemplateType = "website" | "dashboard" | "ecommerce" | "mobile";

export type ThemeMode = "light" | "dark";

export type ViewportSize = "desktop" | "tablet" | "mobile";

export interface VisualizerMapping {
  colors: ColorMapping;
  sources: RoleSources;
}

export interface VisualizerSnapshot {
  overrides: Partial<ColorMapping>;
  template: TemplateType;
  theme: ThemeMode;
}

export interface VisualizerHistory {
  past: VisualizerSnapshot[];
  present: VisualizerSnapshot;
  future: VisualizerSnapshot[];
}

/**
 * Minimal color input accepted by the mapping engine. This keeps the engine
 * decoupled from database row shapes.
 */
export interface VisualizerColorInput {
  id: number | string;
  hex: string | null;
  name?: string | null;
}

export type MappedColorOrigin = "palette" | "derived";
