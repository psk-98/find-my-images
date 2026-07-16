"use client"

import { ThemeProvider as NextThemesProvider } from "next-theme"
import type * as React from "react"

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
