import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { fetchPalettes } from "@/lib/queries/palettes";

type PaletteQueryFilters = Record<string, string[]>;

interface UsePalettesParams {
  filters: PaletteQueryFilters;
  page: number;
  pageSize?: number;
}

export function usePalettes({
  filters,
  page,
  pageSize = 12,
}: UsePalettesParams) {
  return useQuery({
    queryKey: ["palettes", filters, page, pageSize],
    queryFn: () =>
      fetchPalettes({
        filters,
        page,
        pageSize,
      }),
    placeholderData: keepPreviousData,
  });
}
