# 🚀 Vercel Deployment Guide

## Quick Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/xeno_task)

---

## 📋 Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **GitHub/GitLab Account**: For repository hosting
3. **Environment Variables**: Prepare your credentials

---

## 🔧 Environment Variables Setup

Before deploying, you'll need to set these environment variables in Vercel:

### Required Variables

```bash
# Database
DATABASE_URL="mysql://user:password@host:3306/database"

# JWT Secret (generate a random string)
JWT_SECRET="your-super-secret-jwt-key-minimum-32-characters"

# Groq AI API Key
GROQ_API_KEY="gsk_your_groq_api_key_here"

# Node Environment
NODE_ENV="production"
```

### Optional Variables

```bash
# Shopify Integration (optional)
SHOPIFY_API_KEY="your_shopify_api_key"
SHOPIFY_ACCESS_TOKEN="shpat_your_access_token"
SHOPIFY_SHOP_DOMAIN="your-store.myshopify.com"

# Server Port (Vercel auto-assigns)
PORT="3000"
```

---

## 📦 Step-by-Step Deployment

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit for Vercel deployment"
   git branch -M main
   git remote add origin https://github.com/yourusername/xeno_task.git
   git push -u origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Click "Import Project"
   - Select your GitHub repository
   - Vercel will auto-detect the framework

3. **Configure Build Settings**
   - **Framework Preset**: Other
   - **Root Directory**: `./`
   - **Build Command**: `cd client && npm install && npm run build`
   - **Output Directory**: `client/dist`
   - **Install Command**: `npm install`

4. **Add Environment Variables**
   - Go to Project Settings → Environment Variables
   - Add all required variables listed above
   - Make sure to add them for Production, Preview, and Development

5. **Deploy**
   - Click "Deploy"
   - Wait for build to complete (2-5 minutes)
   - Your app will be live at `https://your-project.vercel.app`

### Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy from Root Directory**
   ```bash
   cd xeno_task
   vercel
   ```

4. **Follow CLI Prompts**
   - Set up and deploy? `Y`
   - Which scope? Select your account
   - Link to existing project? `N`
   - What's your project's name? `shopify-intelligence`
   - In which directory is your code located? `./`

5. **Set Environment Variables**
   ```bash
   vercel env add DATABASE_URL production
   vercel env add JWT_SECRET production
   vercel env add GROQ_API_KEY production
   ```

6. **Deploy to Production**
   ```bash
   vercel --prod
   ```

---

## 🗄️ Database Setup

### Using PlanetScale (Recommended for Vercel)

