import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  fetchFavoritePaletteIds,
  setPaletteFavorite,
} from "@/lib/queries/palette-favorites";

export const favoritePaletteQueryKey = ["favorite-palette-ids"];

export function useFavoritePalettes() {
  return useQuery({
    queryKey: favoritePaletteQueryKey,
    queryFn: fetchFavoritePaletteIds,
    staleTime: 5 * 60 * 1000,
  });
}

export function useSetPaletteFavorite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: setPaletteFavorite,

    onMutate: async ({ paletteId, isFavorite }) => {
      await queryClient.cancelQueries({
        queryKey: favoritePaletteQueryKey,
      });

      const previousIds = queryClient.getQueryData<number[]>(
        favoritePaletteQueryKey,
      );

      const previousIsFavorite = previousIds?.includes(paletteId) ?? false;

      queryClient.setQueryData<number[]>(
        favoritePaletteQueryKey,
        (oldIds = []) => {
          if (isFavorite) {
            return oldIds.includes(paletteId) ? oldIds : [...oldIds, paletteId];
          }

          return oldIds.filter((id) => id !== paletteId);
        },
      );

      return {
        paletteId,
        previousIsFavorite,
        hadPreviousCache: previousIds !== undefined,
      };
    },

    onError: (_error, _variables, context) => {
      if (!context) return;

      if (!context.hadPreviousCache) {
        queryClient.setQueryData<number[]>(
          favoritePaletteQueryKey,
          (oldIds = []) => oldIds.filter((id) => id !== context.paletteId),
        );
        return;
      }

      queryClient.setQueryData<number[]>(
        favoritePaletteQueryKey,
        (oldIds = []) => {
          if (context.previousIsFavorite) {
            return oldIds.includes(context.paletteId)
              ? oldIds
              : [...oldIds, context.paletteId];
          }

          return oldIds.filter((id) => id !== context.paletteId);
        },
      );
    },
  });
}
