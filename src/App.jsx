import { useState, useEffect, useRef } from "react";

// --- Auth Config (change these for your deployment) ---
const AUTHORIZED_USERS = [
  { email: "erion@example.com", password: "admin123", name: "Erion", role: "Admin" },
  { email: "team@example.com", password: "team2026", name: "Team Member", role: "Staff" },
];

// --- Mock Data ---
const MOCK_ORDERS = [
  { id: 1042, customer: "Lena Müller", email: "lena@example.com", items: [{ name: "Organic Face Serum", qty: 2, price: 34.99 }, { name: "Vitamin C Cream", qty: 1, price: 22.50 }], total: 92.48, status: "processing", date: "2026-03-08", payment: "Credit Card", shipping: "DHL Express", address: "Bergmannstr. 14, 10961 Berlin" },
  { id: 1041, customer: "Tomás García", email: "tomas@example.com", items: [{ name: "Hair Growth Oil", qty: 1, price: 28.00 }], total: 28.00, status: "completed", date: "2026-03-07", payment: "PayPal", shipping: "Standard", address: "Calle Mayor 8, 28013 Madrid" },
  { id: 1040, customer: "Sophie Laurent", email: "sophie@example.com", items: [{ name: "Retinol Night Cream", qty: 1, price: 45.00 }, { name: "Eye Contour Gel", qty: 1, price: 19.99 }], total: 64.99, status: "on-hold", date: "2026-03-07", payment: "Bank Transfer", shipping: "DPD", address: "Rue de Rivoli 22, 75001 Paris" },
  { id: 1039, customer: "Marco Bianchi", email: "marco@example.com", items: [{ name: "Beard Oil Premium", qty: 3, price: 18.50 }], total: 55.50, status: "pending", date: "2026-03-06", payment: "Credit Card", shipping: "GLS", address: "Via Roma 45, 20121 Milano" },
  { id: 1038, customer: "Anna Kowalski", email: "anna@example.com", items: [{ name: "Shea Body Butter", qty: 2, price: 24.00 }, { name: "Lip Balm Set", qty: 1, price: 12.99 }], total: 60.99, status: "completed", date: "2026-03-06", payment: "Klarna", shipping: "Hermes", address: "Złota 59, 00-120 Warszawa" },
  { id: 1037, customer: "Erik Johansson", email: "erik@example.com", items: [{ name: "Anti-Aging Serum", qty: 1, price: 55.00 }], total: 55.00, status: "refunded", date: "2026-03-05", payment: "Credit Card", shipping: "PostNord", address: "Sveavägen 12, 111 57 Stockholm" },
  { id: 1036, customer: "Clara Hoffmann", email: "clara@example.com", items: [{ name: "Charcoal Face Mask", qty: 4, price: 15.00 }], total: 60.00, status: "processing", date: "2026-03-05", payment: "PayPal", shipping: "DHL Standard", address: "Kurfürstendamm 200, 10719 Berlin" },
  { id: 1035, customer: "Hugo Petit", email: "hugo@example.com", items: [{ name: "Aloe Vera Gel", qty: 2, price: 11.99 }, { name: "Sunscreen SPF50", qty: 1, price: 19.99 }], total: 43.97, status: "completed", date: "2026-03-04", payment: "Credit Card", shipping: "Colissimo", address: "Bd Haussmann 78, 75008 Paris" },
  { id: 1034, customer: "Mia Schneider", email: "mia@example.com", items: [{ name: "Rose Water Toner", qty: 1, price: 16.50 }], total: 16.50, status: "cancelled", date: "2026-03-04", payment: "Bank Transfer", shipping: "DHL", address: "Maximilianstr. 35, 80539 München" },
  { id: 1033, customer: "Jonas Fischer", email: "jonas@example.com", items: [{ name: "Hyaluronic Acid Serum", qty: 2, price: 29.99 }, { name: "Peptide Moisturizer", qty: 1, price: 38.00 }], total: 97.98, status: "processing", date: "2026-03-03", payment: "Credit Card", shipping: "DHL Express", address: "Friedrichstr. 101, 10117 Berlin" },
];

const STATUS_CONFIG = {
  pending: { label: "Pending", color: "#F59E0B", bg: "#FEF3C7" },
  processing: { label: "Processing", color: "#3B82F6", bg: "#DBEAFE" },
  "on-hold": { label: "On Hold", color: "#8B5CF6", bg: "#EDE9FE" },
  completed: { label: "Completed", color: "#10B981", bg: "#D1FAE5" },
  cancelled: { label: "Cancelled", color: "#EF4444", bg: "#FEE2E2" },
  refunded: { label: "Refunded", color: "#6B7280", bg: "#F3F4F6" },
};

