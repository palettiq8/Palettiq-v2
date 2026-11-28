import { ArrowRight } from "lucide-react";

const CATEGORIES = [
  {
    label: "Furniture",
    count: "128 items",
    color: "var(--viz-primary)",
    backdrop:
      "color-mix(in oklch, var(--viz-primary) 16%, var(--viz-background))",
  },
  {
    label: "Lighting",
    count: "64 items",
    color: "var(--viz-secondary)",
    backdrop:
      "color-mix(in oklch, var(--viz-secondary) 16%, var(--viz-background))",
  },
  {
    label: "Decor",
    count: "203 items",
    color: "var(--viz-accent)",
    backdrop:
      "color-mix(in oklch, var(--viz-accent) 18%, var(--viz-background))",
  },
  {
    label: "Textiles",
    count: "87 items",
    color: "var(--viz-muted)",
    backdrop:
      "color-mix(in oklch, var(--viz-muted) 16%, var(--viz-background))",
  },
];

export function EcommerceCategories() {
  return (
    <section
      className="px-6 py-14 @lg:px-10"
      style={{ backgroundColor: "var(--viz-surface)" }}
    >
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div className="space-y-1.5">
            <h2
              className="text-2xl font-bold tracking-tight @lg:text-3xl"
              style={{ color: "var(--viz-text)" }}
            >
              Shop by category
            </h2>
            <p className="text-sm" style={{ color: "var(--viz-muted)" }}>
              Find exactly what your space needs.
            </p>
          </div>

          <span
            className="inline-flex cursor-default items-center gap-1 text-xs font-semibold"
            style={{ color: "var(--viz-primary)" }}
          >
            View all
            <ArrowRight className="size-3.5" />
          </span>
        </div>

        <div className="grid gap-4 @sm:grid-cols-2 @lg:grid-cols-4">
          {CATEGORIES.map((category) => (
            <div
              key={category.label}
              className="overflow-hidden rounded-xl border"
              style={{
                backgroundColor: "var(--viz-background)",
                borderColor: "var(--viz-border)",
              }}
            >
              <div
                className="flex h-24 items-center justify-center"
                style={{ backgroundColor: category.backdrop }}
              >
                <span
                  className="size-12 rounded-2xl"
                  style={{
                    backgroundColor: category.color,
                    opacity: 0.9,
                  }}
                />
              </div>

              <div className="flex items-center justify-between px-4 py-3">
                <p
                  className="text-xs font-semibold"
                  style={{ color: "var(--viz-text)" }}
                >
                  {category.label}
                </p>
                <p
                  className="text-[11px]"
                  style={{ color: "var(--viz-muted)" }}
                >
                  {category.count}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
