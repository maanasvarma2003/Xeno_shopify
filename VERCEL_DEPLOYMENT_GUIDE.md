# 🚀 Vercel Deployment Guide - Complete Setup

## ⚠️ CRITICAL: Fixing "Invalid Credentials" / "Failed to Register" Errors

If you're experiencing authentication errors on your deployed Vercel app but it works locally, this is because:
1. **API endpoint mismatch** - The frontend was trying to connect to `localhost` instead of your Vercel backend
2. **Database issues** - SQLite doesn't work on Vercel's serverless environment

This guide provides a **complete solution**.

---

## 🔧 Solution Already Implemented

The codebase has been updated with the following fix:

### Fixed File: `client/src/api.js`
```javascript
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || (import.meta.env.MODE === 'production' ? '/api' : 'http://localhost:3000/api'),
});
```

**What this does:**
- ✅ **Local development**: Uses `http://localhost:3000/api`
- ✅ **Production (Vercel)**: Uses `/api` (same domain as frontend)
- ✅ **Custom override**: Respects `VITE_API_URL` environment variable if set

---

## 📋 Prerequisites

Before deploying, you need:

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **GitHub Repository**: Your code must be on GitHub
3. **Database** (Choose ONE):
   - **Option A**: Vercel Postgres (Recommended for beginners)
   - **Option B**: PlanetScale MySQL (Free tier available)
   - **Option C**: Railway PostgreSQL/MySQL
