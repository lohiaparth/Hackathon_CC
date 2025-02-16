"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { getGeminiResponse } from "@/api/gemini/route";

export default function BestSellingPage() {
  const [industry, setIndustry] = useState("");
  const [conclusion, setConclusion] = useState("");
  const [desc, setDesc] = useState("");
  const [items, setItems] = useState([]);

  useEffect(() => {
    // Retrieve industry from localStorage (or fallback to a default)
    const storedIndustry = localStorage.getItem("Industry") || "tech";
    const storedDescription = localStorage.getItem("Description") || "Healthcare product";
    setIndustry(storedIndustry);
    setDesc(storedDescription);
    
    const generateProducts = async () => {
        try {
          const prompt = `Based on the industry ${storedIndustry} and description ${storedDescription}, generate an array of 6 best-selling products/services related to the product.
          Example Output:
          const bestSellingItems = [
      {
        name: "Innovative Healthcare Gadget",
        description: "Top-rated gadget that revolutionizes the Healthcare market.",
        query: "Healthcare gadget",
      },
      {
        name: "Premium ${storedIndustry} Service Package",
        description: "All-in-one service package tailored for ${storedIndustry} businesses.",
        query: "${storedIndustry} service",
      },
      {
        name: "Advanced ${storedIndustry} Accessory",
        description: "Essential accessory that elevates every ${storedIndustry} experience.",
        query: "${storedIndustry} accessory",
      },
      {
        name: "Next-Gen ${storedIndustry} Software",
        description: "Cutting-edge software solution for optimizing ${storedIndustry} operations.",
        query: "${storedIndustry} software",
      },
      {
        name:"Eco-Friendly ${storedIndustry} Product",
        description: "Sustainable and innovative product for the modern ${storedIndustry} market.",
        query: "${storedIndustry} eco",
      },
    ];
          `;
    
          const response = await getGeminiResponse(process.env.NEXT_PUBLIC_GEMINI_API_KEY, prompt)
          setConclusion(response)
        } catch (error) {
          console.error("Error generating conclusion:", error)
          setConclusion("Unable to generate conclusion. Please try again.")
        }
      }

    generateProducts();
      console.log(conclusion)

    // setItems(bestSellingItems);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-4xl font-bold text-center mb-8">
        Best Selling Items in the {industry} Industry
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {items.map((item, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-4">
            <div className="relative h-48 w-full mb-4">
              <Image
                src={`https://loremflickr.com/600/400/${item.query.replace(/ /g, ",")}`}
                alt={item.name}
                fill
                className="object-cover rounded"
              />
            </div>
            <h2 className="text-xl font-semibold mb-2">{item.name}</h2>
            <p className="text-gray-700">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
