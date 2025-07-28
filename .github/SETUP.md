# GitHub Actions Setup Guide

## Required Secrets for Continuous Deployment

To enable automatic deployment via GitHub Actions, you need to add the following secrets to your GitHub repository.

### How to Add Secrets
1. Go to your GitHub repository
2. Click on **Settings** tab
3. Navigate to **Secrets and variables** → **Actions**
4. Click **New repository secret**

### Required Secrets

#### For Netlify Deployment
```
NETLIFY_SITE_ID
```
- **Where to find**: Netlify Dashboard → Site Settings → General → Site Information
- **Format**: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`

```
NETLIFY_AUTH_TOKEN
```
- **Where to find**: Netlify Dashboard → User Settings → Applications → Personal Access Tokens
- **How to create**: Click "New access token" and copy the generated token
- **Format**: `nfp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

#### For Cloudflare Pages Deployment
```
CLOUDFLARE_API_TOKEN
```
- **Where to find**: Cloudflare Dashboard → My Profile → API Tokens
- **How to create**: Click "Create Token" → Use "Custom token" template
- **Required permissions**:
  - Zone: Zone:Read
  - Account: Cloudflare Pages:Edit
- **Format**: `xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

```
CLOUDFLARE_ACCOUNT_ID
```
- **Where to find**: Cloudflare Dashboard → Right sidebar → Account ID
- **Format**: `xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

## Workflow Files

### Production Deployment (`.github/workflows/deploy.yml`)
- Triggers on push to `master` or `main` branch
- Builds project and deploys to both Netlify and Cloudflare
- Requires all secrets above

### Development Preview (`.github/workflows/dev.yml`)
- Triggers on push to `dev` branch
- Creates preview deployment on Netlify
- Requires only Netlify secrets

## Testing the Setup

1. **Push to dev branch**: Should create a preview deployment
2. **Push to master branch**: Should deploy to production on both platforms
3. **Check Actions tab**: Monitor workflow execution and logs

## Troubleshooting

### Common Issues
- **Secret not found**: Double-check secret names (case-sensitive)
- **Permission denied**: Verify API token permissions
- **Build failures**: Check Node.js version in workflow (set to 18)

### Getting Help
- Check workflow logs in GitHub Actions tab
- Verify secrets are properly set in repository settings
- Test CLI deployment first to ensure configurations are correct