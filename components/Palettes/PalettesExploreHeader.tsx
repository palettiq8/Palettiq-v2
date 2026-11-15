"use client";

import { ChevronDownIcon } from "lucide-react";

import COLOR_FAMILIES from "@/lib/filters/color_families";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { HorizontalWheel } from "../HorizontalWheel";
import {
  SORT_OPTIONS,
  SortValue,
  usePalettesExploreStore,
} from "@/store/usePalettesExploreStore";

export default function PalettesExploreHeader() {
  const appliedFilters = usePalettesExploreStore(
    (state) => state.appliedFilters,
  );
  const toggleAndApplyFilter = usePalettesExploreStore(
    (state) => state.toggleAndApplyFilter,
  );

  const sortBy = usePalettesExploreStore((state) => state.sortBy);
  const setSortBy = usePalettesExploreStore((state) => state.setSortBy);

  const current = SORT_OPTIONS.find((option) => option.value === sortBy);

  return (
    <div className="w-full flex items-center justify-between gap-4 px-6">
      <HorizontalWheel>
        {COLOR_FAMILIES.map((family) => {
          const isActive = appliedFilters.color_families.includes(family.name);

          return (
            <Button
              key={family.name}
              variant={isActive ? "secondary" : "outline"}
              aria-pressed={isActive}
              className="shrink-0"
              onClick={() =>
                toggleAndApplyFilter("color_families", family.name)
              }
            >
              <span
                className="size-3 rounded-full ring-1 ring-foreground/25"
                style={{ backgroundColor: family.hex }}
              />
              {family.name}
            </Button>
          );
        })}
      </HorizontalWheel>

      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button variant="outline" className="shrink-0">
              {current?.label ?? "All"}
              <ChevronDownIcon />
            </Button>
          }
        />

        <DropdownMenuContent align="end" className="w-52">
          <DropdownMenuGroup>
            <DropdownMenuLabel>Sort by</DropdownMenuLabel>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup
            value={sortBy}
            onValueChange={(value) => setSortBy(value as SortValue)}
          >
            {SORT_OPTIONS.map(({ value, label, icon: Icon }) => (
              <DropdownMenuRadioItem key={value} value={value}>
                <Icon />
                {label}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
