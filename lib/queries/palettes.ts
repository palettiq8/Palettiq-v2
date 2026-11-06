import { createClient } from "@/lib/supabase/client";
import type { SortValue } from "@/store/usePalettesExploreStore";

type PaletteQueryFilters = Record<string, string[]>;

interface FetchPalettesParams {
  filters: PaletteQueryFilters;
  sortBy: SortValue;
  page: number;
  pageSize: number;
}

export async function fetchPalettes({
  filters,
  sortBy,
  page,
  pageSize,
}: FetchPalettesParams) {
  const supabase = createClient();

  const { data: matchedPalettes, error: filterError } = await supabase.rpc(
    "get_filtered_palettes",
    {
      p_filters: filters,
      p_sort_by: sortBy,
      p_page: page,
      p_page_size: pageSize,
    },
  );

  if (filterError) throw new Error(filterError.message);

  const results = matchedPalettes ?? [];
  const totalCount = results[0]?.total_count ?? 0;
  const paletteIds = results.map(({ palette_id }) => palette_id);

  if (paletteIds.length === 0) {
    return { palettes: [], totalCount };
  }

  const { data, error } = await supabase
    .from("palettes")
    .select(
      `
      *,
      identity:palette_identities(*),
      colors:palette_colors(*),
      stats:palette_stats(*)
    `,
    )
    .in("id", paletteIds)
    .eq("status", "published");

  if (error) throw new Error(error.message);

  // Preserve ordering returned by RPC.
  const paletteMap = new Map(
    (data ?? []).map((palette) => [palette.id, palette]),
  );

  const palettes = paletteIds
    .map((id) => paletteMap.get(id))
    .filter((palette) => palette !== undefined);

  return { palettes, totalCount };
}
