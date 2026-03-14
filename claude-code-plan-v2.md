# WooCMS — Claude Code Execution Plan

## Context for Claude Code

This project is a WooCommerce order management CMS dashboard. It currently exists as a **React + Vite** single-page app with hardcoded mock data and hardcoded auth. Everything lives in `src/App.jsx`.

- **GitHub repo**: https://github.com/mexiro/wooComerce
- **Live (current mock)**: https://woo-comerce-neon.vercel.app
- **Vercel setup**: linked directly to the GitHub repo — every `git push` auto-deploys
- **Stack now**: React 18 + Vite + JavaScript (single App.jsx file)
- **Stack target**: Next.js 14 (App Router) + NextAuth.js + WooCommerce REST API + mock mode

The goal is to turn this from a static mockup into a real product connected to a WooCommerce store, deployed on Vercel. Since the WooCommerce store keys are not available yet, we're building with a MOCK_MODE toggle.

### How deployment works (no npm needed on Vercel)

The GitHub repo is linked to Vercel. Every time you push code:
1. You make changes locally (Claude Code does this)
2. You run `git add . && git commit -m "message" && git push`
3. Vercel detects the push, runs `npm install` and `npm run build` automatically
4. Your site is live at woo-comerce-neon.vercel.app within ~60 seconds

You only use `npm run dev` on your MacBook to test locally before pushing.

---

## PHASE 1A — Scaffold Next.js project (keep old code as reference)

This phase ONLY sets up the Next.js skeleton. We don't move any components yet.

### Prompt for Claude Code

```
I need to convert this React + Vite project to Next.js 14 with App Router. This is step 1 of 2 — in this step, ONLY set up the Next.js scaffold while keeping the old code as reference.

CURRENT STATE:
- Single `src/App.jsx` file with the entire app (login, dashboard, orders, invoices, sidebar nav)
- `vite.config.js` + `index.html` as Vite entry point
- Hardcoded users array for auth
- Hardcoded mock order/product/customer data
- package.json with Vite dependencies

WHAT I NEED IN THIS STEP:

1. Update package.json:
   - Remove: vite, @vitejs/plugin-react
   - Add: next, react-dom (if not already there)
   - Change scripts to:
     "dev": "next dev",
     "build": "next build",
     "start": "next start"
   - Run `npm install` to install everything

2. Create `next.config.js` with basic config (empty or minimal)

3. Create the app directory scaffold with placeholder pages:
   - `app/layout.jsx` — basic root layout with <html> and <body> tags, import global styles
   - `app/page.jsx` — just renders: "WooCMS - redirecting..." (we'll add redirect logic later)
   - `app/login/page.jsx` — just renders: "Login page placeholder"
   - `app/dashboard/page.jsx` — just renders: "Dashboard placeholder"
   - `app/orders/page.jsx` — just renders: "Orders placeholder"
   - `app/orders/[id]/page.jsx` — just renders: "Order detail placeholder"
   - `app/invoices/page.jsx` — just renders: "Invoices placeholder"
   - `app/products/page.jsx` — just renders: "Products placeholder"
   - `app/customers/page.jsx` — just renders: "Customers placeholder"
   - `app/settings/page.jsx` — just renders: "Settings placeholder"

4. Create empty directories:
   - `/components/` (empty, for later)
   - `/lib/` (empty, for later)

5. Delete: `vite.config.js` and `index.html`

6. Do NOT delete or modify `src/App.jsx` yet — we need it as reference for Phase 1B

7. If there is a CSS file (like App.css or index.css), move it to `app/globals.css` and import it in layout.jsx

IMPORTANT: After this step, `npm run dev` should start Next.js on localhost:3000 and show placeholder text on each route. The old src/App.jsx still exists as reference but is no longer the entry point.

DO NOT:
- Move any components yet
- Set up authentication
- Create API routes
- Delete the old src/App.jsx (we need it as reference)
```

### How to test locally

Open your VS Code terminal and run:
```
npm run dev
```

