import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

/**
 * Theme provider wrapper. next-themes works in any React app — we use it
 * with `attribute="class"` so it toggles `.dark` on <html>. `defaultTheme`
 * is "dark" to match the main site, and the inline script in index.html
 * applies the same default before React mounts (no flash).
 */
export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
