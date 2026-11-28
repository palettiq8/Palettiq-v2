import { ArrowRight, Star, Truck } from "lucide-react";

export function EcommerceHero() {
  return (
    <section
      className="px-6 pb-16 pt-12 @lg:px-10 @lg:pb-20 @lg:pt-16"
      style={{ backgroundColor: "var(--viz-background)" }}
    >
      <div className="mx-auto grid max-w-6xl items-center gap-12 @lg:grid-cols-[1fr_0.95fr]">
        <div className="space-y-6">
          <span
            className="inline-flex w-fit items-center rounded-full px-3 py-1 text-xs font-medium"
            style={{
              backgroundColor: "var(--viz-accent)",
              color: "var(--viz-on-accent)",
            }}
          >
            New season · 2026
          </span>

          <h1
            className="text-4xl font-bold leading-[1.05] tracking-tight @lg:text-6xl"
            style={{ color: "var(--viz-text)" }}
          >
            Objects for a
            <br />
            calmer home.
          </h1>

          <p
            className="max-w-md text-base leading-relaxed"
            style={{ color: "var(--viz-muted)" }}
          >
            Considered furniture, lighting and textiles — designed to live
            together quietly and last for years.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <span
              className="inline-flex cursor-default items-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold transition-opacity hover:opacity-90"
              style={{
                backgroundColor: "var(--viz-primary)",
                color: "var(--viz-on-primary)",
              }}
            >
              Shop the collection
              <ArrowRight className="size-4" />
            </span>

            <span
              className="cursor-default rounded-lg border px-5 py-3 text-sm font-semibold"
              style={{
                borderColor: "var(--viz-border)",
                color: "var(--viz-text)",
              }}
            >
              Explore lookbook
            </span>
          </div>

          <div
            className="flex flex-wrap items-center gap-x-5 gap-y-2 pt-2 text-xs"
            style={{ color: "var(--viz-muted)" }}
          >
            <span className="inline-flex items-center gap-1.5">
              <Truck className="size-3.5" /> Free delivery
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Star className="size-3.5" fill="currentColor" /> 4.8 · 2.4k reviews
            </span>
          </div>
        </div>

        <div className="relative">
          <div
            className="absolute -inset-3 rounded-[2rem]"
            style={{ backgroundColor: "var(--viz-primary)", opacity: 0.1 }}
          />

          <div
            className="relative aspect-[4/5] overflow-hidden rounded-3xl border shadow-xl"
            style={{
              backgroundColor: "var(--viz-surface)",
              borderColor: "var(--viz-border)",
            }}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <span
                className="block size-48 rounded-full"
                style={{ backgroundColor: "var(--viz-primary)", opacity: 0.16 }}
              />
              <span
                className="absolute size-28 rounded-3xl"
                style={{ backgroundColor: "var(--viz-accent)" }}
              />
              <span
                className="absolute -right-4 -top-2 size-14 rounded-full"
                style={{ backgroundColor: "var(--viz-secondary)" }}
              />
            </div>

            <span
              className="absolute left-4 top-4 rounded-full px-2.5 py-1 text-[10px] font-semibold"
              style={{
                backgroundColor: "var(--viz-primary)",
                color: "var(--viz-on-primary)",
              }}
            >
              Bestseller
            </span>
          </div>

          <div
            className="absolute -bottom-6 -left-4 hidden rounded-2xl border p-4 shadow-xl @lg:block"
            style={{
              backgroundColor: "var(--viz-background)",
              borderColor: "var(--viz-border)",
            }}
          >
            <p
              className="text-[10px] font-medium"
              style={{ color: "var(--viz-muted)" }}
            >
              Aura lounge chair
            </p>
            <p
              className="mt-0.5 text-lg font-bold"
              style={{ color: "var(--viz-text)" }}
            >
              $349
            </p>
            <div
              className="mt-1 flex items-center gap-1"
              style={{ color: "var(--viz-accent)" }}
            >
              {Array.from({ length: 5 }).map((_, index) => (
                <Star key={index} className="size-3" fill="currentColor" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
