import type { Metadata } from 'next'
import './globals.css'
config
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner"
import { ThemeProvider } from "@/components/theme-provider"
main

export const metadata: Metadata = {
  title: 'samrs project',
  description: 'Created for SAMRS',
  generator: 'samrs.dev',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
config
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          {children}
          <Toaster />
main
        </ThemeProvider>
      </body>
    </html>
  )
}
