import { JetBrains_Mono } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/providers/theme-provider"
import { cn } from "@/lib/utils"
import { QueryProvider } from "@/providers/query-provider"
import KeyboardShortcuts from "@/components/keyboardShortcuts"

// Monospace-only design: JetBrains Mono drives --font-mono, and globals.css
// points --font-sans/--font-serif at the same family.
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("font-mono antialiased", jetbrainsMono.variable)}
    >
      <body>
        <QueryProvider>
          <ThemeProvider>
            {children}
            <KeyboardShortcuts />
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  )
}
