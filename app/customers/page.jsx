'use client'
import { useState } from 'react'
import useSWR from 'swr'
import { Icons } from '../../lib/icons'

const Sk = ({ h = 20, w = '100%', mb = 8 }) => (
  <div style={{ height: h, width: w, background: 'var(--surface-alt)', borderRadius: 6, marginBottom: mb, animation: 'pulse 1.5s ease-in-out infinite' }} />
)

export default function CustomersPage() {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  const query = new URLSearchParams({ page, per_page: 10 })
  if (search) query.set('search', search)

  const { data, error, isLoading, mutate } = useSWR(`/api/customers?${query}`)

  const customers = data?.customers || []
  const totalPages = data?.total_pages || 1

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: 'var(--text)', margin: 0 }}>Customers</h1>
          <p style={{ color: 'var(--text-secondary)', margin: '6px 0 0', fontSize: 14 }}>
            {data ? `${data.total} customers` : 'Your customer list'}
          </p>
        </div>
        <div style={{ position: 'relative' }}>
          <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>{Icons.search}</span>
          <input
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1) }}
            placeholder="Search customers..."
            style={{ paddingLeft: 38, padding: '9px 14px 9px 38px', border: '1px solid var(--border)', borderRadius: 8, fontSize: 14, fontFamily: 'var(--font)', background: 'var(--surface)', color: 'var(--text)', outline: 'none', width: 220 }}
            onFocus={e => e.target.style.borderColor = 'var(--accent)'}
            onBlur={e => e.target.style.borderColor = 'var(--border)'}
          />
        </div>
      </div>

      {error && (
        <div style={{ background: 'var(--danger-bg)', border: '1px solid var(--danger)', borderRadius: 'var(--radius)', padding: '14px 20px', marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 14, color: 'var(--danger)' }}>Failed to load customers</span>
          <button onClick={() => mutate()} style={{ background: 'var(--danger)', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 14px', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font)' }}>Retry</button>
        </div>
      )}

      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              {['Customer', 'Email', 'Location', 'Orders', 'Total Spent'].map(h => (
                <th key={h} style={{ padding: '10px 20px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.8 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                  {Array.from({ length: 5 }).map((_, j) => (
                    <td key={j} style={{ padding: '14px 20px' }}><Sk h={16} mb={0} /></td>
                  ))}
                </tr>
              ))
            ) : customers.length === 0 ? (
              <tr><td colSpan={5} style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)', fontSize: 14 }}>No customers found</td></tr>
            ) : customers.map(c => (
              <tr
                key={c.id}
                style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-alt)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <td style={{ padding: '14px 20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)', fontSize: 13, fontWeight: 700, flexShrink: 0 }}>
                      {c.first_name?.charAt(0) || '?'}
                    </div>
                    <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--text)' }}>{c.first_name} {c.last_name}</span>
                  </div>
                </td>
                <td style={{ padding: '14px 20px', fontSize: 14, color: 'var(--text-secondary)' }}>{c.email}</td>
                <td style={{ padding: '14px 20px', fontSize: 13, color: 'var(--text-secondary)' }}>
                  {c.billing?.city ? `${c.billing.city}, ${c.billing.country}` : '—'}
                </td>
                <td style={{ padding: '14px 20px', fontSize: 14, fontFamily: 'var(--mono)' }}>{c.orders_count}</td>
                <td style={{ padding: '14px 20px', fontSize: 14, fontFamily: 'var(--mono)', fontWeight: 600, color: 'var(--accent)' }}>
                  €{parseFloat(c.total_spent).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 12, marginTop: 20 }}>
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            style={{ padding: '8px 16px', border: '1px solid var(--border)', borderRadius: 8, background: 'var(--surface)', color: page === 1 ? 'var(--text-muted)' : 'var(--text)', fontSize: 14, cursor: page === 1 ? 'default' : 'pointer', fontFamily: 'var(--font)' }}
          >
            Previous
          </button>
          <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Page {page} of {totalPages}</span>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            style={{ padding: '8px 16px', border: '1px solid var(--border)', borderRadius: 8, background: 'var(--surface)', color: page === totalPages ? 'var(--text-muted)' : 'var(--text)', fontSize: 14, cursor: page === totalPages ? 'default' : 'pointer', fontFamily: 'var(--font)' }}
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}
