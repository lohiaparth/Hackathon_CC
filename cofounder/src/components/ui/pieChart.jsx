"use client"

import * as React from "react"
import { TrendingUp } from "lucide-react"
import { Label, Pie, PieChart } from "recharts"
import { getGeminiResponse } from "../../api/gemini/route"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  chrome: {
    label: "Chrome",
    color: "hsl(var(--chart-1))",
  },
  safari: {
    label: "Safari",
    color: "hsl(var(--chart-2))",
  },
  firefox: {
    label: "Firefox",
    color: "hsl(var(--chart-3))",
  },
  edge: {
    label: "Edge",
    color: "hsl(var(--chart-4))",
  },
  other: {
    label: "Other",
    color: "hsl(var(--chart-5))",
  },
}

export function PieChartt() {
  const [chartData, setChartData] = React.useState([])
  const [totalVisitors, setTotalVisitors] = React.useState(0)

  React.useEffect(() => {
    async function fetchData() {
      const data = await getGeminiResponse(
        process.env.NEXT_PUBLIC_GEMINI_API_KEY,
        `Provide industry sales data for the CAR industry for the past 10 years (2014-2023). Return the data in an array format where each element represents a year's sales. Each element in the array should be an object with the keys "year" and "sales" (in USD billions). If data for a specific year is unavailable, use "null" as the value for the "sales" key. DO NOT RETURN ANY OTHER TEXT. MAKE SURE THAT IT IS NOT RANDOM DATA. NOTE: ONLY RETURN THE DATA IN ARRAY FORMAT. DO NOT RETURN ANY KIND OF EXTRA DATA. ONLY THE DATA IN ARRAY FORMAT.`
      )
      setChartData(`{"FinancialGrowth": [` + data.slice(9, financialGrowth.length - 5)  + "]}"  )
      console.log(chartData)
    //   setTotalVisitors(chartData["FinancialGrowth"].reduce((acc, curr) => acc + (curr.sales || 0), 0))
    }
    fetchData()
  }, [])

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Pie Chart - Donut with Text</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="visitors"
              nameKey="browser"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalVisitors.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Visitors
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total visitors for the last 6 months
        </div>
      </CardFooter>
    </Card>
  )
}
