"use client";

import { LayoutTemplate } from "lucide-react";

import type { TemplateType } from "@/lib/visualizer/types";
import { Badge } from "@/components/ui/badge";
interface TemplateOption {
  id: string;
  label: string;
  available: boolean;
  type?: TemplateType;
}

/**
 * Only implemented templates are selectable. Unimplemented templates are shown
 * as disabled "Soon" options so the roadmap is visible without pretending they
 * work.
 */
const OPTIONS: TemplateOption[] = [
  { id: "website", label: "Website", available: true, type: "website" },
  { id: "dashboard", label: "Dashboard", available: true, type: "dashboard" },
  { id: "ecommerce", label: "E-commerce", available: true, type: "ecommerce" },
  { id: "mobile", label: "Mobile app", available: true, type: "mobile" },
];

interface TemplateSelectorProps {
  value: TemplateType;
  onChange: (template: TemplateType) => void;
}

export function TemplateSelector({ value, onChange }: TemplateSelectorProps) {
  return (
    <section className="space-y-2">
      <h2 className="text-xs font-semibold">Templates</h2>

      <ul className="space-y-0.5">
        {OPTIONS.map((option) => {
          const active = option.type === value;
          const disabled = !option.available;

          return (
            <li key={option.id}>
              <button
                type="button"
                disabled={disabled}
                aria-pressed={active}
                onClick={() => option.type && onChange(option.type)}
                className={`group flex w-full items-center gap-2.5 rounded-lg px-1.5 py-1.5 text-left transition-colors hover:bg-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-60 ${active && "bg-muted/60"}`}
              >
                <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
                  <LayoutTemplate className="size-4" />
                </span>

                <span className="min-w-0 flex-1">
                  <span className="block truncate text-xs font-medium">
                    {option.label}
                  </span>
                </span>

                {disabled ? (
                  <Badge variant={"secondary"}>
                    Soon
                  </Badge>
                ) : active ? (
                  <Badge variant={"secondary"}>
                    Active
                  </Badge>
                ) : null}
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
