import { Bell, Menu, Plus, Search } from "lucide-react";

export function DashboardTopbar() {
  return (
    <header
      className="flex items-center justify-between gap-3 border-b px-4 py-3"
      style={{
        backgroundColor: "var(--viz-background)",
        borderColor: "var(--viz-border)",
      }}
    >
      <div className="flex min-w-0 items-center gap-3">
        <Menu
          className="size-5 shrink-0 @lg:hidden"
          style={{ color: "var(--viz-text)" }}
        />

        <div className="min-w-0">
          <p
            className="truncate text-sm font-semibold"
            style={{ color: "var(--viz-text)" }}
          >
            Overview
          </p>
          <p
            className="truncate text-[11px]"
            style={{ color: "var(--viz-muted)" }}
          >
            Welcome back — here is what is happening today.
          </p>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <div
          className="hidden items-center gap-2 rounded-lg border px-3 py-2 text-xs @sm:flex"
          style={{
            borderColor: "var(--viz-border)",
            color: "var(--viz-muted)",
          }}
        >
          <Search className="size-3.5" />
          <span>Search…</span>
          <span
            className="ml-3 rounded border px-1 text-[10px]"
            style={{ borderColor: "var(--viz-border)" }}
          >
            ⌘K
          </span>
        </div>

        <span
          className="inline-flex cursor-default items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold"
          style={{
            backgroundColor: "var(--viz-primary)",
            color: "var(--viz-on-primary)",
          }}
        >
          <Plus className="size-3.5" />
          <span className="hidden @sm:inline">New report</span>
        </span>

        <span
          className="flex size-9 cursor-default items-center justify-center rounded-lg border"
          style={{
            borderColor: "var(--viz-border)",
            color: "var(--viz-muted)",
          }}
        >
          <Bell className="size-4" />
        </span>

        <span
          className="flex size-9 items-center justify-center rounded-full text-[11px] font-semibold"
          style={{
            backgroundColor: "var(--viz-secondary)",
            color: "var(--viz-on-secondary)",
          }}
        >
          AR
        </span>
      </div>
    </header>
  );
}
