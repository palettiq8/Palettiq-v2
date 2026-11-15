"use client";

import { useEffect, useRef, useState } from "react";
import {
  usePalettesExploreStore,
  type PaletteFilters,
  type SortValue,
} from "@/store/usePalettesExploreStore";
import {
  parsePaletteExploreUrl,
  serializePaletteExploreUrl,
} from "@/lib/utils/palette-explore-url";

export function usePaletteExploreUrl() {
  const [page, setPage] = useState(1);
  const [isUrlInitialized, setIsUrlInitialized] = useState(false);

  const appliedFilters = usePalettesExploreStore(
    (state) => state.appliedFilters,
  );
  const sortBy = usePalettesExploreStore((state) => state.sortBy);
  const searchQuery = usePalettesExploreStore((state) => state.searchQuery);
  const setExploreStateFromUrl = usePalettesExploreStore(
    (state) => state.setExploreStateFromUrl,
  );

  const [debouncedSearch, setDebouncedSearch] = useState(searchQuery);

  const previousQueryStateRef = useRef<{
    filters: PaletteFilters;
    sortBy: SortValue;
    searchQuery: string;
  } | null>(null);

  useEffect(() => {
    const restoreFromUrl = () => {
      const params = new URLSearchParams(window.location.search);
      const urlState = parsePaletteExploreUrl(params);

      previousQueryStateRef.current = {
        filters: urlState.filters,
        sortBy: urlState.sortBy,
        searchQuery: urlState.searchQuery,
      };

      setExploreStateFromUrl({
        filters: urlState.filters,
        sortBy: urlState.sortBy,
        searchQuery: urlState.searchQuery,
      });

      setDebouncedSearch(urlState.searchQuery);
      setPage(urlState.page);
    };

    restoreFromUrl();
    setIsUrlInitialized(true);
    window.addEventListener("popstate", restoreFromUrl);

    return () => window.removeEventListener("popstate", restoreFromUrl);
  }, [setExploreStateFromUrl]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(searchQuery.trim());
    }, 300);

    return () => clearTimeout(timeout);
  }, [searchQuery]);

  useEffect(() => {
    if (!isUrlInitialized) return;

    const previous = previousQueryStateRef.current;
    const filtersChanged = previous
      ? JSON.stringify(previous.filters) !== JSON.stringify(appliedFilters)
      : false;
    const sortChanged = previous ? previous.sortBy !== sortBy : false;
    const searchChanged = previous
      ? previous.searchQuery !== debouncedSearch
      : false;

    const queryChanged = filtersChanged || sortChanged || searchChanged;
    const nextPage = queryChanged ? 1 : page;

    if (queryChanged) setPage(1);

    const queryString = serializePaletteExploreUrl({
      filters: appliedFilters,
      sortBy,
      searchQuery: debouncedSearch,
      page: nextPage,
    });

    const nextUrl = `${window.location.pathname}${
      queryString ? `?${queryString}` : ""
    }${window.location.hash}`;

    const currentUrl =
      window.location.pathname + window.location.search + window.location.hash;

    if (nextUrl !== currentUrl) {
      const isSearchOnlyChange =
        searchChanged && !filtersChanged && !sortChanged;

      if (isSearchOnlyChange) {
        window.history.replaceState(null, "", nextUrl);
      } else {
        window.history.pushState(null, "", nextUrl);
      }
    }

    previousQueryStateRef.current = {
      filters: appliedFilters,
      sortBy,
      searchQuery: debouncedSearch,
    };
  }, [isUrlInitialized, appliedFilters, sortBy, debouncedSearch, page]);

  const handlePageChange = (nextPage: number, totalPages: number) => {
    if (nextPage < 1 || nextPage > totalPages || nextPage === page) return;

    setPage(nextPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return {
    page,
    debouncedSearch,
    appliedFilters,
    sortBy,
    handlePageChange,
  };
}
