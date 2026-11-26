import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  fetchFavoritePaletteIds,
  fetchFavoritePalettes,
  fetchRecentFavoritePalettes,
  setPaletteFavorite,
} from "@/lib/queries/palette-favorites";

export const favoritePaletteQueryKey = ["favorite-palette-ids"];
export const favoritePalettesQueryKey = ["favorite-palettes"];
export const recentFavoritePalettesQueryKey = ["recent-favorite-palettes"];

export function useFavoritePalettes() {
  return useQuery({
    queryKey: favoritePaletteQueryKey,
    queryFn: fetchFavoritePaletteIds,
    staleTime: 5 * 60 * 1000,
  });
}

export function usePaginatedFavoritePalettes(page: number, pageSize: number) {
  return useQuery({
    queryKey: [...favoritePalettesQueryKey, page, pageSize],
    queryFn: () => fetchFavoritePalettes({ page, pageSize }),
    staleTime: 5 * 60 * 1000,
  });
}

export function useRecentFavoritePalettes() {
  return useQuery({
    queryKey: recentFavoritePalettesQueryKey,
    queryFn: fetchRecentFavoritePalettes,
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

      queryClient.setQueryData<number[]>(
        favoritePaletteQueryKey,
        (oldIds = []) => {
          if (isFavorite) {
            return oldIds.includes(paletteId) ? oldIds : [...oldIds, paletteId];
          }

          return oldIds.filter((id) => id !== paletteId);
        },
      );

      return { previousIds };
    },

    onError: (_error, _variables, context) => {
      if (context?.previousIds !== undefined) {
        queryClient.setQueryData(favoritePaletteQueryKey, context.previousIds);
      } else {
        queryClient.removeQueries({
          queryKey: favoritePaletteQueryKey,
          exact: true,
        });
      }
    },

    onSuccess: (_data, variables) => {
      const invalidations = [
        queryClient.invalidateQueries({
          queryKey: recentFavoritePalettesQueryKey,
        }),
        queryClient.invalidateQueries({
          queryKey: favoritePalettesQueryKey,
        }),
      ];

      if (variables.isFavorite) {
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
