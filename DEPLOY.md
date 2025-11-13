# Deploy to Vercel

## Quick Deploy

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel
```

## Or Deploy via GitHub

1. Push code to GitHub
2. Go to https://vercel.com/
3. Click "Import Project"
4. Select your repository
5. Click "Deploy"

## Environment

- Serverless functions in `/api` folder
- Static files served from root
- SQLite in-memory database (resets on each deployment)

## URLs

- Portfolio: `https://your-project.vercel.app`
- Admin: `https://your-project.vercel.app/admin.html`
- API: `https://your-project.vercel.app/api/*`
