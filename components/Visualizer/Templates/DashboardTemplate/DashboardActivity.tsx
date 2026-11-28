interface Activity {
  name: string;
  action: string;
  time: string;
  tone: "primary" | "accent" | "muted";
}

const ACTIVITY: Activity[] = [
  {
    name: "Sara",
    action: "exported the Pro plan tokens",
    time: "2m ago",
    tone: "primary",
  },
  {
    name: "Michael",
    action: "invited 3 teammates",
    time: "18m ago",
    tone: "accent",
  },
  {
    name: "System",
    action: "completed the nightly contrast audit",
    time: "1h ago",
    tone: "muted",
  },
  {
    name: "Emily",
    action: "updated the brand palette",
    time: "3h ago",
    tone: "primary",
  },
  {
    name: "Ava",
    action: "created a new shared workspace",
    time: "5h ago",
    tone: "accent",
  },
];

function toneColor(tone: Activity["tone"]) {
  if (tone === "primary") return "var(--viz-primary)";
  if (tone === "accent") return "var(--viz-accent)";
  return "var(--viz-muted)";
}

export function DashboardActivity() {
  return (
    <section
      className="rounded-2xl border p-5"
      style={{
        backgroundColor: "var(--viz-surface)",
        borderColor: "var(--viz-border)",
      }}
    >
      <h3 className="text-sm font-semibold" style={{ color: "var(--viz-text)" }}>
        Activity
      </h3>
      <p className="mt-0.5 text-[11px]" style={{ color: "var(--viz-muted)" }}>
        Recent updates across your workspace
      </p>

      <ul className="mt-4">
        {ACTIVITY.map((item) => (
          <li
            key={`${item.name}-${item.time}`}
            className="flex items-start gap-2.5 border-t py-3"
            style={{ borderColor: "var(--viz-border)" }}
          >
            <span
              className="mt-1.5 size-2 shrink-0 rounded-full"
              style={{ backgroundColor: toneColor(item.tone) }}
            />

            <div className="min-w-0 flex-1">
              <p className="text-xs leading-relaxed">
                <span
                  className="font-medium"
                  style={{ color: "var(--viz-text)" }}
                >
                  {item.name}
                </span>{" "}
                <span style={{ color: "var(--viz-muted)" }}>{item.action}</span>
              </p>

              <p className="mt-0.5 text-[10px]" style={{ color: "var(--viz-muted)" }}>
                {item.time}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
