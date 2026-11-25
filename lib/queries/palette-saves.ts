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
  if (!user) throw new Error("You must be logged in to save palettes.");

  const uniqueProjectIds = [...new Set(projectIds)];

  if (uniqueProjectIds.length === 0) {
    throw new Error("Please select at least one project.");
  }

  // Find projects where this palette already exists.
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

  // Fetch names of existing projects.
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

  // Prepare only new project saves.
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

  return data.map((item) => item.palette_id);
}

interface SetNormalPaletteSaveParams {
  paletteId: number;
  isSaved: boolean;
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
  if (!user) throw new Error("You must be logged in to save palettes.");

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
