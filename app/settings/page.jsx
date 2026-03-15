'use client'
import { Icons } from '../../lib/icons'

export default function SettingsPage() {
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
        <div style={{ background: '#FEF3C7', border: '1px solid #FDE68A', borderRadius: 8, padding: '12px 16px', marginBottom: 24, fontSize: 14, color: '#92400E' }}>
          Running in demo mode with sample data. To connect a real store, add your WooCommerce credentials as environment variables and set <code style={{ fontFamily: 'var(--mono)', fontSize: 13 }}>MOCK_MODE=false</code>.
        </div>

        {[
          { label: 'Store URL',       placeholder: 'https://yourstore.com',  hint: 'Your WordPress/WooCommerce store URL',                   mono: false },
          { label: 'Consumer Key',    placeholder: 'ck_xxxxxxxxxxxxxxxx',    hint: 'WooCommerce → Settings → Advanced → REST API',          mono: true  },
          { label: 'Consumer Secret', placeholder: 'cs_xxxxxxxxxxxxxxxx',    hint: 'Keep this secret and never share it', type: 'password', mono: true  },
        ].map(f => (
          <div key={f.label} style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text)', marginBottom: 6 }}>{f.label}</label>
            <input
              type={f.type || 'text'}
              placeholder={f.placeholder}
              readOnly
              disabled
              style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--border)', borderRadius: 8, fontSize: 14, fontFamily: f.mono ? 'var(--mono)' : 'var(--font)', background: 'var(--surface-alt)', color: 'var(--text-muted)', outline: 'none', boxSizing: 'border-box', cursor: 'not-allowed' }}
            />
            <span style={{ display: 'block', fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>{f.hint}</span>
          </div>
        ))}

        <button
          disabled
          style={{ width: '100%', padding: '12px 20px', background: 'var(--surface-alt)', color: 'var(--text-muted)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 15, fontWeight: 600, cursor: 'not-allowed', fontFamily: 'var(--font)', marginTop: 8 }}
        >
          Connect Store
        </button>
      </div>

      <div style={{ marginTop: 24, padding: '16px 20px', background: 'var(--surface-alt)', borderRadius: 8, fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
        <strong style={{ color: 'var(--text)' }}>How to get API keys:</strong><br />
        In your WordPress admin, go to WooCommerce → Settings → Advanced → REST API → Add Key. Set permissions to Read/Write, then add the keys as <code style={{ fontFamily: 'var(--mono)', fontSize: 12 }}>WOOCOMMERCE_KEY</code> and <code style={{ fontFamily: 'var(--mono)', fontSize: 12 }}>WOOCOMMERCE_SECRET</code> environment variables.
      </div>
    </div>
  )
}
