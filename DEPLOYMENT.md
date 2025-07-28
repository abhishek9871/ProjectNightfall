# Deployment Guide

## Overview
Project Nightfall is configured for deployment on both Netlify and Cloudflare Pages with support for continuous deployment via GitHub Actions.

## Current Deployment Methods

### 1. CLI-Based Deployment (Current Method)
```bash
# Netlify
npm run build
npm run deploy:netlify

# Cloudflare Pages
npm run build
npm run deploy:pages
```

### 2. Continuous Deployment via GitHub (Ready to Use)

#### GitHub Secrets Required
For automatic deployment, add these secrets to your GitHub repository:

**Netlify Secrets:**
- `NETLIFY_SITE_ID`: Your Netlify site ID
- `NETLIFY_AUTH_TOKEN`: Your Netlify personal access token

**Cloudflare Secrets:**
- `CLOUDFLARE_API_TOKEN`: Your Cloudflare API token
- `CLOUDFLARE_ACCOUNT_ID`: Your Cloudflare account ID

#### Workflow Triggers
- **Production Deployment**: Triggered on push to `master` or `main` branch
- **Development Preview**: Triggered on push to `dev` branch

## Configuration Files

### Netlify Configuration (`netlify.toml`)
```toml
[build]
command = "npm run build"
publish = "dist"

[[redirects]]
from = "/*"
to = "/index.html"
status = 200
```

### Cloudflare Configuration (`wrangler.toml`)
```toml
name = "project-nightfall"
compatibility_date = "2025-01-27"
pages_build_output_dir = "dist"
```

## Build Process
1. **Install Dependencies**: `npm ci`
2. **Build Project**: `npm run build`
3. **Output Directory**: `dist/`

## Environment Variables
- No environment variables required for basic deployment
- Optional: `GEMINI_API_KEY` for enhanced features

## Branch Strategy
- `dev`: Development branch with preview deployments
- `master`/`main`: Production branch with live deployments

## Deployment Verification
After deployment, verify:
- [ ] Age gate functionality
- [ ] Video playback
- [ ] Mobile navigation
- [ ] Search functionality
- [ ] Legal pages accessibility
- [ ] Ad slot placeholders
- [ ] Responsive design

## Troubleshooting

### Common Issues
1. **Build Failures**: Check Node.js version (requires 18+)
2. **Missing Dependencies**: Run `npm ci` instead of `npm install`
3. **Routing Issues**: Ensure SPA redirects are configured
4. **Mobile Issues**: Test on actual devices, not just browser dev tools

### Support
- Netlify: Check build logs in Netlify dashboard
- Cloudflare: Check deployment logs in Cloudflare Pages dashboard
- GitHub Actions: Check workflow runs in GitHub Actions tab

## Performance Optimization
- Vite build optimization enabled
- Compression plugin configured
- PWA features available
- Lazy loading implemented
- Code splitting automatic

## Security Considerations
- Age verification enforced
- Legal compliance pages included
- Cookie consent implemented
- Geo-restriction handling active
- Adult content warnings present