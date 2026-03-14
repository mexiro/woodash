'use client'
import { useState } from 'react'
import { Icons } from '../../lib/icons'

export default function SettingsPage() {
  const [connected, setConnected] = useState(false)
  const [storeUrl, setStoreUrl] = useState('')
  const [consumerKey, setConsumerKey] = useState('')
  const [consumerSecret, setConsumerSecret] = useState('')
  const [toast, setToast] = useState(null)

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  const handleConnect = () => {
    if (storeUrl && consumerKey && consumerSecret) {
      setConnected(true)
      showToast('Connected to WooCommerce!')
    } else {
      showToast('Please fill in all fields', 'error')
    }
  }

  return (
    <div style={{ maxWidth: 560 }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: 'var(--text)', margin: 0 }}>WooCommerce Connection</h1>
        <p style={{ color: 'var(--text-secondary)', margin: '6px 0 0', fontSize: 14 }}>Connect your WordPress store via REST API</p>
      </div>

      {/* Demo mode badge */}
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 14px', borderRadius: 999, background: '#FEF3C7', border: '1px solid #FDE68A', marginBottom: 24 }}>
        <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#F59E0B' }} />
        <span style={{ fontSize: 13, fontWeight: 600, color: '#92400E' }}>Demo Mode — using sample data</span>
      </div>

      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 32 }}>
        {connected && (
          <div style={{ background: '#D1FAE5', border: '1px solid #A7F3D0', borderRadius: 8, padding: '12px 16px', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: '#065F46', fontWeight: 500 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10B981' }} /> Connected to store
          </div>
        )}

        {[
          { label: 'Store URL',        placeholder: 'https://yourstore.com',    value: storeUrl,       onChange: setStoreUrl,       hint: 'Your WordPress/WooCommerce store URL',                      mono: false },
          { label: 'Consumer Key',     placeholder: 'ck_xxxxxxxxxxxxxxxx',      value: consumerKey,    onChange: setConsumerKey,    hint: 'WooCommerce → Settings → Advanced → REST API',             mono: true  },
          { label: 'Consumer Secret',  placeholder: 'cs_xxxxxxxxxxxxxxxx',      value: consumerSecret, onChange: setConsumerSecret, hint: 'Keep this secret and never share it', type: 'password',    mono: true  },
        ].map(f => (
          <div key={f.label} style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text)', marginBottom: 6 }}>{f.label}</label>
            <input
              type={f.type || 'text'}
              value={f.value}
              onChange={e => f.onChange(e.target.value)}
              placeholder={f.placeholder}
              style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--border)', borderRadius: 8, fontSize: 14, fontFamily: f.mono ? 'var(--mono)' : 'var(--font)', background: 'var(--bg)', color: 'var(--text)', outline: 'none', boxSizing: 'border-box' }}
              onFocus={e => e.target.style.borderColor = 'var(--accent)'}
              onBlur={e => e.target.style.borderColor = 'var(--border)'}
            />
            <span style={{ display: 'block', fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>{f.hint}</span>
          </div>
        ))}

        <button
          onClick={handleConnect}
          style={{ width: '100%', padding: '12px 20px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 8, fontSize: 15, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font)', marginTop: 8 }}
          onMouseEnter={e => e.target.style.background = 'var(--accent-hover)'}
          onMouseLeave={e => e.target.style.background = 'var(--accent)'}
        >
          {connected ? 'Reconnect' : 'Connect Store'}
        </button>
      </div>

      <div style={{ marginTop: 24, padding: '16px 20px', background: 'var(--surface-alt)', borderRadius: 8, fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
        <strong style={{ color: 'var(--text)' }}>How to get API keys:</strong><br />
        In your WordPress admin, go to WooCommerce → Settings → Advanced → REST API → Add Key. Set permissions to Read/Write, then copy the Consumer Key and Secret here.
      </div>

      {toast && (
        <div style={{ position: 'fixed', top: 20, left: '50%', transform: 'translateX(-50%)', zIndex: 9999, padding: '12px 24px', borderRadius: 10, background: toast.type === 'error' ? 'var(--danger)' : 'var(--accent)', color: '#fff', fontSize: 14, fontWeight: 600, boxShadow: 'var(--shadow-lg)', animation: 'toastIn 0.25s ease-out', display: 'flex', alignItems: 'center', gap: 8 }}>
          {Icons.check} {toast.msg}
        </div>
      )}
    </div>
  )
}
