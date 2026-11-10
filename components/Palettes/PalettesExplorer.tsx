"use client";

import { useEffect, useRef, useState } from "react";
import { usePalettes } from "@/hooks/queries/usePalettes";
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyMedia,
} from "../ui/empty";
import { PaletteIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  usePalettesExploreStore,
  type PaletteFilters,
  type SortValue,
} from "@/store/usePalettesExploreStore";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  parsePaletteExploreUrl,
  serializePaletteExploreUrl,
} from "@/lib/utils/palette-explore-url";

type PaginationItem = number | "ellipsis";

function getPaginationItems(
  currentPage: number,
  totalPages: number,
): PaginationItem[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const pages = [
    ...new Set([1, totalPages, currentPage - 1, currentPage, currentPage + 1]),
  ]
    .filter((page) => page >= 1 && page <= totalPages)
    .sort((a, b) => a - b);

  const items: PaginationItem[] = [];

  pages.forEach((page, index) => {
    if (index > 0 && page - pages[index - 1] > 1) {
      items.push("ellipsis");
    }

    items.push(page);
  });

  return items;
}

export default function PalettesExplorer() {
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

    return () => {
      window.removeEventListener("popstate", restoreFromUrl);
    };
  }, [setExploreStateFromUrl]);

  // useEffect(() => {
  //   setPage(1);
  // }, [appliedFilters, sortBy, debouncedSearch]);

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

    if (queryChanged) {
      setPage(1);
    }

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

  const pageSize = 30;

  const { data, isPending, isFetching, isError, error } = usePalettes({
    filters: appliedFilters,
    sortBy,
    search: debouncedSearch,
    page,
    pageSize,
  });

  const palettes = data?.palettes ?? [];
  const totalCount = data?.totalCount ?? 0;

  const totalPages = Math.ceil(totalCount / pageSize);

  const paginationItems = getPaginationItems(page, totalPages);

  const handlePageChange = (nextPage: number) => {
    if (nextPage < 1 || nextPage > totalPages || nextPage === page) {
      return;
    }

    setPage(nextPage);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (isPending || isFetching) {
    return (
      <div className="grid w-full grid-cols-1 gap-3 p-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 9 }).map((_, index) => (
          <Skeleton key={index} className="h-50 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-full p-6">
        <p className="text-destructive">
          Failed to load palettes: {error.message}
        </p>
      </div>
    );
  }

  if (palettes.length === 0) {
    return (
      <div className="grid w-full place-content-center p-6">
        <Empty className="border border-dashed">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <PaletteIcon />
            </EmptyMedia>
            <EmptyTitle>No palettes found</EmptyTitle>
            <EmptyDescription>
              Adjust your search or filters to find palettes that match your
              taste.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      </div>
    );
  }

  return (
    <div className="w-full p-6">
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {palettes.map((palette) => (
          <div
            key={palette.id}
            className="overflow-hidden rounded-xl border bg-card"
          >
            <div className="flex h-40">
              {palette.colors.map((color) => (
                <div
                  key={color.id}
                  className="h-full flex-1"
                  style={{
                    backgroundColor: color.hex ?? "transparent",
                  }}
                  title={color.hex ?? "Unknown color"}
                />
              ))}
            </div>

            <div className="p-4">
              <h3 className="font-semibold">{palette.identity?.name}</h3>

              <p className="mt-1 text-sm text-muted-foreground">
                {palette.identity?.short_description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="mt-8 flex flex-col items-center gap-3">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  aria-disabled={page === 1}
                  tabIndex={page === 1 ? -1 : 0}
                  className={
                    page === 1
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                  onClick={(event) => {
                    event.preventDefault();
                    handlePageChange(page - 1);
                  }}
                />
              </PaginationItem>

              {paginationItems.map((item, index) => (
                <PaginationItem key={`${item}-${index}`}>
                  {item === "ellipsis" ? (
                    <PaginationEllipsis />
                  ) : (
                    <PaginationLink
                      href="#"
                      isActive={page === item}
                      onClick={(event) => {
                        event.preventDefault();
                        handlePageChange(item);
                      }}
                    >
                      {item}
                    </PaginationLink>
                  )}
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  href="#"
                  aria-disabled={page === totalPages}
                  tabIndex={page === totalPages ? -1 : 0}
                  className={
                    page === totalPages
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                  onClick={(event) => {
                    event.preventDefault();
                    handlePageChange(page + 1);
                  }}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>

          <p className="text-xs text-muted-foreground">
            Showing {(page - 1) * pageSize + 1}–
            {Math.min(page * pageSize, totalCount)} of {totalCount} palettes
          </p>
        </div>
      )}
    </div>
  );
}
