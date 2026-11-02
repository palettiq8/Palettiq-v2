"use client";

import { useState } from "react";
import {
  BookmarkIcon,
  ChevronDownIcon,
  ClockIcon,
  DownloadIcon,
  FlameIcon,
  TrendingUpIcon,
} from "lucide-react";

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

const SORT_OPTIONS = [
  { value: "popular", label: "Most popular", icon: FlameIcon },
  { value: "saved", label: "Most saved", icon: BookmarkIcon },
  { value: "downloaded", label: "Most downloaded", icon: DownloadIcon },
  { value: "trending", label: "Trending", icon: TrendingUpIcon },
  { value: "recent", label: "Recently added", icon: ClockIcon },
] as const;

type SortValue = (typeof SORT_OPTIONS)[number]["value"];

export default function PalettesExploreHeader() {
  const [sort, setSort] = useState<SortValue>("popular");
  const current = SORT_OPTIONS.find((o) => o.value === sort)!;

  return (
    <div className="w-full flex items-center justify-between gap-4 px-6">
      <HorizontalWheel>
        {COLOR_FAMILIES.map((family) => (
          <Button
            key={family.name}
            variant="outline"
            className="shrink-0 active:not-aria-[haspopup]:translate-y-0"
          >
            <span
              className="size-3 rounded-full ring-1 ring-foreground/25"
              style={{ backgroundColor: family.hex }}
            />
            {family.name}
          </Button>
        ))}
      </HorizontalWheel>

      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button variant="outline" className="shrink-0">
              {current.label}
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
            value={sort}
            onValueChange={(v) => setSort(v as SortValue)}
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
