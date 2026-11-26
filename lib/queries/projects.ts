import { createClient } from "@/lib/supabase/client";

interface FetchProjectsParams {
  search?: string;
}

interface CreateProjectParams {
  name: string;
  description?: string;
}

interface UpdateProjectParams {
  projectId: number;
  name: string;
  description?: string;
}

function escapeLikePattern(value: string) {
  return value.replace(/[\\%_]/g, "\\$&");
}

export async function fetchProjects({ search = "" }: FetchProjectsParams = {}) {
  const supabase = createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) throw new Error(authError.message);

  if (!user) {
    throw new Error("You must be logged in to view projects.");
  }

  const normalizedSearch = search.trim();

  let query = supabase
    .from("projects")
    .select(
      `
      *,
      palette_saves(count)
    `,
    )
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false });

  if (normalizedSearch) {
    query = query.ilike("name", `%${escapeLikePattern(normalizedSearch)}%`);
  }

  const { data, error } = await query;

  if (error) throw new Error(error.message);

  return (data ?? []).map((project) => ({
  ...project,
  paletteCount: project.palette_saves?.[0]?.count ?? 0,
}));
}

export async function createProject({
  name,
  description,
}: CreateProjectParams) {
  const supabase = createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) throw new Error(authError.message);

  if (!user) {
    throw new Error("You must be logged in to create a project.");
  }

  const trimmedName = name.trim();

  if (!trimmedName) {
    throw new Error("Project name is required.");
  }

  const { data, error } = await supabase
    .from("projects")
    .insert({
      user_id: user.id,
      name: trimmedName,
      description: description?.trim() || null,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);

  return data;
}

export async function deleteProject(projectId: number) {
  const supabase = createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) throw new Error(authError.message);

  if (!user) {
    throw new Error("You must be logged in to delete a project.");
  }

  const { error } = await supabase
    .from("projects")
    .delete()
    .eq("id", projectId)
    .eq("user_id", user.id);

  if (error) throw new Error(error.message);
}

export async function updateProject({
  projectId,
  name,
  description,
}: UpdateProjectParams) {
  const supabase = createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) throw new Error(authError.message);

  if (!user) {
    throw new Error("You must be logged in to update a project.");
  }

  const trimmedName = name.trim();

  if (!trimmedName) {
    throw new Error("Project name is required.");
  }

  const { data, error } = await supabase
    .from("projects")
    .update({
      name: trimmedName,
      description: description?.trim() || null,
    })
    .eq("id", projectId)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) throw new Error(error.message);

  return data;
}
