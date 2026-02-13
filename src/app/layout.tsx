import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AssessMate POC',
  description: 'AI-powered case note assistant for early intervention assessors',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
