import React, { useEffect, useState } from "react"
import { Sun, Moon } from "lucide-react"

export const ThemeToggle: React.FC = () => {
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    const saved = localStorage.getItem("portal_theme")
    if (saved === "dark" || saved === "light") return saved
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
  })

  useEffect(() => {
    const root = document.documentElement
    if (theme === "dark") {
      root.classList.add("dark")
    } else {
      root.classList.remove("dark")
    }
    localStorage.setItem("portal_theme", theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme(prev => (prev === "dark" ? "light" : "dark"))
  }

  return (
    <button
      onClick={toggleTheme}
      className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-slate-100/80 dark:bg-white/10 border border-slate-200/80 dark:border-white/15 backdrop-blur-md hover:bg-slate-200/80 dark:hover:bg-white/20 text-slate-700 dark:text-yellow-300 transition-all duration-300 shadow-sm active:scale-95"
      title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      aria-label="Toggle theme"
    >
      {theme === "dark" ? (
        <Sun className="h-4.5 w-4.5 text-yellow-300 transition-transform duration-300 rotate-0 hover:rotate-45" />
      ) : (
        <Moon className="h-4.5 w-4.5 text-slate-700 transition-transform duration-300 -rotate-12 hover:rotate-0" />
      )}
    </button>
  )
}
