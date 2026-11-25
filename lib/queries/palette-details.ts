import "server-only";

import { createClient } from "@/lib/supabase/server";

export async function fetchPaletteById(id: number) {
  const supabase = await createClient();

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
    .eq("id", id)
    .eq("status", "published")
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to fetch palette: ${error.message}`);
  }

  if (!data) return null;

  return {
    ...data,
    colors: [...(data.colors ?? [])].sort(
      (a, b) => (a.position ?? 0) - (b.position ?? 0),
    ),
  };
}

export async function fetchSimilarPalettes(paletteId: number) {
  const supabase = await createClient();

  const { data: matches, error: matchError } = await supabase.rpc(
    "get_similar_palettes",
    {
      p_palette_id: paletteId,
      p_limit: 15,
    },
  );

  if (matchError) {
    throw new Error(`Failed to fetch similar palettes: ${matchError.message}`);
  }

  if (!matches?.length) return [];

  const rankedIds = matches.map((match) => match.palette_id);

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
    .in("id", rankedIds)
    .eq("status", "published");

  if (error) {
    throw new Error(
      `Failed to fetch similar palette details: ${error.message}`,
    );
  }

  const paletteMap = new Map(
    (data ?? []).map((palette) => [
      palette.id,
      {
        ...palette,
        colors: [...(palette.colors ?? [])].sort(
          (a, b) => (a.position ?? 0) - (b.position ?? 0),
        ),
      },
    ]),
  );

  return rankedIds
    .map((id) => paletteMap.get(id))
    .filter((palette) => palette !== undefined);
}

export type PaletteDetails = NonNullable<
  Awaited<ReturnType<typeof fetchPaletteById>>
>;
