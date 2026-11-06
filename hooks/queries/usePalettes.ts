import { useQuery } from "@tanstack/react-query";
import { fetchPalettes } from "@/lib/queries/palettes";

type PaletteQueryFilters = Record<string, string[]>;

export function usePalettes(filters: PaletteQueryFilters = {}) {
  return useQuery({
    queryKey: ["palettes", filters],
    queryFn: () => fetchPalettes(filters),
  });
}
