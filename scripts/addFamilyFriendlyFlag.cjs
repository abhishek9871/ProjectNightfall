const fs = require('fs');
const path = require('path');

// Path to the videos.ts file
const videosFilePath = path.join(__dirname, '..', 'data', 'videos.ts');

try {
    // Read the current videos.ts file
    const fileContent = fs.readFileSync(videosFilePath, 'utf8');

    // Add isFamilyFriendly: false to each video object
    // This regex finds each video object and adds the field before the closing brace
    const updatedContent = fileContent.replace(
        /(\s+studio: "[^"]*")\s*\n(\s+})/g,
        '$1,\n    isFamilyFriendly: false\n$2'
    );

    // Write the updated content back to the file
    fs.writeFileSync(videosFilePath, updatedContent, 'utf8');

    console.log('Successfully added isFamilyFriendly: false to all video objects in data/videos.ts');

} catch (error) {
    console.error('Error updating videos.ts:', error.message);
    process.exit(1);
}