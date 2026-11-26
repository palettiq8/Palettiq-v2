import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  savePaletteToProjects,
  fetchNormalSavedPaletteIds,
  fetchNormalSavedPalettes,
  fetchRecentNormalSavedPalettes,
  setNormalPaletteSave,
  fetchProjectPalettes,
  removePaletteFromProject,
  deleteAllPalettesFromProject,
} from "@/lib/queries/palette-saves";

export const normalSavedPaletteQueryKey = ["normal-saved-palette-ids"];
export const savedPalettesQueryKey = ["saved-palettes"];
export const recentNormalSavedPalettesQueryKey = [
  "recent-normal-saved-palettes",
];
export const projectPalettesQueryKey = ["project-palettes"];

export function useSavePaletteToProjects() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: savePaletteToProjects,

    onSuccess: (result) => {
      if (result.addedProjectIds.length > 0) {
        return queryClient.invalidateQueries({
          queryKey: ["palettes"],
        });
      }
    },
  });
}

export function useNormalSavedPalettes() {
  return useQuery({
    queryKey: normalSavedPaletteQueryKey,
    queryFn: fetchNormalSavedPaletteIds,
    staleTime: 5 * 60 * 1000,
  });
}

export function useSavedPalettes(page: number, pageSize: number) {
  return useQuery({
    queryKey: [...savedPalettesQueryKey, page, pageSize],
    queryFn: () => fetchNormalSavedPalettes({ page, pageSize }),
    staleTime: 5 * 60 * 1000,
  });
}

export function useRecentNormalSavedPalettes() {
  return useQuery({
    queryKey: recentNormalSavedPalettesQueryKey,
    queryFn: fetchRecentNormalSavedPalettes,
    staleTime: 5 * 60 * 1000,
  });
}

export function useToggleNormalPaletteSave() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: setNormalPaletteSave,

    onMutate: async ({ paletteId, isSaved }) => {
      await queryClient.cancelQueries({
        queryKey: normalSavedPaletteQueryKey,
      });

      const previousIds = queryClient.getQueryData<number[]>(
        normalSavedPaletteQueryKey,
      );

      queryClient.setQueryData<number[]>(
        normalSavedPaletteQueryKey,
        (oldIds = []) => {
          if (isSaved) {
            return oldIds.includes(paletteId) ? oldIds : [...oldIds, paletteId];
          }

          return oldIds.filter((id) => id !== paletteId);
        },
      );

      return { previousIds };
    },

    onError: (_error, _variables, context) => {
      if (context?.previousIds !== undefined) {
        queryClient.setQueryData(
          normalSavedPaletteQueryKey,
          context.previousIds,
        );
      } else {
        queryClient.removeQueries({
          queryKey: normalSavedPaletteQueryKey,
          exact: true,
        });
      }
    },

    onSuccess: (_data, variables) => {
      const invalidations = [
        queryClient.invalidateQueries({
          queryKey: savedPalettesQueryKey,
        }),
        queryClient.invalidateQueries({
          queryKey: recentNormalSavedPalettesQueryKey,
        }),
      ];

      if (variables.isSaved) {
        invalidations.push(
          queryClient.invalidateQueries({
            queryKey: ["palettes"],
          }),
        );
      }

      return Promise.all(invalidations);
    },
  });
}

export function useProjectPalettes(
  projectId: number,
  page: number,
  pageSize: number,
) {
  return useQuery({
    queryKey: [...projectPalettesQueryKey, projectId, page, pageSize],
    queryFn: () => fetchProjectPalettes({ projectId, page, pageSize }),
    enabled: Number.isInteger(projectId) && projectId > 0,
    staleTime: 5 * 60 * 1000,
  });
}

export function useRemovePaletteFromProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: removePaletteFromProject,

    onSuccess: ({ projectId }) => {
      return queryClient.invalidateQueries({
        queryKey: [...projectPalettesQueryKey, projectId],
      });
    },
  });
}

export function useDeleteAllPalettesFromProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteAllPalettesFromProject,

    onSuccess: ({ projectId }) => {
      return queryClient.invalidateQueries({
        queryKey: [...projectPalettesQueryKey, projectId],
      });
    },
  });
}