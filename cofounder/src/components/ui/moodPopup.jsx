"use client";
import { useState, useEffect } from "react";
import { getGeminiResponse } from "@/api/gemini/route";

export default function MoodPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [mood, setMood] = useState("");
  const [response, setResponse] = useState("");

  

  const handleSubmit = async () => {
    if (!mood.trim()) return;

    const reply = await getGeminiResponse(
        process.env.NEXT_PUBLIC_GEMINI_API_KEY,
        mood + "NOTE: RESPONSE SHUOLD BE OF MAXIMUM 100 WORDS"
      );
    setResponse(reply);
  };

  const closePopup = () => {
    setIsVisible(false);
  };

  // Automatically show the popup every 60 seconds
  useEffect(() => {
    const interval = setTimeout(() => {
      setIsVisible(true);
    }, 2000); // 60,000 ms = 60 seconds

    return () => clearInterval(interval);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-white p-4 rounded shadow-lg max-w-sm">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold">How are you feeling?</h2>
          <button
            onClick={closePopup}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            &times;
          </button>
        </div>
        <input
          type="text"
          placeholder="Describe your mood..."
          value={mood}
          onChange={(e) => setMood(e.target.value)}
          className="w-full border border-gray-300 rounded p-2 mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSubmit}
          className="w-full bg-blue-500 text-white py-2 rounded mt-2 hover:bg-blue-600 transition"
        >
          Check In
        </button>
        {response && (
          <div className="mt-2 p-2 bg-gray-100 rounded">
            <p className="text-gray-700">{response}</p>
          </div>
        )}
      </div>
    </div>
  );
}
