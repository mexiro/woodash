'use client'
import { useSession, signOut } from 'next-auth/react'
import { usePathname } from 'next/navigation'
import { SWRConfig } from 'swr'
import Sidebar from './Sidebar'
import fetcher from '../lib/fetcher'

export default function AppShell({ children }) {
  const { data: session, status } = useSession()
  const pathname = usePathname()
  const isLoginPage = pathname === '/login'

  if (isLoginPage) return <>{children}</>

  if (status === 'loading') {
    return <div style={{ height: '100vh', background: 'var(--bg)' }} />
  }

  const handleLogout = () => signOut({ callbackUrl: '/login' })

  return (
    <SWRConfig value={{ fetcher }}>
      <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: 'var(--bg)' }}>
        <Sidebar user={session?.user} onLogout={handleLogout} />
        <main style={{ flex: 1, overflow: 'auto', padding: '32px 40px' }}>
          <div style={{ maxWidth: 1100, animation: 'fadeUp 0.3s ease-out' }}>
            {children}
          </div>
        </main>
      </div>
    </SWRConfig>
  )
}
