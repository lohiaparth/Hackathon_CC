"use client"
import { useState } from 'react';
import Image from 'next/image';

export default function ImageGenerator() {
  const [prompt, setPrompt] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [seed, setSeed] = useState(42);

  const generateImage = async () => {
    if (!prompt) return;
    setLoading(true);
    const width = 1024;
    const height = 1024;
    const model = 'flux';

    const newSeed = Math.floor(Math.random() * 10000);
    setSeed(newSeed);

    const url = `https://pollinations.ai/p/${encodeURIComponent("unique idea for "+prompt+" company")}?width=${width}&height=${height}&seed=${newSeed}&model=${model}`;
    setImageUrl(url);
    
    const img = new window.Image();
    img.src = url;
    img.onload = () => setLoading(false);
  };

  const downloadImage = async () => {
    if (!imageUrl) return;
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'generated-image.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Unique Ideas for Your Startup</h1>
      <input
        type="text"
        className="p-2 border border-gray-300 rounded-md w-80 mb-4"
        placeholder="Enter a prompt"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />
      <button
        onClick={generateImage}
        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
      >
        {loading ? 'Generating...' : 'Generate Image'}
      </button>
      {loading && <p className="mt-4 text-lg font-semibold">Loading...</p>}
      {imageUrl && !loading && (
        <div className="mt-6 flex flex-col items-center">
          <Image src={imageUrl} alt="Generated" width={512} height={512} className="rounded-md" />
          <div className="mt-4 flex gap-4">
            <button
              onClick={generateImage}
              className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
            >
              Generate New Idea
            </button>
            <button
              onClick={downloadImage}
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
            >
              Download Image
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
