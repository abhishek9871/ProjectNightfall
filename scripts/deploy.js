#!/usr/bin/env node

/**
 * Universal Deployment Script for Project Nightfall
 * Supports both CLI and CI/CD deployment scenarios
 */

import { execSync } from 'child_process';
import { existsSync } from 'fs';
import { join } from 'path';

const DEPLOYMENT_TARGETS = {
  netlify: {
    command: 'netlify deploy --prod --dir=dist',
    envCheck: [], // CLI authentication used
    description: 'Netlify Production'
  },
  cloudflare: {
    command: 'wrangler pages deploy dist --project-name=project-nightfall --branch=master',
    envCheck: [], // CLI authentication used
    description: 'Cloudflare Pages'
  }
};

function log(message, type = 'info') {
  const timestamp = new Date().toISOString();
  const prefix = {
    info: '📋',
    success: '✅',
    warning: '⚠️',
    error: '❌'
  }[type];
  
  console.log(`${prefix} [${timestamp}] ${message}`);
}

function checkEnvironment() {
  log('Checking deployment environment...');
  
  // Check if we're in CI/CD environment
  const isCI = process.env.CI === 'true' || process.env.GITHUB_ACTIONS === 'true';
  
  // Check if dist directory exists
  if (!existsSync('dist')) {
    log('Build directory (dist) not found. Running build...', 'warning');
    try {
      execSync('npm run build', { stdio: 'inherit' });
      log('Build completed successfully', 'success');
    } catch (error) {
      log('Build failed', 'error');
      process.exit(1);
    }
  }
  
  return { isCI };
}

function checkCredentials(target) {
  const config = DEPLOYMENT_TARGETS[target];
  
  // If no environment variables required, assume CLI authentication
  if (config.envCheck.length === 0) {
    log(`Using CLI authentication for ${config.description}`, 'info');
    return true;
  }
  
  const missing = config.envCheck.filter(env => !process.env[env]);
  
  if (missing.length > 0) {
    log(`Missing environment variables for ${config.description}: ${missing.join(', ')}`, 'warning');
    log(`Falling back to CLI authentication`, 'info');
    return true; // Still try CLI authentication
  }
  
  return true;
}

function deploy(target) {
  const config = DEPLOYMENT_TARGETS[target];
  
  if (!checkCredentials(target)) {
    log(`Skipping ${config.description} deployment - missing credentials`, 'warning');
    return false;
  }
  
  try {
    log(`Deploying to ${config.description}...`);
    execSync(config.command, { stdio: 'inherit' });
    log(`Successfully deployed to ${config.description}`, 'success');
    return true;
  } catch (error) {
    log(`Failed to deploy to ${config.description}`, 'error');
    return false;
  }
}

function main() {
  const args = process.argv.slice(2);
  const target = args[0];
  
  log('Starting Project Nightfall deployment...');
  
  const { isCI } = checkEnvironment();
  
  if (target && DEPLOYMENT_TARGETS[target]) {
    // Deploy to specific target
    const success = deploy(target);
    process.exit(success ? 0 : 1);
  } else if (target === 'all' || !target) {
    // Deploy to all available targets
    let successCount = 0;
    const targets = Object.keys(DEPLOYMENT_TARGETS);
    
    for (const deployTarget of targets) {
      if (deploy(deployTarget)) {
        successCount++;
      }
    }
    
    if (successCount === 0) {
      log('No deployments were successful', 'error');
      process.exit(1);
    } else if (successCount < targets.length) {
      log(`Partial deployment success: ${successCount}/${targets.length} targets`, 'warning');
      process.exit(0);
    } else {
      log('All deployments completed successfully', 'success');
      process.exit(0);
    }
  } else {
    log('Usage: node scripts/deploy.js [netlify|cloudflare|all]', 'info');
    log('Available targets:', 'info');
    Object.entries(DEPLOYMENT_TARGETS).forEach(([key, config]) => {
      log(`  ${key}: ${config.description}`, 'info');
    });
    process.exit(1);
  }
}

main();