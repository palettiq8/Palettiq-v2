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
import {
  Activity,
  Bookmark,
  Clipboard,
  Columns3,
  Copy,
  DownloadIcon,
  EllipsisVertical,
  Eye,
  FolderPlus,
  Maximize2,
  PaletteIcon,
  Star,
  TextSearch,
  View,
} from "lucide-react";
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
import { formatRelativeTime } from "@/lib/utils";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Badge } from "../ui/badge";
import {
  useNormalSavedPalettes,
  useToggleNormalPaletteSave,
} from "@/hooks/queries/usePaletteSaves";
import AddToProjectsDialog from "../Projects/AddToProjectsDialog";
import {
  useFavoritePalettes,
  useSetPaletteFavorite,
} from "@/hooks/queries/usePaletteFavorites";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { useAuthDialogStore } from "@/store/useAuthDialogStore";

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

  const { data: normalSavedPaletteIds = [] } = useNormalSavedPalettes();
  const toggleNormalSaveMutation = useToggleNormalPaletteSave();

  const { data: favoritePaletteIds = [] } = useFavoritePalettes();

  const favoriteMutation = useSetPaletteFavorite();

  const [addToProjectsOpen, setAddToProjectsOpen] = useState(false);
  const [selectedPaletteId, setSelectedPaletteId] = useState<number | null>(
    null,
  );
  const [savingPaletteId, setSavingPaletteId] = useState<number | null>(null);
  const [favoritingPaletteId, setFavoritingPaletteId] = useState<number | null>(
    null,
  );
  const openAuthDialog = useAuthDialogStore((state) => state.openAuthDialog);

  const checkAuthentication = async () => {
    const supabase = createClient();

    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (error) {
      toast.error(error.message);
      return false;
    }

    if (!session) {
      openAuthDialog();
      return false;
    }

    return true;
  };

  const handleToggleNormalSave = async (paletteId: number) => {
    const isAuthenticated = await checkAuthentication();

    if (!isAuthenticated) return;

    const isSaved = normalSavedPaletteIds.includes(paletteId);

    setSavingPaletteId(paletteId);

    toggleNormalSaveMutation.mutate(
      {
        paletteId,
        isSaved: !isSaved,
      },
      {
        onSuccess: () => {
          toast.success(
            isSaved
              ? "Palette removed from saved."
              : "Palette saved successfully.",
          );
        },
        onError: (error) => {
          toast.error(error.message || "Failed to update saved palette.");
        },
        onSettled: () => {
          setSavingPaletteId(null);
        },
      },
    );
  };

  const handleToggleFavorite = async (paletteId: number) => {
    const isAuthenticated = await checkAuthentication();

    if (!isAuthenticated) return;

    const isFavorite = favoritePaletteIds.includes(paletteId);

    setFavoritingPaletteId(paletteId);

    favoriteMutation.mutate(
      {
        paletteId,
        isFavorite: !isFavorite,
      },
      {
        onSuccess: () => {
          toast.success(
            isFavorite ? "Removed from favorites." : "Added to favorites.",
          );
        },
        onError: (error) => {
          toast.error(error.message || "Failed to update favorites.");
        },
        onSettled: () => {
          setFavoritingPaletteId(null);
        },
      },
    );
  };

  const handleAddToProjects = async (paletteId: number) => {
    if (!(await checkAuthentication())) return;

    setSelectedPaletteId(paletteId);
    setAddToProjectsOpen(true);
  };

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
        {palettes.map((palette) => {
          const isFavorite = favoritePaletteIds.includes(palette.id);
          const isSaved = normalSavedPaletteIds.includes(palette.id);
          return (
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
                <div className="w-full flex items-center justify-between">
                  <h3 className="font-semibold">{palette.identity?.name}</h3>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      aria-label={
                        isFavorite
                          ? "Remove from favorites"
                          : "Add to favorites"
                      }
                      aria-pressed={isFavorite}
                      onClick={() => handleToggleFavorite(palette.id)}
                      disabled={favoritingPaletteId === palette.id}
                    >
                      <Star
                        className={
                          isFavorite
                            ? "fill-yellow-500 text-yellow-500"
                            : "text-foreground"
                        }
                      />
                    </Button>

                    <Button
                      variant="outline"
                      size="icon"
                      aria-label={isSaved ? "Unsave palette" : "Save palette"}
                      aria-pressed={isSaved}
                      disabled={savingPaletteId === palette.id}
                      onClick={() => handleToggleNormalSave(palette.id)}
                    >
                      <Bookmark
                        className={
                          isSaved
                            ? "fill-current text-foreground"
                            : "text-foreground"
                        }
                      />
                    </Button>
                    <Button variant={"outline"} size={"icon"}>
                      <DownloadIcon />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        render={
                          <Button
                            variant="outline"
                            size="icon"
                            aria-label="More palette options"
                          >
                            <EllipsisVertical />
                          </Button>
                        }
                      />

                      <DropdownMenuContent>
                        <DropdownMenuGroup>
                          <DropdownMenuItem>
                            <Copy />
                            Copy
                          </DropdownMenuItem>

                          <DropdownMenuSub>
                            <DropdownMenuSubTrigger>
                              <Clipboard />
                              Copy as
                            </DropdownMenuSubTrigger>

                            <DropdownMenuSubContent>
                              <DropdownMenuItem>HEX</DropdownMenuItem>
                              <DropdownMenuItem>
                                HEX (Without #)
                              </DropdownMenuItem>
                              <DropdownMenuItem>RGB</DropdownMenuItem>
                              <DropdownMenuItem>RGBA</DropdownMenuItem>
                              <DropdownMenuItem>HSL</DropdownMenuItem>
                              <DropdownMenuItem>HSLA</DropdownMenuItem>
                              <DropdownMenuItem>HSV / HSB</DropdownMenuItem>
                              <DropdownMenuItem>CMYK</DropdownMenuItem>
                              <DropdownMenuItem>LAB</DropdownMenuItem>
                              <DropdownMenuItem>LCH</DropdownMenuItem>
                              <DropdownMenuItem>OKLAB</DropdownMenuItem>
                              <DropdownMenuItem>OKLCH</DropdownMenuItem>

                              <DropdownMenuSeparator />

                              <DropdownMenuItem>CSS Variables</DropdownMenuItem>
                              <DropdownMenuItem>
                                SCSS Variables
                              </DropdownMenuItem>
                              <DropdownMenuItem>Tailwind CSS</DropdownMenuItem>
                              <DropdownMenuItem>JSON</DropdownMenuItem>
                              <DropdownMenuItem>
                                JavaScript Array
                              </DropdownMenuItem>
                              <DropdownMenuItem>Swift</DropdownMenuItem>
                              <DropdownMenuItem>Android XML</DropdownMenuItem>
                            </DropdownMenuSubContent>
                          </DropdownMenuSub>

                          <DropdownMenuItem
                            onClick={() => handleAddToProjects(palette.id)}
                          >
                            <FolderPlus />
                            Add to projects
                          </DropdownMenuItem>

                          <DropdownMenuItem>
                            <Eye />
                            Quick view
                          </DropdownMenuItem>

                          <DropdownMenuItem>
                            <View />
                            View details
                          </DropdownMenuItem>

                          <DropdownMenuItem>
                            <Maximize2 />
                            Open on screen
                          </DropdownMenuItem>

                          <DropdownMenuItem>
                            <Columns3 />
                            View mode
                          </DropdownMenuItem>

                          <DropdownMenuItem>
                            <Activity />
                            Visualize palette
                          </DropdownMenuItem>

                          <DropdownMenuItem>
                            <TextSearch />
                            Explore similar
                          </DropdownMenuItem>
                        </DropdownMenuGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                <p className="mt-1 text-sm text-muted-foreground">
                  {palette.identity?.short_description}
                </p>
                <div className="w-full flex items-center justify-between mt-3">
                  <span className="truncate text-xs text-muted-foreground">
                    {formatRelativeTime(palette.created_at)}
                  </span>
                  <Badge variant={"secondary"}>{palette.creation_method}</Badge>
                </div>
              </div>
            </div>
          );
        })}
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

      {selectedPaletteId !== null && (
        <AddToProjectsDialog
          paletteId={selectedPaletteId}
          open={addToProjectsOpen}
          onOpenChange={(open) => {
            setAddToProjectsOpen(open);

            if (!open) {
              setSelectedPaletteId(null);
            }
          }}
          onSaved={() => {
            toast.success("Palette added to your projects.");
          }}
        />
      )}
    </div>
  );
}
