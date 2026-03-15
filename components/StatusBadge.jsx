'use client'
import { STATUS_CONFIG } from '../lib/order-config'

export default function StatusBadge({ status, small }) {
  const c = STATUS_CONFIG[status] || { label: status, color: '#6B7280', bg: '#F3F4F6' }
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: small ? '2px 8px' : '4px 12px',
      borderRadius: 999,
      fontSize: small ? 11 : 12,
      fontWeight: 600, letterSpacing: 0.3,
      color: c.color, background: c.bg,
      textTransform: 'uppercase', whiteSpace: 'nowrap',
    }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: c.color }} />
      {c.label}
    </span>
  )
}
