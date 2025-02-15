"use client"

import { useEffect, useState } from "react"
import { getGeminiResponse } from "../../api/gemini/route"
import Component from "@/components/ui/barChart"
import {PieChartt} from "../../components/ui/pieChart"

export default function Page() {
  const [financialGrowthData, setFinancialGrowthData] = useState([])
  const [totalMarketCap, setTotalMarketCap] = useState(null)
  const [marketShares, setMarketShares] = useState([])
  const [potentialGrowth, setPotentialGrowth] = useState(null)

  const getData = async () => {
    try {
      if (!process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
        console.error("API key is not defined")
        return
      }

      const financialGrowth = await getGeminiResponse(
        process.env.NEXT_PUBLIC_GEMINI_API_KEY,
        `Provide industry sales data for the CAR industry for the past 10 years (2014-2023).  Return the data in a array format where each element represents a year's sales.  Each element in the array should be an object with the keys "year" and "sales" (in USD billions).  If data for a specific year is unavailable, use "null" as the value for the "sales" key. DO NOT RETURN ANY OTHER TEXT. MAKE SURE THAT IT IS NOT RANDOM DATA. NOTE: ONLY RETURN THE DATA IN ARRAY FORMAT. DO NOT RETURN ANY KIND OF EXTRA DATA. ONLY THE DATA IN ARRAY FORMAT.`,
      )
      console.log(`{"FinancialGrowth": [` + financialGrowth.slice(9, financialGrowth.length - 5)  + "]}"  )
      setFinancialGrowthData(JSON.parse(`{"FinancialGrowth": [` + financialGrowth.slice(9, financialGrowth.length - 5)  + "]}"  ))

      const marketCap = await getGeminiResponse(
        process.env.NEXT_PUBLIC_GEMINI_API_KEY,
        `Provide the total market capitalization for the pharmaceutical industry as of latest possible date. Return the market cap in USD billions. If an exact date is not possible, provide the most recent available market cap and indicate the date it represents. It's okay if the number if just an approximation. Make an educated guess. NOTE: RETURN ONLY THE NUMBER IN NUMERIC FORMAT AND NO EXTRA TEXT`,
      )
      setTotalMarketCap(Number.parseFloat(marketCap))

      const shares = await getGeminiResponse(
        process.env.NEXT_PUBLIC_GEMINI_API_KEY,
        `Provide the top 5 companies in the mobile phone industry, along with their respective market share percentages worldwide.  Return the data in a JSON array format. Each element in the array should be an object with the keys "company" (string) and "market_share" (number, representing the percentage).  List the companies in descending order of market share.  If precise market share percentages are unavailable, provide estimates and indicate that they are estimates. If market share data is not readily available, return "Market share data unavailable.". NOTE: ONLY RETURN THE DATA IN JSON ARRAY FORMAT AND THERE IS NO NEED TO INCLUDE THE WORD JSON OR ANYTHING EXTRA. IT SHOULD BE IN A PARSEABLE FORMAT.`,
      )
      console.log(`{"Shares": [` + shares.slice(9, shares.length - 5)  + "]}" )
      setMarketShares(JSON.parse(`{"Shares": [` + shares.slice(9, shares.length - 5)  + "]}" ))

      const growth = await getGeminiResponse(
        process.env.NEXT_PUBLIC_GEMINI_API_KEY,
        `Calculate the Compound Annual Growth Rate (CAGR) for the mobile phone industry over the most recent 10-year period for which data is available. Ideally, this would be from 2014 to 2024, but if data for 2024 isn't available, use the most recent year's data. Return the CAGR as a decimal (e.g., 0.10 for 10%). If the necessary data (industry revenue or market size for both the start and end years) is not readily available, return "Data unavailable for CAGR calculation. allow approximation or an educated guess"`,
      )
      setPotentialGrowth(Number.parseFloat(growth))

      console.log("Data fetched successfully")
    } catch (error) {
      console.error("Error in getData:", error)
    }
  }

  useEffect(() => {
    getData()
  }, []) // Removed getData as a dependency

  useEffect(() => {
    console.log("Financial Growth Data:", financialGrowthData["FinancialGrowth"]?.length)
    console.log("Market Shares:", marketShares)
    console.log("Total Market Cap:", totalMarketCap)
    console.log("Potential Growth:", potentialGrowth)
  },[financialGrowthData, marketShares, totalMarketCap, potentialGrowth])

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Data Visualization</h1>
      <button onClick={getData} className="bg-blue-500 text-white px-4 py-2 rounded mb-4">
        Refresh Data
      </button>
      {financialGrowthData["FinancialGrowth"]?.length > 0 && (
          <Component data={financialGrowthData["FinancialGrowth"]} />
        )}
        

      {/* {marketShares["Sales"]?.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-2">data</h2> */}
          <PieChartt/>
        {/* </div> */}
      {/* )} */}

      {marketShares.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-2">Mobile Phone Industry Market Shares</h2>
          <Component
            data={marketShares}
            xKey="company"
            yKey="market_share"
            title="Top 5 Mobile Phone Companies Market Share"
          />
        </div>
      )}

      {totalMarketCap && (
        <div className="mb-4">
          <h2 className="text-xl font-semibold">Pharmaceutical Industry Market Cap</h2>
          <p className="text-lg">${totalMarketCap.toFixed(2)} billion</p>
        </div>
      )}

      {potentialGrowth && (
        <div className="mb-4">
          <h2 className="text-xl font-semibold">Mobile Phone Industry CAGR</h2>
          <p className="text-lg">{(potentialGrowth * 100).toFixed(2)}%</p>
        </div>
      )}
    </div>
  )
}

