'use client'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { MOCK_ORDERS } from '../../lib/mock-data'
import { Icons } from '../../lib/icons'
import StatusBadge from '../../components/StatusBadge'

function StatCard({ icon, label, value, sub }) {
  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '20px 24px', flex: 1, minWidth: 180 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
        <div style={{ width: 36, height: 36, borderRadius: 8, background: 'var(--accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)' }}>{icon}</div>
        <span style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 500 }}>{label}</span>
      </div>
      <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--text)', fontFamily: 'var(--mono)', letterSpacing: -1 }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>{sub}</div>}
    </div>
  )
}

export default function DashboardPage() {
  const { data: session } = useSession()
  const userName = session?.user?.name || 'there'

  const stats = {
    total: MOCK_ORDERS.length,
    revenue: MOCK_ORDERS.filter(o => !['cancelled', 'refunded'].includes(o.status)).reduce((s, o) => s + o.total, 0),
    processing: MOCK_ORDERS.filter(o => o.status === 'processing').length,
    pending: MOCK_ORDERS.filter(o => o.status === 'pending').length,
  }

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: 'var(--text)', margin: 0 }}>Welcome back, {userName}</h1>
        <p style={{ color: 'var(--text-secondary)', margin: '6px 0 0', fontSize: 14 }}>Here's what's happening with your store today</p>
      </div>

      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 32 }}>
        <StatCard icon={Icons.box}     label="Total Orders" value={stats.total}                          sub="Last 7 days" />
        <StatCard icon={Icons.dollar}  label="Revenue"      value={`€${stats.revenue.toFixed(2)}`}       sub="Excl. cancelled & refunded" />
        <StatCard icon={Icons.refresh} label="Processing"   value={stats.processing}                     sub="Awaiting fulfillment" />
        <StatCard icon={Icons.clock}   label="Pending"      value={stats.pending}                        sub="Awaiting payment" />
      </div>

      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
        <div style={{ padding: '18px 24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)' }}>Recent Orders</span>
          <Link href="/orders" style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', fontSize: 13, fontWeight: 600, fontFamily: 'var(--font)', display: 'flex', alignItems: 'center', gap: 4, textDecoration: 'none' }}>
            View All {Icons.arrowRight}
          </Link>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              {['Order', 'Customer', 'Total', 'Status', 'Date'].map(h => (
                <th key={h} style={{ padding: '10px 24px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.8 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {MOCK_ORDERS.slice(0, 5).map(o => (
              <tr
                key={o.id}
                style={{ borderBottom: '1px solid var(--border)', cursor: 'pointer', transition: 'background 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-alt)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                onClick={() => window.location.href = `/orders?id=${o.id}`}
              >
                <td style={{ padding: '14px 24px', fontSize: 14, fontWeight: 600, fontFamily: 'var(--mono)', color: 'var(--accent)' }}>#{o.id}</td>
                <td style={{ padding: '14px 24px', fontSize: 14, color: 'var(--text)' }}>{o.customer}</td>
                <td style={{ padding: '14px 24px', fontSize: 14, fontFamily: 'var(--mono)', fontWeight: 500 }}>€{o.total.toFixed(2)}</td>
                <td style={{ padding: '14px 24px' }}><StatusBadge status={o.status} small /></td>
                <td style={{ padding: '14px 24px', fontSize: 13, color: 'var(--text-muted)' }}>{o.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
