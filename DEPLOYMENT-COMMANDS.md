# Deployment Commands Reference

## Your Proven Working Commands (From FRS.md)

These are the exact commands that worked successfully in your terminal:

### Build First
```bash
npm run build
```

### Deploy to Netlify
```bash
npm run deploy:netlify
```
**Executes**: `netlify deploy --prod --dir=dist`

### Deploy to Cloudflare
```bash
npm run deploy:cloudflare
```
**OR**
```bash
npm run deploy:pages
```
**Executes**: `wrangler pages deploy dist --project-name=project-nightfall --branch=master`

### Deploy to Both Platforms
```bash
npm run deploy:all
```
**Executes**: Both Netlify and Cloudflare commands sequentially

## Prerequisites

### CLI Authentication (Required)
Make sure you're logged in to both platforms:

```bash
# Netlify login (if not already done)
netlify login

# Cloudflare login (if not already done)  
wrangler login
```

### Verify Authentication Status
```bash
# Check Netlify status
netlify status

# Check Cloudflare status
wrangler whoami
```

## Complete Deployment Workflow

### Option 1: Deploy to Both Platforms
```bash
npm run build
npm run deploy:all
```

### Option 2: Deploy to Specific Platform
```bash
npm run build
npm run deploy:netlify    # Netlify only
# OR
npm run deploy:cloudflare # Cloudflare only
```

### Option 3: With Verification (Optional)
```bash
npm run build
npm run verify           # Check if everything is ready
npm run deploy:all       # Deploy to both platforms
```

## GitHub Actions (Optional)

If you add these secrets to your GitHub repository, deployments will happen automatically on push to master:

**Required Secrets:**
- `NETLIFY_SITE_ID`
- `NETLIFY_AUTH_TOKEN`  
- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

**Without secrets**: GitHub Actions will only build and test, no deployment

## Troubleshooting

### If Netlify Deploy Fails
```bash
# Re-authenticate
netlify login

# Check status
netlify status

# Try manual deployment
netlify deploy --prod --dir=dist
```

### If Cloudflare Deploy Fails
```bash
# Re-authenticate
wrangler login

# Check status
wrangler whoami

# Try manual deployment
wrangler pages deploy dist --project-name=project-nightfall --branch=master
```

### If Build Fails
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install

# Try build again
npm run build
```

## Summary

**Your working deployment process:**
1. `npm run build` - Creates production build
2. `npm run deploy:netlify` - Deploys to Netlify using CLI auth
3. `npm run deploy:cloudflare` - Deploys to Cloudflare using CLI auth

**OR simply:**
1. `npm run build`
2. `npm run deploy:all` - Deploys to both platforms

These commands use your existing CLI authentication and the exact deployment commands that worked successfully according to your FRS.md documentation.