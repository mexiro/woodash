'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Icons } from '../lib/icons'
import { MOCK_ORDERS } from '../lib/mock-data'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: Icons.dashboard },
  { href: '/orders',    label: 'Orders',    icon: Icons.orders },
  { href: '/invoices',  label: 'Invoices',  icon: Icons.invoice },
  { href: '/settings',  label: 'Connection', icon: Icons.settings },
]

export default function Sidebar({ user, onLogout }) {
  const pathname = usePathname()
  const processingCount = MOCK_ORDERS.filter(o => o.status === 'processing').length

  return (
    <aside style={{ width: 240, background: 'var(--sidebar-bg)', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
      {/* Logo */}
      <div style={{ padding: '24px 24px 32px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 34, height: 34, borderRadius: 8, background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
          {Icons.woo}
        </div>
        <div>
          <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--sidebar-active)', letterSpacing: -0.3 }}>WooCMS</div>
          <div style={{ fontSize: 11, color: 'var(--sidebar-text)', opacity: 0.6 }}>Order Manager</div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '0 12px' }}>
        {navItems.map(item => {
          const active = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                width: '100%', padding: '11px 14px', marginBottom: 4,
                borderRadius: 8, border: 'none',
                background: active ? 'rgba(255,255,255,0.08)' : 'transparent',
                color: active ? 'var(--sidebar-active)' : 'var(--sidebar-text)',
                fontSize: 14, fontWeight: active ? 600 : 400,
                fontFamily: 'var(--font)', cursor: 'pointer',
                transition: 'all 0.15s', textDecoration: 'none',
              }}
              onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'rgba(255,255,255,0.04)' }}
              onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent' }}
            >
              <span style={{ opacity: active ? 1 : 0.6 }}>{item.icon}</span>
              {item.label}
              {item.href === '/orders' && processingCount > 0 && (
                <span style={{ marginLeft: 'auto', background: 'var(--accent)', color: '#fff', fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 99, fontFamily: 'var(--mono)' }}>
                  {processingCount}
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* User footer */}
      <div style={{ padding: '12px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 8, background: 'rgba(255,255,255,0.04)' }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 13, fontWeight: 700 }}>
            {user?.name?.charAt(0) || '?'}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--sidebar-active)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.name}</div>
            <div style={{ fontSize: 11, color: 'var(--sidebar-text)', opacity: 0.6 }}>{user?.role}</div>
          </div>
          <button
            onClick={onLogout}
            title="Sign out"
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--sidebar-text)', opacity: 0.5, padding: 4 }}
            onMouseEnter={e => e.currentTarget.style.opacity = '1'}
            onMouseLeave={e => e.currentTarget.style.opacity = '0.5'}
          >
            {Icons.logout}
          </button>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px 4px' }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#EF4444' }} />
          <span style={{ fontSize: 11, color: 'var(--sidebar-text)', opacity: 0.6 }}>Not Connected</span>
        </div>
      </div>
    </aside>
  )
}
