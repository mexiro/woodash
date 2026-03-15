# WooCMS — WooCommerce Order Manager

A CMS dashboard for managing WooCommerce orders, built with Next.js 14, NextAuth.js, and SWR. Supports a mock demo mode so you can run the full UI without a live store.

**Stack:** Next.js 14 · React 18 · NextAuth.js v5 · SWR · Vercel

---

## Run locally

```bash
# 1. Clone the repo
git clone https://github.com/mexiro/wooComerce.git
cd wooComerce

# 2. Copy the env template and fill in values
cp .env.example .env.local

# 3. Install dependencies
npm install

# 4. Start the dev server
npm run dev

# 5. Open http://localhost:3000
```

**Demo login:** `erion@example.com` / `admin123`

---

## Environment variables

Copy `.env.example` to `.env.local` and set each value:

| Variable | Description |
|---|---|
| `MOCK_MODE` | `true` = use built-in sample data, `false` = connect to real WooCommerce |
| `WOOCOMMERCE_URL` | Your WordPress store URL (e.g. `https://yourstore.com`) |
| `WOOCOMMERCE_KEY` | WooCommerce REST API consumer key (`ck_...`) |
| `WOOCOMMERCE_SECRET` | WooCommerce REST API consumer secret (`cs_...`) |
| `AUTH_SECRET` | Random secret for signing session tokens — generate one at https://generate-secret.vercel.app |
| `NEXTAUTH_URL` | Full URL of your app (e.g. `http://localhost:3000` or `https://your-app.vercel.app`) |
| `AUTH_USER_1_EMAIL` | Email for user 1 |
| `AUTH_USER_1_PASSWORD` | Password for user 1 |
| `AUTH_USER_1_NAME` | Display name for user 1 |
| `AUTH_USER_1_ROLE` | Role label for user 1 (e.g. `admin`) |
| `AUTH_USER_2_EMAIL` | Email for user 2 (optional — add more with `AUTH_USER_3_*`, etc.) |
| `AUTH_USER_2_PASSWORD` | Password for user 2 |
| `AUTH_USER_2_NAME` | Display name for user 2 |
| `AUTH_USER_2_ROLE` | Role label for user 2 (e.g. `editor`) |

---

## Switch to live WooCommerce

1. In your WordPress admin: **WooCommerce → Settings → Advanced → REST API → Add Key**
2. Set permissions to **Read/Write** and generate the key
3. In `.env.local` (or Vercel environment variables):
   ```
   MOCK_MODE=false
   WOOCOMMERCE_URL=https://yourstore.com
   WOOCOMMERCE_KEY=ck_xxxxxxxxxxxxxxxx
   WOOCOMMERCE_SECRET=cs_xxxxxxxxxxxxxxxx
   ```
4. Restart the dev server (or redeploy on Vercel)

---

## Add team members

Add more `AUTH_USER_N_*` variables for each person. The app loops through all numbered users automatically:

```
AUTH_USER_3_EMAIL=colleague@example.com
AUTH_USER_3_PASSWORD=securepassword
AUTH_USER_3_NAME=Colleague
AUTH_USER_3_ROLE=editor
```

---

## Deploy to Vercel

The GitHub repo is linked to Vercel — every `git push` to `main` triggers an automatic deploy.

After pushing for the first time, add these environment variables in your **Vercel dashboard → Project → Settings → Environment Variables**:

- `AUTH_SECRET` (generate at https://generate-secret.vercel.app)
- `NEXTAUTH_URL` = `https://your-app.vercel.app`
- `MOCK_MODE` = `true`
- All `AUTH_USER_*` variables for your team

Then trigger a redeploy from the Deployments tab to pick up the new variables.

---

## Project structure

```
app/
  api/          # Next.js API routes (orders, products, customers, analytics, auth)
  dashboard/    # Dashboard with analytics
  orders/       # Order list + order detail
  products/     # Product catalog
  customers/    # Customer list
  invoices/     # Invoices
  settings/     # WooCommerce connection settings
  login/        # Login page
components/     # Shared UI (Sidebar, StatusBadge, OrderDetailPanel, AppShell)
lib/
  api.js          # Frontend fetch helpers
  auth.js         # NextAuth config
  fetcher.js      # SWR fetcher
  mock-data.js    # Sample data (used by API routes in mock mode)
  order-config.js # Status labels and workflow config
  woo-client.js   # WooCommerce REST API client
middleware.js   # Route protection (redirects unauthenticated users to /login)
```
