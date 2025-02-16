"use client";
import { useEffect, useState } from "react";
import { getGeminiResponse } from "@/api/gemini/route";

export default function LegalCompliance() {
  const companyName = localStorage.getItem("CompanyName") || "";
  const industry = localStorage.getItem("Industry") || "";
  const currentStage = localStorage.getItem("CurrentStage") || "";
  const additionalInfo = localStorage.getItem("AdditionalInfo") || "";
  const [legalDocs, setLegalDocs] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);

    const legalPrompt = `You are an expert legal advisor for startups. Based on the following company details, generate a comprehensive checklist of all the legal documents, licenses, permits, and regulatory compliance items required for the company. Include items such as incorporation documents, operating licenses, tax registrations, employment contracts, intellectual property registrations, and any industry-specific legal requirements.

Company Name: ${companyName}
Industry: ${industry}
Current Stage: ${currentStage}
Additional Info: ${additionalInfo}

Output the checklist as a structured, easy-to-read list with bullet points.
Also don't start with okay,... directly start with what is expected as output`

    try {
      const response = await getGeminiResponse(
        process.env.NEXT_PUBLIC_GEMINI_API_KEY,
        legalPrompt
      );
      let cleanResponse = response.replace(/```(json|text)?|```/g, "").trim();
      cleanResponse = cleanResponse.replace(/^(\s*)\*(\s)/gm, "$1- ");

  // 2. Convert any text wrapped between double asterisks into <strong> tags.
  cleanResponse = cleanResponse.replace(/\*\*(.+?)\*\*/g, "$1");
      setLegalDocs(cleanResponse);
    } catch (error) {
      console.error("Error generating legal documentation:", error);
      setLegalDocs("Failed to generate legal documentation. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    handleSubmit();
   }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-4xl font-bold text-center mb-8">
        Legal Compliance & Documentation
      </h1>

      {/* {!legalDocs && (
        <form
          onSubmit={handleSubmit}
          className="max-w-xl mx-auto bg-white p-6 rounded shadow"
        >
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">
              Company Name
            </label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              required
              placeholder="e.g., Tech Innovators Inc."
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">
              Industry
            </label>
            <input
              type="text"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              required
              placeholder="e.g., FinTech, Healthcare, etc."
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">
              Current Stage
            </label>
            <input
              type="text"
              value={currentStage}
              onChange={(e) => setCurrentStage(e.target.value)}
              required
              placeholder="e.g., Seed, Series A, etc."
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">
              Additional Info
            </label>
            <textarea
              value={additionalInfo}
              onChange={(e) => setAdditionalInfo(e.target.value)}
              placeholder="Any additional legal considerations..."
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-500 text-white p-3 rounded hover:bg-green-600 transition-colors"
          >
            {loading ? "Generating Legal Documentation..." : "Generate Legal Compliance Checklist"}
          </button>
        </form>
      )} */}
      {!legalDocs && (
        <div className="max-w-3xl mx-auto mt-8 bg-white p-6 rounded shadow">
          <p className="text-gray-800">Generating legal documentation customized specifically for your own startup...</p>
        </div>
      )}

      {legalDocs && (
        <div className="max-w-3xl mx-auto mt-8 bg-white p-6 rounded shadow">
          <h2 className="text-2xl font-bold mb-4">Legal Compliance Checklist</h2>
          <pre className="whitespace-pre-wrap text-gray-800">{legalDocs}</pre>
        </div>
      )}
    </div>
  );
}
