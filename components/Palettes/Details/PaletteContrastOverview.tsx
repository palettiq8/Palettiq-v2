"use client";

import { useMemo, useState } from "react";
import { ArrowDownUp } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { CopyColorButton } from "./CopyColorButton";
import {
  getPaletteContrastPairs,
  type ContrastColorInput,
  type ContrastPair,
} from "@/lib/utils/contrast";

type ContrastFilter = "all" | "passing" | "failing";

interface PaletteContrastOverviewProps {
  colors: ContrastColorInput[];
}

function getPairStatus(pair: ContrastPair) {
  if (pair.normalTextAA) {
    return {
      label: "AA pass",
      variant: "success" as const,
    };
  }

  if (pair.largeTextAA || pair.uiComponents) {
    return {
      label: "Partial pass",
      variant: "warning" as const,
    };
  }

  return {
    label: "Fail",
    variant: "destructive" as const,
  };
}

export function PaletteContrastOverview({
  colors,
}: PaletteContrastOverviewProps) {
  const [filter, setFilter] = useState<ContrastFilter>("all");

  const pairs = useMemo(() => getPaletteContrastPairs(colors), [colors]);

  const passingCount = pairs.filter((pair) => pair.normalTextAA).length;

  const failingCount = pairs.length - passingCount;

  const filteredPairs = pairs.filter((pair) => {
    if (filter === "passing") return pair.normalTextAA;
    if (filter === "failing") return !pair.normalTextAA;

    return true;
  });

  if (pairs.length === 0) return null;

  const filters: { value: ContrastFilter; label: string; count: number }[] = [
    { value: "all", label: "All", count: pairs.length },
    { value: "passing", label: "Passing", count: passingCount },
    { value: "failing", label: "Needs attention", count: failingCount },
  ];

  return (
    <section className="mt-8 space-y-4">
      {/* Section Header */}
      <div className="flex flex-col gap-1">
        <h3 className="text-base font-semibold tracking-tight">
          Contrast analysis
        </h3>

        <p className="text-sm text-muted-foreground">
          Evaluate how well the colors in this palette work together for text
          and interface elements.
        </p>
      </div>

      {/* Summary */}
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-border/60 bg-card p-4">
          <p className="text-sm text-muted-foreground">Combinations tested</p>
          <p className="mt-1 text-2xl font-semibold tabular-nums">
            {pairs.length}
          </p>
        </div>

        <div className="rounded-xl border border-border/60 bg-card p-4">
          <p className="text-sm text-muted-foreground">AA normal text</p>
          <p className="mt-1 text-2xl font-semibold tabular-nums text-emerald-600 dark:text-emerald-500">
            {passingCount}
          </p>
        </div>

        <div className="rounded-xl border border-border/60 bg-card p-4">
          <p className="text-sm text-muted-foreground">Needs attention</p>
          <p className="mt-1 text-2xl font-semibold tabular-nums text-destructive">
            {failingCount}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        {filters.map((item) => (
          <button
            key={item.value}
            type="button"
            onClick={() => setFilter(item.value)}
            aria-pressed={filter === item.value}
            className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${
              filter === item.value
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            {item.label}
            <span className="tabular-nums opacity-70">{item.count}</span>
          </button>
        ))}
      </div>

      {/* Contrast Pairs */}
      <div className="grid gap-3 sm:grid-cols-2">
        {filteredPairs.map((pair) => (
          <ContrastPairCard
            key={`${pair.colorA.id}-${pair.colorB.id}`}
            pair={pair}
          />
        ))}
      </div>

      {filteredPairs.length === 0 && (
        <div className="rounded-xl border border-dashed px-5 py-10 text-center">
          <p className="text-sm font-medium">No combinations found</p>
          <p className="mt-1 text-xs text-muted-foreground">
            There are no color pairs in this category.
          </p>
        </div>
      )}

      <p className="text-xs leading-relaxed text-muted-foreground">
        Based on WCAG contrast ratio guidelines. Passing a contrast check does
        not guarantee that an entire design is accessible.
      </p>
    </section>
  );
}

function ContrastPairCard({ pair }: { pair: ContrastPair }) {
  const [isSwapped, setIsSwapped] = useState(false);

  const foreground = isSwapped ? pair.colorA : pair.colorB;
  const background = isSwapped ? pair.colorB : pair.colorA;

  const status = getPairStatus(pair);

  return (
    <article className="min-w-0 overflow-hidden rounded-xl border border-border/60 bg-card">
      {/* Card Header */}
      <div className="flex items-center justify-between gap-3 border-b border-border/60 px-4 py-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">
            {pair.colorA.name || "Unnamed color"}
            <span className="mx-1.5 text-muted-foreground">/</span>
            {pair.colorB.name || "Unnamed color"}
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {pair.colorA.role || "Unassigned"} /{" "}
            {pair.colorB.role || "Unassigned"}
          </p>
        </div>

        <Badge
          variant={
            status.variant === "success"
              ? "default"
              : status.variant === "warning"
                ? "secondary"
                : "destructive"
          }
          className={
            status.variant === "success"
              ? "shrink-0 bg-emerald-600 text-white hover:bg-emerald-600 dark:bg-emerald-700"
              : status.variant === "warning"
                ? "shrink-0"
                : "shrink-0"
          }
        >
          {status.label}
        </Badge>
      </div>

      <div className="space-y-4 p-4">
        {/* Visual Preview */}
        <div
          className="flex min-h-28 flex-col justify-center gap-1 rounded-lg p-4"
          style={{
            backgroundColor: background.hex,
            color: foreground.hex,
          }}
        >
          <span className="text-2xl font-semibold tracking-tight">Aa</span>
          <span className="text-xs">Sample text preview</span>
        </div>

        {/* Color Values */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex min-w-0 flex-1 items-center gap-2">
            <span
              className="size-8 shrink-0 rounded-md border border-black/10"
              style={{ backgroundColor: pair.colorA.hex }}
            />
            <div className="min-w-0">
              <p className="truncate text-xs font-medium">
                {pair.colorA.name || "Color A"}
              </p>
              <p className="font-mono text-[11px] uppercase text-muted-foreground">
                {pair.colorA.hex}
              </p>
            </div>
            <CopyColorButton hex={pair.colorA.hex.toUpperCase()} />
          </div>

          <button
            type="button"
            onClick={() => setIsSwapped((current) => !current)}
            className="grid size-8 shrink-0 place-items-center rounded-md border border-border/60 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            title="Swap foreground and background"
            aria-label="Swap foreground and background colors"
          >
            <ArrowDownUp className="size-4" />
          </button>

          <div className="flex min-w-0 flex-1 items-center justify-end gap-2">
            <div className="min-w-0 text-right">
              <p className="truncate text-xs font-medium">
                {pair.colorB.name || "Color B"}
              </p>
              <p className="font-mono text-[11px] uppercase text-muted-foreground">
                {pair.colorB.hex}
              </p>
            </div>
            <span
              className="size-8 shrink-0 rounded-md border border-black/10"
              style={{ backgroundColor: pair.colorB.hex }}
            />
            <CopyColorButton hex={pair.colorB.hex.toUpperCase()} />
          </div>
        </div>

        {/* Contrast Ratio */}
        <div className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2.5">
          <span className="text-xs font-medium text-muted-foreground">
            Contrast ratio
          </span>
          <span className="text-base font-semibold tabular-nums">
            {pair.ratio.toFixed(2)}:1
          </span>
        </div>

        {/* WCAG Checks */}
        <div className="space-y-2">
          <ContrastCheck
            label="Normal text"
            requirement="4.5:1"
            passed={pair.normalTextAA}
          />

          <ContrastCheck
            label="Large text"
            requirement="3:1"
            passed={pair.largeTextAA}
          />

          <ContrastCheck
            label="UI components"
            requirement="3:1"
            passed={pair.uiComponents}
          />

          <div className="my-2 border-t border-border/60" />

          <ContrastCheck
            label="Normal text AAA"
            requirement="7:1"
            passed={pair.normalTextAAA}
          />

          <ContrastCheck
            label="Large text AAA"
            requirement="4.5:1"
            passed={pair.largeTextAAA}
          />
        </div>
      </div>
    </article>
  );
}

function ContrastCheck({
  label,
  requirement,
  passed,
}: {
  label: string;
  requirement: string;
  passed: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="min-w-0">
        <span className="text-sm font-medium">{label}</span>
        <span className="ml-1.5 text-sm text-muted-foreground">
          {requirement}
        </span>
      </div>

      <Badge
        variant="outline"
        className={
          passed
            ? "shrink-0 border-emerald-600/30 text-emerald-600 dark:text-emerald-500"
            : "shrink-0 text-muted-foreground"
        }
      >
        {passed ? "Pass" : "Fail"}
      </Badge>
    </div>
  );
}
