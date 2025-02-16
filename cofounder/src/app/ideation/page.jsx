"use client"
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { getGeminiResponse } from '@/api/gemini/route';
import { set } from 'react-hook-form';
import { getStorageValue } from '@/utils/storage';

export default function ImageGenerator() {
  // Fallback values in case localStorage is empty
  const industry = getStorageValue('Industry', 'technology');
  const description = getStorageValue('Description', 'Healthcare product');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [seed, setSeed] = useState(42);
  const [res, setRes] = useState('');

  const generateImage = async () => {
    setLoading(true);
    const width = 1024;
    const height = 1024;
    const model = 'flux';

    const newSeed = Math.floor(Math.random() * 10000);
    setSeed(newSeed);

    const url = `https://pollinations.ai/p/${encodeURIComponent("unique idea for " + industry + " company for product(s) with description: "+description)}?width=${width}&height=${height}&seed=${newSeed}&model=${model}`;
    setImageUrl(url);
    
    // Preload the image so we can update the loading state correctly
    const img = new window.Image();
    img.src = url;
    img.onload = () => setLoading(false);
    generateIdeas();
  };

  const generateIdeas = async () => {
    const prompt = `Give a unique idea for a ${industry} company. Give the answer in the format of 10 short pointers. They should give a crisp understanding of the idea. NOTE: INCLUDE ONLY THE 5 POINTERS AND NOTHING ELSE. NO BOLD FONT SHOULD BE USED`;
    try {
      const response = await getGeminiResponse(process.env.NEXT_PUBLIC_GEMINI_API_KEY, prompt);
      setRes(response);
      console.log(response);
    } catch (error) {
      console.error('Error in generateIdeas:', error);
    }
  }

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

  useEffect(() => {
    generateImage();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Heading at the top */}
      <header className="py-4 text-center">
        <h1 className="text-4xl font-bold">Unique Ideas for Your Startup</h1>
      </header>

      {/* Main content area split into two columns */}
      <div className="flex flex-col md:flex-row p-8">
        {/* Left Column: Image and Buttons */}
        <div className="md:w-1/2 flex flex-col items-center">
          {loading ? (
            <p className="text-lg font-semibold">Loading...</p>
          ) : (
            imageUrl && (
              <Image
                src={imageUrl}
                alt="Generated"
                width={512}
                height={512}
                className="rounded-md"
              />
            )
          )}
          {/* Render buttons only when an image is generated and loading is complete */}
          {!loading && imageUrl && (
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
          )}
        </div>

        {/* Right Column: Additional Text */}
        <div className="md:w-1/2 flex flex-col justify-center items-center md:items-start mt-8 md:mt-0 md:pl-8">
        <p className="text-lg text-gray-700">
  {res.split('\n').map((line, index) => (
    <span key={index}>
      {line}
      <br />
    </span>
  ))}
</p>

        </div>
      </div>
    </div>
  );
}
