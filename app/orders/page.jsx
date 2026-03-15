'use client'
import { useState, useRef, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import useSWR from 'swr'
import { Icons } from '../../lib/icons'
import { STATUS_CONFIG } from '../../lib/order-config'
import StatusBadge from '../../components/StatusBadge'
import OrderDetailPanel from '../../components/OrderDetailPanel'

const Sk = ({ h = 20, w = '100%', mb = 8 }) => (
  <div style={{ height: h, width: w, background: 'var(--surface-alt)', borderRadius: 6, marginBottom: mb, animation: 'pulse 1.5s ease-in-out infinite' }} />
)

function OrdersContent() {
  const searchParams = useSearchParams()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [page, setPage] = useState(1)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [toast, setToast] = useState(null)
  const toastTimer = useRef(null)

  const query = new URLSearchParams({ page, per_page: 10 })
  if (statusFilter !== 'all') query.set('status', statusFilter)
  if (search) query.set('search', search)

  const { data, error, isLoading, mutate } = useSWR(`/api/orders?${query}`)

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type })
    if (toastTimer.current) clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToast(null), 3000)
  }

  const updateOrderStatus = async (id, newStatus) => {
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      if (!res.ok) throw new Error('Update failed')
      const updated = await res.json()
      mutate()
      if (selectedOrder?.id === id) setSelectedOrder(updated)
      showToast(`Order #${id} → ${STATUS_CONFIG[newStatus]?.label || newStatus}`)
    } catch {
      showToast('Failed to update order', 'error')
    }
  }

  const orders = data?.orders || []
  const totalPages = data?.total_pages || 1

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: 'var(--text)', margin: 0 }}>Orders</h1>
          <p style={{ color: 'var(--text-secondary)', margin: '6px 0 0', fontSize: 14 }}>
            {data ? `${data.total} orders` : 'Track and process customer orders'}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>{Icons.search}</span>
            <input
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1) }}
              placeholder="Search orders..."
              style={{ paddingLeft: 38, padding: '9px 14px 9px 38px', border: '1px solid var(--border)', borderRadius: 8, fontSize: 14, fontFamily: 'var(--font)', background: 'var(--surface)', color: 'var(--text)', outline: 'none', width: 220 }}
              onFocus={e => e.target.style.borderColor = 'var(--accent)'}
              onBlur={e => e.target.style.borderColor = 'var(--border)'}
            />
          </div>
          <select
            value={statusFilter}
            onChange={e => { setStatusFilter(e.target.value); setPage(1) }}
            style={{ padding: '9px 32px 9px 14px', border: '1px solid var(--border)', borderRadius: 8, fontSize: 14, fontFamily: 'var(--font)', background: 'var(--surface)', color: 'var(--text)', cursor: 'pointer', outline: 'none', appearance: 'none', backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236B6860' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 10px center' }}
          >
            <option value="all">All Statuses</option>
            {Object.entries(STATUS_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
        </div>
      </div>

      {error && (
        <div style={{ background: 'var(--danger-bg)', border: '1px solid var(--danger)', borderRadius: 'var(--radius)', padding: '14px 20px', marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 14, color: 'var(--danger)' }}>Failed to load orders</span>
          <button onClick={() => mutate()} style={{ background: 'var(--danger)', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 14px', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font)' }}>Retry</button>
        </div>
      )}

      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              {['Order', 'Customer', 'Items', 'Total', 'Payment', 'Status', 'Date', ''].map(h => (
                <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.8 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                  {Array.from({ length: 8 }).map((_, j) => (
                    <td key={j} style={{ padding: '14px 16px' }}><Sk h={16} mb={0} /></td>
                  ))}
                </tr>
              ))
            ) : orders.length === 0 ? (
              <tr><td colSpan={8} style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)', fontSize: 14 }}>No orders match your criteria</td></tr>
            ) : orders.map(o => {
              const customerName = `${o.billing.first_name} ${o.billing.last_name}`
              const date = o.date_created ? o.date_created.split('T')[0] : ''
              return (
                <tr
                  key={o.id}
                  style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-alt)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <td style={{ padding: '14px 16px', fontSize: 14, fontWeight: 600, fontFamily: 'var(--mono)', color: 'var(--accent)' }}>#{o.number}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--text)' }}>{customerName}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{o.billing.email}</div>
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: 13, color: 'var(--text-secondary)' }}>{o.line_items.length} item{o.line_items.length !== 1 ? 's' : ''}</td>
                  <td style={{ padding: '14px 16px', fontSize: 14, fontFamily: 'var(--mono)', fontWeight: 600 }}>€{parseFloat(o.total).toFixed(2)}</td>
                  <td style={{ padding: '14px 16px', fontSize: 13, color: 'var(--text-secondary)' }}>{o.payment_method_title}</td>
                  <td style={{ padding: '14px 16px' }}><StatusBadge status={o.status} small /></td>
                  <td style={{ padding: '14px 16px', fontSize: 13, color: 'var(--text-muted)' }}>{date}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <button
                      onClick={() => setSelectedOrder(o)}
                      style={{ background: 'var(--surface-alt)', border: '1px solid var(--border)', borderRadius: 6, padding: '6px 12px', fontSize: 12, fontWeight: 600, cursor: 'pointer', color: 'var(--text-secondary)', fontFamily: 'var(--font)' }}
                      onMouseEnter={e => { e.target.style.background = 'var(--accent)'; e.target.style.color = '#fff'; e.target.style.borderColor = 'var(--accent)' }}
                      onMouseLeave={e => { e.target.style.background = 'var(--surface-alt)'; e.target.style.color = 'var(--text-secondary)'; e.target.style.borderColor = 'var(--border)' }}
                    >
                      View
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
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

      <OrderDetailPanel
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
        onStatusChange={updateOrderStatus}
      />

      {toast && (
        <div style={{ position: 'fixed', top: 20, left: '50%', transform: 'translateX(-50%)', zIndex: 9999, padding: '12px 24px', borderRadius: 10, background: toast.type === 'error' ? 'var(--danger)' : 'var(--accent)', color: '#fff', fontSize: 14, fontWeight: 600, fontFamily: 'var(--font)', boxShadow: 'var(--shadow-lg)', animation: 'toastIn 0.25s ease-out', display: 'flex', alignItems: 'center', gap: 8 }}>
          {toast.type === 'error' ? Icons.close : Icons.check} {toast.msg}
        </div>
      )}
    </div>
  )
}

export default function OrdersPage() {
  return (
    <Suspense fallback={<div style={{ padding: 40, color: 'var(--text-muted)' }}>Loading orders...</div>}>
      <OrdersContent />
    </Suspense>
  )
}
