import { createClient } from "@/lib/supabase/client";

interface SavePaletteToProjectsParams {
  paletteId: number;
  projectIds: number[];
}

interface ExistingProject {
  id: number;
  name: string;
}

interface SavePaletteToProjectsResult {
  addedProjectIds: number[];
  alreadyAddedProjects: ExistingProject[];
}

interface SetNormalPaletteSaveParams {
  paletteId: number;
  isSaved: boolean;
}

export async function savePaletteToProjects({
  paletteId,
  projectIds,
}: SavePaletteToProjectsParams): Promise<SavePaletteToProjectsResult> {
  const supabase = createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) throw new Error(authError.message);

  if (!user) {
    throw new Error("You must be logged in to save palettes.");
  }

  const uniqueProjectIds = [...new Set(projectIds)];

  if (uniqueProjectIds.length === 0) {
    throw new Error("Please select at least one project.");
  }

  const { data: existingSaves, error: checkError } = await supabase
    .from("palette_saves")
    .select("project_id")
    .eq("user_id", user.id)
    .eq("palette_id", paletteId)
    .in("project_id", uniqueProjectIds);

  if (checkError) throw new Error(checkError.message);

  const existingProjectIds = new Set(
    (existingSaves ?? [])
      .map((save) => save.project_id)
      .filter((id): id is number => id !== null),
  );

  let alreadyAddedProjects: ExistingProject[] = [];

  if (existingProjectIds.size > 0) {
    const { data: projects, error: projectsError } = await supabase
      .from("projects")
      .select("id, name")
      .eq("user_id", user.id)
      .in("id", [...existingProjectIds]);

    if (projectsError) throw new Error(projectsError.message);

    alreadyAddedProjects = projects ?? [];
  }

  const newProjectIds = uniqueProjectIds.filter(
    (id) => !existingProjectIds.has(id),
  );

  if (newProjectIds.length > 0) {
    const newSaves = newProjectIds.map((projectId) => ({
      user_id: user.id,
      palette_id: paletteId,
      project_id: projectId,
    }));

    const { error: insertError } = await supabase
      .from("palette_saves")
      .insert(newSaves);

    if (insertError) throw new Error(insertError.message);
  }

  return {
    addedProjectIds: newProjectIds,
    alreadyAddedProjects,
  };
}

export async function fetchNormalSavedPaletteIds() {
  const supabase = createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) throw new Error(authError.message);

  if (!user) return [];

  const { data, error } = await supabase
    .from("palette_saves")
    .select("palette_id")
    .eq("user_id", user.id)
    .is("project_id", null);

  if (error) throw new Error(error.message);

  return (data ?? []).map((item) => item.palette_id);
}

export async function fetchRecentNormalSavedPalettes() {
  const supabase = createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) throw new Error(authError.message);
  if (!user) return [];

  const { data, error } = await supabase
    .from("palette_saves")
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
    .is("project_id", null)
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

export async function setNormalPaletteSave({
  paletteId,
  isSaved,
}: SetNormalPaletteSaveParams) {
  const supabase = createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) throw new Error(authError.message);

  if (!user) {
    throw new Error("You must be logged in to save palettes.");
  }

  if (isSaved) {
    const { error } = await supabase.from("palette_saves").insert({
      user_id: user.id,
      palette_id: paletteId,
      project_id: null,
    });

    if (error && error.code !== "23505") {
      throw new Error(error.message);
    }
  } else {
    const { error } = await supabase
      .from("palette_saves")
      .delete()
      .eq("user_id", user.id)
      .eq("palette_id", paletteId)
      .is("project_id", null);

    if (error) throw new Error(error.message);
  }

  return { paletteId, isSaved };
}

interface FetchNormalSavedPalettesParams {
  page: number;
  pageSize: number;
}

export async function fetchNormalSavedPalettes({
  page,
  pageSize,
}: FetchNormalSavedPalettesParams) {
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
    data: savedItems,
    count,
    error: savesError,
  } = await supabase
    .from("palette_saves")
    .select("palette_id, created_at", { count: "exact" })
    .eq("user_id", user.id)
    .is("project_id", null)
    .order("created_at", { ascending: false })
    .order("palette_id", { ascending: false })
    .range(from, to);

  if (savesError) throw new Error(savesError.message);

  const totalCount = count ?? 0;
  const paletteIds = (savedItems ?? []).map((item) => item.palette_id);

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
    throw new Error(`Failed to fetch saved palettes: ${error.message}`);
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

interface FetchProjectPalettesParams {
  projectId: number;
  page: number;
  pageSize: number;
}

export async function fetchProjectPalettes({
  projectId,
  page,
  pageSize,
}: FetchProjectPalettesParams) {
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
    data: savedItems,
    count,
    error: savesError,
  } = await supabase
    .from("palette_saves")
    .select("palette_id, created_at", { count: "exact" })
    .eq("user_id", user.id)
    .eq("project_id", projectId)
    .order("created_at", { ascending: false })
    .order("palette_id", { ascending: false })
    .range(from, to);

  if (savesError) throw new Error(savesError.message);

  const totalCount = count ?? 0;
  const paletteIds = (savedItems ?? []).map((item) => item.palette_id);

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
    throw new Error(`Failed to fetch project palettes: ${error.message}`);
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

interface RemovePaletteFromProjectParams {
  paletteId: number;
  projectId: number;
}

export async function removePaletteFromProject({
  paletteId,
  projectId,
}: RemovePaletteFromProjectParams) {
  const supabase = createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) throw new Error(authError.message);

  if (!user) {
    throw new Error("You must be logged in to remove palettes.");
  }

  const { error } = await supabase
    .from("palette_saves")
    .delete()
    .eq("user_id", user.id)
    .eq("palette_id", paletteId)
    .eq("project_id", projectId);

  if (error) {
    throw new Error(`Failed to remove palette from project: ${error.message}`);
  }

  return { paletteId, projectId };
}


export async function deleteAllPalettesFromProject(projectId: number) {
  const supabase = createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) throw new Error(authError.message);

  if (!user) {
    throw new Error("You must be logged in to delete project palettes.");
  }

  const { error } = await supabase
    .from("palette_saves")
    .delete()
    .eq("user_id", user.id)
    .eq("project_id", projectId);

  if (error) {
    throw new Error(`Failed to delete project palettes: ${error.message}`);
  }

  return { projectId };
}