import './globals.css'
import ThemeProvider from '../components/ThemeProvider'
import CookieBanner from '../components/CookieBanner'

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
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <body className="antialiased min-h-screen">
        <ThemeProvider>
          {children}
          <CookieBanner />
        </ThemeProvider>
      </body>
    </html>
  )
}
