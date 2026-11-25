"use client";

import { Suspense } from "react";
import { usePathname } from "next/navigation";

import { Search } from "lucide-react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";

import PaletteFiltersDrawer from "@/components/Palettes/PaletteFiltersDrawer";
import { usePalettesExploreStore } from "@/store/usePalettesExploreStore";

function HeaderSearchContent() {
  const pathname = usePathname();

  const isHiddenPage =
    /^\/palettes\/\d+-[^/]+\/?$/.test(pathname) || pathname.startsWith("/a/");

  const searchQuery = usePalettesExploreStore((state) => state.searchQuery);
  const setSearchQuery = usePalettesExploreStore(
    (state) => state.setSearchQuery,
  );

  if (isHiddenPage) return null;

  return (
    <InputGroup className="w-xs">
      <InputGroupInput
        placeholder="Search palettes by name..."
        value={searchQuery}
        onChange={(event) => setSearchQuery(event.target.value)}
      />
      <InputGroupAddon>
        <Search />
      </InputGroupAddon>
    </InputGroup>
  );
}

function HeaderFiltersContent() {
  const pathname = usePathname();

  const isHiddenPage =
    /^\/palettes\/\d+-[^/]+\/?$/.test(pathname) || pathname.startsWith("/a/");

  if (isHiddenPage) return null;

  return <PaletteFiltersDrawer />;
}

export function HeaderSearch() {
  return (
    <Suspense fallback={null}>
      <HeaderSearchContent />
    </Suspense>
  );
}

export function HeaderFilters() {
  return (
    <Suspense fallback={null}>
      <HeaderFiltersContent />
    </Suspense>
  );
}
