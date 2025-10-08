import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'VernierSim',
  description: 'Simulateur de vernier interactif',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="min-h-dvh bg-neutral-50 text-neutral-900 antialiased">{children}</body>
    </html>
  )
}
