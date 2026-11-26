"use client";

import { useMemo, useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

import { ScrollArea } from "@/components/ui/scroll-area";

import {
  usePalettesExploreStore,
  PALETTE_FILTER_GROUPS,
} from "@/store/usePalettesExploreStore";

export default function PaletteFiltersDrawer() {
  const [search, setSearch] = useState("");

  const filters = usePalettesExploreStore((state) => state.filters);
  const toggleFilter = usePalettesExploreStore((state) => state.toggleFilter);
  const clearFilters = usePalettesExploreStore((state) => state.clearFilters);
  const applyFilters = usePalettesExploreStore((state) => state.applyFilters);

  const appliedFilters = usePalettesExploreStore(
    (state) => state.appliedFilters,
  );

  const activeCount = Object.values(appliedFilters).reduce(
    (total, values) => total + values.length,
    0,
  );

  const draftFilterCount = Object.values(filters).reduce(
    (total, values) => total + values.length,
    0,
  );

  const filteredGroups = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return PALETTE_FILTER_GROUPS;

    return PALETTE_FILTER_GROUPS.map((group) => ({
      ...group,
      categories: group.categories
        .map((category) => {
          const categoryMatches = category.label.toLowerCase().includes(query);

          return {
            ...category,
            options: categoryMatches
              ? category.options
              : category.options.filter((option) =>
                  option.toLowerCase().includes(query),
                ),
          };
        })
        .filter(
          (category) =>
            category.label.toLowerCase().includes(query) ||
            category.options.length > 0,
        ),
    })).filter((group) => group.categories.length > 0);
  }, [search]);

  return (
    <Drawer>
      <DrawerTrigger
        render={
          <Button>
            <SlidersHorizontal />
            Filters
            {activeCount > 0 && (
              <Badge variant="secondary">{activeCount}</Badge>
            )}
          </Button>
        }
      />

      <DrawerContent className="mx-auto flex h-[85dvh] max-h-225 w-[calc(100%-1rem)] max-w-2xl flex-col">
        <DrawerHeader className="p-6 pb-4">
          <div className="flex items-center justify-between">
            <DrawerTitle>Filters</DrawerTitle>

            <DrawerClose
              render={
                <Button variant="outline" size="icon">
                  <X className="size-4" />
                  <span className="sr-only">Close</span>
                </Button>
              }
            />
          </div>

          <div className="relative pt-2">
            <Search className="absolute left-3 top-4.5 size-4 text-muted-foreground" />

            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search filters..."
              className="pl-9"
            />
          </div>
        </DrawerHeader>

        <ScrollArea className="min-h-0 flex-1 px-6">
          <div className="space-y-6 pb-4">
            {filteredGroups.map((group) => (
              <section key={group.label} className="space-y-2">
                <h3 className="text-sm font-semibold text-muted-foreground">
                  {group.label}
                </h3>

                <Accordion className="w-full">
                  {group.categories.map((category) => {
                    const selected = filters[category.key];

                    return (
                      <AccordionItem key={category.key} value={category.key}>
                        <AccordionTrigger className="py-3 text-sm hover:no-underline">
                          <span className="flex items-center gap-2">
                            {category.label}

                            {selected.length > 0 && (
                              <Badge
                                variant="secondary"
                                className="size-5 justify-center rounded-full p-0 text-xs"
                              >
                                {selected.length}
                              </Badge>
                            )}
                          </span>
                        </AccordionTrigger>

                        <AccordionContent>
                          <div className="grid grid-cols-1 gap-x-4 gap-y-2 pb-3 sm:grid-cols-2">
                            {category.options.map((option) => {
                              const id = `${category.key}-${option
                                .toLowerCase()
                                .replace(/[^a-z0-9]+/g, "-")}`;

                              return (
                                <label
                                  key={option}
                                  htmlFor={id}
                                  className="flex cursor-pointer items-center gap-2 rounded-md py-1.5 text-sm"
                                >
                                  <Checkbox
                                    id={id}
                                    checked={selected.includes(option)}
                                    onCheckedChange={() =>
                                      toggleFilter(category.key, option)
                                    }
                                  />

                                  <span className="leading-none">{option}</span>
                                </label>
                              );
                            })}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    );
                  })}
                </Accordion>
              </section>
            ))}

            {filteredGroups.length === 0 && (
              <div className="py-12 text-center">
                <p className="text-sm font-medium">No filters found</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Try another search term.
                </p>
              </div>
            )}
          </div>
        </ScrollArea>

        <DrawerFooter className="p-6 pt-4">
          <div className="flex flex-row gap-2">
            <Button
              size="lg"
              variant="outline"
              className="flex-1"
              onClick={clearFilters}
              disabled={draftFilterCount === 0}
            >
              Clear all
            </Button>

            <DrawerClose
              render={
                <Button size="lg" className="flex-1" onClick={applyFilters}>
                  Apply Filters
                  {draftFilterCount > 0 && ` (${draftFilterCount})`}
                </Button>
              }
            />
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
