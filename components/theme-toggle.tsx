"use client";

import { useTheme } from "@/components/theme-provider";

export function ThemeToggle() {
  const { isReady, theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";
  const nextTheme = isDark ? "light" : "dark";

  return (
    <button
      className="theme-toggle"
      type="button"
      onClick={toggleTheme}
      aria-label={isReady ? `Switch to ${nextTheme} theme` : "Toggle theme"}
      title={isReady ? `Switch to ${nextTheme} theme` : "Toggle theme"}
    >
      <span className="theme-toggle-track" aria-hidden="true">
        <span className="theme-toggle-thumb" />
      </span>
      <span className="theme-toggle-copy">
        <strong>{isReady ? `${isDark ? "Dark" : "Light"} theme` : "Theme"}</strong>
        <small>{isReady ? `Switch to ${nextTheme}` : "Loading preference"}</small>
      </span>
    </button>
  );
}
