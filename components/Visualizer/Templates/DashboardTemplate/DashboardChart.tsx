const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"];

const CURRENT = [42, 55, 48, 68, 60, 78, 72, 92];
const PREVIOUS = [34, 40, 44, 52, 50, 60, 58, 66];

export function DashboardChart() {
  return (
    <section
      className="rounded-2xl border p-5"
      style={{
        backgroundColor: "var(--viz-surface)",
        borderColor: "var(--viz-border)",
      }}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3
            className="text-sm font-semibold"
            style={{ color: "var(--viz-text)" }}
          >
            Revenue overview
          </h3>
          <p className="mt-0.5 text-[11px]" style={{ color: "var(--viz-muted)" }}>
            Monthly recurring revenue
          </p>
        </div>

        <div className="flex items-center gap-4">
          <span
            className="flex items-center gap-1.5 text-[11px]"
            style={{ color: "var(--viz-muted)" }}
          >
            <span
              className="size-2 rounded-full"
              style={{ backgroundColor: "var(--viz-primary)" }}
            />
            This year
          </span>
          <span
            className="flex items-center gap-1.5 text-[11px]"
            style={{ color: "var(--viz-muted)" }}
          >
            <span
              className="size-2 rounded-full"
              style={{ backgroundColor: "var(--viz-border)" }}
            />
            Last year
          </span>
        </div>
      </div>

      <div className="relative mt-6 h-44">
        <div className="absolute inset-0 flex flex-col justify-between">
          {[0, 1, 2, 3].map((line) => (
            <div
              key={line}
              className="border-t"
              style={{ borderColor: "var(--viz-border)", opacity: 0.6 }}
            />
          ))}
        </div>

        <div className="relative flex h-full items-end gap-2">
          {MONTHS.map((month, index) => (
            <div
              key={month}
              className="flex h-full flex-1 items-end justify-center gap-1"
            >
              <span
                className="w-1/3 rounded-t-sm"
                style={{
                  height: `${PREVIOUS[index]}%`,
                  backgroundColor: "var(--viz-border)",
                }}
              />
              <span
                className="w-1/3 rounded-t-sm"
                style={{
                  height: `${CURRENT[index]}%`,
                  backgroundColor:
                    index === MONTHS.length - 1
                      ? "var(--viz-accent)"
                      : "var(--viz-primary)",
                }}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="mt-2 flex gap-2">
        {MONTHS.map((month) => (
          <span
            key={month}
            className="flex-1 text-center text-[10px]"
            style={{ color: "var(--viz-muted)" }}
          >
            {month}
          </span>
        ))}
      </div>
    </section>
  );
}
