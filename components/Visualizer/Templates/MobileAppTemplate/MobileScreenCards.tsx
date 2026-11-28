import { CreditCard, Eye, Snowflake, SlidersHorizontal } from "lucide-react";

const CARD_ACTIONS = [
  { icon: Snowflake, label: "Freeze" },
  { icon: SlidersHorizontal, label: "Limit" },
  { icon: Eye, label: "Details" },
];

const ALL_CARDS = [
  {
    name: "Lumen Debit",
    last4: "•••• 4821",
    status: "Active" as const,
    color: "var(--viz-primary)",
  },
  {
    name: "Lumen Virtual",
    last4: "•••• 9077",
    status: "Frozen" as const,
    color: "var(--viz-muted)",
  },
];

export function MobileScreenCards() {
  return (
    <div className="space-y-3 px-3">
      <p className="text-xs font-semibold" style={{ color: "var(--viz-text)" }}>
        Your cards
      </p>

      <div
        className="relative overflow-hidden rounded-xl p-3"
        style={{
          background:
            "linear-gradient(135deg, var(--viz-primary) 0%, var(--viz-secondary) 100%)",
          color: "var(--viz-on-primary)",
        }}
      >
        <div className="flex items-start justify-between">
          <span className="text-[9px] font-medium" style={{ opacity: 0.85 }}>
            Lumen Pay
          </span>
          <CreditCard className="size-4" style={{ opacity: 0.85 }} />
        </div>

        <p className="mt-7 text-[11px] font-semibold tracking-[0.2em]">
          •••• 4821
        </p>

        <div
          className="mt-2 flex items-center justify-between text-[8px]"
          style={{ opacity: 0.85 }}
        >
          <span>AVA RUIZ</span>
          <span>09/28</span>
        </div>

        <span
          className="absolute -bottom-6 -right-6 size-20 rounded-full"
          style={{ backgroundColor: "var(--viz-on-primary)", opacity: 0.1 }}
        />
      </div>

      <div className="grid grid-cols-3 gap-1.5">
        {CARD_ACTIONS.map(({ icon: Icon, label }) => (
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

      <div className="space-y-1.5">
        <p
          className="text-[10px] font-semibold"
          style={{ color: "var(--viz-text)" }}
        >
          All cards
        </p>

        {ALL_CARDS.map((card) => (
          <div
            key={card.name}
            className="flex items-center gap-2 rounded-lg border px-2.5 py-2"
            style={{
              borderColor: "var(--viz-border)",
              backgroundColor: "var(--viz-surface)",
            }}
          >
            <span
              className="h-6 w-9 rounded"
              style={{ backgroundColor: card.color, opacity: 0.85 }}
            />

            <div className="min-w-0 flex-1">
              <p
                className="truncate text-[10px] font-medium"
                style={{ color: "var(--viz-text)" }}
              >
                {card.name}
              </p>
              <p className="text-[8px]" style={{ color: "var(--viz-muted)" }}>
                {card.last4}
              </p>
            </div>

            <span
              className="rounded-full px-1.5 py-0.5 text-[8px] font-medium"
              style={
                card.status === "Active"
                  ? {
                      backgroundColor:
                        "color-mix(in oklch, var(--viz-primary) 16%, transparent)",
                      color: "var(--viz-primary)",
                    }
                  : {
                      backgroundColor:
                        "color-mix(in oklch, var(--viz-muted) 18%, transparent)",
                      color: "var(--viz-muted)",
                    }
              }
            >
              {card.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
