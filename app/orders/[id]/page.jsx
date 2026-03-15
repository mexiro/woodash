'use client'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import useSWR from 'swr'
import { Icons } from '../../../lib/icons'
import { STATUS_CONFIG, STATUS_FLOW } from '../../../lib/order-config'
import StatusBadge from '../../../components/StatusBadge'
import { useState } from 'react'

const Sk = ({ h = 20, w = '100%', mb = 8 }) => (
  <div style={{ height: h, width: w, background: 'var(--surface-alt)', borderRadius: 6, marginBottom: mb, animation: 'pulse 1.5s ease-in-out infinite' }} />
)

export default function OrderDetailPage() {
  const { id } = useParams()
  const { data: order, error, isLoading, mutate } = useSWR(`/api/orders/${id}`)
  const [toast, setToast] = useState(null)

  const updateStatus = async (newStatus) => {
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      if (!res.ok) throw new Error('Update failed')
      mutate()
      setToast({ msg: `Order #${id} → ${STATUS_CONFIG[newStatus]?.label || newStatus}` })
      setTimeout(() => setToast(null), 3000)
    } catch {
      setToast({ msg: 'Failed to update order', type: 'error' })
      setTimeout(() => setToast(null), 3000)
    }
  }

  if (isLoading) {
    return (
      <div style={{ maxWidth: 640 }}>
        <Sk h={14} w={120} mb={24} />
        <Sk h={32} w="50%" mb={8} />
        <Sk h={14} w="30%" mb={32} />
        <Sk h={100} mb={16} />
        <Sk h={120} mb={16} />
        <Sk h={200} mb={16} />
      </div>
    )
  }

  if (error || !order) {
    return (
      <div style={{ textAlign: 'center', padding: 60 }}>
        <p style={{ fontSize: 18, color: 'var(--text-secondary)', marginBottom: 16 }}>
          {error ? 'Failed to load order' : `Order #${id} not found`}
        </p>
        <Link href="/orders" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 600 }}>← Back to Orders</Link>
      </div>
    )
  }

  const nextStatuses = STATUS_FLOW[order.status] || []
  const total = parseFloat(order.total)
  const tax = parseFloat(order.total_tax || 0)
  const subtotal = total - tax
  const customerName = `${order.billing.first_name} ${order.billing.last_name}`
  const address = `${order.billing.address_1}, ${order.billing.city} ${order.billing.postcode}, ${order.billing.country}`
  const date = order.date_created ? order.date_created.split('T')[0] : ''

  return (
    <div style={{ maxWidth: 640 }}>
      <Link href="/orders" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--text-secondary)', textDecoration: 'none', fontSize: 14, fontWeight: 500, marginBottom: 24 }}>
        ← Back to Orders
      </Link>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: 'var(--text)', margin: 0 }}>Order #{order.number}</h1>
          <p style={{ color: 'var(--text-muted)', margin: '4px 0 0', fontSize: 14 }}>{date}</p>
        </div>
        <StatusBadge status={order.status} />
      </div>

      {/* Status transitions */}
      {nextStatuses.length > 0 && (
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 20, marginBottom: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 12 }}>Change Status</div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {nextStatuses.map(ns => (
              <button
                key={ns}
                onClick={() => updateStatus(ns)}
                style={{ padding: '7px 14px', borderRadius: 6, border: `1px solid ${STATUS_CONFIG[ns].color}30`, background: STATUS_CONFIG[ns].bg, color: STATUS_CONFIG[ns].color, fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font)' }}
                onMouseEnter={e => { e.target.style.background = STATUS_CONFIG[ns].color; e.target.style.color = '#fff' }}
                onMouseLeave={e => { e.target.style.background = STATUS_CONFIG[ns].bg; e.target.style.color = STATUS_CONFIG[ns].color }}
              >
                Move to {STATUS_CONFIG[ns].label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Customer */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 20, marginBottom: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 12 }}>Customer</div>
        <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)' }}>{customerName}</div>
        <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>{order.billing.email}</div>
        <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 8, lineHeight: 1.5 }}>{address}</div>
        {order.customer_note && (
          <div style={{ marginTop: 10, padding: '8px 12px', background: 'var(--surface-alt)', borderRadius: 6, fontSize: 13, color: 'var(--text-secondary)', fontStyle: 'italic' }}>
            "{order.customer_note}"
          </div>
        )}
      </div>

      {/* Items */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 20, marginBottom: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 12 }}>Items</div>
        {order.line_items.map((item, i) => (
          <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: i < order.line_items.length - 1 ? '1px solid var(--border)' : 'none' }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--text)' }}>{item.name}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Qty: {item.quantity} × €{parseFloat(item.price).toFixed(2)}</div>
            </div>
            <span style={{ fontFamily: 'var(--mono)', fontWeight: 600, fontSize: 14 }}>€{parseFloat(item.total).toFixed(2)}</span>
          </div>
        ))}
        <div style={{ borderTop: '2px solid var(--border)', marginTop: 12, paddingTop: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--text-secondary)', marginBottom: 6 }}>
            <span>Subtotal</span><span style={{ fontFamily: 'var(--mono)' }}>€{subtotal.toFixed(2)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--text-secondary)', marginBottom: 8 }}>
            <span>Tax</span><span style={{ fontFamily: 'var(--mono)' }}>€{tax.toFixed(2)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 16, fontWeight: 700, color: 'var(--text)' }}>
            <span>Total</span><span style={{ fontFamily: 'var(--mono)' }}>€{total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Payment + Shipping */}
      <div style={{ display: 'flex', gap: 12 }}>
        <div style={{ flex: 1, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 16 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6 }}>Payment</div>
          <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--text)' }}>{order.payment_method_title}</div>
        </div>
        <div style={{ flex: 1, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 16 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6 }}>Ship to</div>
          <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--text)' }}>
            {order.shipping?.city ? `${order.shipping.city}, ${order.shipping.country}` : `${order.billing.city}, ${order.billing.country}`}
          </div>
        </div>
      </div>

      {toast && (
        <div style={{ position: 'fixed', top: 20, left: '50%', transform: 'translateX(-50%)', zIndex: 9999, padding: '12px 24px', borderRadius: 10, background: toast.type === 'error' ? 'var(--danger)' : 'var(--accent)', color: '#fff', fontSize: 14, fontWeight: 600, boxShadow: 'var(--shadow-lg)', animation: 'toastIn 0.25s ease-out', display: 'flex', alignItems: 'center', gap: 8 }}>
          {Icons.check} {toast.msg}
        </div>
      )}
    </div>
  )
}
