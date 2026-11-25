"use client";

import { useEffect, useState } from "react";
import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button variant="outline" size="icon" aria-label="Change appearance">
        <Monitor />
      </Button>
    );
  }

  const ActiveIcon =
    theme === "light" ? Sun : theme === "dark" ? Moon : Monitor;

  const toggleTheme = () => {
    const nextTheme =
      theme === "light" ? "dark" : theme === "dark" ? "system" : "light";

    setTheme(nextTheme);
  };

  return (
    <Button
      variant="outline"
      size="icon"
      aria-label="Change appearance"
      onClick={toggleTheme}
    >
      <ActiveIcon />
    </Button>
  );
}
