# Deployment Guide - Xeno Dashboard

## 📦 Deploying to Vercel

### Prerequisites
- Vercel account (free tier works)
- Git repository (GitHub, GitLab, or Bitbucket)
- Groq API key for AI insights

### Step 1: Prepare the Project

1. **Push to Git**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin your-repo-url
   git push -u origin main
   ```

2. **Update vercel.json** (already configured)
   The project includes a pre-configured `vercel.json` file

### Step 2: Deploy Backend

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "Add New Project"
3. Import your Git repository
4. Configure:
   - **Framework Preset**: Other
   - **Root Directory**: `server`
   - **Build Command**: `npm install && npx prisma generate`
   - **Output Directory**: Leave empty
   - **Install Command**: `npm install`

5. **Add Environment Variables**:
   ```
   DATABASE_URL=file:./dev.db
   GROQ_API_KEY=your_groq_api_key
   NODE_ENV=production
   ```

6. Click "Deploy"

### Step 3: Deploy Frontend

1. Create a new project in Vercel
2. Import the same Git repository
3. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

4. **Add Environment Variables**:
   ```
   VITE_API_URL=https://your-backend-url.vercel.app/api
   ```
   (Replace with your actual backend URL from Step 2)

5. Click "Deploy"

### Step 4: Update API URL

After deploying the backend, update the frontend environment variable:
1. Go to frontend project settings
2. Update `VITE_API_URL` with the backend deployment URL
3. Redeploy the frontend

## 🚀 Alternative: Deploy as Monorepo

You can also deploy both frontend and backend together:

1. Update `vercel.json`:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "server/src/index.js",
      "use": "@vercel/node"
    },
    {
      "src": "client/package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "server/src/index.js"
    },
    {
      "src": "/(.*)",
      "dest": "client/$1"
    }
  ]
}
```

2. Set build settings:
   - **Build Command**: `cd server && npm install && cd ../client && npm install && npm run build`
   - **Output Directory**: `client/dist`

## 🗄️ Database Considerations

### For Production

⚠️ **Important**: SQLite is not recommended for production on Vercel due to serverless filesystem constraints.

**Recommended alternatives:**

1. **PostgreSQL** (Recommended)
   - Use Vercel Postgres or Neon
   - Update Prisma schema:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```
   - Run migrations:
   ```bash
   npx prisma migrate deploy
   ```

2. **MySQL** (via PlanetScale)
   - Sign up for PlanetScale
   - Update Prisma schema:
   ```prisma
   datasource db {
     provider = "mysql"
     url      = env("DATABASE_URL")
     relationMode = "prisma"
   }
   ```

3. **MongoDB** (via MongoDB Atlas)
   - Use Prisma with MongoDB connector

### Migration Commands

```bash
# Development
npx prisma migrate dev

# Production
npx prisma migrate deploy

# Generate client
npx prisma generate
```

## 🔐 Environment Variables

### Backend (.env)
```env
# Database
DATABASE_URL="postgresql://user:password@host:5432/dbname"

# Server
PORT=3000
NODE_ENV=production

# AI Service
GROQ_API_KEY=your_groq_api_key_here

# CORS (if needed)
ALLOWED_ORIGINS=https://your-frontend-url.vercel.app
```

### Frontend (.env)
```env
# API Endpoint
VITE_API_URL=https://your-backend-url.vercel.app/api
```

## ✅ Post-Deployment Checklist

- [ ] Backend is accessible and returns data
- [ ] Frontend loads and displays correctly
- [ ] API calls from frontend to backend work
- [ ] Database connection is successful
- [ ] AI insights generate properly
- [ ] CORS is configured correctly
- [ ] Environment variables are set
- [ ] Custom domain configured (optional)
- [ ] SSL/HTTPS is enabled
- [ ] Analytics setup (optional)

## 🔍 Troubleshooting

### Frontend can't connect to backend
- Check `VITE_API_URL` is correct
- Verify CORS settings in backend
- Check browser console for errors

### Database connection issues
- Verify `DATABASE_URL` format
- Check Prisma client is generated
- Review connection pooling settings

### Build failures
- Check Node.js version compatibility
- Verify all dependencies are in package.json
- Review build logs in Vercel dashboard

### AI insights not working
- Verify `GROQ_API_KEY` is set correctly
- Check API quota and limits
- Review backend logs for errors

## 📊 Monitoring

### Vercel Analytics
Enable Vercel Analytics in your dashboard for:
- Page views
- Performance metrics
- Error tracking

### Custom Monitoring
Add logging service:
- Sentry for error tracking
- LogRocket for session replay
- DataDog for APM

## 🔄 Continuous Deployment

Vercel automatically deploys on Git push:
1. Push to `main` branch → Production deployment
2. Push to other branches → Preview deployment
3. Pull requests → Automatic preview URLs

## 📱 Custom Domain

1. Go to project settings in Vercel
2. Navigate to "Domains"
3. Add your custom domain
4. Update DNS records as instructed
5. SSL is automatically configured

## 💡 Performance Tips

1. **Enable caching**: Configure appropriate cache headers
2. **Image optimization**: Use Vercel's Image Optimization
3. **Code splitting**: Vite handles this automatically
4. **Edge functions**: Consider Vercel Edge Functions for API
5. **CDN**: Vercel serves static assets via CDN automatically

## 🆘 Support

- [Vercel Documentation](https://vercel.com/docs)
- [Prisma Deployment Guide](https://www.prisma.io/docs/guides/deployment)
- [Vite Production Build](https://vitejs.dev/guide/build.html)

---

**Happy Deploying! 🚀**
