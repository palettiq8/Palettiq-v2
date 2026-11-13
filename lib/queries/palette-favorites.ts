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

  return data.map((favorite) => favorite.palette_id);
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
