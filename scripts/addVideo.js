import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to videos.ts
const filePath = path.join(__dirname, '../data/videos.ts');

// Function to add new video
function addVideo(newVideo) {
  // Read current file
  const content = fs.readFileSync(filePath, 'utf-8');
  
  // Find the last video entry to get the next ID
  const videoMatches = content.match(/id:\s*(\d+)/g);
  if (!videoMatches) throw new Error('No video IDs found in videos.ts');
  
  const lastId = Math.max(...videoMatches.map(match => parseInt(match.match(/\d+/)[0])));
  const newId = lastId + 1;
  
  // Create the new video entry string
  const newVideoEntry = `  {
    id: ${newId},
    title: "${newVideo.title}",
    embedUrl: "${newVideo.embedUrl}",
    views: "${newVideo.views}",
    duration: "${newVideo.duration}",
    category: "${newVideo.category}",
    rating: ${newVideo.rating},
    uploadDate: "${newVideo.uploadDate}",
    tags: [${newVideo.tags.map(tag => `"${tag}"`).join(', ')}]
  },`;
  
  // Find the position to insert (before the closing ];)
  const insertPosition = content.lastIndexOf('];');
  if (insertPosition === -1) throw new Error('Could not find end of videos array');
  
  // Insert the new video entry
  const newContent = content.slice(0, insertPosition) + newVideoEntry + '\n' + content.slice(insertPosition);
  
  // Write back to file
  fs.writeFileSync(filePath, newContent);
  console.log(`Added video ${newId}: ${newVideo.title}`);
}

// Example usage
addVideo({
  title: 'New HD Video 2025',
  embedUrl: 'https://www.pornhub.com/embed/ph66a1b2c3d4e5f',
  views: '1.2M',
  duration: '12:45',
  category: 'Amateur',
  rating: 4.5,
  uploadDate: '2025-07-24',
  tags: ['hd', 'amateur', '2025']
});