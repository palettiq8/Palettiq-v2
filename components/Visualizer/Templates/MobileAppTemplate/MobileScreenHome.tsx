import { Bell, Download, Ellipsis, Plus, Send } from "lucide-react";

const QUICK_ACTIONS = [
  { icon: Send, label: "Send" },
  { icon: Download, label: "Request" },
  { icon: Plus, label: "Top up" },
  { icon: Ellipsis, label: "More" },
];

const BARS = [38, 52, 46, 64, 56, 74, 86];

const RECENT = [
  {
    name: "Acme Studio",
    category: "Income",
    amount: "+$1,240",
    incoming: true,
  },
  { name: "Figma", category: "Subscription", amount: "-$15", incoming: false },
];

export function MobileScreenHome() {
  return (
    <div className="space-y-3 px-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className="flex size-7 items-center justify-center rounded-full text-[9px] font-semibold"
            style={{
              backgroundColor: "var(--viz-secondary)",
              color: "var(--viz-on-secondary)",
            }}
          >
            AR
          </span>
          <div>
            <p className="text-[9px]" style={{ color: "var(--viz-muted)" }}>
              Good morning
            </p>
            <p
              className="text-[11px] font-semibold"
              style={{ color: "var(--viz-text)" }}
            >
              Ava Ruiz
            </p>
          </div>
        </div>

        <span
          className="flex size-7 items-center justify-center rounded-full border"
          style={{
            borderColor: "var(--viz-border)",
            color: "var(--viz-text)",
          }}
        >
          <Bell className="size-3" />
        </span>
      </div>

      <div
        className="rounded-xl p-3"
        style={{
          backgroundColor: "var(--viz-primary)",
          color: "var(--viz-on-primary)",
        }}
      >
        <p className="text-[9px]" style={{ opacity: 0.8 }}>
          Total balance
        </p>
        <p className="text-base font-bold tracking-tight">$24,860.00</p>

        <div className="mt-2 flex h-6 items-end gap-0.5">
          {BARS.map((height, index) => (
            <span
              key={index}
              className="flex-1 rounded-sm"
              style={{
                height: `${height}%`,
                backgroundColor: "var(--viz-on-primary)",
                opacity: index === BARS.length - 1 ? 0.95 : 0.35,
              }}
            />
          ))}
        </div>

        <div className="mt-2 flex gap-1.5">
          <span
            className="flex-1 rounded-md py-1 text-center text-[9px] font-semibold"
            style={{
              backgroundColor: "var(--viz-on-primary)",
              color: "var(--viz-primary)",
            }}
          >
            Add money
          </span>
          <span
            className="flex-1 rounded-md border py-1 text-center text-[9px] font-semibold"
            style={{
              borderColor:
                "color-mix(in oklch, var(--viz-on-primary) 45%, transparent)",
              color: "var(--viz-on-primary)",
            }}
          >
            Send
          </span>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-1.5">
        {QUICK_ACTIONS.map(({ icon: Icon, label }) => (
          <div key={label} className="flex flex-col items-center gap-1">
            <span
              className="flex size-8 items-center justify-center rounded-lg border"
              style={{
                borderColor: "var(--viz-border)",
                backgroundColor: "var(--viz-surface)",
              }}
            >
              <Icon className="size-3.5" style={{ color: "var(--viz-primary)" }} />
            </span>
            <span className="text-[8px]" style={{ color: "var(--viz-muted)" }}>
              {label}
            </span>
          </div>
        ))}
      </div>

      <div>
        <div className="flex items-center justify-between">
          <p
            className="text-[10px] font-semibold"
            style={{ color: "var(--viz-text)" }}
          >
            Recent
          </p>
          <span
            className="text-[9px] font-medium"
            style={{ color: "var(--viz-primary)" }}
          >
            See all
          </span>
        </div>

        <div
          className="mt-1 overflow-hidden rounded-xl border"
          style={{
            borderColor: "var(--viz-border)",
            backgroundColor: "var(--viz-surface)",
          }}
        >
          {RECENT.map((item, index) => (
            <div
              key={item.name}
              className="flex items-center gap-2 px-2.5 py-2"
              style={
                index === 0
                  ? undefined
                  : { borderTop: "1px solid var(--viz-border)" }
              }
            >
              <span
                className="flex size-7 items-center justify-center rounded-full text-[8px] font-semibold"
                style={{
                  backgroundColor: "var(--viz-secondary)",
                  color: "var(--viz-on-secondary)",
                }}
              >
                {item.name.charAt(0)}
              </span>
              <div className="min-w-0 flex-1">
                <p
                  className="truncate text-[10px] font-medium"
                  style={{ color: "var(--viz-text)" }}
                >
                  {item.name}
                </p>
                <p className="text-[8px]" style={{ color: "var(--viz-muted)" }}>
                  {item.category}
                </p>
              </div>
              <p
                className="text-[10px] font-semibold"
                style={{
                  color: item.incoming
                    ? "var(--viz-primary)"
                    : "var(--viz-text)",
                }}
              >
                {item.amount}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
