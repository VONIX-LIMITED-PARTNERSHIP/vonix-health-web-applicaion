"use client"

import { Sun, MoonIcon } from "lucide-react" // Changed Moon to MoonIcon
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"

const ModeToggle = () => {
  const { setTheme, theme } = useTheme()

  return (
    <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />{" "}
      {/* Changed Moon to MoonIcon */}
      <span className="sr-only">Toggle dark mode</span>
    </Button>
  )
}

export default ModeToggle
export { ModeToggle }
