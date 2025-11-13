# Deployment Guide - Step by Step

## Prerequisites
- GitHub account
- Vercel account (free)

## Step 1: Prepare for Deployment

Your project is ready! All files are configured for Vercel.

## Step 2: Push to GitHub

1. Open terminal in project folder
2. Run these commands:

```bash
git init
git add .
git commit -m "Initial commit"
```

3. Create a new repository on GitHub (https://github.com/new)
   - Name it: `portfolio-website`
   - Don't initialize with README

4. Push to GitHub:
```bash
git remote add origin https://github.com/YOUR_USERNAME/portfolio-website.git
git branch -M main
git push -u origin main
```

## Step 3: Deploy to Vercel

### Option A: Using Vercel Website (Easiest)

1. Go to https://vercel.com/
2. Click "Sign Up" or "Login" (use GitHub)
3. Click "Add New" → "Project"
4. Import your GitHub repository
5. Configure:
   - Framework Preset: Other
   - Root Directory: ./
   - Build Command: (leave empty)
   - Output Directory: (leave empty)
6. Click "Deploy"
7. Wait 1-2 minutes ✓

### Option B: Using Vercel CLI

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Login:
```bash
vercel login
```

3. Deploy:
```bash
vercel
```

4. Follow prompts:
   - Set up and deploy? Y
   - Which scope? (select your account)
   - Link to existing project? N
   - Project name? (press enter)
   - Directory? (press enter)
   - Override settings? N

5. Deploy to production:
```bash
vercel --prod
```

## Step 4: Access Your Site

After deployment, you'll get URLs:
- **Portfolio**: `https://your-project.vercel.app`
- **Admin Login**: `https://your-project.vercel.app/login`
- **Admin Panel**: `https://your-project.vercel.app/admin`

## Step 5: Create Admin User

Since you're using MongoDB Atlas (cloud database), your admin user already exists!

If you need to create a new admin:
1. Run locally: `npm run create-admin`
2. Enter email and password
3. Admin is saved to MongoDB Atlas (accessible from deployed site)

## Important Notes

✓ MongoDB Atlas is already cloud-based - works automatically
✓ All data persists across deployments
✓ No environment variables needed (connection string is in code)
✓ Static files served automatically
✓ API routes work via serverless functions

## Troubleshooting

**If deployment fails:**
1. Check `vercel.json` exists
2. Check `api/index.js` exists
3. Redeploy: `vercel --prod`

**If admin login doesn't work:**
1. Create admin user locally: `npm run create-admin`
2. Data saves to MongoDB Atlas
3. Login on deployed site

## Update Your Site

After making changes:
```bash
git add .
git commit -m "Update"
git push
```

Vercel auto-deploys on every push!

## Custom Domain (Optional)

1. Go to Vercel Dashboard
2. Select your project
3. Settings → Domains
4. Add your domain
5. Update DNS records as shown

---

**Your site is now live! 🎉**
