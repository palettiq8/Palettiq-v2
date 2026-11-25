import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { fetchPalettes } from "@/lib/queries/palettes";
import type { SortValue } from "@/store/usePalettesExploreStore";

type PaletteQueryFilters = Record<string, string[]>;

interface UsePalettesParams {
  filters: PaletteQueryFilters;
  sortBy: SortValue;
  search: string;
  page: number;
  pageSize?: number;
}

export function usePalettes({
  filters,
  sortBy,
  search,
  page,
  pageSize = 12,
}: UsePalettesParams) {
  return useQuery({
    queryKey: ["palettes", filters, sortBy, search, page, pageSize],
    queryFn: () =>
      fetchPalettes({
        filters,
        sortBy,
        search,
        page,
        pageSize,
      }),
    placeholderData: keepPreviousData,
  });
}
