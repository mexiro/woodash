'use client'
import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Sidebar from './Sidebar'

export default function AppShell({ children }) {
  const [user, setUser] = useState(null)
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
    const stored = localStorage.getItem('woo_user')
    if (stored) {
      setUser(JSON.parse(stored))
    } else if (pathname !== '/login') {
      router.push('/login')
    }
  }, [pathname])

  const handleLogout = () => {
    localStorage.removeItem('woo_user')
    setUser(null)
    router.push('/login')
  }

  if (!mounted) return null

  const isLoginPage = pathname === '/login'

  if (isLoginPage) return <>{children}</>

  if (!user) return null

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: 'var(--bg)' }}>
      <Sidebar user={user} onLogout={handleLogout} />
      <main style={{ flex: 1, overflow: 'auto', padding: '32px 40px' }}>
        <div style={{ maxWidth: 1100, animation: 'fadeUp 0.3s ease-out' }}>
          {children}
        </div>
      </main>
    </div>
  )
}
