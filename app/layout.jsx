import './globals.css'
import SessionProvider from '../components/SessionProvider'
import AppShell from '../components/AppShell'

export const metadata = {
  title: 'WooCMS',
  description: 'WooCommerce Order Manager',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>
          <AppShell>{children}</AppShell>
        </SessionProvider>
      </body>
    </html>
  )
}
