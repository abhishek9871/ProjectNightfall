// Simple test script to verify category page functionality
const { categories } = require('./data/categories.ts');
const { videos } = require('./data/videos.ts');

console.log('Testing Category Page Implementation');
console.log('====================================');

// Test 1: Verify all 8 required categories exist
const requiredCategories = ['amateur', 'milf', 'pov', 'japanese', 'teen', 'lesbian', 'anal', 'big-tits'];
console.log('\n1. Checking required categories:');
requiredCategories.forEach(slug => {
  const category = categories.find(c => c.slug === slug);
  if (category) {
    console.log(`✅ ${category.name} (${slug}) - Found`);
  } else {
    console.log(`❌ ${slug} - Missing`);
  }
});

// Test 2: Verify video filtering works
console.log('\n2. Testing video filtering:');
categories.forEach(category => {
  const filteredVideos = videos.filter(v => 
    v.category.toLowerCase() === category.id.toLowerCase()
  );
  console.log(`${category.name}: ${filteredVideos.length} videos (expected: ${category.videoCount})`);
});

// Test 3: Verify URL structure
console.log('\n3. Category URLs:');
categories.forEach(category => {
  console.log(`/category/${category.slug} -> ${category.name}`);
});

console.log('\n✅ Category page implementation test complete!');