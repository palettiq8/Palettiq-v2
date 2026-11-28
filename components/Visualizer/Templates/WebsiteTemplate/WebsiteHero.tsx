const HERO_SWATCHES = [
  "var(--viz-primary)",
  "var(--viz-secondary)",
  "var(--viz-accent)",
  "var(--viz-muted)",
];

export function WebsiteHero() {
  return (
    <section
      className="px-6 py-14 @lg:px-10 @lg:py-20"
      style={{ backgroundColor: "var(--viz-background)" }}
    >
      <div className="mx-auto grid max-w-5xl items-center gap-10 @lg:grid-cols-2">
        <div className="space-y-5">
          <span
            className="inline-flex w-fit items-center rounded-full px-3 py-1 text-xs font-medium"
            style={{
              backgroundColor: "var(--viz-accent)",
              color: "var(--viz-on-accent)",
            }}
          >
            New · Live palette previews
          </span>

          <h1
            className="text-3xl font-bold leading-tight tracking-tight @lg:text-5xl"
            style={{ color: "var(--viz-text)" }}
          >
            Build products people remember
          </h1>

          <p
            className="max-w-md text-sm leading-relaxed @lg:text-base"
            style={{ color: "var(--viz-muted)" }}
          >
            Lumen turns color and design systems into shippable interfaces —
            consistent, accessible, and unmistakably on brand.
          </p>

          <div className="flex flex-wrap gap-3">
            <span
              className="cursor-default rounded-lg px-5 py-2.5 text-sm font-medium transition-opacity hover:opacity-90"
              style={{
                backgroundColor: "var(--viz-primary)",
                color: "var(--viz-on-primary)",
              }}
            >
              Start free
            </span>

            <span
              className="cursor-default rounded-lg border px-5 py-2.5 text-sm font-medium"
              style={{
                borderColor: "var(--viz-border)",
                color: "var(--viz-text)",
              }}
            >
              Book a demo
            </span>
          </div>

          <div
            className="flex items-center gap-3 pt-2 text-xs"
            style={{ color: "var(--viz-muted)" }}
          >
            <span>Trusted by 4,000+ teams</span>

            <span className="flex gap-1.5">
              {HERO_SWATCHES.slice(0, 3).map((swatch) => (
                <span
                  key={swatch}
                  className="size-5 rounded-full ring-1 ring-inset ring-black/10"
                  style={{ backgroundColor: swatch }}
                />
              ))}
            </span>
          </div>
        </div>

        <div
          className="rounded-2xl border p-5"
          style={{
            backgroundColor: "var(--viz-surface)",
            borderColor: "var(--viz-border)",
          }}
        >
          <div className="flex items-center justify-between pb-4">
            <span
              className="text-xs font-medium"
              style={{ color: "var(--viz-muted)" }}
            >
              Design tokens
            </span>

            <span
              className="rounded-full px-2 py-0.5 text-[10px] font-medium"
              style={{
                backgroundColor: "var(--viz-accent)",
                color: "var(--viz-on-accent)",
              }}
            >
              Live
            </span>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {HERO_SWATCHES.map((swatch) => (
              <span
                key={swatch}
                className="h-14 rounded-lg ring-1 ring-inset ring-black/10"
                style={{ backgroundColor: swatch }}
              />
            ))}
          </div>

          <div className="mt-4 space-y-2">
            <div
              className="h-2.5 w-3/4 rounded-full"
              style={{ backgroundColor: "var(--viz-border)" }}
            />
            <div
              className="h-2.5 w-1/2 rounded-full"
              style={{ backgroundColor: "var(--viz-border)" }}
            />
          </div>

          <div className="mt-4 flex gap-2">
            <span
              className="rounded-md px-2.5 py-1 text-[11px] font-medium"
              style={{
                backgroundColor: "var(--viz-primary)",
                color: "var(--viz-on-primary)",
              }}
            >
              Primary
            </span>

            <span
              className="rounded-md border px-2.5 py-1 text-[11px] font-medium"
              style={{
                backgroundColor: "var(--viz-surface)",
                borderColor: "var(--viz-border)",
                color: "var(--viz-text)",
              }}
            >
              Outline
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