1. **Create PlanetScale Account**
   - Go to [planetscale.com](https://planetscale.com)
   - Create a free account

2. **Create Database**
   ```bash
   # Install PlanetScale CLI
   brew install planetscale/tap/pscale

   # Login
   pscale auth login

   # Create database
   pscale database create shopify-intelligence --region us-east

   # Create branch
   pscale branch create shopify-intelligence main
   ```

3. **Get Connection String**
   - Go to your database in PlanetScale dashboard
   - Click "Connect"
   - Copy the connection string
   - Add it to Vercel environment variables as `DATABASE_URL`

4. **Run Migrations**
   ```bash
   # Connect to your database
   pscale connect shopify-intelligence main --port 3309

   # In another terminal, run migrations
   cd server
   npx prisma migrate deploy
   ```

### Using Railway (Alternative)

1. **Create Railway Account**: [railway.app](https://railway.app)
2. **Create MySQL Database**: Click "New Project" → "Provision MySQL"
3. **Get Connection String**: Copy the `DATABASE_URL`
4. **Add to Vercel**: Paste in environment variables

---

## 📁 Project Structure for Vercel

```
xeno_task/
├── client/                 # Frontend (React + Vite)
│   ├── dist/              # Build output (auto-generated)
│   ├── src/
│   ├── package.json
│   └── vite.config.js
│
├── server/                # Backend (Node.js + Express)
│   ├── src/
│   │   └── index.js      # Main entry point
│   ├── prisma/
│   │   └── schema.prisma
│   └── package.json
│
├── vercel.json           # Vercel configuration
├── package.json          # Root package.json
└── README.md
```

---

## ⚙️ Build Configuration

### Client Build Command
```bash
cd client && npm install && npm run build
```

### Server Build Command
```bash
cd server && npm install
```

### Vercel Auto-Detection
Vercel automatically:
- Detects Node.js version from `package.json`
- Installs dependencies
- Runs build commands
- Deploys serverless functions

---

## 🔗 Custom Domain Setup

1. **Add Domain in Vercel**
   - Go to Project Settings → Domains
   - Add your custom domain
   - Follow DNS configuration instructions

2. **Update DNS Records**
   - Add A record or CNAME as instructed
   - Wait for DNS propagation (5-60 minutes)

3. **SSL Certificate**
   - Vercel automatically provisions SSL
   - Your site will be HTTPS by default

---

## 🧪 Testing Deployment

### 1. Test Health Endpoint
```bash
curl https://your-project.vercel.app/health
```

Expected response:
```json
{
  "status": "OK",
  "uptime": 12345
}
```

### 2. Test API
```bash
curl https://your-project.vercel.app/api/dashboard/demo_tenant
```

### 3. Test Frontend
Visit: `https://your-project.vercel.app`

---

## 🔄 Continuous Deployment

Vercel automatically deploys when you push to GitHub:

1. **Push to Main Branch**
   ```bash
   git add .
   git commit -m "Update feature"
   git push origin main
   ```

2. **Automatic Build**
   - Vercel detects the push
   - Runs build process
   - Deploys to production

3. **Preview Deployments**
   - Every branch gets a preview URL
   - Test before merging to main

---

## 📊 Monitoring & Logs

### View Deployment Logs
1. Go to Vercel Dashboard
2. Select your project
3. Click on "Deployments"
4. Click on any deployment to view logs

### Real-time Logs
```bash
vercel logs your-deployment-url
```

### Performance Analytics
- Go to Project → Analytics
- View metrics:
  - Page views
  - Unique visitors
  - Top pages
  - Performance scores

---

## 🚨 Troubleshooting

### Build Fails

**Issue**: Build command not found
```bash
Solution: Check package.json scripts in client folder
```

**Issue**: Dependencies not installing
```bash
Solution: Delete node_modules and package-lock.json, then redeploy
```

### Database Connection Fails

**Issue**: Cannot connect to database
```bash
Solution: 
1. Verify DATABASE_URL in environment variables
2. Check database is accessible from external IPs
3. Ensure Prisma is generated (add to build command)
```

### API Routes Not Working

**Issue**: 404 on API calls
```bash
Solution:
1. Check vercel.json routing configuration
2. Ensure server/src/index.js exports the Express app
3. Verify API routes don't have /api prefix in code (Vercel adds it)
```

### Environment Variables Not Loading

**Issue**: Undefined environment variables
```bash
Solution:
1. Add variables in Vercel dashboard
2. Redeploy the project
3. Check variable names match exactly
```

---

## 🔐 Security Checklist

- [x] All secrets in environment variables (not in code)
- [x] HTTPS enabled (automatic with Vercel)
- [x] CORS configured properly
- [x] Rate limiting implemented
- [x] SQL injection prevention (using Prisma ORM)
- [x] XSS protection enabled
- [x] JWT tokens properly secured
- [x] Password hashing with bcrypt

---

## 📈 Performance Optimization

### Vercel Automatic Optimizations
- ✅ Edge caching
- ✅ Gzip compression
- ✅ Image optimization
- ✅ CDN distribution
- ✅ Serverless functions

### Manual Optimizations
```javascript
// In vercel.json, add headers
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

---

## 📱 Post-Deployment Checklist

- [ ] Health endpoint returns 200
- [ ] Login/Register working
- [ ] Dashboard loads correctly
- [ ] AI Chat functioning
- [ ] 3D visualizations rendering
- [ ] Database queries executing
- [ ] Real-time updates working
- [ ] Environment variables set
- [ ] Custom domain configured (if applicable)
- [ ] SSL certificate active
- [ ] Monitoring enabled
- [ ] Error tracking setup (Sentry recommended)

---

## 🎯 Next Steps After Deployment

1. **Set up Monitoring**
   - Add Sentry for error tracking
   - Enable Vercel Analytics
   - Configure uptime monitoring

2. **Optimize Performance**
   - Review Lighthouse scores
   - Optimize images
   - Enable caching headers

3. **Configure Alerts**
   - Set up Vercel notifications
   - Configure email alerts for errors
   - Monitor usage limits

4. **Documentation**
   - Update README with live URL
   - Document API endpoints
   - Create user guide

---

## 💡 Tips for Successful Deployment

1. **Test Locally First**
   ```bash
   npm run build
   npm run preview
   ```

2. **Use Preview Deployments**
   - Test on unique URLs before production
   - Share with team for feedback

3. **Monitor Usage**
   - Check Vercel usage dashboard
   - Stay within free tier limits
   - Upgrade if needed

4. **Keep Secrets Safe**
   - Never commit `.env` files
   - Use Vercel's environment variables
   - Rotate secrets regularly

---

## 📞 Support Resources

- **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)
- **Vercel Discord**: [vercel.com/discord](https://vercel.com/discord)
- **GitHub Issues**: Create an issue in your repo
- **Stack Overflow**: Tag `vercel` and `next.js`

---

## 🎉 Congratulations!

Your Shopify Intelligence Platform is now live on Vercel! 🚀

**Live URL**: `https://your-project.vercel.app`

Share it with the world! 🌍

---

**Last Updated**: December 2024  
**Deployment Platform**: Vercel  
**Status**: ✅ Production Ready
