import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createProject,
  deleteProject,
  fetchProjects,
  updateProject,
} from "@/lib/queries/projects";

export function useProjects(search = "", enabled = true) {
  const normalizedSearch = search.trim();

  return useQuery({
    queryKey: ["projects", normalizedSearch],
    queryFn: () => fetchProjects({ search: normalizedSearch }),
    enabled,
  });
}

export function useCreateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createProject,

    onSuccess: () => {
      return queryClient.invalidateQueries({
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
      return queryClient.invalidateQueries({
        queryKey: ["projects"],
      });
    },
  });
}

export function useUpdateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProject,

    onSuccess: () => {
      return queryClient.invalidateQueries({
        queryKey: ["projects"],
      });
    },
  });
}
