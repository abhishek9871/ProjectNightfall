# Cloudflare Pages Deployment

## Quick Deploy Commands

```bash
npm run build
npm run deploy:pages
```

## What Happens
- Builds production files to `dist/`
- Deploys to Cloudflare Pages using `wrangler`
- Generates new deployment URL (e.g., `https://abc123.project-nightfall.pages.dev`)
- Dynamic proxy URLs automatically work with new deployment URL

## Prerequisites
- Logged in to Cloudflare: `wrangler login`
- Project configured: `project-nightfall`

## GitHub Automation (Optional)
Add these secrets to enable auto-deployment on push to master:
- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

That's it.