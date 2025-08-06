const fs = require('fs');
const path = require('path');

// Read the xvideos_data.md file
const csvData = fs.readFileSync('xvideos_data.md', 'utf8');

// Parse CSV data
function parseCSVData(csvContent) {
  const lines = csvContent.split('\n').slice(2); // Skip header and first empty line
  const videos = [];
  
  for (const line of lines) {
    if (line.trim() === '') continue;
    
    // Split by the first comma that's not inside quotes
    const match = line.match(/^([^"]*(?:"[^"]*"[^"]*)*?),(.*)$/);
    if (!match) continue;
    
    const description = match[1].replace(/^"|"$/g, '').trim();
    const embedCode = match[2].replace(/^"|"$/g, '').trim();
    
    // Extract embed URL from iframe
    const urlMatch = embedCode.match(/src="([^"]+)"/);
    if (!urlMatch) continue;
    
    const embedUrl = urlMatch[1];
    
    videos.push({
      description,
      embedUrl
    });
  }
  
  return videos;
}

// Generate realistic data
function generateRealisticData(index, sourceDescription) {
  const categories = ['Amateur', 'College', 'MILF', 'Office', 'Outdoor', 'Fitness', 'Romance', 'Gaming'];
  const studios = ['Brazzers', 'Reality Kings', 'Naughty America', 'Digital Playground', 'Evil Angel', 'Wicked Pictures', 'Vivid Entertainment', 'Private Media'];
  const maleActors = ['Johnny Sins', 'Manuel Ferrara', 'James Deen', 'Ryan Madison', 'Mike Adriano', 'Keiran Lee', 'Danny D', 'Xander Corvus'];
  const femaleActors = ['Mia Khalifa', 'Riley Reid', 'Lana Rhoades', 'Abella Danger', 'Angela White', 'Adriana Chechik', 'Kendra Lust', 'Phoenix Marie'];
  
  // Generate title from description
  const title = sourceDescription.split(' ').slice(0, 6).join(' ').replace(/[^\w\s]/g, '');
  
  // Extract duration from description
  let duration = '12:34';
  const durationMatch = sourceDescription.match(/(\d+)\s*min/);
  if (durationMatch) {
    const minutes = parseInt(durationMatch[1]);
    const seconds = Math.floor(Math.random() * 60);
    duration = `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }
  
  // Generate views
  const viewsNum = Math.floor(Math.random() * 3000000) + 100000;
  const views = viewsNum > 1000000 ? `${(viewsNum / 1000000).toFixed(1)}M Views` : `${Math.floor(viewsNum / 1000)}K Views`;
  
  // Generate rating
  const rating = (Math.random() * 1.5 + 3.5).toFixed(1);
  
  // Generate upload date (last year)
  const startDate = new Date('2024-01-01');
  const endDate = new Date('2025-01-31');
  const randomTime = startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime());
  const uploadDate = new Date(randomTime).toISOString();
  
  return {
    category: categories[Math.floor(Math.random() * categories.length)],
    views,
    duration,
    rating: parseFloat(rating),
    uploadDate,
    title: title || `Video ${index + 49}`
  };
}

console.log('Starting video data update...');

// Main processing function
function updateVideosFile() {
  // Parse CSV data
  const parsedVideos = parseCSVData(csvData);
  console.log(`Parsed ${parsedVideos.length} videos from CSV`);
  
  // Read existing videos.ts file
  const videosPath = path.join(__dirname, '..', 'data', 'videos.ts');
  let videosContent = fs.readFileSync(videosPath, 'utf8');
  
  // Generate new videos
  let newVideosStr = '';
  let startId = 49; // Start from ID 49 since we have 48 existing videos
  
  for (let i = 0; i < parsedVideos.length; i++) {
    const videoData = parsedVideos[i];
    const generatedData = generateRealisticData(i, videoData.description);
    
    // Generate tags based on description
    const tags = ['hd', 'adult', '2025'];
    if (videoData.description.toLowerCase().includes('amateur')) tags.push('amateur');
    if (videoData.description.toLowerCase().includes('milf')) tags.push('milf');
    if (videoData.description.toLowerCase().includes('teen')) tags.push('teen');
    if (videoData.description.toLowerCase().includes('anal')) tags.push('anal');
    
    // Generate actors
    const actors = Math.random() > 0.5 ? ['Actor Name', 'Actress Name'] : undefined;
    const studio = Math.random() > 0.4 ? 'Studio Name' : undefined;
    
    const newVideo = `  {
    id: ${startId + i},
    title: "${generatedData.title}",
    embedUrls: ["${videoData.embedUrl}"],
    thumbnailUrl: "https://picsum.photos/seed/video${startId + i}/400/225",
    views: "${generatedData.views}",
    duration: "${generatedData.duration}",
    category: "${generatedData.category}",
    rating: ${generatedData.rating},
    uploadDate: "${generatedData.uploadDate}",
    tags: ${JSON.stringify(tags)},
    description: "TBD: Unique 250-word review will be added here.",
    sourceDescription: "${videoData.description.replace(/"/g, '\\"')}",
    actors: ${actors ? JSON.stringify(actors) : 'undefined'},
    studio: ${studio ? `"${studio}"` : 'undefined'}
  }`;
    
    newVideosStr += (i === 0 ? '' : ',\n') + newVideo;
  }
  
  console.log(`Generated ${parsedVideos.length} new videos`);
  return newVideosStr;
}

// Run the update
try {
  const newVideos = updateVideosFile();
  console.log('Video parsing completed successfully!');
  console.log('New videos generated. Ready to update videos.ts file.');
} catch (error) {
  console.error('Error updating videos:', error);
  process.exit(1);
}