Then open these URLs in your browser:
- http://localhost:3000 → should show "WooCMS - redirecting..."
- http://localhost:3000/login → should show "Login page placeholder"
- http://localhost:3000/dashboard → should show "Dashboard placeholder"
- http://localhost:3000/orders → should show "Orders placeholder"

If all pages show their placeholder text, Phase 1A is done.

### Commit and deploy
```
git add .
git commit -m "Phase 1A: Scaffold Next.js app structure"
git push
```
Wait ~60 seconds, then check woo-comerce-neon.vercel.app — it should show the placeholder.

---

## PHASE 1B — Move components from App.jsx into Next.js pages

Now we break the monolithic App.jsx into proper components and pages.

### Prompt for Claude Code

```
Now move all the real UI from src/App.jsx into the Next.js pages and components we scaffolded.

Read src/App.jsx carefully first. It contains:
- A login screen with email/password form
- A sidebar navigation
- A header bar with user info
- A dashboard view with stats cards and maybe charts
- An orders list view with status badges
- An order detail view
- An invoices view
- Mock data arrays (orders, products, customers)
- Hardcoded authorized users array
- CSS styles (inline or in a separate file)

WHAT I NEED:

1. Extract shared UI into components:

   `components/Sidebar.jsx`:
   - The sidebar/navigation from App.jsx
   - Use Next.js <Link> instead of onClick handlers for navigation
   - Highlight the active page
   - Keep the exact same visual design

   `components/Header.jsx`:
   - The top header bar from App.jsx
   - Show user name/role (hardcoded for now, we'll connect auth later)
   - Keep the exact same visual design

   `components/StatusBadge.jsx`:
   - The colored order status badges (processing=blue, completed=green, etc.)
   - Accepts a `status` prop, returns styled badge

   `components/StatsCard.jsx`:
   - Dashboard stat cards (total orders, revenue, etc.)
   - Accepts props: title, value, icon, trend

   `components/DataTable.jsx`:
   - A reusable table component if there's a pattern in orders/products lists
   - Optional — only create if there's clear reuse

2. Move mock data to `/lib/mock-data.js`:
   - Move ALL hardcoded arrays (orders, products, customers, users) from App.jsx
   - Export them as named exports
   - Keep the data exactly as-is for now

3. Build out each page using the real UI from App.jsx:

   `app/layout.jsx`:
   - Add the Sidebar and Header components
   - Wrap the page content in the main content area
   - Import global CSS
   - The sidebar + header should appear on ALL pages except /login

   `app/login/page.jsx`:
   - Move the login form UI from App.jsx
   - Keep the hardcoded auth check for now (import users from mock-data)
   - On successful login, use Next.js router to navigate to /dashboard
   - Store a simple flag in localStorage to track logged-in state (temporary, will be replaced by NextAuth in Phase 3)
   - Keep the exact same visual design

   `app/page.jsx`:
   - Redirect to /dashboard (use Next.js redirect or router.push)

   `app/dashboard/page.jsx`:
   - Move the dashboard/stats view from App.jsx
   - Import mock data from lib/mock-data.js
   - Show stats cards, charts, recent orders
   - Keep the exact same visual design

   `app/orders/page.jsx`:
   - Move the orders list from App.jsx
   - Import mock data from lib/mock-data.js
   - Keep filtering by status if it exists
   - Each order row should link to /orders/[id]
   - Keep the exact same visual design

   `app/orders/[id]/page.jsx`:
   - Move the order detail view from App.jsx
   - Use the [id] param to find the order in mock data
   - Show all order details
   - Keep the exact same visual design

   `app/invoices/page.jsx`:
   - Move the invoices view from App.jsx
   - Keep the exact same visual design

   `app/products/page.jsx`:
   - If there's a products view in App.jsx, move it
   - If not, create a simple product list table using mock data

   `app/customers/page.jsx`:
   - If there's a customers view in App.jsx, move it
   - If not, create a simple customer list table using mock data

   `app/settings/page.jsx`:
   - Create a simple page with:
     - A "WooCommerce Connection" section
     - Input fields for Store URL, Consumer Key, Consumer Secret (disabled/placeholder for now)
     - A "Test Connection" button (does nothing yet)
     - A status indicator showing "Demo Mode" with an orange badge

4. Handle styling:
   - If App.jsx uses inline styles, keep them inline in the new components
   - If there's a CSS file, make sure it's imported in layout.jsx as globals.css
   - If App.jsx uses CSS class names, make sure the class definitions are in globals.css
   - The goal is: the app should look IDENTICAL to the current Vite version

5. After everything is moved, DELETE:
   - `src/App.jsx`
   - `src/` directory (if empty)
   - Any other leftover Vite files

6. Verify navigation works:
   - Clicking sidebar links navigates between pages
   - Order rows link to order detail
   - Back buttons work
   - Login redirects to dashboard

CRITICAL: The app must look exactly the same as before. Don't redesign anything. Just move the code into the proper Next.js structure.

After completing, run `npm run dev` and click through every page to verify it all works.
```

