"use client";

import { useTheme } from "next-themes";
import { Sun, Moon, Monitor } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const themes = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
];

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const activeTheme = themes.find((item) => item.value === theme) ?? themes[2];

  const ActiveIcon = activeTheme.icon;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="outline" size="icon" aria-label="Change appearance">
            <ActiveIcon className="size-5" />
          </Button>
        }
      />

      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuRadioGroup
          value={theme ?? "system"}
          onValueChange={setTheme}
        >
          {themes.map(({ value, label, icon: Icon }) => (
            <DropdownMenuRadioItem key={value} value={value}>
              <Icon className="size-4" />
              {label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
