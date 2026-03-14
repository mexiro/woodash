'use client'
import { useState } from 'react'
import { MOCK_ORDERS } from '../../lib/mock-data'
import { Icons } from '../../lib/icons'
import StatusBadge from '../../components/StatusBadge'

export default function InvoicesPage() {
  const [toast, setToast] = useState(null)
  const invoiceable = MOCK_ORDERS.filter(o => ['completed', 'processing'].includes(o.status))

  const showToast = (msg) => {
    setToast({ msg })
    setTimeout(() => setToast(null), 3000)
  }

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: 'var(--text)', margin: 0 }}>Invoices</h1>
        <p style={{ color: 'var(--text-secondary)', margin: '6px 0 0', fontSize: 14 }}>View and manage invoices for completed and processing orders</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {invoiceable.map(o => (
          <div
            key={o.id}
            style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16, transition: 'box-shadow 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.boxShadow = 'var(--shadow-lg)'}
            onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 20, minWidth: 240 }}>
              <div style={{ width: 42, height: 42, borderRadius: 8, background: 'var(--accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)', flexShrink: 0 }}>
                {Icons.invoice}
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>INV-{o.id}</div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{o.customer}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{o.date}</div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
              <StatusBadge status={o.status} small />
              <span style={{ fontFamily: 'var(--mono)', fontWeight: 700, fontSize: 16, minWidth: 80, textAlign: 'right' }}>€{o.total.toFixed(2)}</span>
              <button
                onClick={() => showToast(`Invoice INV-${o.id} preview opened`)}
                style={{ background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font)', display: 'flex', alignItems: 'center', gap: 6 }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--accent-hover)'}
                onMouseLeave={e => e.currentTarget.style.background = 'var(--accent)'}
              >
                {Icons.download} Preview
              </button>
            </div>
          </div>
        ))}
      </div>

      {toast && (
        <div style={{ position: 'fixed', top: 20, left: '50%', transform: 'translateX(-50%)', zIndex: 9999, padding: '12px 24px', borderRadius: 10, background: 'var(--accent)', color: '#fff', fontSize: 14, fontWeight: 600, boxShadow: 'var(--shadow-lg)', animation: 'toastIn 0.25s ease-out', display: 'flex', alignItems: 'center', gap: 8 }}>
          {Icons.check} {toast.msg}
        </div>
      )}
    </div>
  )
}
