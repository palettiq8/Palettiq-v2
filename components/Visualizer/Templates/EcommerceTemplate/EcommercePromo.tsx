import { ArrowRight } from "lucide-react";

export function EcommercePromo() {
  return (
    <section
      className="px-6 py-14 @lg:px-10"
      style={{ backgroundColor: "var(--viz-primary)" }}
    >
      <div className="mx-auto grid max-w-6xl items-center gap-8 @lg:grid-cols-2">
        <div className="space-y-4">
          <span
            className="inline-flex rounded-full px-3 py-1 text-[11px] font-semibold"
            style={{
              backgroundColor: "var(--viz-on-primary)",
              color: "var(--viz-primary)",
            }}
          >
            Limited time
          </span>

          <h2
            className="text-2xl font-bold tracking-tight @lg:text-4xl"
            style={{ color: "var(--viz-on-primary)" }}
          >
            Up to 30% off the essentials
          </h2>

          <p
            className="max-w-md text-sm leading-relaxed"
            style={{ color: "var(--viz-on-primary)", opacity: 0.85 }}
          >
            Refresh your space with our most-loved pieces — for a limited time
            only.
          </p>

          <span
            className="inline-flex w-fit cursor-default items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold transition-opacity hover:opacity-90"
            style={{
              backgroundColor: "var(--viz-on-primary)",
              color: "var(--viz-primary)",
            }}
          >
            Shop the edit
            <ArrowRight className="size-4" />
          </span>
        </div>

        <div
          className="relative aspect-[16/10] overflow-hidden rounded-2xl border"
          style={{
            backgroundColor: "var(--viz-surface)",
            borderColor: "var(--viz-on-primary)",
          }}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <span
              className="block size-36 rounded-full"
              style={{ backgroundColor: "var(--viz-primary)", opacity: 0.14 }}
            />
            <span
              className="absolute size-20 rounded-2xl"
              style={{ backgroundColor: "var(--viz-accent)" }}
            />
            <span
              className="absolute right-8 top-8 size-10 rounded-full"
              style={{ backgroundColor: "var(--viz-secondary)" }}
            />
          </div>

          <span
            className="absolute bottom-4 left-4 rounded-full px-3 py-1 text-[11px] font-bold"
            style={{
              backgroundColor: "var(--viz-accent)",
              color: "var(--viz-on-accent)",
            }}
          >
            Save 30%
          </span>
        </div>
      </div>
    </section>
  );
}
