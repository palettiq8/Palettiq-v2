
"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";

import { createClient } from "@/lib/supabase/client";
import { favoritePaletteQueryKey } from "@/hooks/queries/usePaletteFavorites";
import { normalSavedPaletteQueryKey } from "@/hooks/queries/usePaletteSaves";

interface QueryProviderProps {
  children: React.ReactNode;
}

export default function QueryProvider({ children }: QueryProviderProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5,
            refetchOnWindowFocus: false,
            retry: 1,
          },
        },
      }),
  );

  useEffect(() => {
    const supabase = createClient();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") {
        void queryClient.cancelQueries({
          queryKey: favoritePaletteQueryKey,
        });

        void queryClient.cancelQueries({
          queryKey: normalSavedPaletteQueryKey,
        });

        queryClient.setQueryData(favoritePaletteQueryKey, []);
        queryClient.setQueryData(normalSavedPaletteQueryKey, []);
      }

      if (event === "SIGNED_IN") {
        void queryClient.invalidateQueries({
          queryKey: favoritePaletteQueryKey,
        });

        void queryClient.invalidateQueries({
          queryKey: normalSavedPaletteQueryKey,
        });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [queryClient]);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
