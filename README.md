# WooCMS — WooCommerce Order Manager

A lightweight CMS dashboard for managing WooCommerce orders, built with React + Vite.

## Features
- Email/password login
- Order tracking with status workflow
- Invoice management
- WooCommerce REST API connection
- Responsive, clean UI

---

## Quick Start (Local)

```bash
npm install
npm run dev
```

Then open http://localhost:5173

**Demo login:** `erion@example.com` / `admin123`

---

## Deploy to Vercel

### Prerequisites
- A GitHub account (https://github.com)
- A Vercel account (https://vercel.com — sign up with GitHub)
- Git installed on your computer

### Step-by-step

**1. Unzip this project**

Unzip the `woo-cms.zip` file to a folder on your computer.

**2. Open a terminal in that folder**

On Mac: right-click the folder → "Open in Terminal"  
On Windows: open the folder, type `cmd` in the address bar, press Enter

**3. Initialize a Git repo**

```bash
git init
git add .
git commit -m "Initial commit"
```

**4. Create a GitHub repo**

Go to https://github.com/new  
- Name: `woo-cms`
- Keep it Private
- Do NOT add a README (you already have one)
- Click "Create repository"

**5. Push your code to GitHub**

GitHub will show you commands. Copy and run the ones under "push an existing repository":

```bash
git remote add origin https://github.com/YOUR_USERNAME/woo-cms.git
git branch -M main
git push -u origin main
```

Replace `YOUR_USERNAME` with your actual GitHub username.

**6. Connect to Vercel**

- Go to https://vercel.com/dashboard
- Click "Add New" → "Project"
- Select your `woo-cms` repo from the list
- Vercel auto-detects Vite — leave all settings as default
- Click "Deploy"
- Wait ~60 seconds

**7. Done!**

Vercel gives you a URL like `woo-cms-xxxx.vercel.app`. That's your live CMS.

---

## After Deployment

### Change login credentials

Open `src/App.jsx` and edit the `AUTHORIZED_USERS` array at the top:

```js
const AUTHORIZED_USERS = [
  { email: "your@email.com", password: "your-secure-password", name: "Your Name", role: "Admin" },
  // add more users as needed
];
```

Then commit and push — Vercel redeploys automatically:

```bash
git add .
git commit -m "Update credentials"
git push
```

### Connect your WooCommerce store

1. In your WordPress admin: WooCommerce → Settings → Advanced → REST API
2. Click "Add Key"
3. Description: `WooCMS`
4. User: select your admin user
5. Permissions: `Read/Write`
6. Click "Generate API Key"
7. Copy the Consumer Key and Consumer Secret
8. In WooCMS, go to Connection page and paste them in

### Custom domain (optional)

In Vercel dashboard → your project → Settings → Domains → add `cms.yourstore.com`

Then in your domain DNS, add a CNAME record pointing to `cname.vercel-dns.com`

---

## Updating the app

Any time you push changes to GitHub, Vercel auto-deploys within ~30 seconds:

```bash
# make changes to src/App.jsx
git add .
git commit -m "Description of changes"
git push
```
