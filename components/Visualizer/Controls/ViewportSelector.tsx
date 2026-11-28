"use client";

import { Monitor, Smartphone, Tablet } from "lucide-react";

import type { ViewportSize } from "@/lib/visualizer/types";

const OPTIONS = [
  { value: "desktop", label: "Desktop", icon: Monitor },
  { value: "tablet", label: "Tablet", icon: Tablet },
  { value: "mobile", label: "Mobile", icon: Smartphone },
] as const;

interface ViewportSelectorProps {
  value: ViewportSize;
  onChange: (viewport: ViewportSize) => void;
}

export function ViewportSelector({ value, onChange }: ViewportSelectorProps) {
  return (
    <section className="space-y-2">
      <h2 className="text-xs font-semibold">Viewport</h2>

      <div className="grid grid-cols-3 gap-1 rounded-lg bg-muted p-1">
        {OPTIONS.map(({ value: size, label, icon: Icon }) => {
          const active = value === size;

          return (
            <button
              key={size}
              type="button"
              onClick={() => onChange(size)}
              aria-pressed={active}
              aria-label={label}
              title={label}
              className={`flex flex-col items-center justify-center gap-1 rounded-md px-2 py-2 text-[11px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                active
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="size-4" />
              {label}
            </button>
          );
        })}
      </div>
    </section>
  );
}
