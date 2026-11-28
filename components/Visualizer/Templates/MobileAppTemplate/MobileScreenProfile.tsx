import {
  Bell,
  ChevronRight,
  LifeBuoy,
  ShieldCheck,
  User,
  type LucideIcon,
} from "lucide-react";

const SETTINGS: { icon: LucideIcon; label: string }[] = [
  { icon: User, label: "Personal info" },
  { icon: ShieldCheck, label: "Security" },
  { icon: Bell, label: "Notifications" },
  { icon: LifeBuoy, label: "Help & support" },
];

const STATS = [
  { label: "Member since", value: "2022" },
  { label: "This month", value: "42 txns" },
];

export function MobileScreenProfile() {
  return (
    <div className="space-y-3 px-3">
      <p className="text-xs font-semibold" style={{ color: "var(--viz-text)" }}>
        Profile
      </p>

      <div className="flex flex-col items-center gap-1.5 py-1">
        <span
          className="flex size-14 items-center justify-center rounded-full text-sm font-semibold"
          style={{
            backgroundColor: "var(--viz-primary)",
            color: "var(--viz-on-primary)",
          }}
        >
          AR
        </span>

        <p
          className="text-[11px] font-semibold"
          style={{ color: "var(--viz-text)" }}
        >
          Ava Ruiz
        </p>
        <p className="text-[9px]" style={{ color: "var(--viz-muted)" }}>
          ava@lumen.app
        </p>

        <span
          className="rounded-full px-2 py-0.5 text-[8px] font-semibold"
          style={{
            backgroundColor: "var(--viz-accent)",
            color: "var(--viz-on-accent)",
          }}
        >
          Premium member
        </span>
      </div>

      <div className="grid grid-cols-2 gap-1.5">
        {STATS.map((stat) => (
          <div
            key={stat.label}
            className="rounded-lg border p-2"
            style={{
              borderColor: "var(--viz-border)",
              backgroundColor: "var(--viz-surface)",
            }}
          >
            <p className="text-[8px]" style={{ color: "var(--viz-muted)" }}>
              {stat.label}
            </p>
            <p
              className="text-[10px] font-semibold"
              style={{ color: "var(--viz-text)" }}
            >
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      <div
        className="overflow-hidden rounded-xl border"
        style={{
          borderColor: "var(--viz-border)",
          backgroundColor: "var(--viz-surface)",
        }}
      >
        {SETTINGS.map(({ icon: Icon, label }, index) => (
          <div
            key={label}
            className="flex items-center gap-2 px-2.5 py-2"
            style={
              index === 0
                ? undefined
                : { borderTop: "1px solid var(--viz-border)" }
            }
          >
            <span
              className="flex size-6 items-center justify-center rounded-md"
              style={{
                backgroundColor:
                  "color-mix(in oklch, var(--viz-primary) 14%, transparent)",
                color: "var(--viz-primary)",
              }}
            >
              <Icon className="size-3" />
            </span>

            <span
              className="flex-1 text-[10px]"
              style={{ color: "var(--viz-text)" }}
            >
              {label}
            </span>

            <ChevronRight
              className="size-3"
              style={{ color: "var(--viz-muted)" }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
