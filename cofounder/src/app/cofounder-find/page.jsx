"use client";

import { useEffect, useState } from "react";
import { getGeminiResponse } from "../../api/gemini/route";
import { Linkedin, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function CoFounderPage() {
  const [qualities, setQualities] = useState([]);
  const [skills, setSkills] = useState([]);
  const [linkedinPost, setLinkedinPost] = useState("");
  const [twitterPost, setTwitterPost] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCoFounderData = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
        throw new Error("Missing Gemini API Key");
      }

      const industry =
        typeof window !== "undefined"
          ? localStorage.getItem("Industry") || "Technology"
          : "Technology";
      const productDescription =
        typeof window !== "undefined"
          ? localStorage.getItem("ProductDescription") ||
            "AI-powered file organization desktop application"
          : "AI-powered file organization desktop application";

      const prompt = `Based on the industry '${industry}' and the product '${productDescription}', list the top qualities and skills required for an ideal co-founder. Return JSON format with two keys: 'qualities' (array of strings) and 'skills' (array of strings).`;

      const response = await getGeminiResponse(
        process.env.NEXT_PUBLIC_GEMINI_API_KEY,
        prompt
      );
      const data = JSON.parse(response.replace(/```json|```/g, "").trim());

      setQualities(data.qualities || []);
      setSkills(data.skills || []);

      await generatePosts(data.skills);
    } catch (err) {
      console.error("Fetch Error:", err);
      setError("Failed to fetch co-founder data. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  const generatePosts = async (skills) => {
    try {
      const linkedinPrompt = `Write a compelling LinkedIn post seeking a co-founder with the following skills: ${skills.join(
        ", "
      )}. Keep it professional, engaging, and around 3-4 sentences.`;
      const linkedinResponse = await getGeminiResponse(
        process.env.NEXT_PUBLIC_GEMINI_API_KEY,
        linkedinPrompt
      );
      setLinkedinPost(linkedinResponse);

      const twitterPrompt = `Write a concise Twitter post (under 280 characters) seeking a co-founder with the following skills: ${skills.join(
        ", "
      )}. Keep it engaging and to the point.`;
      const twitterResponse = await getGeminiResponse(
        process.env.NEXT_PUBLIC_GEMINI_API_KEY,
        twitterPrompt
      );
      setTwitterPost(twitterResponse);
    } catch (err) {
      console.error("Post Generation Error:", err);
    }
  };

  useEffect(() => {
    fetchCoFounderData();
  }, []);

  const handleLinkedinPost = () => {
    // Add your LinkedIn posting logic here
    console.log("Posting to LinkedIn:", linkedinPost);
  };

  const handleTwitterPost = () => {
    // Add your Twitter posting logic here
    console.log("Posting to Twitter:", twitterPost);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900">Ideal Co-Founder Profile</h1>
        <p className="mb-6">
          (Personalized according to your startup's industry and description taken as input before)
        </p>

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

            <div className="bg-white p-6 rounded-xl shadow-lg mb-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-700">Required Skills</h2>
              <ul className="list-disc pl-6 text-gray-600">
                {skills.map((skill, index) => (
                  <li key={index}>{skill}</li>
                ))}
              </ul>
            </div>

            {/* LinkedIn Post Block */}
            <div className="bg-white p-6 rounded-xl shadow-lg flex flex-col mb-6">
              <div className="flex items-center gap-2 mb-4">
                <Linkedin className="text-blue-700" size={24} />
                <h2 className="text-xl font-semibold text-gray-700">LinkedIn Post</h2>
              </div>
              <Textarea 
                value={linkedinPost}
                onChange={(e) => setLinkedinPost(e.target.value)}
                className="min-h-[150px] mb-4"
                placeholder="Edit your LinkedIn post here..."
              />
              <Button 
                className="self-center"
                onClick={handleLinkedinPost}
              >
                Post to LinkedIn
              </Button>
            </div>

            {/* Twitter Post Block */}
            <div className="bg-white p-6 rounded-xl shadow-lg flex flex-col">
              <div className="flex items-center gap-2 mb-4">
                <Twitter className="text-blue-500" size={24} />
                <h2 className="text-xl font-semibold text-gray-700">Twitter Post</h2>
              </div>
              <Textarea 
                value={twitterPost}
                onChange={(e) => setTwitterPost(e.target.value)}
                className="min-h-[100px] mb-4"
                placeholder="Edit your Twitter post here..."
                maxLength={280}
              />
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">
                  {twitterPost.length}/280 characters
                </span>
                <Button onClick={handleTwitterPost}>
                  Post to Twitter
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}