
import type { Database } from "./database.types";

// =========================================
// Database Types
// =========================================

type Tables = Database["public"]["Tables"];

export type PaletteIdentity = Tables["palette_identities"]["Row"];
export type PaletteColor = Tables["palette_colors"]["Row"];
export type PaletteStats = Tables["palette_stats"]["Row"];
export type PaletteActivity = Tables["palette_activities"]["Row"];
export type Project = Tables["projects"]["Row"];

export type PaletteCreationMethod =
  Database["public"]["Enums"]["palettecreatedby"];

export type PaletteStatus = Database["public"]["Enums"]["palettestatus"];
export type ColorRole = Database["public"]["Enums"]["colorrole"];
export type PaletteActivityType =
  Database["public"]["Enums"]["paletteactivitytype"];

// =========================================
// Custom Types
// =========================================

export interface ColorFamily {
  name: string;
  hex: string;
}

export type StringFilterKey =
  | "industries"
  | "moods"
  | "emotions"
  | "psychologies"
  | "modes"
  | "use_cases"
  | "styles"
  | "themes"
  | "seasons"
  | "eras"
  | "harmonies"
  | "temperatures"
  | "tones"
  | "brightness_levels"
  | "saturation_levels"
  | "contrast_levels";

export type PaletteFilters = Record<StringFilterKey, string[]> & {
  color_families: ColorFamily[];
};

// =========================================
// Application Types
// =========================================

export type Palette = Pick<
  Tables["palettes"]["Row"],
  | "id"
  | "status"
  | "is_free"
  | "created_by"
  | "creation_method"
  | "inspiration_sources"
  | "filters"
  | "created_at"
  | "updated_at"
> & {
  identity: PaletteIdentity | null;
  colors: PaletteColor[];
  stats: PaletteStats | null;
};

// =========================================
// Download Types
// =========================================

export type DownloadablePalette = Pick<Palette, "id"> & {
  identity: Pick<PaletteIdentity, "name" | "tagline"> | null;
  colors: Pick<PaletteColor, "position" | "hex">[];
};
