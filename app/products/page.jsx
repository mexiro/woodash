'use client'
import { useState } from 'react'
import useSWR from 'swr'
import { Icons } from '../../lib/icons'

const Sk = ({ h = 20, w = '100%', mb = 8 }) => (
  <div style={{ height: h, width: w, background: 'var(--surface-alt)', borderRadius: 6, marginBottom: mb, animation: 'pulse 1.5s ease-in-out infinite' }} />
)

const STOCK_CONFIG = {
  instock:    { label: 'In Stock',    color: '#10B981', bg: '#D1FAE5' },
  outofstock: { label: 'Out of Stock', color: '#EF4444', bg: '#FEE2E2' },
  onbackorder:{ label: 'Backorder',   color: '#F59E0B', bg: '#FEF3C7' },
}

export default function ProductsPage() {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  const query = new URLSearchParams({ page, per_page: 10 })
  if (search) query.set('search', search)

  const { data, error, isLoading, mutate } = useSWR(`/api/products?${query}`)

  const products = data?.products || []
  const totalPages = data?.total_pages || 1

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: 'var(--text)', margin: 0 }}>Products</h1>
          <p style={{ color: 'var(--text-secondary)', margin: '6px 0 0', fontSize: 14 }}>
            {data ? `${data.total} products` : 'Your product catalog'}
          </p>
        </div>
        <div style={{ position: 'relative' }}>
          <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>{Icons.search}</span>
          <input
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1) }}
            placeholder="Search products..."
            style={{ paddingLeft: 38, padding: '9px 14px 9px 38px', border: '1px solid var(--border)', borderRadius: 8, fontSize: 14, fontFamily: 'var(--font)', background: 'var(--surface)', color: 'var(--text)', outline: 'none', width: 220 }}
            onFocus={e => e.target.style.borderColor = 'var(--accent)'}
            onBlur={e => e.target.style.borderColor = 'var(--border)'}
          />
        </div>
      </div>

      {error && (
        <div style={{ background: 'var(--danger-bg)', border: '1px solid var(--danger)', borderRadius: 'var(--radius)', padding: '14px 20px', marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 14, color: 'var(--danger)' }}>Failed to load products</span>
          <button onClick={() => mutate()} style={{ background: 'var(--danger)', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 14px', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font)' }}>Retry</button>
        </div>
      )}

      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              {['Product', 'SKU', 'Price', 'Stock', 'Category'].map(h => (
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
            ) : products.length === 0 ? (
              <tr><td colSpan={5} style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)', fontSize: 14 }}>No products found</td></tr>
            ) : products.map(p => {
              const sc = STOCK_CONFIG[p.stock_status] || { label: p.stock_status, color: '#6B7280', bg: '#F3F4F6' }
              const category = p.categories?.[0]?.name || '—'
              return (
                <tr
                  key={p.id}
                  style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-alt)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <td style={{ padding: '14px 20px' }}>
                    <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--text)' }}>{p.name}</div>
                  </td>
                  <td style={{ padding: '14px 20px', fontSize: 13, fontFamily: 'var(--mono)', color: 'var(--text-muted)' }}>{p.sku}</td>
                  <td style={{ padding: '14px 20px' }}>
                    <span style={{ fontSize: 14, fontFamily: 'var(--mono)', fontWeight: 600 }}>€{parseFloat(p.price).toFixed(2)}</span>
                    {p.regular_price && p.regular_price !== p.price && (
                      <span style={{ fontSize: 12, fontFamily: 'var(--mono)', color: 'var(--text-muted)', textDecoration: 'line-through', marginLeft: 6 }}>€{parseFloat(p.regular_price).toFixed(2)}</span>
                    )}
                  </td>
                  <td style={{ padding: '14px 20px' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '2px 8px', borderRadius: 999, fontSize: 11, fontWeight: 600, color: sc.color, background: sc.bg }}>
                      <span style={{ width: 5, height: 5, borderRadius: '50%', background: sc.color }} />
                      {sc.label}
                    </span>
                    {p.stock_quantity != null && (
                      <span style={{ marginLeft: 8, fontSize: 12, color: 'var(--text-muted)' }}>({p.stock_quantity})</span>
                    )}
                  </td>
                  <td style={{ padding: '14px 20px', fontSize: 13, color: 'var(--text-secondary)' }}>{category}</td>
                </tr>
              )
            })}
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
