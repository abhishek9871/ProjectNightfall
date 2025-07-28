#!/usr/bin/env node

/**
 * Pre-deployment verification script
 * Ensures the build is production-ready before deployment
 */

import { existsSync, readFileSync, statSync } from 'fs';
import { join } from 'path';

const REQUIRED_FILES = [
  'dist/index.html',
  'dist/assets',
  'dist/manifest.webmanifest',
  'dist/sw.js'
];

const REQUIRED_CONFIGS = [
  'netlify.toml',
  'wrangler.toml'
];

function log(message, type = 'info') {
  const prefix = {
    info: '📋',
    success: '✅',
    warning: '⚠️',
    error: '❌'
  }[type];
  
  console.log(`${prefix} ${message}`);
}

function checkBuildFiles() {
  log('Checking build files...');
  
  let allFilesExist = true;
  
  for (const file of REQUIRED_FILES) {
    if (existsSync(file)) {
      const stats = statSync(file);
      if (stats.isDirectory()) {
        log(`✓ Directory exists: ${file}`, 'success');
      } else {
        const size = (stats.size / 1024).toFixed(2);
        log(`✓ File exists: ${file} (${size} KB)`, 'success');
      }
    } else {
      log(`✗ Missing: ${file}`, 'error');
      allFilesExist = false;
    }
  }
  
  return allFilesExist;
}

function checkConfigFiles() {
  log('Checking deployment configuration files...');
  
  let allConfigsExist = true;
  
  for (const config of REQUIRED_CONFIGS) {
    if (existsSync(config)) {
      log(`✓ Config exists: ${config}`, 'success');
    } else {
      log(`✗ Missing config: ${config}`, 'error');
      allConfigsExist = false;
    }
  }
  
  return allConfigsExist;
}

function checkIndexHtml() {
  log('Verifying index.html content...');
  
  if (!existsSync('dist/index.html')) {
    log('index.html not found', 'error');
    return false;
  }
  
  const content = readFileSync('dist/index.html', 'utf-8');
  
  const checks = [
    { test: content.includes('<title>'), message: 'Title tag present' },
    { test: content.includes('manifest.webmanifest'), message: 'PWA manifest linked' },
    { test: content.includes('registerSW'), message: 'Service worker registration' },
    { test: content.includes('assets/'), message: 'Asset references present' }
  ];
  
  let allChecksPass = true;
  
  for (const check of checks) {
    if (check.test) {
      log(`✓ ${check.message}`, 'success');
    } else {
      log(`✗ ${check.message}`, 'error');
      allChecksPass = false;
    }
  }
  
  return allChecksPass;
}

function checkEnvironmentVariables() {
  log('Checking deployment environment variables...');
  
  const netlifyVars = ['NETLIFY_AUTH_TOKEN', 'NETLIFY_SITE_ID'];
  const cloudflareVars = ['CLOUDFLARE_API_TOKEN', 'CLOUDFLARE_ACCOUNT_ID'];
  
  const netlifyReady = netlifyVars.every(v => process.env[v]);
  const cloudflareReady = cloudflareVars.every(v => process.env[v]);
  
  if (netlifyReady) {
    log('✓ Netlify credentials configured', 'success');
  } else {
    log('⚠ Netlify credentials not configured (CLI deployment only)', 'warning');
  }
  
  if (cloudflareReady) {
    log('✓ Cloudflare credentials configured', 'success');
  } else {
    log('⚠ Cloudflare credentials not configured (CLI deployment only)', 'warning');
  }
  
  return netlifyReady || cloudflareReady;
}

function main() {
  log('Starting pre-deployment verification...');
  
  const buildFilesOk = checkBuildFiles();
  const configFilesOk = checkConfigFiles();
  const indexHtmlOk = checkIndexHtml();
  const envVarsOk = checkEnvironmentVariables();
  
  log('Verification Summary:');
  log(`Build Files: ${buildFilesOk ? 'PASS' : 'FAIL'}`, buildFilesOk ? 'success' : 'error');
  log(`Config Files: ${configFilesOk ? 'PASS' : 'FAIL'}`, configFilesOk ? 'success' : 'error');
  log(`Index HTML: ${indexHtmlOk ? 'PASS' : 'FAIL'}`, indexHtmlOk ? 'success' : 'error');
  log(`Environment: ${envVarsOk ? 'READY' : 'CLI ONLY'}`, envVarsOk ? 'success' : 'warning');
  
  const overallSuccess = buildFilesOk && configFilesOk && indexHtmlOk;
  
  if (overallSuccess) {
    log('✅ Deployment verification PASSED - Ready for production!', 'success');
    process.exit(0);
  } else {
    log('❌ Deployment verification FAILED - Please fix issues before deploying', 'error');
    process.exit(1);
  }
}

main();