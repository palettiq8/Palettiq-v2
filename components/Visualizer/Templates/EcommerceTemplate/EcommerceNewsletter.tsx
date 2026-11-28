import { ArrowRight } from "lucide-react";

export function EcommerceNewsletter() {
  return (
    <section
      className="px-6 py-14 @lg:px-10"
      style={{ backgroundColor: "var(--viz-background)" }}
    >
      <div
        className="mx-auto grid max-w-5xl items-center gap-6 rounded-2xl border p-6 @lg:grid-cols-[1.1fr_1fr] @lg:p-8"
        style={{
          backgroundColor: "var(--viz-surface)",
          borderColor: "var(--viz-border)",
        }}
      >
        <div className="space-y-1.5">
          <h2
            className="text-xl font-bold tracking-tight @lg:text-2xl"
            style={{ color: "var(--viz-text)" }}
          >
            Get 10% off your first order
          </h2>
          <p className="text-sm leading-relaxed" style={{ color: "var(--viz-muted)" }}>
            Join the list for new arrivals, slow-living edits and early access.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div
            className="flex-1 rounded-lg border px-3 py-2.5 text-xs"
            style={{
              borderColor: "var(--viz-border)",
              color: "var(--viz-muted)",
            }}
          >
            you@email.com
          </div>

          <span
            className="inline-flex cursor-default items-center gap-1.5 rounded-lg px-4 py-2.5 text-xs font-semibold"
            style={{
              backgroundColor: "var(--viz-primary)",
              color: "var(--viz-on-primary)",
            }}
          >
            Subscribe
            <ArrowRight className="size-3.5" />
          </span>
        </div>
      </div>
    </section>
  );
}
