import { createClient } from "@/lib/supabase/client";

export async function fetchPalettes() {
  const supabase = createClient();

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
    .eq("status", "published")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}
