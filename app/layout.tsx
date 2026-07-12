import { Geist, Geist_Mono, JetBrains_Mono } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/providers/theme-provider"
import { cn } from "@/lib/utils"
import { QueryProvider } from "@/providers/query-provider"
import KeyboardShortcuts from "@/components/keyboardShortcuts"
const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
})

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
      className={cn(
        "antialiased",
        fontSans.variable,
        "font-mono",
        jetbrainsMono.variable
      )}
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
