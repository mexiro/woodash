'use client'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { MOCK_ORDERS, STATUS_CONFIG, STATUS_FLOW } from '../../../lib/mock-data'
import { Icons } from '../../../lib/icons'
import StatusBadge from '../../../components/StatusBadge'
import { useState } from 'react'

export default function OrderDetailPage() {
  const { id } = useParams()
  const [order, setOrder] = useState(() => MOCK_ORDERS.find(o => o.id === Number(id)) || null)
  const [toast, setToast] = useState(null)

  if (!order) {
    return (
      <div style={{ textAlign: 'center', padding: 60 }}>
        <p style={{ fontSize: 18, color: 'var(--text-secondary)' }}>Order #{id} not found</p>
        <Link href="/orders" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 600 }}>← Back to Orders</Link>
      </div>
    )
  }

  const updateStatus = (newStatus) => {
    setOrder(prev => ({ ...prev, status: newStatus }))
    setToast({ msg: `Order #${order.id} → ${STATUS_CONFIG[newStatus].label}` })
    setTimeout(() => setToast(null), 3000)
  }

  const nextStatuses = STATUS_FLOW[order.status] || []
  const tax = order.total * 0.19
  const subtotal = order.total - tax

  return (
    <div style={{ maxWidth: 640 }}>
      <Link href="/orders" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--text-secondary)', textDecoration: 'none', fontSize: 14, fontWeight: 500, marginBottom: 24 }}>
        ← Back to Orders
      </Link>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: 'var(--text)', margin: 0 }}>Order #{order.id}</h1>
          <p style={{ color: 'var(--text-muted)', margin: '4px 0 0', fontSize: 14 }}>{order.date}</p>
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
        <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)' }}>{order.customer}</div>
        <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>{order.email}</div>
        <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 8, lineHeight: 1.5 }}>{order.address}</div>
      </div>

      {/* Items */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 20, marginBottom: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 12 }}>Items</div>
        {order.items.map((item, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: i < order.items.length - 1 ? '1px solid var(--border)' : 'none' }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--text)' }}>{item.name}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Qty: {item.qty} × €{item.price.toFixed(2)}</div>
            </div>
            <span style={{ fontFamily: 'var(--mono)', fontWeight: 600, fontSize: 14 }}>€{(item.qty * item.price).toFixed(2)}</span>
          </div>
        ))}
        <div style={{ borderTop: '2px solid var(--border)', marginTop: 12, paddingTop: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--text-secondary)', marginBottom: 6 }}>
            <span>Subtotal</span><span style={{ fontFamily: 'var(--mono)' }}>€{subtotal.toFixed(2)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--text-secondary)', marginBottom: 8 }}>
            <span>Tax (19%)</span><span style={{ fontFamily: 'var(--mono)' }}>€{tax.toFixed(2)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 16, fontWeight: 700, color: 'var(--text)' }}>
            <span>Total</span><span style={{ fontFamily: 'var(--mono)' }}>€{order.total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Payment + Shipping */}
      <div style={{ display: 'flex', gap: 12 }}>
        <div style={{ flex: 1, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 16 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6 }}>Payment</div>
          <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--text)' }}>{order.payment}</div>
        </div>
        <div style={{ flex: 1, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 16 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6 }}>Shipping</div>
          <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--text)' }}>{order.shipping}</div>
        </div>
      </div>

      {toast && (
        <div style={{ position: 'fixed', top: 20, left: '50%', transform: 'translateX(-50%)', zIndex: 9999, padding: '12px 24px', borderRadius: 10, background: 'var(--accent)', color: '#fff', fontSize: 14, fontWeight: 600, boxShadow: 'var(--shadow-lg)', animation: 'toastIn 0.25s ease-out', display: 'flex', alignItems: 'center', gap: 8 }}>
          {Icons.check} {toast.msg}
        </div>
      )}
    </div>
  )
}
