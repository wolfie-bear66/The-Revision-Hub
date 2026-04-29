import './globals.css'
import { Analytics } from '@vercel/analytics/next'

export const metadata = {
  title: 'The Revision Hub',
  description: 'GCSE flashcard revision — all subjects in one place',
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
