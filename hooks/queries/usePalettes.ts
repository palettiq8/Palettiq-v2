import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { fetchPalettes } from "@/lib/queries/palettes";
import type { SortValue } from "@/store/usePalettesExploreStore";

type PaletteQueryFilters = Record<string, string[]>;

interface UsePalettesParams {
  filters: PaletteQueryFilters;
  sortBy: SortValue;
  page: number;
  pageSize?: number;
}

export function usePalettes({
  filters,
  sortBy,
  page,
  pageSize = 12,
}: UsePalettesParams) {
  return useQuery({
    queryKey: ["palettes", filters, sortBy, page, pageSize],
    queryFn: () =>
      fetchPalettes({
        filters,
        sortBy,
        page,
        pageSize,
      }),
    placeholderData: keepPreviousData,
  });
}
