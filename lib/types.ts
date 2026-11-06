import {
  ColorRole,
  PaletteActivityType,
  PaletteCreationMethod,
  PaletteStatus,
} from "./constants";

export interface ColorFamily {
  name: string;
  hex: string;
}

export interface PaletteIdentity {
  id: number;
  palette_id: number;
  name: string;
  slug: string;
  short_description: string;
  long_description: string;
  tagline: string;
  story: string;
  author: string | null;
  best_for: string;
}

export interface PaletteColor {
  id: number;
  palette_id: number;
  position: number;
  hex: string;
  name: string;
  role: ColorRole;
  color_families: ColorFamily[];
  created_at: string;
  updated_at: string;
}

export interface PaletteStats {
  id: number;
  palette_id: number;
  saves: number;
  favorites: number;
  downloads: number;
}

export interface PaletteActivity {
  id: number;
  palette_id: number;
  activity_type: PaletteActivityType;
  created_at: string;
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

export interface Palette {
  id: number;
  status: PaletteStatus;
  is_free: boolean;
  created_by: string | null;
  creation_method: PaletteCreationMethod;
  inspiration_sources: string | null;
  filters: PaletteFilters;
  created_at: string;
  updated_at: string;
  identity: PaletteIdentity;
  colors: PaletteColor[];
  stats: PaletteStats;
}
