import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Mcq System',
  description: 'Mcq_System',
  generator: 'Mcq System',
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