### How to test locally

```
npm run dev
```

Click through every page:
- http://localhost:3000/login → login with erion@example.com / admin123
- After login → should see dashboard with sidebar
- Click "Orders" in sidebar → orders list
- Click an order → order detail
- Click "Invoices" → invoices page
- Click "Products" → products page
- Click "Customers" → customers page
- Click "Settings" → settings page with demo mode indicator

Everything should look the same as the current live version at woo-comerce-neon.vercel.app.

### Commit and deploy
```
git add .
git commit -m "Phase 1B: Move all components to Next.js pages"
git push
```

---

## PHASE 2 — Add API Routes with Mock Mode

### Prompt for Claude Code

```
Add Next.js API routes that will proxy WooCommerce REST API calls. Since we don't have real WooCommerce credentials yet, build everything with a MOCK_MODE toggle.

WHAT I NEED:

1. Create environment files:
   - Create `.env.local` with:
     ```
     MOCK_MODE=true
     WOOCOMMERCE_URL=
     WOOCOMMERCE_KEY=
     WOOCOMMERCE_SECRET=
     ```
   - Create `.env.example` with the same keys but empty values (this gets committed to git as a template)
   - Make sure `.env.local` is in `.gitignore`

2. Create a WooCommerce API client at `/lib/woo-client.js`:
   - Install the package: `npm install @woocommerce/woocommerce-rest-api`
   - Initialize with env vars (WOOCOMMERCE_URL, KEY, SECRET)
   - Export a configured client instance
   - Only initialize when MOCK_MODE is false

3. Expand mock data at `/lib/mock-data.js`:
   - Keep existing data, but make sure it matches WooCommerce REST API v3 response format
   - Ensure we have:
     - 15 orders with various statuses (processing, completed, on-hold, pending, refunded, cancelled)
     - Each order has: id, number, status, total, currency ("EUR"), date_created, date_modified, billing (first_name, last_name, email, address_1, city, country), shipping, line_items array (name, quantity, price, sku), payment_method, customer_note
     - 10 products with: id, name, sku, price, regular_price, stock_quantity, stock_status, categories, images
     - 8 customers with: id, first_name, last_name, email, billing, orders_count, total_spent
     - Dates should be within last 30 days
     - Totals between €15 and €450

4. Create these API routes:

   `app/api/orders/route.js` — GET handler
   - MOCK_MODE=true: return mock orders, support query params (status, page, per_page, search)
   - MOCK_MODE=false: proxy to WooCommerce GET /wc/v3/orders with same params
   - Default per_page=10
   - Return: { orders: [...], total: number, total_pages: number }

   `app/api/orders/[id]/route.js` — GET and PUT handlers
   - GET: return single order by ID (mock: find in array, real: proxy to WC)
   - PUT: update order status (mock: update in-memory, real: proxy to WC)

   `app/api/products/route.js` — GET handler
   - List products with pagination (page, per_page, search)

   `app/api/customers/route.js` — GET handler
   - List customers with pagination (page, per_page, search)

   `app/api/analytics/route.js` — GET handler
   - Return dashboard aggregates computed from orders:
     - total_sales (sum of order totals, last 30 days)
     - total_orders (count, last 30 days)
     - average_order_value
     - orders_by_status (object: { processing: 5, completed: 4, ... })
     - sales_by_day (array of { date: "2026-03-01", total: 123.45 } for charts)
     - top_products (array of { name, quantity_sold, revenue })

5. All API routes should:
   - Return proper JSON with correct HTTP status codes
   - Handle errors gracefully (try/catch, return { error: "message" })
   - Work in both mock and real mode

6. Create a frontend API service at `/lib/api.js`:
   - Export functions: getOrders(params), getOrder(id), updateOrder(id, data), getProducts(params), getCustomers(params), getAnalytics()
   - Each calls the corresponding /api/* route using fetch
   - Handle errors and return parsed JSON

DO NOT:
- Add authentication to API routes yet (Phase 3)
- Change any frontend pages or components
- Modify any UI

After completing, test by running `npm run dev` and opening in browser:
- http://localhost:3000/api/orders → should return JSON with mock orders
- http://localhost:3000/api/orders?status=processing → filtered results
- http://localhost:3000/api/analytics → dashboard stats JSON
- http://localhost:3000/api/products → mock products
- http://localhost:3000/api/customers → mock customers
```