const STATUS_FLOW = {
  pending: ["processing", "on-hold", "cancelled"],
  processing: ["completed", "on-hold", "cancelled"],
  "on-hold": ["processing", "cancelled"],
  completed: ["refunded"],
  cancelled: [],
  refunded: [],
};

const fonts = `@import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=JetBrains+Mono:wght@400;500&display=swap');`;

const cssVars = {
  "--bg": "#F8F7F4", "--surface": "#FFFFFF", "--surface-alt": "#F1EFE9",
  "--border": "#E8E5DD", "--border-strong": "#D4D0C8",
  "--text": "#1A1917", "--text-secondary": "#6B6860", "--text-muted": "#9C9889",
  "--accent": "#2D5A27", "--accent-light": "#E8F0E6", "--accent-hover": "#3D7A35",
  "--sidebar-bg": "#1A1917", "--sidebar-text": "#B8B5AD", "--sidebar-active": "#F8F7F4",
  "--danger": "#C53030", "--danger-bg": "#FFF5F5",
  "--shadow": "0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)",
  "--shadow-lg": "0 4px 20px rgba(0,0,0,0.08)",
  "--radius": "10px", "--font": "'DM Sans', sans-serif", "--mono": "'JetBrains Mono', monospace",
};

// --- Icons ---
const Icon = ({ d, size = 20, color = "currentColor", stroke = 2 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">{typeof d === 'string' ? <path d={d} /> : d}</svg>
);
const Icons = {
  dashboard: <Icon d={<><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></>} />,
  orders: <Icon d={<><path d="M16 3H8a2 2 0 00-2 2v14a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2z" /><path d="M10 7h4" /><path d="M10 11h4" /><path d="M10 15h2" /></>} />,
  invoice: <Icon d={<><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><path d="M14 2v6h6" /><path d="M8 13h8" /><path d="M8 17h8" /><path d="M8 9h2" /></>} />,
  settings: <Icon d={<><circle cx="12" cy="12" r="3" /><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" /></>} />,
  search: <Icon d={<><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /></>} />,
  close: <Icon d="M18 6L6 18M6 6l12 12" size={18} />,
  check: <Icon d="M20 6L9 17l-5-5" size={16} />,
  dollar: <Icon d={<><path d="M12 1v22" /><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" /></>} />,
  box: <Icon d={<><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" /><path d="M3.27 6.96L12 12.01l8.73-5.05" /><path d="M12 22.08V12" /></>} />,
  clock: <Icon d={<><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></>} />,
  download: <Icon d={<><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><path d="M7 10l5 5 5-5" /><path d="M12 15V3" /></>} />,
  arrowRight: <Icon d="M5 12h14M12 5l7 7-7 7" size={16} />,
  refresh: <Icon d={<><path d="M23 4v6h-6" /><path d="M1 20v-6h6" /><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" /></>} />,
  woo: <Icon d={<><circle cx="12" cy="12" r="10" /><path d="M8 14s1.5 2 4 2 4-2 4-2" /><path d="M9 9h.01" /><path d="M15 9h.01" /></>} />,
  lock: <Icon d={<><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0110 0v4" /></>} />,
  mail: <Icon d={<><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><path d="M22 6l-10 7L2 6" /></>} />,
  eye: <Icon d={<><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></>} />,
  eyeOff: <Icon d={<><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" /><path d="M1 1l22 22" /></>} />,
  logout: <Icon d={<><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" /><path d="M16 17l5-5-5-5" /><path d="M21 12H9" /></>} />,
};

// =============================================
// LOGIN SCREEN
// =============================================
function LoginScreen({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);

  const handleSubmit = () => {
    setError("");
    if (!email || !password) { setError("Please fill in all fields"); return; }
    setLoading(true);
    setTimeout(() => {
      const user = AUTHORIZED_USERS.find(u => u.email === email && u.password === password);
      if (user) { onLogin(user); }
      else { setError("Invalid email or password"); setShake(true); setTimeout(() => setShake(false), 500); }
      setLoading(false);
    }, 800);
  };

  const handleKeyDown = (e) => { if (e.key === "Enter") handleSubmit(); };

  return (
    <div style={{ ...cssVars, fontFamily: "var(--font)", minHeight: "100vh", background: "var(--sidebar-bg)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <style>{fonts}{`
        @keyframes fadeScale { from { opacity: 0; transform: scale(0.96) translateY(8px); } to { opacity: 1; transform: scale(1) translateY(0); } }
        @keyframes shake { 0%,100% { transform: translateX(0); } 20%,60% { transform: translateX(-8px); } 40%,80% { transform: translateX(8px); } }
        @keyframes float { 0%,100% { transform: translateY(0px); } 50% { transform: translateY(-6px); } }
        @keyframes spin { to { transform: rotate(360deg); } }
        .login-input:focus { border-color: var(--accent) !important; box-shadow: 0 0 0 3px rgba(45,90,39,0.1); }
      `}</style>
      <div style={{ position: "fixed", inset: 0, opacity: 0.03, backgroundImage: "radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)", backgroundSize: "32px 32px" }} />
      <div style={{ position: "relative", width: "100%", maxWidth: 420, animation: "fadeScale 0.5s ease-out" }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ width: 56, height: 56, borderRadius: 14, background: "var(--accent)", display: "inline-flex", alignItems: "center", justifyContent: "center", color: "#fff", marginBottom: 16, animation: "float 3s ease-in-out infinite", boxShadow: "0 8px 32px rgba(45,90,39,0.3)" }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M8 14s1.5 2 4 2 4-2 4-2" /><path d="M9 9h.01" /><path d="M15 9h.01" /></svg>
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: "#fff", margin: "0 0 6px", letterSpacing: -0.5 }}>WooCMS</h1>
          <p style={{ fontSize: 14, color: "var(--sidebar-text)", margin: 0, opacity: 0.7 }}>Sign in to manage your store</p>
        </div>
        <div style={{ background: "var(--surface)", borderRadius: 16, padding: "36px 32px", boxShadow: "0 20px 60px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.05)", animation: shake ? "shake 0.4s ease-in-out" : "none" }}>
          {error && (
            <div style={{ background: "var(--danger-bg)", border: "1px solid #FED7D7", borderRadius: 8, padding: "10px 14px", marginBottom: 20, fontSize: 13, color: "var(--danger)", fontWeight: 500, display: "flex", alignItems: "center", gap: 8 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" /></svg>
              {error}
            </div>
          )}
          <div style={{ marginBottom: 18 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--text)", marginBottom: 7 }}>Email</label>
            <div style={{ position: "relative" }}>
              <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", pointerEvents: "none" }}>{Icons.mail}</span>
              <input className="login-input" type="email" value={email} onChange={e => setEmail(e.target.value)} onKeyDown={handleKeyDown} placeholder="you@company.com" style={{ width: "100%", padding: "12px 14px 12px 44px", border: "1.5px solid var(--border)", borderRadius: 10, fontSize: 15, fontFamily: "var(--font)", background: "var(--bg)", color: "var(--text)", outline: "none", transition: "all 0.2s", boxSizing: "border-box" }} />
            </div>
          </div>
          <div style={{ marginBottom: 24 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--text)", marginBottom: 7 }}>Password</label>
            <div style={{ position: "relative" }}>
              <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", pointerEvents: "none" }}>{Icons.lock}</span>
              <input className="login-input" type={showPw ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} onKeyDown={handleKeyDown} placeholder="Enter your password" style={{ width: "100%", padding: "12px 48px 12px 44px", border: "1.5px solid var(--border)", borderRadius: 10, fontSize: 15, fontFamily: "var(--font)", background: "var(--bg)", color: "var(--text)", outline: "none", transition: "all 0.2s", boxSizing: "border-box" }} />
              <button onClick={() => setShowPw(!showPw)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", padding: 4 }}>{showPw ? Icons.eyeOff : Icons.eye}</button>
            </div>
          </div>
          <button onClick={handleSubmit} disabled={loading} style={{ width: "100%", padding: "13px 20px", background: loading ? "var(--accent-hover)" : "var(--accent)", color: "#fff", border: "none", borderRadius: 10, fontSize: 15, fontWeight: 600, cursor: loading ? "wait" : "pointer", fontFamily: "var(--font)", transition: "all 0.2s", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, boxShadow: "0 4px 12px rgba(45,90,39,0.25)" }} onMouseEnter={e => { if (!loading) e.target.style.background = "var(--accent-hover)"; }} onMouseLeave={e => { if (!loading) e.target.style.background = "var(--accent)"; }}>
            {loading ? (<><span style={{ width: 18, height: 18, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", display: "inline-block", animation: "spin 0.6s linear infinite" }} />Signing in...</>) : "Sign In"}
          </button>
        </div>
        <div style={{ textAlign: "center", marginTop: 24, padding: "14px 20px", background: "rgba(255,255,255,0.04)", borderRadius: 10, border: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ fontSize: 11, color: "var(--sidebar-text)", opacity: 0.5, marginBottom: 6, textTransform: "uppercase", letterSpacing: 1, fontWeight: 600 }}>Demo Credentials</div>
          <div style={{ fontFamily: "var(--mono)", fontSize: 13, color: "var(--sidebar-text)", opacity: 0.7 }}>erion@example.com / admin123</div>
        </div>
      </div>
    </div>
  );
}

// =============================================
// MAIN CMS APP
// =============================================
export default function WooCMS() {
  const [currentUser, setCurrentUser] = useState(null);
  const [page, setPage] = useState("dashboard");
  const [orders, setOrders] = useState(MOCK_ORDERS);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [toast, setToast] = useState(null);
  const [connected, setConnected] = useState(false);
  const [storeUrl, setStoreUrl] = useState("");
  const [consumerKey, setConsumerKey] = useState("");
  const [consumerSecret, setConsumerSecret] = useState("");
  const [animIn, setAnimIn] = useState(true);
  const toastTimer = useRef(null);

  useEffect(() => { setAnimIn(false); const t = setTimeout(() => setAnimIn(true), 30); return () => clearTimeout(t); }, [page]);

  if (!currentUser) return <LoginScreen onLogin={(user) => setCurrentUser(user)} />;

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 3000);
  };

  const updateOrderStatus = (id, newStatus) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: newStatus } : o));
    showToast(`Order #${id} → ${STATUS_CONFIG[newStatus].label}`);
    if (selectedOrder?.id === id) setSelectedOrder(prev => ({ ...prev, status: newStatus }));
  };

  const filteredOrders = orders.filter(o => {
    const matchSearch = search === "" || o.customer.toLowerCase().includes(search.toLowerCase()) || String(o.id).includes(search);
    const matchStatus = statusFilter === "all" || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const stats = {
    total: orders.length,
    revenue: orders.filter(o => !["cancelled", "refunded"].includes(o.status)).reduce((s, o) => s + o.total, 0),
    processing: orders.filter(o => o.status === "processing").length,
    pending: orders.filter(o => o.status === "pending").length,
  };

  const handleConnect = () => {
    if (storeUrl && consumerKey && consumerSecret) { setConnected(true); showToast("Connected to WooCommerce!"); }
    else { showToast("Please fill in all fields", "error"); }
  };

  const StatusBadge = ({ status, small }) => {
    const c = STATUS_CONFIG[status];
    return (<span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: small ? "2px 8px" : "4px 12px", borderRadius: 999, fontSize: small ? 11 : 12, fontWeight: 600, letterSpacing: 0.3, color: c.color, background: c.bg, textTransform: "uppercase", whiteSpace: "nowrap" }}><span style={{ width: 6, height: 6, borderRadius: "50%", background: c.color }} />{c.label}</span>);
  };

  const StatCard = ({ icon, label, value, sub }) => (
    <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: "20px 24px", flex: 1, minWidth: 180 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
        <div style={{ width: 36, height: 36, borderRadius: 8, background: "var(--accent-light)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--accent)" }}>{icon}</div>
        <span style={{ fontSize: 13, color: "var(--text-secondary)", fontWeight: 500 }}>{label}</span>
      </div>
      <div style={{ fontSize: 28, fontWeight: 700, color: "var(--text)", fontFamily: "var(--mono)", letterSpacing: -1 }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>{sub}</div>}
    </div>
  );

  const renderDashboard = () => (
    <div>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: "var(--text)", margin: 0 }}>Welcome back, {currentUser.name}</h1>
        <p style={{ color: "var(--text-secondary)", margin: "6px 0 0", fontSize: 14 }}>Here's what's happening with your store today</p>
      </div>
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 32 }}>
        <StatCard icon={Icons.box} label="Total Orders" value={stats.total} sub="Last 7 days" />
        <StatCard icon={Icons.dollar} label="Revenue" value={`€${stats.revenue.toFixed(2)}`} sub="Excl. cancelled & refunded" />
        <StatCard icon={Icons.refresh} label="Processing" value={stats.processing} sub="Awaiting fulfillment" />
        <StatCard icon={Icons.clock} label="Pending" value={stats.pending} sub="Awaiting payment" />
      </div>
      <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius)", overflow: "hidden" }}>
        <div style={{ padding: "18px 24px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 15, fontWeight: 600, color: "var(--text)" }}>Recent Orders</span>
          <button onClick={() => setPage("orders")} style={{ background: "none", border: "none", color: "var(--accent)", cursor: "pointer", fontSize: 13, fontWeight: 600, fontFamily: "var(--font)", display: "flex", alignItems: "center", gap: 4 }}>View All {Icons.arrowRight}</button>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead><tr style={{ borderBottom: "1px solid var(--border)" }}>
            {["Order", "Customer", "Total", "Status", "Date"].map(h => (<th key={h} style={{ padding: "10px 24px", textAlign: "left", fontSize: 11, fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 0.8 }}>{h}</th>))}
          </tr></thead>
          <tbody>
            {orders.slice(0, 5).map(o => (
              <tr key={o.id} onClick={() => { setSelectedOrder(o); setPage("orders"); }} style={{ borderBottom: "1px solid var(--border)", cursor: "pointer", transition: "background 0.15s" }} onMouseEnter={e => e.currentTarget.style.background = "var(--surface-alt)"} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                <td style={{ padding: "14px 24px", fontSize: 14, fontWeight: 600, fontFamily: "var(--mono)", color: "var(--accent)" }}>#{o.id}</td>
                <td style={{ padding: "14px 24px", fontSize: 14, color: "var(--text)" }}>{o.customer}</td>
                <td style={{ padding: "14px 24px", fontSize: 14, fontFamily: "var(--mono)", fontWeight: 500 }}>€{o.total.toFixed(2)}</td>
                <td style={{ padding: "14px 24px" }}><StatusBadge status={o.status} small /></td>
                <td style={{ padding: "14px 24px", fontSize: 13, color: "var(--text-muted)" }}>{o.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderOrders = () => (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24, flexWrap: "wrap", gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: "var(--text)", margin: 0 }}>Orders</h1>
          <p style={{ color: "var(--text-secondary)", margin: "6px 0 0", fontSize: 14 }}>Track and process customer orders</p>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ position: "relative" }}>
            <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }}>{Icons.search}</span>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search orders..." style={{ paddingLeft: 38, padding: "9px 14px 9px 38px", border: "1px solid var(--border)", borderRadius: 8, fontSize: 14, fontFamily: "var(--font)", background: "var(--surface)", color: "var(--text)", outline: "none", width: 220 }} onFocus={e => e.target.style.borderColor = "var(--accent)"} onBlur={e => e.target.style.borderColor = "var(--border)"} />
          </div>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ padding: "9px 32px 9px 14px", border: "1px solid var(--border)", borderRadius: 8, fontSize: 14, fontFamily: "var(--font)", background: "var(--surface)", color: "var(--text)", cursor: "pointer", outline: "none", appearance: "none", backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236B6860' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 10px center" }}>
            <option value="all">All Statuses</option>
            {Object.entries(STATUS_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
        </div>
      </div>
      <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius)", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead><tr style={{ borderBottom: "1px solid var(--border)" }}>
            {["Order", "Customer", "Items", "Total", "Payment", "Status", "Date", ""].map(h => (<th key={h} style={{ padding: "10px 16px", textAlign: "left", fontSize: 11, fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 0.8 }}>{h}</th>))}
          </tr></thead>
          <tbody>
            {filteredOrders.length === 0 ? (
              <tr><td colSpan={8} style={{ padding: 40, textAlign: "center", color: "var(--text-muted)", fontSize: 14 }}>No orders match your criteria</td></tr>
            ) : filteredOrders.map(o => (
              <tr key={o.id} style={{ borderBottom: "1px solid var(--border)", transition: "background 0.15s" }} onMouseEnter={e => e.currentTarget.style.background = "var(--surface-alt)"} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                <td style={{ padding: "14px 16px", fontSize: 14, fontWeight: 600, fontFamily: "var(--mono)", color: "var(--accent)" }}>#{o.id}</td>
                <td style={{ padding: "14px 16px" }}>
                  <div style={{ fontSize: 14, fontWeight: 500, color: "var(--text)" }}>{o.customer}</div>
                  <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{o.email}</div>
                </td>
                <td style={{ padding: "14px 16px", fontSize: 13, color: "var(--text-secondary)" }}>{o.items.length} item{o.items.length > 1 ? "s" : ""}</td>
                <td style={{ padding: "14px 16px", fontSize: 14, fontFamily: "var(--mono)", fontWeight: 600 }}>€{o.total.toFixed(2)}</td>
                <td style={{ padding: "14px 16px", fontSize: 13, color: "var(--text-secondary)" }}>{o.payment}</td>
                <td style={{ padding: "14px 16px" }}><StatusBadge status={o.status} small /></td>
                <td style={{ padding: "14px 16px", fontSize: 13, color: "var(--text-muted)" }}>{o.date}</td>
                <td style={{ padding: "14px 16px" }}>
                  <button onClick={() => setSelectedOrder(o)} style={{ background: "var(--surface-alt)", border: "1px solid var(--border)", borderRadius: 6, padding: "6px 12px", fontSize: 12, fontWeight: 600, cursor: "pointer", color: "var(--text-secondary)", fontFamily: "var(--font)" }} onMouseEnter={e => { e.target.style.background = "var(--accent)"; e.target.style.color = "#fff"; e.target.style.borderColor = "var(--accent)"; }} onMouseLeave={e => { e.target.style.background = "var(--surface-alt)"; e.target.style.color = "var(--text-secondary)"; e.target.style.borderColor = "var(--border)"; }}>View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderInvoices = () => {
    const invoiceable = orders.filter(o => ["completed", "processing"].includes(o.status));
    return (
      <div>
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: "var(--text)", margin: 0 }}>Invoices</h1>
          <p style={{ color: "var(--text-secondary)", margin: "6px 0 0", fontSize: 14 }}>View and manage invoices for completed and processing orders</p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {invoiceable.map(o => (
            <div key={o.id} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: "20px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16, transition: "box-shadow 0.2s" }} onMouseEnter={e => e.currentTarget.style.boxShadow = "var(--shadow-lg)"} onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}>
              <div style={{ display: "flex", alignItems: "center", gap: 20, minWidth: 240 }}>
                <div style={{ width: 42, height: 42, borderRadius: 8, background: "var(--accent-light)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--accent)", flexShrink: 0 }}>{Icons.invoice}</div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text)" }}>INV-{o.id}</div>
                  <div style={{ fontSize: 13, color: "var(--text-secondary)" }}>{o.customer}</div>
                  <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>{o.date}</div>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                <StatusBadge status={o.status} small />
                <span style={{ fontFamily: "var(--mono)", fontWeight: 700, fontSize: 16, minWidth: 80, textAlign: "right" }}>€{o.total.toFixed(2)}</span>
                <button onClick={() => { setSelectedOrder(o); showToast(`Invoice INV-${o.id} preview opened`); }} style={{ background: "var(--accent)", color: "#fff", border: "none", borderRadius: 8, padding: "8px 16px", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "var(--font)", display: "flex", alignItems: "center", gap: 6 }} onMouseEnter={e => e.target.style.background = "var(--accent-hover)"} onMouseLeave={e => e.target.style.background = "var(--accent)"}>
                  {Icons.download} Preview
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderSettings = () => (
    <div style={{ maxWidth: 560 }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: "var(--text)", margin: 0 }}>WooCommerce Connection</h1>
        <p style={{ color: "var(--text-secondary)", margin: "6px 0 0", fontSize: 14 }}>Connect your WordPress store via REST API</p>
      </div>
      <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: 32 }}>
        {connected && (
          <div style={{ background: "#D1FAE5", border: "1px solid #A7F3D0", borderRadius: 8, padding: "12px 16px", marginBottom: 24, display: "flex", alignItems: "center", gap: 10, fontSize: 14, color: "#065F46", fontWeight: 500 }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#10B981" }} /> Connected to store
          </div>
        )}
        {[
          { label: "Store URL", placeholder: "https://yourstore.com", value: storeUrl, onChange: setStoreUrl, hint: "Your WordPress/WooCommerce store URL" },
          { label: "Consumer Key", placeholder: "ck_xxxxxxxxxxxxxxxx", value: consumerKey, onChange: setConsumerKey, hint: "WooCommerce → Settings → Advanced → REST API" },
          { label: "Consumer Secret", placeholder: "cs_xxxxxxxxxxxxxxxx", value: consumerSecret, onChange: setConsumerSecret, hint: "Keep this secret and never share it", type: "password" },
        ].map(f => (
          <div key={f.label} style={{ marginBottom: 20 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--text)", marginBottom: 6 }}>{f.label}</label>
            <input type={f.type || "text"} value={f.value} onChange={e => f.onChange(e.target.value)} placeholder={f.placeholder} style={{ width: "100%", padding: "10px 14px", border: "1px solid var(--border)", borderRadius: 8, fontSize: 14, fontFamily: f.label !== "Store URL" ? "var(--mono)" : "var(--font)", background: "var(--bg)", color: "var(--text)", outline: "none", boxSizing: "border-box" }} onFocus={e => e.target.style.borderColor = "var(--accent)"} onBlur={e => e.target.style.borderColor = "var(--border)"} />
            <span style={{ display: "block", fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>{f.hint}</span>
          </div>
        ))}
        <button onClick={handleConnect} style={{ width: "100%", padding: "12px 20px", background: "var(--accent)", color: "#fff", border: "none", borderRadius: 8, fontSize: 15, fontWeight: 600, cursor: "pointer", fontFamily: "var(--font)", marginTop: 8 }} onMouseEnter={e => e.target.style.background = "var(--accent-hover)"} onMouseLeave={e => e.target.style.background = "var(--accent)"}>{connected ? "Reconnect" : "Connect Store"}</button>
      </div>
      <div style={{ marginTop: 24, padding: "16px 20px", background: "var(--surface-alt)", borderRadius: 8, fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6 }}>
        <strong style={{ color: "var(--text)" }}>How to get API keys:</strong><br />
        In your WordPress admin, go to WooCommerce → Settings → Advanced → REST API → Add Key. Set permissions to Read/Write, then copy the Consumer Key and Secret here.
      </div>
    </div>
  );

  const renderOrderDetail = () => {
    if (!selectedOrder) return null;
    const o = selectedOrder;
    const nextStatuses = STATUS_FLOW[o.status] || [];
    const tax = o.total * 0.19;
    const subtotal = o.total - tax;
    return (
      <div style={{ position: "fixed", inset: 0, zIndex: 1000, display: "flex", justifyContent: "flex-end" }} onClick={() => setSelectedOrder(null)}>
        <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.3)", backdropFilter: "blur(2px)" }} />
        <div onClick={e => e.stopPropagation()} style={{ position: "relative", width: "100%", maxWidth: 520, background: "var(--bg)", height: "100%", overflowY: "auto", boxShadow: "-8px 0 30px rgba(0,0,0,0.12)", animation: "slideIn 0.25s ease-out" }}>
          <div style={{ position: "sticky", top: 0, background: "var(--bg)", padding: "20px 28px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center", zIndex: 2 }}>
            <div>
              <div style={{ fontSize: 18, fontWeight: 700, color: "var(--text)" }}>Order #{o.id}</div>
              <div style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 2 }}>{o.date}</div>
            </div>
            <button onClick={() => setSelectedOrder(null)} style={{ background: "var(--surface-alt)", border: "1px solid var(--border)", borderRadius: 8, width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "var(--text-secondary)" }}>{Icons.close}</button>
          </div>
          <div style={{ padding: "24px 28px" }}>
            <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: 20, marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: nextStatuses.length ? 16 : 0 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-secondary)" }}>Status</span>
                <StatusBadge status={o.status} />
              </div>
              {nextStatuses.length > 0 && (
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {nextStatuses.map(ns => (
                    <button key={ns} onClick={() => updateOrderStatus(o.id, ns)} style={{ padding: "7px 14px", borderRadius: 6, border: `1px solid ${STATUS_CONFIG[ns].color}30`, background: STATUS_CONFIG[ns].bg, color: STATUS_CONFIG[ns].color, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "var(--font)" }} onMouseEnter={e => { e.target.style.background = STATUS_CONFIG[ns].color; e.target.style.color = "#fff"; }} onMouseLeave={e => { e.target.style.background = STATUS_CONFIG[ns].bg; e.target.style.color = STATUS_CONFIG[ns].color; }}>
                      Move to {STATUS_CONFIG[ns].label}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: 20, marginBottom: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 12 }}>Customer</div>
              <div style={{ fontSize: 15, fontWeight: 600, color: "var(--text)" }}>{o.customer}</div>
              <div style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 4 }}>{o.email}</div>
              <div style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 8, lineHeight: 1.5 }}>{o.address}</div>
            </div>
            <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: 20, marginBottom: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 12 }}>Items</div>
              {o.items.map((item, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: i < o.items.length - 1 ? "1px solid var(--border)" : "none" }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 500, color: "var(--text)" }}>{item.name}</div>
                    <div style={{ fontSize: 12, color: "var(--text-muted)" }}>Qty: {item.qty} × €{item.price.toFixed(2)}</div>
                  </div>
                  <span style={{ fontFamily: "var(--mono)", fontWeight: 600, fontSize: 14 }}>€{(item.qty * item.price).toFixed(2)}</span>
                </div>
              ))}
              <div style={{ borderTop: "2px solid var(--border)", marginTop: 12, paddingTop: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "var(--text-secondary)", marginBottom: 6 }}><span>Subtotal</span><span style={{ fontFamily: "var(--mono)" }}>€{subtotal.toFixed(2)}</span></div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "var(--text-secondary)", marginBottom: 8 }}><span>Tax (19%)</span><span style={{ fontFamily: "var(--mono)" }}>€{tax.toFixed(2)}</span></div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 16, fontWeight: 700, color: "var(--text)" }}><span>Total</span><span style={{ fontFamily: "var(--mono)" }}>€{o.total.toFixed(2)}</span></div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 12 }}>
              <div style={{ flex: 1, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: 16 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", marginBottom: 6 }}>Payment</div>
                <div style={{ fontSize: 14, fontWeight: 500, color: "var(--text)" }}>{o.payment}</div>
              </div>
              <div style={{ flex: 1, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: 16 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", marginBottom: 6 }}>Shipping</div>
                <div style={{ fontSize: 14, fontWeight: 500, color: "var(--text)" }}>{o.shipping}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const navItems = [
    { key: "dashboard", label: "Dashboard", icon: Icons.dashboard },
    { key: "orders", label: "Orders", icon: Icons.orders },
    { key: "invoices", label: "Invoices", icon: Icons.invoice },
    { key: "settings", label: "Connection", icon: Icons.settings },
  ];

  return (
    <div style={{ ...cssVars, fontFamily: "var(--font)", display: "flex", height: "100vh", background: "var(--bg)", color: "var(--text)", overflow: "hidden" }}>
      <style>{fonts}{`
        @keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes toastIn { from { opacity: 0; transform: translateY(-12px); } to { opacity: 1; transform: translateY(0); } }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-thumb { background: var(--border-strong); border-radius: 3px; }
      `}</style>
      <aside style={{ width: 240, background: "var(--sidebar-bg)", display: "flex", flexDirection: "column", flexShrink: 0 }}>
        <div style={{ padding: "24px 24px 32px", display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 34, height: 34, borderRadius: 8, background: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>{Icons.woo}</div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: "var(--sidebar-active)", letterSpacing: -0.3 }}>WooCMS</div>
            <div style={{ fontSize: 11, color: "var(--sidebar-text)", opacity: 0.6 }}>Order Manager</div>
          </div>
        </div>
        <nav style={{ flex: 1, padding: "0 12px" }}>
          {navItems.map(item => {
            const active = page === item.key;
            return (
              <button key={item.key} onClick={() => setPage(item.key)} style={{ display: "flex", alignItems: "center", gap: 12, width: "100%", padding: "11px 14px", marginBottom: 4, borderRadius: 8, border: "none", background: active ? "rgba(255,255,255,0.08)" : "transparent", color: active ? "var(--sidebar-active)" : "var(--sidebar-text)", fontSize: 14, fontWeight: active ? 600 : 400, fontFamily: "var(--font)", cursor: "pointer", transition: "all 0.15s", textAlign: "left" }} onMouseEnter={e => { if (!active) e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }} onMouseLeave={e => { if (!active) e.currentTarget.style.background = active ? "rgba(255,255,255,0.08)" : "transparent"; }}>
                <span style={{ opacity: active ? 1 : 0.6 }}>{item.icon}</span>
                {item.label}
                {item.key === "orders" && stats.processing > 0 && (
                  <span style={{ marginLeft: "auto", background: "var(--accent)", color: "#fff", fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 99, fontFamily: "var(--mono)" }}>{stats.processing}</span>
                )}
              </button>
            );
          })}
        </nav>
        <div style={{ padding: "12px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 8, background: "rgba(255,255,255,0.04)" }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 13, fontWeight: 700 }}>{currentUser.name.charAt(0)}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "var(--sidebar-active)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{currentUser.name}</div>
              <div style={{ fontSize: 11, color: "var(--sidebar-text)", opacity: 0.6 }}>{currentUser.role}</div>
            </div>
            <button onClick={() => setCurrentUser(null)} title="Sign out" style={{ background: "none", border: "none", cursor: "pointer", color: "var(--sidebar-text)", opacity: 0.5, padding: 4 }} onMouseEnter={e => e.currentTarget.style.opacity = "1"} onMouseLeave={e => e.currentTarget.style.opacity = "0.5"}>{Icons.logout}</button>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px 4px" }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: connected ? "#10B981" : "#EF4444" }} />
            <span style={{ fontSize: 11, color: "var(--sidebar-text)", opacity: 0.6 }}>{connected ? "Store Connected" : "Not Connected"}</span>
          </div>
        </div>
      </aside>
      <main style={{ flex: 1, overflow: "auto", padding: "32px 40px" }}>
        <div style={{ maxWidth: 1100, animation: animIn ? "fadeUp 0.3s ease-out" : "none" }}>
          {page === "dashboard" && renderDashboard()}
          {page === "orders" && renderOrders()}
          {page === "invoices" && renderInvoices()}
          {page === "settings" && renderSettings()}
        </div>
      </main>
      {selectedOrder && renderOrderDetail()}
      {toast && (
        <div style={{ position: "fixed", top: 20, left: "50%", transform: "translateX(-50%)", zIndex: 9999, padding: "12px 24px", borderRadius: 10, background: toast.type === "error" ? "var(--danger)" : "var(--accent)", color: "#fff", fontSize: 14, fontWeight: 600, fontFamily: "var(--font)", boxShadow: "var(--shadow-lg)", animation: "toastIn 0.25s ease-out", display: "flex", alignItems: "center", gap: 8 }}>
          {toast.type === "error" ? Icons.close : Icons.check} {toast.msg}
        </div>
      )}
    </div>
  );
}
