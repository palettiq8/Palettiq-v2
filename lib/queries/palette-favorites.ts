import { createClient } from "@/lib/supabase/client";

interface SetPaletteFavoriteParams {
  paletteId: number;
  isFavorite: boolean;
}

export async function fetchFavoritePaletteIds() {
  const supabase = createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) throw new Error(authError.message);

  if (!user) return [];

  const { data, error } = await supabase
    .from("palette_favorites")
    .select("palette_id")
    .eq("user_id", user.id);

  if (error) throw new Error(error.message);

  return (data ?? []).map((favorite) => favorite.palette_id);
}

export async function fetchRecentFavoritePalettes() {
  const supabase = createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) throw new Error(authError.message);
  if (!user) return [];

  const { data, error } = await supabase
    .from("palette_favorites")
    .select(
      `
      created_at,
      palette:palettes(
        *,
        identity:palette_identities(*),
        colors:palette_colors(*),
        stats:palette_stats(*)
      )
    `,
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(4);

  if (error) throw new Error(error.message);

  return (data ?? []).flatMap(({ palette }) => {
    if (!palette || palette.status !== "published") return [];

    return [
      {
        ...palette,
        colors: [...(palette.colors ?? [])].sort(
          (a, b) => (a.position ?? 0) - (b.position ?? 0),
        ),
      },
    ];
  });
}

export async function setPaletteFavorite({
  paletteId,
  isFavorite,
}: SetPaletteFavoriteParams) {
  const supabase = createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) throw new Error(authError.message);

  if (!user) {
    throw new Error("You must be logged in to manage favorites.");
  }

  if (isFavorite) {
    const { error } = await supabase.from("palette_favorites").insert({
      user_id: user.id,
      palette_id: paletteId,
    });

    if (error && error.code !== "23505") {
      throw new Error(error.message);
    }
  } else {
    const { error } = await supabase
      .from("palette_favorites")
      .delete()
      .eq("user_id", user.id)
      .eq("palette_id", paletteId);

    if (error) throw new Error(error.message);
  }

  return { paletteId, isFavorite };
}

interface FetchFavoritePalettesParams {
  page: number;
  pageSize: number;
}

export async function fetchFavoritePalettes({
  page,
  pageSize,
}: FetchFavoritePalettesParams) {
  const supabase = createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) throw new Error(authError.message);

  if (!user) {
    return { palettes: [], totalCount: 0 };
  }

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const {
    data: favoriteItems,
    count,
    error: favoritesError,
  } = await supabase
    .from("palette_favorites")
    .select("palette_id, created_at", { count: "exact" })
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .order("palette_id", { ascending: false })
    .range(from, to);

  if (favoritesError) throw new Error(favoritesError.message);

  const totalCount = count ?? 0;
  const paletteIds = (favoriteItems ?? []).map((item) => item.palette_id);

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

  if (error) {
    throw new Error(`Failed to fetch favorite palettes: ${error.message}`);
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

  const palettes = paletteIds
    .map((id) => paletteMap.get(id))
    .filter((palette) => palette !== undefined);

  return { palettes, totalCount };
}