### How to test locally

```
npm run dev
```

Open these URLs directly in your browser (they return raw JSON):
- http://localhost:3000/api/orders
- http://localhost:3000/api/orders?status=processing
- http://localhost:3000/api/analytics
- http://localhost:3000/api/products
- http://localhost:3000/api/customers

You should see nicely formatted JSON data in each one.

### Commit and deploy
```
git add .
git commit -m "Phase 2: Add API routes with mock mode"
git push
```

---

## PHASE 3 — Add Authentication

### Prompt for Claude Code

```
Add authentication using NextAuth.js v5 (next-auth@beta). Use a credentials provider with allowed users from environment variables.

WHAT I NEED:

1. Install: `npm install next-auth@beta`

2. Add to `.env.local`:
   ```
   NEXTAUTH_SECRET=replace-with-a-random-32-char-string
   NEXTAUTH_URL=http://localhost:3000
   AUTH_USER_1_EMAIL=erion@example.com
   AUTH_USER_1_PASSWORD=admin123
   AUTH_USER_1_NAME=Erion
   AUTH_USER_1_ROLE=admin
   AUTH_USER_2_EMAIL=team@example.com
   AUTH_USER_2_PASSWORD=team123
   AUTH_USER_2_NAME=Team Member
   AUTH_USER_2_ROLE=editor
   ```
   Also update `.env.example` with these keys (but empty values).

3. Create auth config at `/lib/auth.js`:
   - CredentialsProvider that validates email + password
   - Parse AUTH_USER_* env vars dynamically — loop through process.env, find all keys matching AUTH_USER_N_EMAIL pattern, build a users array
   - Include user name and role in the session/token

4. Create NextAuth route at `app/api/auth/[...nextauth]/route.js`

5. Create a session provider component at `components/SessionProvider.jsx`:
   - Wraps children in NextAuth's SessionProvider
   - Use "use client" directive
   - Import and use in app/layout.jsx

6. Update `app/login/page.jsx`:
   - Replace the localStorage-based auth with NextAuth signIn("credentials", { email, password })
   - Keep the EXACT same visual design of the login form
   - Show error message on failed login
   - Redirect to /dashboard on success

7. Create `middleware.js` at the project root:
   - Protect all routes except: /login, /api/auth/*, /_next/*, /favicon.ico
   - Redirect unauthenticated users to /login

8. Update `components/Header.jsx`:
   - Show the logged-in user's name from the session
   - Add a Logout button that calls signOut() and redirects to /login

9. Update `app/layout.jsx`:
   - Only show Sidebar + Header when user is authenticated
   - On /login page, show just the login form without sidebar/header

10. Remove any old hardcoded auth logic (localStorage checks, AUTHORIZED_USERS imports in pages)

DO NOT:
- Add database auth (that's later)
- Add OAuth (Google, GitHub, etc.)
- Change the visual design of any page

After completing:
- Going to localhost:3000/dashboard while logged out → redirects to /login
- Login with erion@example.com / admin123 → goes to dashboard, name shows in header
- Login with wrong password → shows error
- Click Logout → goes back to /login
- API routes at /api/orders etc still work when logged in
```

