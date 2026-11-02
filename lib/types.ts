import { ColorRole, PaletteCreationMethod, PaletteStatus } from "./constants";

export interface ColorFamily {
  name: string;
  hex: string;
}

export interface PaletteColor {
  id: number;
  position: number;
  hex: string;
  name: string;
  role: ColorRole;
  color_families: ColorFamily[];
  created_at: string;
  updated_at: string;
}

export interface Palette {
  id: number;
  status: PaletteStatus;
  is_free: boolean;
  created_by: string;
  creation_method: PaletteCreationMethod;
  inspiration_sources: string;
  created_at: string;
  updated_at: string;
  identity: {
    name: string;
    slug: string;
    short_description: string;
    long_description: string;
    tagline: string;
    story: string;
    collection: string;
    author: string;
    best_for: string;
  };
  colors: PaletteColor[];
  filters: Record<
    | "industries"
    | "color_families"
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
    | "contrast_levels",
    string[]
  >;
  stats: { saves: number; favorites: number; downloads: number };
}
