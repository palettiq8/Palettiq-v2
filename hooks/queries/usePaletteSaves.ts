import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  savePaletteToProjects,
  fetchNormalSavedPaletteIds,
  setNormalPaletteSave,
} from "@/lib/queries/palette-saves";

export const normalSavedPaletteQueryKey = ["normal-saved-palette-ids"];

export function useSavePaletteToProjects() {
  return useMutation({
    mutationFn: savePaletteToProjects,
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
      }
    },
  });
}
