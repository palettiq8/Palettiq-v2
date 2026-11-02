import { create } from "zustand";

import BRIGHTNESS_LEVELS from "@/lib/filters/brightness_levels";
import COLOR_FAMILIES from "@/lib/filters/color_families";
import CONTRAST_LEVELS from "@/lib/filters/contrast_levels";
import EMOTIONS from "@/lib/filters/emotions";
import ERAS from "@/lib/filters/eras";
import HARMONIES from "@/lib/filters/harmonies";
import INDUSTRIES from "@/lib/filters/industries";
import MODES from "@/lib/filters/modes";
import MOODS from "@/lib/filters/moods";
import PSYCHOLOGIES from "@/lib/filters/psychologies";
import SATURATION_LEVELS from "@/lib/filters/saturation_levels";
import SEASONS from "@/lib/filters/seasons";
import STYLES from "@/lib/filters/styles";
import TEMPERATURES from "@/lib/filters/temperatures";
import THEMES from "@/lib/filters/themes";
import TONES from "@/lib/filters/tones";
import USE_CASES from "@/lib/filters/use_cases";

export const PALETTE_FILTER_GROUPS = [
  {
    label: "Color Characteristics",
    categories: [
      { key: "color_families", label: "Color Families", options: COLOR_FAMILIES.map((item) => item.name) },
      { key: "modes", label: "Modes", options: MODES },
      { key: "harmonies", label: "Color Harmonies", options: HARMONIES },
      { key: "temperatures", label: "Temperatures", options: TEMPERATURES },
      { key: "tones", label: "Tones", options: TONES },
      { key: "brightness_levels", label: "Brightness", options: BRIGHTNESS_LEVELS },
      { key: "saturation_levels", label: "Saturation", options: SATURATION_LEVELS },
      { key: "contrast_levels", label: "Contrast", options: CONTRAST_LEVELS },
    ],
  },
  {
    label: "Design Context",
    categories: [
      { key: "industries", label: "Industries", options: INDUSTRIES },
      { key: "use_cases", label: "Use Cases", options: USE_CASES },
    ],
  },
  {
    label: "Creative Direction",
    categories: [
      { key: "moods", label: "Moods", options: MOODS },
      { key: "emotions", label: "Emotions", options: EMOTIONS },
      { key: "psychologies", label: "Psychologies", options: PSYCHOLOGIES },
      { key: "styles", label: "Styles", options: STYLES },
      { key: "themes", label: "Themes", options: THEMES },
    ],
  },
  {
    label: "Time & Inspiration",
    categories: [
      { key: "seasons", label: "Seasons", options: SEASONS },
      { key: "eras", label: "Eras", options: ERAS },
    ],
  },
] as const;

export type PaletteFilterKey =
  (typeof PALETTE_FILTER_GROUPS)[number]["categories"][number]["key"];

export type PaletteFilters = Record<PaletteFilterKey, string[]>;

const INITIAL_FILTERS: PaletteFilters = {
  color_families: [],
  modes: [],
  harmonies: [],
  temperatures: [],
  tones: [],
  brightness_levels: [],
  saturation_levels: [],
  contrast_levels: [],
  industries: [],
  use_cases: [],
  moods: [],
  emotions: [],
  psychologies: [],
  styles: [],
  themes: [],
  seasons: [],
  eras: [],
};

interface PalettesExploreState {
  filters: PaletteFilters;
  toggleFilter: (key: PaletteFilterKey, value: string) => void;
  clearFilters: () => void;
  getActiveFilterCount: () => number;
}

export const usePalettesExploreStore = create<PalettesExploreState>(
  (set, get) => ({
    filters: INITIAL_FILTERS,

    toggleFilter: (key, value) =>
      set((state) => {
        const selected = state.filters[key];

        return {
          filters: {
            ...state.filters,
            [key]: selected.includes(value)
              ? selected.filter((item) => item !== value)
              : [...selected, value],
          },
        };
      }),

    clearFilters: () => set({ filters: INITIAL_FILTERS }),

    getActiveFilterCount: () =>
      Object.values(get().filters).reduce(
        (total, selected) => total + selected.length,
        0,
      ),
  }),
);