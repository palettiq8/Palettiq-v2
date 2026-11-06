import { createClient } from "@/lib/supabase/client";

type PaletteQueryFilters = Record<string, string[]>;

export async function fetchPalettes(filters: PaletteQueryFilters = {}) {
  const supabase = createClient();

  // First, get matching palette IDs from the RPC.
  const { data: matchedPalettes, error: filterError } = await supabase.rpc(
    "get_filtered_palettes",
    {
      p_filters: filters,
    },
  );

  if (filterError) {
    throw new Error(filterError.message);
  }

  const paletteIds: number[] = matchedPalettes.map(
    ({ id }: { id: number }) => id,
  );
  if (paletteIds.length === 0) {
    return [];
  }

  // Then fetch complete palette data with relationships.
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
    .eq("status", "published")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}
