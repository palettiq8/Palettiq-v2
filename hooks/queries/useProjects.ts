import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createProject,
  deleteProject,
  fetchProjects,
} from "@/lib/queries/projects";

import type { Project } from "@/lib/types";

export function useProjects(search = "", enabled = true) {
  return useQuery({
    queryKey: ["projects", search],
    queryFn: () => fetchProjects({ search }),
    enabled,
  });
}

export function useCreateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createProject,
    onSuccess: (newProject) => {
      queryClient.setQueryData<Project[]>(
        ["projects", ""],
        (oldProjects = []) => [newProject, ...oldProjects],
      );

      queryClient.invalidateQueries({
        queryKey: ["projects"],
      });
    },
  });
}

export function useDeleteProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteProject,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["projects"],
      });
    },
  });
}