import { createClient } from "@/lib/supabase/client";
import type { SortValue } from "@/store/usePalettesExploreStore";

type PaletteQueryFilters = Record<string, string[]>;

interface FetchPalettesParams {
  filters: PaletteQueryFilters;
  sortBy: SortValue;
  search: string;
  page: number;
  pageSize: number;
}

export async function fetchPalettes({
  filters,
  sortBy,
  search,
  page,
  pageSize,
}: FetchPalettesParams) {
  const supabase = createClient();

  const rpcStart = performance.now();

  const { data: matchedPalettes, error: filterError } = await supabase.rpc(
    "get_filtered_palettes",
    {
      p_filters: filters,
      p_sort_by: sortBy,
      p_search: search,
      p_page: page,
      p_page_size: pageSize,
    },
  );

  console.log(
    `[Palettiq] RPC: ${(performance.now() - rpcStart).toFixed(2)}ms`,
  );

  if (filterError) throw new Error(filterError.message);

  const results = matchedPalettes ?? [];
  const totalCount = results[0]?.total_count ?? 0;
  const paletteIds = results.map(({ palette_id }) => palette_id);

  if (paletteIds.length === 0) {
    return { palettes: [], totalCount };
  }

  const fetchStart = performance.now();

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

  console.log(
    `[Palettiq] Full palette fetch: ${(performance.now() - fetchStart).toFixed(2)}ms`,
  );

  if (error) throw new Error(error.message);

  const paletteMap = new Map(
    (data ?? []).map((palette) => [palette.id, palette]),
  );

  const palettes = paletteIds
    .map((id) => paletteMap.get(id))
    .filter(
      (palette): palette is NonNullable<typeof palette> =>
        palette !== undefined,
    );

  return { palettes, totalCount };
}