### How to test locally

```
npm run dev
```

1. Open http://localhost:3000/dashboard → should redirect to /login
2. Enter erion@example.com / admin123 → should go to dashboard
3. Check header shows "Erion" and "admin" role
4. Click Logout → back to login page
5. Try wrong password → error message appears

### Commit and deploy
```
git add .
git commit -m "Phase 3: Add NextAuth authentication"
git push
```

**IMPORTANT for Vercel**: After pushing, go to your Vercel dashboard:
1. Click your wooComerce project
2. Go to Settings → Environment Variables
3. Add these variables:
   - `NEXTAUTH_SECRET` = (paste a random string — you can generate one at https://generate-secret.vercel.app)
   - `NEXTAUTH_URL` = `https://woo-comerce-neon.vercel.app`
   - `AUTH_USER_1_EMAIL` = `erion@example.com`
   - `AUTH_USER_1_PASSWORD` = `admin123`
   - `AUTH_USER_1_NAME` = `Erion`
   - `AUTH_USER_1_ROLE` = `admin`
   - `MOCK_MODE` = `true`
4. Click "Redeploy" from the Deployments tab (so it picks up the new env vars)

---

## PHASE 4 — Wire Frontend to Real API

### Prompt for Claude Code

```
Replace all hardcoded mock data in the frontend pages with real API calls to our /api routes. The API routes already handle mock mode internally, so the frontend just calls /api/* endpoints.

WHAT I NEED:

1. Install SWR for data fetching: `npm install swr`

2. Create a fetch helper at `/lib/fetcher.js`:
   - A wrapper around fetch that parses JSON and throws on errors

3. Update `app/layout.jsx`:
   - Wrap the app content in an SWRConfig provider with the fetcher as default

4. Update `app/dashboard/page.jsx`:
   - Fetch from /api/analytics using SWR
   - Show: total orders, total sales (formatted as €), average order value, orders by status
   - Render sales chart using sales_by_day data (keep existing chart library or use a simple bar/line chart)
   - Show top products section
   - While loading: show gray animated skeleton placeholders (pulsing rectangles where the data will be)
   - On error: show "Failed to load dashboard data" with a Retry button

5. Update `app/orders/page.jsx`:
   - Fetch from /api/orders using SWR
   - Add status filter (tabs or dropdown: All, Processing, Completed, On-hold, etc.)
   - When filter changes, refetch with ?status=xxx
   - Add a search input (filters by order number or customer name)
   - Add pagination controls (Previous / Next buttons, "Page 1 of 2" text)
   - Each row links to /orders/[id] using Next.js Link
   - Loading skeleton while fetching

6. Update `app/orders/[id]/page.jsx`:
   - Fetch from /api/orders/[id] using SWR
   - Show: customer info, line items table, totals, payment method, dates, notes
   - Add a dropdown to change order status → sends PUT to /api/orders/[id]
   - After status update, revalidate the SWR cache
   - "← Back to orders" link at top
   - Loading skeleton

7. Update `app/products/page.jsx`:
   - Fetch from /api/products using SWR
   - Show: product name, SKU, price (€), stock status, stock quantity
   - Search input
   - Pagination
   - Loading skeleton

8. Update `app/customers/page.jsx`:
   - Fetch from /api/customers using SWR
   - Show: name, email, total orders, total spent (€)
   - Search input
   - Pagination
   - Loading skeleton

9. Update `app/settings/page.jsx`:
   - Show "Running in demo mode with sample data" when MOCK_MODE is true
   - Show WooCommerce connection fields (URL, key, secret) — disabled/read-only for now
   - Green/orange status dot based on mode

10. For ALL pages:
    - Add loading skeletons (gray pulsing bars) that match the layout of the real content
    - Add error states with retry button
    - Remove ALL imports of mock data from lib/mock-data.js in page components
    - All data comes from /api/* routes via SWR

11. Remove or update lib/mock-data.js imports:
    - Pages should NOT import mock-data directly anymore
    - Only the API routes import mock-data

CRITICAL: Keep the exact same visual design. Only change where the data comes from.

After completing:
- Dashboard loads with stats and chart
- Orders list loads, filtering and pagination work
- Clicking an order shows detail, status update works
- Products and customers load
- Loading skeletons appear on slow connections
- No direct mock-data imports in any page component
```

### How to test locally

```
npm run dev
```

Click through every page and verify:
- Dashboard → shows stats cards, chart, top products
- Orders → list loads, try status filter, try search, try pagination
- Click an order → detail loads, try changing status
- Products → list loads
- Customers → list loads
- Settings → shows "Demo mode" indicator

### Commit and deploy
```
git add .
git commit -m "Phase 4: Wire frontend to API routes"
git push
```

---

## PHASE 5 — Clean Up and Deploy

### Prompt for Claude Code

```
Final cleanup for production deployment.

WHAT I NEED:

1. Run `npm run build` and fix any errors or warnings

2. Check .gitignore includes:
   - .env.local
   - .next/
   - node_modules/
   - .vercel/

3. Update README.md:
   - Project name: WooCMS — WooCommerce Order Manager
   - Description: A CMS dashboard for managing WooCommerce orders
   - How to run locally:
     1. Clone the repo
     2. Copy .env.example to .env.local and fill in values
     3. npm install
     4. npm run dev
     5. Open http://localhost:3000
   - Environment variables (list all from .env.example with descriptions)
   - How to switch to live WooCommerce:
     1. Set MOCK_MODE=false
     2. Add your WooCommerce URL, key, and secret
   - How to add team members (add AUTH_USER_N_* env vars)
   - Stack: Next.js 14, React 18, NextAuth.js, SWR, Vercel

4. Remove any console.log statements used for debugging

5. Make sure `npm run build` completes with 0 errors

DO NOT add any new features.
```

### Commit and deploy
```
git add .
git commit -m "Phase 5: Production cleanup"
git push
```

---

## When your friend gives you WooCommerce keys (Phase 6)

No code changes needed. Just add environment variables in Vercel:

1. Go to https://vercel.com → your wooComerce project → Settings → Environment Variables
2. Change `MOCK_MODE` to `false`
3. Add:
   - `WOOCOMMERCE_URL` = `https://the-wordpress-store.com`
   - `WOOCOMMERCE_KEY` = `ck_xxxxxxxxxxxxxxxx`
   - `WOOCOMMERCE_SECRET` = `cs_xxxxxxxxxxxxxxxx`
4. Go to Deployments tab → click "..." on the latest → Redeploy
5. Done — the app now shows real store data

---

## Quick reference: the only terminal commands you need

```bash
# Test locally (run this after each phase)
npm run dev

# Stop the local server
Ctrl + C

# Deploy (run this after each phase is verified)
git add .
git commit -m "your message"
git push

# If npm run dev fails with missing packages
npm install
```

---

## Execution summary

| Phase | What happens | Estimated time |
|-------|-------------|---------------|
| 1A | Scaffold Next.js, placeholder pages | 10-15 min |
| 1B | Move real UI from App.jsx into pages | 20-30 min |
| 2 | API routes + mock data engine | 15-20 min |
| 3 | Login/logout with NextAuth | 15-20 min |
| 4 | Connect all pages to API | 20-30 min |
| 5 | Cleanup + deploy | 5-10 min |
| 6 | Flip to real WooCommerce | 2 min (Vercel UI only) |

Total: ~2-3 hours of Claude Code work across 1-2 sessions.
