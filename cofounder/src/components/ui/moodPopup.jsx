"use client";
import { useState, useEffect } from "react";

export default function MoodPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [mood, setMood] = useState("");
  const [response, setResponse] = useState("");

  const handleSubmit = () => {
    if (!mood.trim()) return;

    const lowerMood = mood.toLowerCase();
    let reply = "";

    if (
      lowerMood.includes("happy") ||
      lowerMood.includes("good") ||
      lowerMood.includes("great")
    ) {
      reply = "That's wonderful to hear! I'm really glad you're feeling good.";
    } else if (
      lowerMood.includes("sad") ||
      lowerMood.includes("down") ||
      lowerMood.includes("unhappy")
    ) {
      reply =
        "I'm sorry you're feeling down. Remember, it's okay to have tough days—I’m here for you.";
    } else if (
      lowerMood.includes("anxious") ||
      lowerMood.includes("stressed") ||
      lowerMood.includes("nervous")
    ) {
      reply =
        "It sounds like you’re feeling anxious. Sometimes taking a few deep breaths can help. I'm here if you need to talk.";
    } else {
      reply =
        "Thank you for sharing how you feel. I'm here to listen if you'd like to share more.";
    }

    setResponse(reply);
  };

  const closePopup = () => {
    setIsVisible(false);
  };

  // Automatically show the popup every 60 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(true);
    }, 60000); // 60,000 ms = 60 seconds

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