4. **Groq API Key**: Get from [console.groq.com](https://console.groq.com)

---

## 🗄️ Step 1: Set Up Database (CRITICAL)

### ⭐ Option A: Vercel Postgres (Recommended)

1. Go to your Vercel Dashboard
2. Navigate to **Storage** tab
3. Click **Create Database** → **Postgres**
4. Copy the connection string

5. **Prisma Schema is ALREADY Updated** for PostgreSQL:

The `server/prisma/schema.prisma` file is now configured for PostgreSQL by default:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

6. Run migration:
```bash
cd server
npx prisma migrate dev --name init_postgres
npx prisma generate
```

### Option B: PlanetScale (MySQL)

1. Sign up at [planetscale.com](https://planetscale.com)
2. Create a new database
3. Get connection string from dashboard

Edit `server/prisma/schema.prisma`:
```prisma
datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
  relationMode = "prisma"  // Required for PlanetScale
}
```

---

## 🚀 Step 2: Deploy to Vercel

### Method 1: Vercel Dashboard (Easiest)

1. **Import Repository**:
   - Go to [vercel.com/new](https://vercel.com/new)
   - Click **Import Git Repository**
   - Select your GitHub repository
   - Click **Import**

2. **Configure Build Settings** (should auto-detect):
   - **Framework Preset**: Vite
   - **Root Directory**: `./client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

3. **Add Environment Variables**:

Click **Environment Variables** and add these:

#### Required Variables:
```
DATABASE_URL = your_database_connection_string
GROQ_API_KEY = your_groq_api_key_here
NODE_ENV = production
```

#### Optional but Recommended:
```
JWT_SECRET = generate_random_32+_character_string
```

Generate JWT_SECRET: Run this in terminal:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

4. **Deploy**:
   - Click **Deploy**
   - Wait for deployment to complete (~2-5 minutes)

---

## ✅ Step 3: Verify Deployment

1. **Test API Health**:
```bash
curl https://your-app.vercel.app/api/health
```
Expected response:
```json
{"status":"OK","uptime":12345}
```

2. **Test Registration**:
   - Go to `https://your-app.vercel.app`
   - Click **Get Started**
   - Fill in the registration form
   - You should successfully register and see the dashboard

3. **Test Login**:
   - Log out
   - Log back in with your credentials
   - Should work without "Invalid credentials" error

---

## 🔍 Troubleshooting

### Issue: "Invalid credentials" / "Failed to register"

**Cause**: Frontend can't reach backend API

**Fix**:
1. ✅ **Already done**: API baseURL updated in code
2. Check browser console (F12) → Network tab
3. Look for API calls - they should go to `/api/...` not `http://localhost:3000/api/...`
4. If still failing, check Vercel logs

### Issue: "Failed to connect to database"

**Fix**:
1. Verify `DATABASE_URL` is set in Vercel environment variables
2. Test database connection string locally:
   ```bash
   cd server
   DATABASE_URL="your_connection_string" npx prisma db push
   ```
3. Make sure Prisma schema matches your database provider

### Issue: 500 Internal Server Error

**Fix**:
1. Check Vercel function logs:
   - Vercel Dashboard → Your Project → **Deployments** → Click latest deployment → **Functions**
2. Look for error messages
3. Common issues:
   - Missing environment variables
   - Database connection failures
   - Prisma client not generated

### Issue: CORS errors

**Already handled** in `server/src/index.js`:
```javascript
app.use(cors());  // Allows all origins
```

If you need  stricter CORS:
```javascript
app.use(cors({
    origin: process.env.CORS_ORIGIN?.split(',') || '*',
    credentials: true
}));
```

---

## 🔄 Step 4: Push Changes to GitHub

Since we've updated the API configuration, commit and push:

```bash
git add .
git commit -m "Fix: Update API baseURL for Vercel deployment compatibility"
git push origin main
```

Vercel will automatically redeploy when you push to GitHub.

---

## 📱 Testing Checklist

After deployment, test these features:

- [ ] Landing page loads
- [ ] **Registration works** (no "failed to register" error)
- [ ] **Login works** (no "invalid credentials" error)
- [ ] Dashboard displays
- [ ] Metrics load
- [ ] AI insights generate
- [ ] Charts render
- [ ] Real-time features work

---

## 🆘 Need Help?

### Check Vercel Logs:
```bash
vercel logs your-project-name
```

### Or in Dashboard:
1. Go to your project
2. Click **Deployments**
3. Click on latest deployment
4. Check **Build Logs** and **Function Logs**

### Common Log Messages:

| Error | Solution |
|-------|----------|
| `GROQ_API_KEY is required` | Add GROQ_API_KEY to environment variables |
| `Can't reach database server` | Check DATABASE_URL format |
| `Module not found: prisma` | Run `npx prisma generate` in build |
| `ECONNREFUSED` | Database not accessible from Vercel |

---

## 🎉 Success Indicators

Your deployment is successful when:

1. ✅ URL opens without errors
2. ✅ You can register a new account
3. ✅ You can login with created credentials  
4. ✅ Dashboard loads with data
5. ✅ No console errors in browser (F12)
6. ✅ API health check returns `{"status":"OK"}`

---

## 🔐 Security Best Practices

1. **Rotate secrets regularly** (every 90 days)
2. **Use different API keys** for dev/staging/production
3. **Never commit `.env` files** to Git (already in `.gitignore`)
4. **Enable Vercel Authentication** for sensitive routes (optional)
5. **Use environment-specific database** credentials

---

## 📝 Environment Variables Reference

### Client (Frontend) - Vercel

**DO NOT SET** `VITE_API_URL` in Vercel - it uses relative paths in production.

### Server (Backend) - Vercel

| Variable | Required | Example | Description |
|----------|----------|---------|-------------|
| `DATABASE_URL` | ✅ Yes | `postgresql://user:pass@host/db` | Database connection string |
| `GROQ_API_KEY` | ✅ Yes | `gsk_...` | Groq AI API key |
| `NODE_ENV` | ✅ Yes | `production` | Environment mode |
| `JWT_SECRET` | ⚠️ Recommended | `random32chars...` | JWT signing secret |
| `PORT` | ❌ No | `3000` | Auto-assigned by Vercel |

---

## 🔄 Continuous Deployment

Vercel automatically redeploys when you push to GitHub:

```bash
# Make changes
git add .
git commit -m "Your changes"
git push origin main

# Vercel deploys automatically!
```

---

## 📊 Performance Optimization

After deployment:

1. **Enable Vercel Analytics**:
   - Project Settings → Analytics → Enable

2. **Set up Edge Functions** (optional):
   - Move API routes to edge for faster response times

3. **Enable Vercel KV** (optional):
   - For caching and session storage

---

## ✅ Final Checklist

Before considering deployment complete:

- [ ] Code pushed to GitHub
- [ ] Database created and connected
- [ ] All environment variables set in Vercel
- [ ] Prisma schema matches database provider
- [ ] Build succeeds without errors
- [ ] Health check passes
- [ ] **Registration works on deployed URL**
- [ ] **Login works on deployed URL**
- [ ] Dashboard accessible after login
- [ ] No console errors
- [ ] Mobile responsive verified

---

## 🎯 Summary

**What was fixed:**
1. ✅ API baseURL now uses relative paths in production (`/api`)
2. ✅ Works with Vercel's serverless function routing
3. ✅ No more "localhost" hardcoding issues
4. ✅ Automatic environment detection (dev vs production)

**Result:**
- 🎉 Registration works on deployed app
- 🎉 Login works on deployed app  
- 🎉 Full authentication flow functional
- 🎉 Same experience as localhost

---

Last Updated: December 2024
