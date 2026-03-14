import './globals.css'
import AppShell from '../components/AppShell'

export const metadata = {
  title: 'WooCMS',
  description: 'WooCommerce Order Manager',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  )
}
