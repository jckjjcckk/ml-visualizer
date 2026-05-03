"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useEffect, useSyncExternalStore } from "react";
import { cn } from "@/lib/utils";
import { Tooltip } from "@/components/ui/tooltip";

export type ThemeMode = "system" | "light" | "dark";

const THEME_STORAGE_KEY = "ml-visualizer-theme";
const THEME_CHANGE_EVENT = "ml-visualizer-theme-change";

const themeOptions = [
  { icon: Monitor, label: "System theme", value: "system" },
  { icon: Sun, label: "Light theme", value: "light" },
  { icon: Moon, label: "Dark theme", value: "dark" },
] as const;

const isThemeMode = (value: string | null): value is ThemeMode =>
  value === "system" || value === "light" || value === "dark";

const getStoredTheme = (): ThemeMode => {
  if (typeof window === "undefined") {
    return "system";
  }

  try {
    const storedMode = window.localStorage.getItem(THEME_STORAGE_KEY);
    return isThemeMode(storedMode) ? storedMode : "system";
  } catch {
    return "system";
  }
};

const subscribeToTheme = (callback: () => void) => {
  if (typeof window === "undefined") {
    return () => {};
  }

  window.addEventListener("storage", callback);
  window.addEventListener(THEME_CHANGE_EVENT, callback);

  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(THEME_CHANGE_EVENT, callback);
  };
};

const applyTheme = (mode: ThemeMode) => {
  const root = document.documentElement;

  if (mode === "system") {
    root.removeAttribute("data-theme");
    return;
  }

  root.dataset.theme = mode;
};

export function ThemeToggle() {
  const mode = useSyncExternalStore<ThemeMode>(
    subscribeToTheme,
    getStoredTheme,
    () => "system",
  );

  useEffect(() => {
    applyTheme(mode);
  }, [mode]);

  const handleChange = (nextMode: ThemeMode) => {
    applyTheme(nextMode);
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, nextMode);
    } catch {
    }
    window.dispatchEvent(new Event(THEME_CHANGE_EVENT));
  };

  return (
    <div
      aria-label="Theme"
      className="flex shrink-0 items-center gap-1 rounded-full border border-border bg-inset p-1"
      role="group"
    >
      {themeOptions.map((option) => {
        const Icon = option.icon;
        const isSelected = option.value === mode;

        return (
          <Tooltip content={option.label} key={option.value}>
            <button
              type="button"
              aria-label={option.label}
              aria-pressed={isSelected}
              className={cn(
                "flex size-8 items-center justify-center rounded-full text-[var(--text-muted)] transition-colors duration-150 hover:text-[var(--text-primary)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus",
                isSelected &&
                  "bg-panel-raised text-[var(--text-primary)] shadow-[var(--shadow-soft)]",
              )}
              onClick={() => handleChange(option.value)}
            >
              <Icon aria-hidden="true" className="size-4" />
            </button>
          </Tooltip>
        );
      })}
    </div>
  );
}
