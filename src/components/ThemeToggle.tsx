"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  // Apply theme on initial load and when theme state changes
  useEffect(() => {
    const stored = localStorage.getItem("theme");
    const systemPrefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    const initialTheme = stored ?? (systemPrefersDark ? "dark" : "light");

    setTheme(initialTheme as "light" | "dark");
  }, []);

  useEffect(() => {
    // Apply theme class to document
    document.documentElement.classList.toggle("dark", theme === "dark");
    // Persist theme in localStorage
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };
  return (
    <Button
      onClick={toggleTheme}
      className="rounded-full  dark:bg-neutral-800 text-gray-800 dark:text-gray-100 transition-all"
      variant={"ghost"}
      size={"icon"}
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
    >
      {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
    </Button>
  );
}
