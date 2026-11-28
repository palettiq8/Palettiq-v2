import { TrendingUp } from "lucide-react";

const STATS = [
  { value: "240+", label: "Components shipped" },
  { value: "98%", label: "Contrast pass rate" },
  { value: "10k+", label: "Palettes deployed" },
  { value: "4.9/5", label: "Average team rating" },
];

export function WebsiteStats() {
  return (
    <section
      className="px-6 py-14 @lg:px-10"
      style={{
        backgroundColor: "var(--viz-primary)",
        color: "var(--viz-on-primary)",
      }}
    >
      <div className="mx-auto grid max-w-6xl items-center gap-10 @lg:grid-cols-[1fr_1.1fr]">
        <div className="space-y-3">
          <span
            className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-medium"
            style={{
              backgroundColor: "var(--viz-on-primary)",
              color: "var(--viz-primary)",
            }}
          >
            <TrendingUp className="size-3" />
            Measured impact
          </span>

          <h2
            className="text-2xl font-bold tracking-tight @lg:text-3xl"
            style={{ color: "var(--viz-on-primary)" }}
          >
            A system that pays for itself
          </h2>

          <p
            className="max-w-md text-sm leading-relaxed"
            style={{ color: "var(--viz-on-primary)", opacity: 0.8 }}
          >
            Consistent interfaces ship faster, convert better, and stay
            accessible as your product grows.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-x-8 gap-y-8 @sm:grid-cols-4 @lg:grid-cols-2">
          {STATS.map((stat) => (
            <div key={stat.label}>
              <p
                className="text-3xl font-bold tracking-tight"
                style={{ color: "var(--viz-on-primary)" }}
              >
                {stat.value}
              </p>
              <p
                className="mt-1 text-xs"
                style={{ color: "var(--viz-on-primary)", opacity: 0.75 }}
              >
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
