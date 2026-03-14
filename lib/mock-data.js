export const AUTHORIZED_USERS = [
  { email: "erion@example.com", password: "admin123", name: "Erion", role: "Admin" },
  { email: "team@example.com", password: "team2026", name: "Team Member", role: "Staff" },
];

export const MOCK_ORDERS = [
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

export const STATUS_CONFIG = {
  pending:    { label: "Pending",    color: "#F59E0B", bg: "#FEF3C7" },
  processing: { label: "Processing", color: "#3B82F6", bg: "#DBEAFE" },
  "on-hold":  { label: "On Hold",   color: "#8B5CF6", bg: "#EDE9FE" },
  completed:  { label: "Completed", color: "#10B981", bg: "#D1FAE5" },
  cancelled:  { label: "Cancelled", color: "#EF4444", bg: "#FEE2E2" },
  refunded:   { label: "Refunded",  color: "#6B7280", bg: "#F3F4F6" },
};

export const STATUS_FLOW = {
  pending:    ["processing", "on-hold", "cancelled"],
  processing: ["completed", "on-hold", "cancelled"],
  "on-hold":  ["processing", "cancelled"],
  completed:  ["refunded"],
  cancelled:  [],
  refunded:   [],
};
