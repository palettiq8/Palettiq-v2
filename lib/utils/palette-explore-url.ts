import {
  PALETTE_FILTER_GROUPS,
  SORT_OPTIONS,
  createEmptyPaletteFilters,
  type PaletteFilters,
  type PaletteFilterKey,
  type SortValue,
} from "@/store/usePalettesExploreStore";

const FILTER_KEYS = PALETTE_FILTER_GROUPS.flatMap((group) =>
  group.categories.map((category) => category.key),
) as PaletteFilterKey[];

const FILTER_OPTIONS: Record<PaletteFilterKey, readonly string[]> =
  Object.fromEntries(
    PALETTE_FILTER_GROUPS.reduce(
      (categories, group) => [...categories, ...group.categories],
      [] as Array<{
        key: PaletteFilterKey;
        options: readonly string[];
      }>,
    ).map((category) => [category.key, category.options]),
  ) as Record<PaletteFilterKey, readonly string[]>;

const DEFAULT_SORT: SortValue = "all";

export interface PaletteExploreUrlState {
  filters: PaletteFilters;
  sortBy: SortValue;
  searchQuery: string;
  page: number;
}

function isValidSort(value: string): value is SortValue {
  return SORT_OPTIONS.some((option) => option.value === value);
}

function getValidFilterValues(
  key: PaletteFilterKey,
  values: string[],
): string[] {
  const options = FILTER_OPTIONS[key];

  return options.filter((option) => values.includes(option));
}

export function parsePaletteExploreUrl(
  params: URLSearchParams,
): PaletteExploreUrlState {
  const filters = createEmptyPaletteFilters();

  for (const key of FILTER_KEYS) {
    const values = params.getAll(key);

    filters[key] = getValidFilterValues(key, [...new Set(values)]);
  }

  const requestedSort = params.get("sort") ?? DEFAULT_SORT;
  const sortBy = isValidSort(requestedSort) ? requestedSort : DEFAULT_SORT;

  const searchQuery = (params.get("search") ?? "").trim();

  const requestedPage = Number(params.get("page"));
  const page =
    Number.isSafeInteger(requestedPage) && requestedPage > 0
      ? requestedPage
      : 1;

  return {
    filters,
    sortBy,
    searchQuery,
    page,
  };
}

export function serializePaletteExploreUrl(
  state: PaletteExploreUrlState,
): string {
  const params = new URLSearchParams();

  for (const key of FILTER_KEYS) {
    const values = getValidFilterValues(key, state.filters[key]);

    for (const value of values) {
      params.append(key, value);
    }
  }

  if (state.sortBy !== DEFAULT_SORT) {
    params.set("sort", state.sortBy);
  }

  const searchQuery = state.searchQuery.trim();

  if (searchQuery) {
    params.set("search", searchQuery);
  }

  if (state.page > 1) {
    params.set("page", String(state.page));
  }

  return params.toString();
}
