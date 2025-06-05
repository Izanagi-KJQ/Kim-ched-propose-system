import type { Metadata } from 'next'
import './globals.css'

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
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
