'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AUTHORIZED_USERS } from '../../lib/mock-data'
import { Icons } from '../../lib/icons'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [shake, setShake] = useState(false)
  const router = useRouter()

  const handleSubmit = () => {
    setError('')
    if (!email || !password) { setError('Please fill in all fields'); return }
    setLoading(true)
    setTimeout(() => {
      const user = AUTHORIZED_USERS.find(u => u.email === email && u.password === password)
      if (user) {
        localStorage.setItem('woo_user', JSON.stringify(user))
        router.push('/dashboard')
      } else {
        setError('Invalid email or password')
        setShake(true)
        setTimeout(() => setShake(false), 500)
      }
      setLoading(false)
    }, 800)
  }

  const handleKeyDown = e => { if (e.key === 'Enter') handleSubmit() }

  return (
    <div style={{ fontFamily: 'var(--font)', minHeight: '100vh', background: 'var(--sidebar-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ position: 'fixed', inset: 0, opacity: 0.03, backgroundImage: 'radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)', backgroundSize: '32px 32px' }} />
      <div style={{ position: 'relative', width: '100%', maxWidth: 420, animation: 'fadeScale 0.5s ease-out' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ width: 56, height: 56, borderRadius: 14, background: 'var(--accent)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#fff', marginBottom: 16, animation: 'float 3s ease-in-out infinite', boxShadow: '0 8px 32px rgba(45,90,39,0.3)' }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" /><path d="M8 14s1.5 2 4 2 4-2 4-2" /><path d="M9 9h.01" /><path d="M15 9h.01" />
            </svg>
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: '#fff', margin: '0 0 6px', letterSpacing: -0.5 }}>WooCMS</h1>
          <p style={{ fontSize: 14, color: 'var(--sidebar-text)', margin: 0, opacity: 0.7 }}>Sign in to manage your store</p>
        </div>

        <div style={{ background: 'var(--surface)', borderRadius: 16, padding: '36px 32px', boxShadow: '0 20px 60px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.05)', animation: shake ? 'shake 0.4s ease-in-out' : 'none' }}>
          {error && (
            <div style={{ background: 'var(--danger-bg)', border: '1px solid #FED7D7', borderRadius: 8, padding: '10px 14px', marginBottom: 20, fontSize: 13, color: 'var(--danger)', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 8 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" /></svg>
              {error}
            </div>
          )}

          <div style={{ marginBottom: 18 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text)', marginBottom: 7 }}>Email</label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }}>{Icons.mail}</span>
              <input
                className="login-input"
                type="email" value={email}
                onChange={e => setEmail(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="you@company.com"
                style={{ width: '100%', padding: '12px 14px 12px 44px', border: '1.5px solid var(--border)', borderRadius: 10, fontSize: 15, fontFamily: 'var(--font)', background: 'var(--bg)', color: 'var(--text)', outline: 'none', transition: 'all 0.2s', boxSizing: 'border-box' }}
              />
            </div>
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text)', marginBottom: 7 }}>Password</label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }}>{Icons.lock}</span>
              <input
                className="login-input"
                type={showPw ? 'text' : 'password'} value={password}
                onChange={e => setPassword(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Enter your password"
                style={{ width: '100%', padding: '12px 48px 12px 44px', border: '1.5px solid var(--border)', borderRadius: 10, fontSize: 15, fontFamily: 'var(--font)', background: 'var(--bg)', color: 'var(--text)', outline: 'none', transition: 'all 0.2s', boxSizing: 'border-box' }}
              />
              <button
                onClick={() => setShowPw(!showPw)}
                style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 4 }}
              >
                {showPw ? Icons.eyeOff : Icons.eye}
              </button>
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{ width: '100%', padding: '13px 20px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 600, cursor: loading ? 'wait' : 'pointer', fontFamily: 'var(--font)', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, boxShadow: '0 4px 12px rgba(45,90,39,0.25)' }}
            onMouseEnter={e => { if (!loading) e.currentTarget.style.background = 'var(--accent-hover)' }}
            onMouseLeave={e => { if (!loading) e.currentTarget.style.background = 'var(--accent)' }}
          >
            {loading
              ? <><span style={{ width: 18, height: 18, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.6s linear infinite' }} />Signing in...</>
              : 'Sign In'
            }
          </button>
        </div>

        <div style={{ textAlign: 'center', marginTop: 24, padding: '14px 20px', background: 'rgba(255,255,255,0.04)', borderRadius: 10, border: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ fontSize: 11, color: 'var(--sidebar-text)', opacity: 0.5, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 1, fontWeight: 600 }}>Demo Credentials</div>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 13, color: 'var(--sidebar-text)', opacity: 0.7 }}>erion@example.com / admin123</div>
        </div>
      </div>
    </div>
  )
}
