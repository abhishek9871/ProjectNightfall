# Deployment Guide

## Overview
Project Nightfall is configured for deployment on both Netlify and Cloudflare Pages with support for both CLI and continuous deployment via GitHub Actions.

## Deployment Methods

### 1. Direct CLI Deployment (Your Working Commands)
```bash
# Build first
npm run build

# Deploy to Netlify (your working command)
npm run deploy:netlify

# Deploy to Cloudflare (your working command)  
npm run deploy:cloudflare
# OR
npm run deploy:pages

# Deploy to both platforms
npm run deploy:all
```

### 2. Enhanced Deployment (Optional)
```bash
# Smart deployment with verification
npm run deploy:smart

# Verify deployment readiness only
npm run verify
```

### 3. Continuous Deployment via GitHub (Optional)

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
- **Manual Deployment**: Can be triggered manually from GitHub Actions tab

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

## Smart Deployment Features

### Automatic Verification
All deployment commands now include pre-deployment verification:
- ✅ Build file integrity check
- ✅ Configuration file validation
- ✅ HTML content verification
- ✅ PWA manifest and service worker validation
- ✅ Asset reference verification

### Intelligent Credential Detection
The deployment system automatically detects available credentials:
- **CLI Mode**: Uses local CLI authentication (netlify-cli, wrangler)
- **CI/CD Mode**: Uses GitHub secrets when available
- **Hybrid Mode**: Deploys to platforms with available credentials, skips others

### Deployment Scenarios

#### Scenario 1: CLI Only (Your Current Working Setup)
```bash
# Authenticate with platforms locally (if not already done)
netlify login
wrangler login

# Build and deploy (your exact working commands)
npm run build
npm run deploy:netlify  # Deploys to Netlify
npm run deploy:cloudflare  # Deploys to Cloudflare

# Or deploy to both
npm run deploy:all
```

#### Scenario 2: GitHub Actions Only
- Add required secrets to GitHub repository
- Push to master branch
- Automatic deployment to both platforms

#### Scenario 3: Hybrid (Recommended)
- Keep CLI authentication for manual deployments
- Add GitHub secrets for automated deployments
- Use both methods as needed

## Build Process
1. **Install Dependencies**: `npm ci`
2. **Build Project**: `npm run build`
3. **Verify Build**: `npm run verify`
4. **Deploy**: `npm run deploy`

## Environment Variables
- No environment variables required for basic deployment
- Optional: `GEMINI_API_KEY` for enhanced features
- Deployment credentials handled automatically

## Branch Strategy
- `dev`: Development branch with preview deployments
- `master`/`main`: Production branch with live deployments

## Deployment Verification
The automated verification checks:
- [ ] Build files exist and are properly sized
- [ ] Configuration files are present
- [ ] HTML contains required elements
- [ ] PWA features are configured
- [ ] Assets are properly referenced

After deployment, manually verify:
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
5. **Verification Failures**: Run `npm run verify` to see specific issues
6. **Credential Issues**: Check CLI authentication or GitHub secrets

### Deployment-Specific Issues

#### CLI Deployment Issues
```bash
# Re-authenticate if needed
netlify login
wrangler login

# Check authentication status
netlify status
wrangler whoami
```

#### GitHub Actions Issues
- Verify secrets are correctly set in repository settings
- Check workflow logs for specific error messages
- Ensure branch names match workflow configuration

### Support
- **Local Issues**: Run `npm run verify` for detailed diagnostics
- **Netlify**: Check build logs in Netlify dashboard
- **Cloudflare**: Check deployment logs in Cloudflare Pages dashboard
- **GitHub Actions**: Check workflow runs in GitHub Actions tab

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