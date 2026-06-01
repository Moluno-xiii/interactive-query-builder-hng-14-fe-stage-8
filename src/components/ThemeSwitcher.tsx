"use client";

import { Moon, Sun } from "lucide-react";
import useTheme from "@/hooks/useTheme";
import { cn } from "@/lib/utils";

const optBase =
  "grid h-[26px] w-[30px] place-items-center rounded-[6px] text-faint transition hover:text-muted-foreground";
const optActive = "bg-surface text-accent shadow-sm";

const ThemeSwitcher = () => {
  const { theme, applyTheme } = useTheme();
  return (
    <div
      className="flex gap-0.5 rounded-md border border-border bg-surface-2 p-0.75"
      role="group"
      aria-label="Theme"
    >
      <button
        type="button"
        className={cn(optBase, theme === "light" && optActive)}
        onClick={() => applyTheme("light")}
        title="Light"
        aria-label="Light theme"
        aria-pressed={theme === "light"}
      >
        <Sun size={15} />
      </button>
      <button
        type="button"
        className={cn(optBase, theme === "dark" && optActive)}
        onClick={() => applyTheme("dark")}
        title="Dark"
        aria-label="Dark theme"
        aria-pressed={theme === "dark"}
      >
        <Moon size={14} />
      </button>
    </div>
  );
};

export default ThemeSwitcher;
