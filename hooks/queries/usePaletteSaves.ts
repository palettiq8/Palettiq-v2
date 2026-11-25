import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  savePaletteToProjects,
  fetchNormalSavedPaletteIds,
  setNormalPaletteSave,
} from "@/lib/queries/palette-saves";

export const normalSavedPaletteQueryKey = ["normal-saved-palette-ids"];

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
      if (variables.isSaved) {
        return queryClient.invalidateQueries({
          queryKey: ["palettes"],
        });
      }
    },
  });
}
