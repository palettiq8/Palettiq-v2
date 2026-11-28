interface Metric {
  label: string;
  value: string;
  delta: string;
  positive: boolean;
  bars: number[];
}

const METRICS: Metric[] = [
  {
    label: "Revenue",
    value: "$84.2k",
    delta: "+12.4%",
    positive: true,
    bars: [38, 46, 42, 58, 52, 66, 72, 88],
  },
  {
    label: "Active users",
    value: "12,480",
    delta: "+8.1%",
    positive: true,
    bars: [44, 40, 52, 48, 60, 56, 70, 76],
  },
  {
    label: "Conversion",
    value: "3.9%",
    delta: "-0.6%",
    positive: false,
    bars: [70, 64, 68, 58, 62, 54, 50, 46],
  },
  {
    label: "Churn",
    value: "1.2%",
    delta: "-0.3%",
    positive: true,
    bars: [64, 58, 60, 52, 48, 44, 40, 36],
  },
];

export function DashboardMetrics() {
  return (
    <div className="grid gap-3 @sm:grid-cols-2 @xl:grid-cols-4">
      {METRICS.map((metric) => (
        <div
          key={metric.label}
          className="rounded-2xl border p-4"
          style={{
            backgroundColor: "var(--viz-surface)",
            borderColor: "var(--viz-border)",
          }}
        >
          <p
            className="text-[11px] font-medium"
            style={{ color: "var(--viz-muted)" }}
          >
            {metric.label}
          </p>

          <div className="mt-1.5 flex items-end justify-between gap-2">
            <p
              className="text-xl font-bold tracking-tight"
              style={{ color: "var(--viz-text)" }}
            >
              {metric.value}
            </p>

            <span
              className="text-[11px] font-semibold"
              style={{
                color: metric.positive
                  ? "var(--viz-primary)"
                  : "var(--viz-muted)",
              }}
            >
              {metric.delta}
            </span>
          </div>

          <div className="mt-3 flex h-8 items-end gap-1">
            {metric.bars.map((height, index) => (
              <span
                key={index}
                className="flex-1 rounded-sm"
                style={{
                  height: `${height}%`,
                  backgroundColor:
                    index === metric.bars.length - 1
                      ? "var(--viz-accent)"
                      : "var(--viz-primary)",
                  opacity: index === metric.bars.length - 1 ? 1 : 0.35,
                }}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
