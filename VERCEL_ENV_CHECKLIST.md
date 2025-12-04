# ✅ Vercel Environment Checklist

To ensure your deployment works perfectly, verify these settings in your Vercel Dashboard.

**Go to:** Project Settings → Environment Variables

## 1. Database (PostgreSQL)
- [ ] **`DATABASE_URL`**
  - **Value:** `postgresql://neondb_owner:npg_tuyS95BPJnOd@ep-cold-sunset-ahfu5xij-pooler.c-3.us-east-1.aws.neon.tech/neondb?connect_timeout=15&sslmode=require`
  - **Why:** Connects to your Neon DB where we just created the tables.

## 2. AI Service
- [ ] **`GROQ_API_KEY`**
  - **Value:** `gsk_...` (Your actual key)
  - **Why:** Powers the AI chat and insights.

## 3. Configuration
- [ ] **`NODE_ENV`**
  - **Value:** `production`
  - **Why:** Optimizes the build.

- [ ] **`JWT_SECRET`**
  - **Value:** `any_long_random_string`
  - **Why:** Secures user sessions.

## ❌ DO NOT SET
- [ ] **`VITE_API_URL`**
  - **Ensure this is NOT set in Vercel.**
  - **Why:** The app automatically uses relative paths (`/api`) in production. Setting this to localhost will break it.

---

## 🔄 After Checking
If you changed anything, go to **Deployments** → **Redeploy**.
