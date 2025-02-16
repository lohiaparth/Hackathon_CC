"use client";
import { useState } from "react";
import { getGeminiResponse } from "@/api/gemini/route";
import { Button } from "@/components/ui/button";
import { useLocalStorage } from "@/utils/storage";

export default function FundraisingPreparation() {
    const [companyName, setCompanyName] = useLocalStorage("CompanyName", "");
    const [industry, setIndustry] = useLocalStorage("Industry", "Tech");
    const [currentStage, setCurrentStage] = useLocalStorage("CurrentStage", "");
    const [fundingTarget, setFundingTarget] = useLocalStorage("FundingTarget", "");
    const [additionalInfo, setAdditionalInfo] = useLocalStorage("AdditionalInfo", "");
    
  const [plan, setPlan] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Create a prompt that guides the AI to produce a fundraising preparation plan.
    const prompt = `You are an experienced fundraising advisor. Based on the following details, generate a comprehensive fundraising preparation plan for a startup.

Company Name: ${companyName}
Industry: ${industry}
Current Stage: ${currentStage}
Funding Target: ${fundingTarget}
Additional Info: ${additionalInfo}

Provide a step-by-step plan that covers:
1. Preparing the investor pitch deck.
2. Organizing financials and determining valuation.
3. Identifying a target list of investors and outreach strategies.
4. Establishing a fundraising timeline with milestones.
5. Tips for negotiating and closing deals.

Output the plan as a structured, easy-to-read list.`;

    try {
      const response = await getGeminiResponse(
        process.env.NEXT_PUBLIC_GEMINI_API_KEY,
        prompt
      );
      // Clean up the response by removing any markdown formatting.
      let cleanResponse = response.replace(/```(json|text)?|```/g, "").trim();
      cleanResponse = cleanResponse.replace(/^(\s*)\*(\s)/gm, "$1- ");

  // 2. Convert any text wrapped between double asterisks into <strong> tags.
  cleanResponse = cleanResponse.replace(/\*\*(.+?)\*\*/g, "$1");

      setPlan(cleanResponse);
    } catch (error) {
      setPlan("Failed to generate fundraising plan. Please try again.");
      console.error("Error generating fundraising plan:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-4xl font-bold text-center mb-8">
        Automated Fundraising Preparation
      </h1>
      {!plan && (
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
              onChange={(e) => {setCompanyName(e.target.value);useLocalStorage("CompanyName", e.target.value);}}
              required
              placeholder="e.g., Tech Innovators Inc."
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
              onChange={(e) => {setCurrentStage(e.target.value);useLocalStorage("CurrentStage", e.target.value);}}
              required
              placeholder="e.g., Seed, Series A, etc."
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">
              Funding Target
            </label>
            <input
              type="text"
              value={fundingTarget}
              onChange={(e) => {setFundingTarget(e.target.value);useLocalStorage("FundingTarget", e.target.value);}}
              required
              placeholder="e.g., Rs. 1 Cr., Rs. 2 Cr., etc."
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">
              Additional Info
            </label>
            <textarea
              value={additionalInfo}
              onChange={(e) => {setAdditionalInfo(e.target.value);useLocalStorage("AdditionalInfo", e.target.value);}}
              placeholder="Any additional information about your startup..."
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-3 rounded hover:bg-blue-600 transition-colors"
          >
            {loading ? "Generating Plan..." : "Generate Fundraising Plan"}
          </button>
        </form>
      )}

      {/* Display the generated plan if available */}
      {plan && (
        <>
                <div className="max-w-3xl mx-auto mt-8 bg-white p-6 rounded shadow">
          <h2 className="text-2xl font-bold mb-4">Your Fundraising Plan</h2>
          <pre className="whitespace-pre-wrap text-gray-800">{plan}</pre>
        </div>
        <center>
        <Button onClick={() => {window.location.href = "/legalities";}}>
            Check Legality Compliances
        </Button>

        </center>
        </>

      )}
    </div>
  );
}
