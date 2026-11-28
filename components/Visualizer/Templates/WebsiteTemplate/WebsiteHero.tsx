import { ArrowRight, Sparkles, Star } from "lucide-react";

const AVATARS = ["AL", "MK", "JR", "SD"];

const SWATCHES = [
  { label: "Primary", bg: "var(--viz-primary)", fg: "var(--viz-on-primary)" },
  {
    label: "Secondary",
    bg: "var(--viz-secondary)",
    fg: "var(--viz-on-secondary)",
  },
  { label: "Accent", bg: "var(--viz-accent)", fg: "var(--viz-on-accent)" },
  { label: "Text", bg: "var(--viz-text)", fg: "var(--viz-background)" },
  { label: "Muted", bg: "var(--viz-muted)", fg: "var(--viz-background)" },
];

export function WebsiteHero() {
  return (
    <section
      className="px-6 pb-16 pt-14 @lg:px-10 @lg:pb-24 @lg:pt-20"
      style={{ backgroundColor: "var(--viz-background)" }}
    >
      <div className="mx-auto grid max-w-6xl items-center gap-12 @lg:grid-cols-[1.05fr_0.95fr]">
        {/* Copy */}
        <div className="space-y-6">
          <span
            className="inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium"
            style={{
              backgroundColor: "var(--viz-accent)",
              color: "var(--viz-on-accent)",
            }}
          >
            <Sparkles className="size-3.5" />
            Design systems, simplified
          </span>

          <h1
            className="text-4xl font-bold leading-[1.05] tracking-tight @lg:text-6xl"
            style={{ color: "var(--viz-text)" }}
          >
            Color that ships
            <br />
            with confidence.
          </h1>

          <p
            className="max-w-md text-base leading-relaxed"
            style={{ color: "var(--viz-muted)" }}
          >
            Lumen turns a palette into a complete, accessible design system —
            tokens, components, and live previews — so your product looks
            intentional on every screen.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <span
              className="inline-flex cursor-default items-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold transition-opacity hover:opacity-90"
              style={{
                backgroundColor: "var(--viz-primary)",
                color: "var(--viz-on-primary)",
              }}
            >
              Start free
              <ArrowRight className="size-4" />
            </span>

            <span
              className="cursor-default rounded-lg border px-5 py-3 text-sm font-semibold"
              style={{
                borderColor: "var(--viz-border)",
                color: "var(--viz-text)",
              }}
            >
              See how it works
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <div className="flex -space-x-2">
              {AVATARS.map((initials) => (
                <span
                  key={initials}
                  className="flex size-8 items-center justify-center rounded-full border-2 text-[10px] font-semibold"
                  style={{
                    backgroundColor: "var(--viz-surface)",
                    borderColor: "var(--viz-background)",
                    color: "var(--viz-text)",
                  }}
                >
                  {initials}
                </span>
              ))}
            </div>

            <div className="text-xs" style={{ color: "var(--viz-muted)" }}>
              <div className="flex items-center gap-1.5">
                <span className="flex" style={{ color: "var(--viz-accent)" }}>
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star
                      key={index}
                      className="size-3"
                      fill="currentColor"
                    />
                  ))}
                </span>

                <span
                  className="font-semibold"
                  style={{ color: "var(--viz-text)" }}
                >
                  4.9/5
                </span>
              </div>

              <p className="mt-0.5">Trusted by 4,000+ product teams</p>
            </div>
          </div>
        </div>

        {/* Product visual */}
        <div className="relative">
          <div
            className="absolute -right-4 -top-6 hidden size-24 rounded-full @lg:block"
            style={{ backgroundColor: "var(--viz-accent)", opacity: 0.18 }}
          />

          <div
            className="relative rounded-3xl border p-5 shadow-2xl"
            style={{
              backgroundColor: "var(--viz-surface)",
              borderColor: "var(--viz-border)",
            }}
          >
            <div className="flex items-center justify-between pb-4">
              <div className="flex items-center gap-1.5">
                <span
                  className="size-2 rounded-full"
                  style={{ backgroundColor: "var(--viz-border)" }}
                />
                <span
                  className="size-2 rounded-full"
                  style={{ backgroundColor: "var(--viz-border)" }}
                />
                <span
                  className="size-2 rounded-full"
                  style={{ backgroundColor: "var(--viz-border)" }}
                />
              </div>

              <span
                className="rounded-full px-2 py-0.5 text-[10px] font-medium"
                style={{
                  backgroundColor: "var(--viz-accent)",
                  color: "var(--viz-on-accent)",
                }}
              >
                Live token map
              </span>
            </div>

            <div className="grid grid-cols-5 gap-2">
              {SWATCHES.map((swatch) => (
                <div
                  key={swatch.label}
                  className="flex h-16 flex-col justify-end rounded-xl p-1.5"
                  style={{ backgroundColor: swatch.bg, color: swatch.fg }}
                >
                  <span className="text-[8px] font-semibold opacity-90">
                    {swatch.label}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-4 grid grid-cols-[1.2fr_1fr] gap-3">
              <div
                className="rounded-xl border p-3"
                style={{ borderColor: "var(--viz-border)" }}
              >
                <p
                  className="text-[10px] font-medium"
                  style={{ color: "var(--viz-muted)" }}
                >
                  Type scale
                </p>

                <p
                  className="mt-0.5 text-2xl font-bold tracking-tight"
                  style={{ color: "var(--viz-text)" }}
                >
                  Aa
                </p>

                <div className="mt-2 space-y-1.5">
                  <div
                    className="h-1.5 w-full rounded-full"
                    style={{ backgroundColor: "var(--viz-border)" }}
                  />
                  <div
                    className="h-1.5 w-3/4 rounded-full"
                    style={{ backgroundColor: "var(--viz-border)" }}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <span
                  className="block rounded-lg px-3 py-2 text-center text-[10px] font-semibold"
                  style={{
                    backgroundColor: "var(--viz-primary)",
                    color: "var(--viz-on-primary)",
                  }}
                >
                  Primary
                </span>
                <span
                  className="block rounded-lg border px-3 py-2 text-center text-[10px] font-semibold"
                  style={{
                    borderColor: "var(--viz-border)",
                    color: "var(--viz-text)",
                  }}
                >
                  Outline
                </span>
                <span
                  className="block rounded-lg px-3 py-2 text-center text-[10px] font-semibold"
                  style={{
                    backgroundColor: "var(--viz-secondary)",
                    color: "var(--viz-on-secondary)",
                  }}
                >
                  Secondary
                </span>
              </div>
            </div>
          </div>

          <div
            className="absolute -bottom-6 -left-4 hidden rounded-2xl border p-3 shadow-xl @lg:block"
            style={{
              backgroundColor: "var(--viz-background)",
              borderColor: "var(--viz-border)",
            }}
          >
            <p
              className="text-[10px] font-medium"
              style={{ color: "var(--viz-muted)" }}
            >
              Contrast check
            </p>
            <p
              className="text-lg font-bold"
              style={{ color: "var(--viz-text)" }}
            >
              AA ✓
            </p>
            <p className="text-[10px]" style={{ color: "var(--viz-muted)" }}>
              All text pairs pass
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
