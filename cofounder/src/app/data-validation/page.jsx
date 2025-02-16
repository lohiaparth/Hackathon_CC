"use client"

import { useEffect, useState } from "react"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js"
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, ArcElement)
import { Line, Pie } from "react-chartjs-2"
import { getGeminiResponse } from "../../api/gemini/route"
import { ArrowDownCircle } from "lucide-react"
import MoodPopup from "@/components/ui/moodPopup"
import { getStorageValue } from "@/utils/storage"

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend)

export default function Page() {
  const [financialGrowthData, setFinancialGrowthData] = useState([])
  const [totalMarketCap, setTotalMarketCap] = useState(null)
  const [marketShares, setMarketShares] = useState([])
  const [potentialGrowth, setPotentialGrowth] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [showArrow, setShowArrow] = useState(false)
  const [conclusion, setConclusion] = useState("")
  const [investmentRisk, setInvestmentRisk] = useState(null);
  const [industry1, setIndustry] = useState("Tech");


  // Common chart configuration
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            let label = context.dataset.label || ""
            if (label) label += ": "
            if (context.parsed.y !== null) {
              label += new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
                maximumFractionDigits: 0,
              }).format(context.parsed.y)
            }
            return label
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => {
            return new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
              maximumFractionDigits: 0,
            }).format(value)
          },
        },
      },
    },
  }

  const getData = async () => {
    try {
      setLoading(true)
      setError(null)

      if (!process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
        throw new Error("Missing Gemini API Key")
      }

      const industry = getStorageValue("Industry", "Tech");
      setIndustry(industry);

      // Fetch car industry sales data
      const carSalesPrompt = `Provide exact industry sales data for the ${industry} industry from 2014-2023. Return JSON array with objects containing "year" (number) and "sales" (number in USD billions). Example: [{"year": 2014, "sales": 1500}, ...]. If data unavailable for a year, use null. ONLY RETURN THE ARRAY.`
      const carResponse = await getGeminiResponse(process.env.NEXT_PUBLIC_GEMINI_API_KEY, carSalesPrompt)
      const carData = JSON.parse(carResponse.replace(/```json|```/g, "").trim())
      setFinancialGrowthData(carData)

      // Fetch pharma market cap
      const marketCapPrompt = `Provide current total market capitalization for  ${industry} industry in USD billions as a single number. Example: 1500.45. If unavailable, estimate. RETURN ONLY THE NUMBER.`
      const marketCapResponse = await getGeminiResponse(process.env.NEXT_PUBLIC_GEMINI_API_KEY, marketCapPrompt)
      setTotalMarketCap(Number.parseFloat(marketCapResponse.replace(/[^0-9.]/g, "")))

      // Fetch mobile market shares
      const marketSharePrompt = `List top 5  ${industry} companies with market share percentages as JSON array. Example: [{"company": "Apple", "market_share": 25.3}, ...]. RETURN ONLY THE ARRAY.`
      const marketShareResponse = await getGeminiResponse(process.env.NEXT_PUBLIC_GEMINI_API_KEY, marketSharePrompt)
      const marketShareData = JSON.parse(marketShareResponse.replace(/```json|```/g, "").trim())
      setMarketShares(marketShareData)

      // Fetch CAGR data
      const cagrPrompt = `Calculate 10-year CAGR for  ${industry} industry as percentage. Example: 5.5. If unavailable, estimate. RETURN ONLY THE NUMBER.`
      const cagrResponse = await getGeminiResponse(process.env.NEXT_PUBLIC_GEMINI_API_KEY, cagrPrompt)
      setPotentialGrowth(Number.parseFloat(cagrResponse.replace(/[^0-9.]/g, "")))
    } catch (error) {
      console.error("Fetch Error:", error)
      setError(`Failed to load data: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getData()
  }, [])

  useEffect(() => {
    if (financialGrowthData.length > 0 && totalMarketCap && marketShares.length > 0 && potentialGrowth) {
      setShowArrow(true)
    }
  }, [financialGrowthData, totalMarketCap, marketShares, potentialGrowth])

  const generateConclusion = async () => {
    try {
      const prompt = `Based on the following data for the ${industry1} industry:
      - Total Market Cap: $${totalMarketCap}B
      - 10-year CAGR: ${potentialGrowth.toFixed(1)}%
      - Top company market share: ${marketShares[0]?.company} with ${marketShares[0]?.market_share}%
      Provide a brief conclusion about the industry's current state and future outlook. Limit to 2-3 sentences. Also talk about whether it is a good arket to invest in or not. Validate the idea.`

      const response = await getGeminiResponse(process.env.NEXT_PUBLIC_GEMINI_API_KEY, prompt)
      setConclusion(response)
      const riskPrompt = `Assess the investment risk level for the ${industry1} industry on a scale from 1 (very safe) to 10 (very risky). Example Output: 7 (Risky).`
const riskResponse = await getGeminiResponse(process.env.NEXT_PUBLIC_GEMINI_API_KEY, riskPrompt);
setInvestmentRisk(Number.parseInt(riskResponse.replace(/[^0-9]/g, ""), 10));

    } catch (error) {
      console.error("Error generating conclusion:", error)
      setConclusion("Unable to generate conclusion. Please try again.")
    }
  }

  // Chart data configurations
  const salesChartData = {
    labels: financialGrowthData.map((item) => item.year),
    datasets: [
      {
        label: "Annual Sales (USD Billion)",
        data: financialGrowthData.map((item) => item.sales),
        borderColor: "#3b82f6",
        backgroundColor: "#60a5fa",
        tension: 0.4,
        fill: true,
      },
    ],
  }

  const marketShareChartData = {
    labels: marketShares.map((item) => item.company),
    datasets: [
      {
        label: "Market Share (%)",
        data: marketShares.map((item) => item.market_share),
        backgroundColor: ["#3b82f6", "#60a5fa", "#93c5fd", "#bfdbfe", "#dbeafe"],
        borderWidth: 0,
      },
    ],
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Industry Analytics Dashboard</h1>
          <button
            onClick={getData}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center">
                <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Loading...
              </span>
            ) : (
              "Refresh Data"
            )}
          </button>
        </div>

        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-8">{error}</div>}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Car Sales Chart */}
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">
              {" "}
              {industry1} Industry Sales (2014-2023)
            </h2>
            <div className="h-96">
              <Line data={salesChartData} options={chartOptions} />
            </div>
          </div>

          {/* Market Share Chart */}
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">
              {" "}
              {industry1} Market Share Distribution
            </h2>
            <div className="h-96">
              <Pie
                data={marketShareChartData}
                options={{
                  ...chartOptions,
                  plugins: {
                    ...chartOptions.plugins,
                    tooltip: {
                      callbacks: {
                        // Adjust the label callback to show the label and the value.
                        label: (context) => `${context.label}: ${context.parsed} % market share`,
                      },
                    },
                  },
                  // No scales property is needed for a Pie chart.
                }}
              />
            </div>
          </div>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
          {totalMarketCap && (
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-500"> {industry1} Market Cap</h3>
                  <p className="mt-2 text-3xl font-bold text-blue-600">${totalMarketCap.toLocaleString()}B</p>
                </div>
                <div className="bg-blue-100 p-4 rounded-full">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>
            </div>
          )}

          {potentialGrowth && (
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-500">
                    {" "}
                    {industry1} Industry CAGR (10Y)
                  </h3>
                  <p className="mt-2 text-3xl font-bold text-green-600">{potentialGrowth.toFixed(1)}%</p>
                </div>
                <div className="bg-green-100 p-4 rounded-full">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                    />
                  </svg>
                </div>
              </div>
            </div>
          )}
        </div>
        {showArrow && (
          <div className="flex flex-col items-center mt-8">
            <button onClick={generateConclusion} className="text-blue-600 hover:text-blue-800 transition-colors">
              <ArrowDownCircle size={48} />
            </button>
            {conclusion && (
              <div className="mt-4 p-6 bg-white rounded-xl shadow-lg max-w-2xl">
                <h2 className="text-xl font-semibold mb-2 text-gray-700">Conclusion</h2>
                <p className="text-gray-600">{conclusion}</p>
              </div>
              
            )}
            {investmentRisk && (
                                          <div className="mt-4 p-6 bg-white rounded-xl shadow-lg max-w-2xl">
                                          <h2 className="text-xl font-semibold mb-2 text-gray-700">Risk Assessment - 1 (very safe) to 10 (very risky)</h2>
                                          <p className="text-gray-600">{investmentRisk}</p>
                                        </div>
            )}

          </div>
        )}
      </div>
      <MoodPopup />
    </div>
  )
}

