const SOURCES = [
  { label: "Organic search", pct: "42%", color: "var(--viz-primary)" },
  { label: "Direct", pct: "26%", color: "var(--viz-secondary)" },
  { label: "Referral", pct: "18%", color: "var(--viz-accent)" },
  { label: "Social", pct: "14%", color: "var(--viz-border)" },
];

export function DashboardBreakdown() {
  return (
    <section
      className="rounded-2xl border p-5"
      style={{
        backgroundColor: "var(--viz-surface)",
        borderColor: "var(--viz-border)",
      }}
    >
      <h3 className="text-sm font-semibold" style={{ color: "var(--viz-text)" }}>
        Traffic sources
      </h3>
      <p className="mt-0.5 text-[11px]" style={{ color: "var(--viz-muted)" }}>
        Where visitors come from
      </p>

      <div
        className="relative mx-auto mt-5 size-32 rounded-full"
        style={{
          background:
            "conic-gradient(var(--viz-primary) 0 42%, var(--viz-secondary) 42% 68%, var(--viz-accent) 68% 86%, var(--viz-border) 86% 100%)",
        }}
      >
        <div
          className="absolute inset-4 flex flex-col items-center justify-center rounded-full"
          style={{ backgroundColor: "var(--viz-surface)" }}
        >
          <p
            className="text-xl font-bold tracking-tight"
            style={{ color: "var(--viz-text)" }}
          >
            24.8k
          </p>
          <p className="text-[10px]" style={{ color: "var(--viz-muted)" }}>
            visits
          </p>
        </div>
      </div>

      <ul className="mt-5 space-y-2">
        {SOURCES.map((source) => (
          <li key={source.label} className="flex items-center gap-2 text-[11px]">
            <span
              className="size-2 rounded-full"
              style={{ backgroundColor: source.color }}
            />
            <span className="flex-1" style={{ color: "var(--viz-muted)" }}>
              {source.label}
            </span>
            <span className="font-semibold" style={{ color: "var(--viz-text)" }}>
              {source.pct}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
