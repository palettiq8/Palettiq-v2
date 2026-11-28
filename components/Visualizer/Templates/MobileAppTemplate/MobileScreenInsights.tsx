const BARS = [44, 58, 50, 70, 62, 82, 74];

const CATEGORIES = [
  { label: "Shopping", pct: 50, color: "var(--viz-primary)" },
  { label: "Food", pct: 28, color: "var(--viz-secondary)" },
  { label: "Bills", pct: 22, color: "var(--viz-accent)" },
];

export function MobileScreenInsights() {
  return (
    <div className="space-y-3 px-3">
      <div className="flex items-center justify-between">
        <p
          className="text-xs font-semibold"
          style={{ color: "var(--viz-text)" }}
        >
          Insights
        </p>
        <span
          className="rounded-full border px-2 py-0.5 text-[8px] font-medium"
          style={{
            borderColor: "var(--viz-border)",
            color: "var(--viz-muted)",
          }}
        >
          This month
        </span>
      </div>

      <div
        className="rounded-xl border p-3"
        style={{
          borderColor: "var(--viz-border)",
          backgroundColor: "var(--viz-surface)",
        }}
      >
        <p className="text-[9px]" style={{ color: "var(--viz-muted)" }}>
          Total spent
        </p>

        <div className="flex items-baseline gap-1.5">
          <p
            className="text-lg font-bold tracking-tight"
            style={{ color: "var(--viz-text)" }}
          >
            $3,120
          </p>
          <span
            className="text-[9px] font-semibold"
            style={{ color: "var(--viz-primary)" }}
          >
            +8.2%
          </span>
        </div>

        <div className="mt-2 flex h-16 items-end gap-1">
          {BARS.map((height, index) => (
            <span
              key={index}
              className="flex-1 rounded-sm"
              style={{
                height: `${height}%`,
                backgroundColor:
                  index === BARS.length - 1
                    ? "var(--viz-accent)"
                    : "var(--viz-primary)",
                opacity: index === BARS.length - 1 ? 1 : 0.4,
              }}
            />
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <p
          className="text-[10px] font-semibold"
          style={{ color: "var(--viz-text)" }}
        >
          By category
        </p>

        {CATEGORIES.map((category) => (
          <div key={category.label} className="flex items-center gap-2">
            <span
              className="w-12 text-[9px]"
              style={{ color: "var(--viz-muted)" }}
            >
              {category.label}
            </span>

            <div
              className="h-1.5 flex-1 overflow-hidden rounded-full"
              style={{ backgroundColor: "var(--viz-border)" }}
            >
              <span
                className="block h-full rounded-full"
                style={{
                  width: `${category.pct}%`,
                  backgroundColor: category.color,
                }}
              />
            </div>

            <span
              className="w-6 text-right text-[9px] font-medium"
              style={{ color: "var(--viz-text)" }}
            >
              {category.pct}%
            </span>
          </div>
        ))}
      </div>

      <div
        className="flex items-center justify-between rounded-xl border p-2.5"
        style={{
          borderColor: "var(--viz-border)",
          backgroundColor: "var(--viz-surface)",
        }}
      >
        <div>
          <p className="text-[9px]" style={{ color: "var(--viz-muted)" }}>
            Top category
          </p>
          <p
            className="text-[11px] font-semibold"
            style={{ color: "var(--viz-text)" }}
          >
            Shopping
          </p>
        </div>

        <span
          className="rounded-full px-2 py-0.5 text-[9px] font-semibold"
          style={{
            backgroundColor: "var(--viz-primary)",
            color: "var(--viz-on-primary)",
          }}
        >
          $1,560
        </span>
      </div>
    </div>
  );
}
