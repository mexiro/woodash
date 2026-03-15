'use client'
import Link from 'next/link'
import useSWR from 'swr'
import { useSession } from 'next-auth/react'
import { Icons } from '../../lib/icons'
import StatusBadge from '../../components/StatusBadge'

const Sk = ({ h = 20, w = '100%', mb = 8 }) => (
  <div style={{ height: h, width: w, background: 'var(--surface-alt)', borderRadius: 6, marginBottom: mb, animation: 'pulse 1.5s ease-in-out infinite' }} />
)

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
  const { data, error, isLoading, mutate } = useSWR('/api/analytics')

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: 'var(--text)', margin: 0 }}>Welcome back, {userName}</h1>
        <p style={{ color: 'var(--text-secondary)', margin: '6px 0 0', fontSize: 14 }}>Here's what's happening with your store today</p>
      </div>

      {error && (
        <div style={{ background: 'var(--danger-bg)', border: '1px solid var(--danger)', borderRadius: 'var(--radius)', padding: '16px 20px', marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 14, color: 'var(--danger)' }}>Failed to load dashboard data</span>
          <button onClick={() => mutate()} style={{ background: 'var(--danger)', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 14px', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font)' }}>Retry</button>
        </div>
      )}

      {/* Stat cards */}
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 32 }}>
        {isLoading ? (
          [0,1,2,3].map(i => (
            <div key={i} style={{ flex: 1, minWidth: 180, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '20px 24px' }}>
              <Sk h={14} w="60%" mb={16} />
              <Sk h={32} w="70%" mb={6} />
              <Sk h={12} w="50%" mb={0} />
            </div>
          ))
        ) : data ? (
          <>
            <StatCard icon={Icons.box}     label="Total Orders"  value={data.total_orders}                          sub="Last 30 days" />
            <StatCard icon={Icons.dollar}  label="Revenue"       value={`€${data.total_sales.toFixed(2)}`}          sub="Excl. cancelled & refunded" />
            <StatCard icon={Icons.refresh} label="Processing"    value={data.orders_by_status?.processing || 0}     sub="Awaiting fulfillment" />
            <StatCard icon={Icons.clock}   label="Avg Order"     value={`€${data.average_order_value.toFixed(2)}`}  sub="Per order" />
          </>
        ) : null}
      </div>

      {/* Top products */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden', marginBottom: 32 }}>
        <div style={{ padding: '18px 24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)' }}>Top Products</span>
          <Link href="/orders" style={{ color: 'var(--accent)', fontSize: 13, fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
            All Orders {Icons.arrowRight}
          </Link>
        </div>
        {isLoading ? (
          <div style={{ padding: '16px 24px' }}>
            {[0,1,2,3,4].map(i => <Sk key={i} h={40} mb={8} />)}
          </div>
        ) : data?.top_products?.length ? (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                {['Product', 'Units Sold', 'Revenue'].map(h => (
                  <th key={h} style={{ padding: '10px 24px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.8 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.top_products.map((p, i) => (
                <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '14px 24px', fontSize: 14, fontWeight: 500, color: 'var(--text)' }}>{p.name}</td>
                  <td style={{ padding: '14px 24px', fontSize: 14, fontFamily: 'var(--mono)' }}>{p.quantity_sold}</td>
                  <td style={{ padding: '14px 24px', fontSize: 14, fontFamily: 'var(--mono)', fontWeight: 600, color: 'var(--accent)' }}>€{p.revenue.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : null}
      </div>

      {/* Orders by status */}
      {data?.orders_by_status && (
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '20px 24px' }}>
          <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)', marginBottom: 16 }}>Orders by Status</div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {Object.entries(data.orders_by_status).map(([status, count]) => (
              <div key={status} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', background: 'var(--surface-alt)', borderRadius: 8 }}>
                <StatusBadge status={status} small />
                <span style={{ fontFamily: 'var(--mono)', fontWeight: 700, fontSize: 16, color: 'var(--text)' }}>{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
