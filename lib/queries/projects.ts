import { createClient } from "@/lib/supabase/client";

interface FetchProjectsParams {
  search?: string;
}

interface CreateProjectParams {
  name: string;
  description?: string;
}

export async function fetchProjects({ search = "" }: FetchProjectsParams = {}) {
  const supabase = createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) throw new Error(authError.message);
  if (!user) throw new Error("You must be logged in to view projects.");

  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("user_id", user.id)
    .ilike("name", `%${search.trim()}%`)
    .order("updated_at", { ascending: false });

  if (error) throw new Error(error.message);

  return data;
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
  if (!user) throw new Error("You must be logged in to create a project.");

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
  if (!user) throw new Error("You must be logged in to delete a project.");

  const { error } = await supabase
    .from("projects")
    .delete()
    .eq("id", projectId)
    .eq("user_id", user.id);

  if (error) throw new Error(error.message);
}
