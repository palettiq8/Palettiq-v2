import {
  BarChart3,
  FolderKanban,
  LayoutDashboard,
  LifeBuoy,
  Palette,
  Settings,
  Users,
  type LucideIcon,
} from "lucide-react";

interface NavItem {
  icon: LucideIcon;
  label: string;
  active?: boolean;
}

const NAV_GROUPS: { group: string; items: NavItem[] }[] = [
  {
    group: "Overview",
    items: [
      { icon: LayoutDashboard, label: "Dashboard", active: true },
      { icon: BarChart3, label: "Analytics" },
      { icon: Palette, label: "Palettes" },
    ],
  },
  {
    group: "Workspace",
    items: [
      { icon: FolderKanban, label: "Projects" },
      { icon: Users, label: "Team" },
    ],
  },
];

export function DashboardSidebar() {
  return (
    <aside
      className="hidden w-60 shrink-0 flex-col border-r @lg:flex"
      style={{
        backgroundColor: "var(--viz-surface)",
        borderColor: "var(--viz-border)",
      }}
    >
      <div
        className="flex items-center gap-2.5 border-b px-4 py-4"
        style={{ borderColor: "var(--viz-border)" }}
      >
        <span
          className="flex size-8 items-center justify-center rounded-lg"
          style={{
            backgroundColor: "var(--viz-primary)",
            color: "var(--viz-on-primary)",
          }}
        >
          <LayoutDashboard className="size-4" />
        </span>

        <span
          className="text-sm font-semibold tracking-tight"
          style={{ color: "var(--viz-text)" }}
        >
          Lumen
        </span>

        <span
          className="ml-auto rounded-full px-2 py-0.5 text-[10px] font-medium"
          style={{
            backgroundColor: "var(--viz-accent)",
            color: "var(--viz-on-accent)",
          }}
        >
          Pro
        </span>
      </div>

      <div className="flex-1 space-y-5 overflow-hidden p-3">
        {NAV_GROUPS.map((group) => (
          <div key={group.group} className="space-y-1">
            <p
              className="px-2 text-[10px] font-semibold uppercase tracking-wide"
              style={{ color: "var(--viz-muted)" }}
            >
              {group.group}
            </p>

            {group.items.map(({ icon: Icon, label, active }) => (
              <div
                key={label}
                className="flex cursor-default items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-medium"
                style={
                  active
                    ? {
                        backgroundColor: "var(--viz-primary)",
                        color: "var(--viz-on-primary)",
                      }
                    : { color: "var(--viz-muted)" }
                }
              >
                <Icon className="size-4" />
                {label}
              </div>
            ))}
          </div>
        ))}
      </div>

      <div
        className="space-y-1 border-t p-3"
        style={{ borderColor: "var(--viz-border)" }}
      >
        <div
          className="flex cursor-default items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-medium"
          style={{ color: "var(--viz-muted)" }}
        >
          <Settings className="size-4" />
          Settings
        </div>

        <div
          className="flex cursor-default items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-medium"
          style={{ color: "var(--viz-muted)" }}
        >
          <LifeBuoy className="size-4" />
          Support
        </div>

        <div
          className="mt-3 flex items-center gap-2.5 rounded-lg border p-2"
          style={{ borderColor: "var(--viz-border)" }}
        >
          <span
            className="flex size-8 items-center justify-center rounded-full text-[10px] font-semibold"
            style={{
              backgroundColor: "var(--viz-accent)",
              color: "var(--viz-on-accent)",
            }}
          >
            AR
          </span>
          <div className="min-w-0">
            <p
              className="truncate text-xs font-medium"
              style={{ color: "var(--viz-text)" }}
            >
              Ava Ruiz
            </p>
            <p
              className="truncate text-[10px]"
              style={{ color: "var(--viz-muted)" }}
            >
              ava@lumen.app
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
