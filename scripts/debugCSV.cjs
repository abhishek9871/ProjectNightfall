const fs = require('fs');

// Read the xvideos_data.md file
const csvData = fs.readFileSync('xvideos_data.md', 'utf8');

console.log('First 10 lines of the file:');
const lines = csvData.split('\n');
for (let i = 0; i < Math.min(10, lines.length); i++) {
  console.log(`Line ${i}: "${lines[i]}"`);
}

console.log('\nTotal lines:', lines.length);

// Try to parse a few lines manually
console.log('\nTrying to parse lines:');
for (let i = 2; i < Math.min(7, lines.length); i++) {
  const line = lines[i];
  if (line.trim() === '') {
    console.log(`Line ${i}: Empty line`);
    continue;
  }
  
  console.log(`Line ${i}: "${line}"`);
  
  // Try different parsing approaches
  const commaIndex = line.indexOf(',"');
  if (commaIndex > 0) {
    const description = line.substring(0, commaIndex);
    const embedCode = line.substring(commaIndex + 1);
    console.log(`  Description: "${description}"`);
    console.log(`  Embed code: "${embedCode}"`);
    
    // Extract URL
    const urlMatch = embedCode.match(/src="([^"]+)"/);
    if (urlMatch) {
      console.log(`  URL: "${urlMatch[1]}"`);
    } else {
      console.log(`  No URL found`);
    }
  } else {
    console.log(`  No comma-quote pattern found`);
  }
  console.log('---');
}