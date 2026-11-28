"use client";

import { Moon, Sun } from "lucide-react";

import type { ThemeMode } from "@/lib/visualizer/types";

const OPTIONS = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
] as const;

interface ThemeSelectorProps {
  value: ThemeMode;
  onChange: (theme: ThemeMode) => void;
}

export function ThemeSelector({ value, onChange }: ThemeSelectorProps) {
  return (
    <section className="space-y-2">
      <h2 className="text-xs font-semibold">Theme</h2>

      <div className="grid grid-cols-2 gap-1 rounded-lg bg-muted p-1">
        {OPTIONS.map(({ value: mode, label, icon: Icon }) => {
          const active = value === mode;

          return (
            <button
              key={mode}
              type="button"
              onClick={() => onChange(mode)}
              aria-pressed={active}
              className={`flex items-center justify-center gap-1.5 rounded-md px-2 py-1.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                active
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="size-3.5" />
              {label}
            </button>
          );
        })}
      </div>
    </section>
  );
}
