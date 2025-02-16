"use client"

import { useEffect, useState } from "react";
import { getGeminiResponse } from "../../api/gemini/route";

export default function CoFounderPage() {
  const [qualities, setQualities] = useState([]);
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCoFounderData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (!process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
        throw new Error("Missing Gemini API Key");
      }
      
      const industry = localStorage.getItem("Industry") || "Technology";
      const productDescription = localStorage.getItem("ProductDescription") || "AI-powered file organization desktop application";
      
      const prompt = `Based on the industry '${industry}' and the product '${productDescription}', list the top qualities and skills required for an ideal co-founder. Return JSON format with two keys: 'qualities' (array of strings) and 'skills' (array of strings).`;
      
      const response = await getGeminiResponse(process.env.NEXT_PUBLIC_GEMINI_API_KEY, prompt);
      const data = JSON.parse(response.replace(/```json|```/g, "").trim());
      
      setQualities(data.qualities || []);
      setSkills(data.skills || []);
    } catch (err) {
      console.error("Fetch Error:", err);
      setError("Failed to fetch co-founder data. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoFounderData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900">Ideal Co-Founder Profile</h1>
        <p className="mb-6">(Personalized according to your startup's industry and description taken as input before)</p>
        
        {loading && <p className="text-gray-700">Loading...</p>}
        {error && <p className="text-red-600">{error}</p>}
        
        {!loading && !error && (
          <>
            <div className="bg-white p-6 rounded-xl shadow-lg mb-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-700">Key Qualities</h2>
              <ul className="list-disc pl-6 text-gray-600">
                {qualities.map((quality, index) => (
                  <li key={index}>{quality}</li>
                ))}
              </ul>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h2 className="text-xl font-semibold mb-4 text-gray-700">Required Skills</h2>
              <ul className="list-disc pl-6 text-gray-600">
                {skills.map((skill, index) => (
                  <li key={index}>{skill}</li>
                ))}
              </ul>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
