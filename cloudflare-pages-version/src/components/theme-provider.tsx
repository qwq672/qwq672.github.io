import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

/**
 * Wraps next-themes' ThemeProvider. next-themes works fine in a plain
 * React/Vite app (no Next.js required) — it just reads/writes
 * localStorage and toggles the `dark` class on <html>.
 */
export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
