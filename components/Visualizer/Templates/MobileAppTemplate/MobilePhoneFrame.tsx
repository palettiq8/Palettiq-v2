import type { ReactNode } from "react";
import {
  BatteryFull,
  CreditCard,
  Home,
  PieChart,
  Signal,
  User,
  Wifi,
  type LucideIcon,
} from "lucide-react";

export type MobileTab = "home" | "insights" | "cards" | "profile";

const TABS: { id: MobileTab; icon: LucideIcon; label: string }[] = [
  { id: "home", icon: Home, label: "Home" },
  { id: "insights", icon: PieChart, label: "Insights" },
  { id: "cards", icon: CreditCard, label: "Cards" },
  { id: "profile", icon: User, label: "Profile" },
];

interface MobilePhoneFrameProps {
  active: MobileTab;
  caption: string;
  children: ReactNode;
}

export function MobilePhoneFrame({
  active,
  caption,
  children,
}: MobilePhoneFrameProps) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="w-[min(260px,100%)]">
        <div
          className="overflow-hidden rounded-[2.1rem] border-[8px] shadow-xl"
          style={{
            borderColor: "var(--viz-text)",
            backgroundColor: "var(--viz-background)",
          }}
        >
          <div className="relative flex h-[506px] flex-col">
            <div
              className="absolute left-1/2 top-2 z-10 h-5 w-20 -translate-x-1/2 rounded-full"
              style={{ backgroundColor: "var(--viz-text)" }}
            />

            <div
              className="flex items-center justify-between px-4 pt-9 text-[9px] font-medium"
              style={{ color: "var(--viz-text)" }}
            >
              <span>9:41</span>
              <div className="flex items-center gap-1">
                <Signal className="size-2.5" />
                <Wifi className="size-2.5" />
                <BatteryFull className="size-3" />
              </div>
            </div>

            <div className="min-h-0 flex-1 overflow-hidden pt-2">
              {children}
            </div>

            <div
              className="flex items-center justify-around border-t px-2 pb-1.5 pt-2"
              style={{
                borderColor: "var(--viz-border)",
                backgroundColor: "var(--viz-background)",
              }}
            >
              {TABS.map(({ id, icon: Icon, label }) => (
                <div
                  key={id}
                  className="flex flex-col items-center gap-0.5"
                  style={{
                    color:
                      id === active
                        ? "var(--viz-primary)"
                        : "var(--viz-muted)",
                  }}
                >
                  <Icon className="size-3.5" />
                  <span className="text-[8px] font-medium">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <p
        className="text-[11px] font-medium"
        style={{ color: "var(--viz-muted)" }}
      >
        {caption}
      </p>
    </div>
  );
}
