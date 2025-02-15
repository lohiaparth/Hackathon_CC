const fs = require('fs');

async function downloadImage(imageUrl) {
  const fetch = (await import('node-fetch')).default; // Dynamic import

  try {
    const response = await fetch(imageUrl);
    if (!response.ok) throw new Error(`Failed to fetch image: ${response.statusText}`);

    const buffer = await response.arrayBuffer();
    fs.writeFileSync('image.png', Buffer.from(buffer));

    console.log('✅ Download Completed: image.png');
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

const prompt = 'tshirt with a tiger image on it';
const width = 1024;
const height = 1024;
const seed = 42;
const model = 'flux';

const imageUrl = `https://pollinations.ai/p/${encodeURIComponent(prompt)}?width=${width}&height=${height}&seed=${seed}&model=${model}`;

downloadImage(imageUrl);
