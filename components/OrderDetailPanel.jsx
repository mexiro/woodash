'use client'
import { Icons } from '../lib/icons'
import { STATUS_CONFIG, STATUS_FLOW } from '../lib/mock-data'
import StatusBadge from './StatusBadge'

export default function OrderDetailPanel({ order, onClose, onStatusChange }) {
  if (!order) return null
  const o = order
  const nextStatuses = STATUS_FLOW[o.status] || []
  const tax = o.total * 0.19
  const subtotal = o.total - tax

  return (
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', justifyContent: 'flex-end' }}
      onClick={onClose}
    >
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(2px)' }} />
      <div
        onClick={e => e.stopPropagation()}
        style={{
          position: 'relative', width: '100%', maxWidth: 520,
          background: 'var(--bg)', height: '100%', overflowY: 'auto',
          boxShadow: '-8px 0 30px rgba(0,0,0,0.12)',
          animation: 'slideIn 0.25s ease-out',
        }}
      >
        <div style={{ position: 'sticky', top: 0, background: 'var(--bg)', padding: '20px 28px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 2 }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text)' }}>Order #{o.id}</div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>{o.date}</div>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'var(--surface-alt)', border: '1px solid var(--border)', borderRadius: 8, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-secondary)' }}
          >
            {Icons.close}
          </button>
        </div>

        <div style={{ padding: '24px 28px' }}>
          {/* Status */}
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 20, marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: nextStatuses.length ? 16 : 0 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)' }}>Status</span>
              <StatusBadge status={o.status} />
            </div>
            {nextStatuses.length > 0 && (
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {nextStatuses.map(ns => (
                  <button
                    key={ns}
                    onClick={() => onStatusChange(o.id, ns)}
                    style={{ padding: '7px 14px', borderRadius: 6, border: `1px solid ${STATUS_CONFIG[ns].color}30`, background: STATUS_CONFIG[ns].bg, color: STATUS_CONFIG[ns].color, fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font)' }}
                    onMouseEnter={e => { e.target.style.background = STATUS_CONFIG[ns].color; e.target.style.color = '#fff' }}
                    onMouseLeave={e => { e.target.style.background = STATUS_CONFIG[ns].bg; e.target.style.color = STATUS_CONFIG[ns].color }}
                  >
                    Move to {STATUS_CONFIG[ns].label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Customer */}
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 20, marginBottom: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 12 }}>Customer</div>
            <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)' }}>{o.customer}</div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>{o.email}</div>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 8, lineHeight: 1.5 }}>{o.address}</div>
          </div>

          {/* Items */}
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 20, marginBottom: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 12 }}>Items</div>
            {o.items.map((item, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: i < o.items.length - 1 ? '1px solid var(--border)' : 'none' }}>
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
                <span>Total</span><span style={{ fontFamily: 'var(--mono)' }}>€{o.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Payment + Shipping */}
          <div style={{ display: 'flex', gap: 12 }}>
            <div style={{ flex: 1, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 16 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6 }}>Payment</div>
              <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--text)' }}>{o.payment}</div>
            </div>
            <div style={{ flex: 1, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 16 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6 }}>Shipping</div>
              <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--text)' }}>{o.shipping}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
