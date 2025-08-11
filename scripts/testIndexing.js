// scripts/testIndexing.js
// Test script to verify indexing functionality without making API calls

import fs from 'fs';
import path from 'path';

const SITE_URL = 'https://project-nightfall.pages.dev';

// Test sitemap generation
function testSitemapGeneration() {
  console.log('🧪 Testing sitemap generation...');
  
  const sitemapPath = path.resolve(process.cwd(), 'public/category-sitemap.xml');
  
  if (!fs.existsSync(sitemapPath)) {
    console.log('❌ Category sitemap not found. Run: npm run generate-sitemaps');
    return false;
  }
  
  const sitemapContent = fs.readFileSync(sitemapPath, 'utf-8');
  
  // Check XML structure
  if (!sitemapContent.includes('<?xml version="1.0" encoding="UTF-8"?>')) {
    console.log('❌ Invalid XML header');
    return false;
  }
  
  if (!sitemapContent.includes('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">')) {
    console.log('❌ Invalid sitemap namespace');
    return false;
  }
  
  // Count URLs
  const urlCount = (sitemapContent.match(/<url>/g) || []).length;
  console.log(`✅ Sitemap contains ${urlCount} URLs`);
  
  // Check for required elements
  const hasLoc = sitemapContent.includes('<loc>');
  const hasLastmod = sitemapContent.includes('<lastmod>');
  const hasChangefreq = sitemapContent.includes('<changefreq>');
  const hasPriority = sitemapContent.includes('<priority>');
  
  if (hasLoc && hasLastmod && hasChangefreq && hasPriority) {
    console.log('✅ All required sitemap elements present');
    return true;
  } else {
    console.log('❌ Missing required sitemap elements');
    return false;
  }
}

// Test environment setup
function testEnvironmentSetup() {
  console.log('\n🧪 Testing environment setup...');
  
  // Check Google credentials
  const googleCredsPath = path.resolve(process.cwd(), 'google-credentials.json');
  if (fs.existsSync(googleCredsPath)) {
    console.log('✅ Google credentials file found');
    
    try {
      const creds = JSON.parse(fs.readFileSync(googleCredsPath, 'utf-8'));
      if (creds.client_email && creds.private_key) {
        console.log('✅ Google credentials appear valid');
      } else {
        console.log('❌ Google credentials missing required fields');
      }
    } catch (error) {
      console.log('❌ Google credentials file is not valid JSON');
    }
  } else {
    console.log('❌ Google credentials file not found');
  }
  
  // Check .env file
  const envPath = path.resolve(process.cwd(), '.env');
  if (fs.existsSync(envPath)) {
    console.log('✅ .env file found');
    
    const envContent = fs.readFileSync(envPath, 'utf-8');
    if (envContent.includes('VITE_INDEXNOW_KEY=')) {
      console.log('✅ IndexNow key found in .env');
      
      // Extract key and check for corresponding file
      const keyMatch = envContent.match(/VITE_INDEXNOW_KEY=(.+)/);
      if (keyMatch) {
        const key = keyMatch[1].trim();
        const keyFilePath = path.resolve(process.cwd(), 'public', `${key}.txt`);
        
        if (fs.existsSync(keyFilePath)) {
          console.log('✅ IndexNow key file found in public directory');
        } else {
          console.log(`❌ IndexNow key file not found: public/${key}.txt`);
        }
      }
    } else {
      console.log('❌ IndexNow key not found in .env');
    }
  } else {
    console.log('❌ .env file not found');
  }
}

// Test robots.txt
function testRobotsTxt() {
  console.log('\n🧪 Testing robots.txt...');
  
  const robotsPath = path.resolve(process.cwd(), 'public/robots.txt');
  if (fs.existsSync(robotsPath)) {
    const robotsContent = fs.readFileSync(robotsPath, 'utf-8');
    
    const hasCategorySitemap = robotsContent.includes('category-sitemap.xml');
    const hasVideoSitemap = robotsContent.includes('video-sitemap.xml');
    const hasMainSitemap = robotsContent.includes('sitemap.xml');
    
    if (hasCategorySitemap && hasVideoSitemap && hasMainSitemap) {
      console.log('✅ All sitemaps referenced in robots.txt');
    } else {
      console.log('❌ Missing sitemap references in robots.txt');
      if (!hasCategorySitemap) console.log('  - Missing category-sitemap.xml');
      if (!hasVideoSitemap) console.log('  - Missing video-sitemap.xml');
      if (!hasMainSitemap) console.log('  - Missing sitemap.xml');
    }
  } else {
    console.log('❌ robots.txt not found');
  }
}

// Test package.json scripts
function testPackageScripts() {
  console.log('\n🧪 Testing package.json scripts...');
  
  const packagePath = path.resolve(process.cwd(), 'package.json');
  const packageContent = JSON.parse(fs.readFileSync(packagePath, 'utf-8'));
  
  const requiredScripts = [
    'generate-sitemaps',
    'index:google',
    'index:now',
    'index:all'
  ];
  
  const missingScripts = requiredScripts.filter(script => !packageContent.scripts[script]);
  
  if (missingScripts.length === 0) {
    console.log('✅ All required scripts present in package.json');
  } else {
    console.log('❌ Missing scripts in package.json:', missingScripts.join(', '));
  }
  
  // Check if build script includes sitemap generation
  if (packageContent.scripts.build && packageContent.scripts.build.includes('generateSitemaps.js')) {
    console.log('✅ Build script includes sitemap generation');
  } else {
    console.log('❌ Build script missing sitemap generation');
  }
}

// Run all tests
async function runAllTests() {
  console.log('🚀 Running indexing system tests...\n');
  
  const sitemapTest = testSitemapGeneration();
  testEnvironmentSetup();
  testRobotsTxt();
  testPackageScripts();
  
  console.log('\n📊 Test Summary:');
  if (sitemapTest) {
    console.log('✅ Sitemap generation: PASSED');
  } else {
    console.log('❌ Sitemap generation: FAILED');
  }
  
  console.log('\n💡 Next steps:');
  console.log('1. Fix any failed tests above');
  console.log('2. Run: npm run generate-sitemaps');
  console.log('3. Run: npm run index:all (when ready to submit to search engines)');
}

runAllTests();