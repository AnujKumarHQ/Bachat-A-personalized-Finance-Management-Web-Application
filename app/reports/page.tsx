"use client"

import { useEffect, useState } from "react"
import { storageUtils, type Transaction } from "@/lib/storage"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeftIcon, DownloadIcon } from "lucide-react"
import Link from "next/link"
import { formatCurrency } from "@/lib/currency"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

export default function ReportsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [timeRange, setTimeRange] = useState<"month" | "quarter" | "year">("month")

  useEffect(() => {
    setTransactions(storageUtils.getTransactions())
  }, [])

  const now = new Date()
  const getDateRange = () => {
    const start = new Date()
    if (timeRange === "month") {
      start.setMonth(start.getMonth() - 1)
    } else if (timeRange === "quarter") {
      start.setMonth(start.getMonth() - 3)
    } else {
      start.setFullYear(start.getFullYear() - 1)
    }
    return start
  }

  const dateRangeStart = getDateRange()
  const filtered = transactions.filter((t) => new Date(t.date) >= dateRangeStart)

  // Calculate summary stats
  const income = filtered.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0)
  const expenses = filtered.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0)
  const net = income - expenses

  // Prepare data for monthly trend chart
  const monthlyData: Record<string, { month: string; income: number; expense: number }> = {}
  filtered.forEach((t) => {
    const date = new Date(t.date)
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
    if (!monthlyData[monthKey]) {
      monthlyData[monthKey] = {
        month: new Date(date.getFullYear(), date.getMonth()).toLocaleDateString("en-US", {
          month: "short",
          year: "2-digit",
        }),
        income: 0,
        expense: 0,
      }
    }
    if (t.type === "income") {
      monthlyData[monthKey].income += t.amount
    } else {
      monthlyData[monthKey].expense += t.amount
    }
  })

  const trendData = Object.values(monthlyData).sort((a, b) => {
    const aDate = new Date(a.month)
    const bDate = new Date(b.month)
    return aDate.getTime() - bDate.getTime()
  })

  // Prepare data for category pie chart
  const categoryData: Record<string, number> = {}
  filtered
    .filter((t) => t.type === "expense")
    .forEach((t) => {
      categoryData[t.category] = (categoryData[t.category] || 0) + t.amount
    })

  const pieData = Object.entries(categoryData).map(([name, value]) => ({
    name,
    value: Math.round(value),
  }))

  const categoryBreakdown: Record<string, { amount: number; percentage: number }> = {}
  filtered
    .filter((t) => t.type === "expense")
    .forEach((t) => {
      if (!categoryBreakdown[t.category]) {
        categoryBreakdown[t.category] = { amount: 0, percentage: 0 }
      }
      categoryBreakdown[t.category].amount += t.amount
    })

  Object.entries(categoryBreakdown).forEach(([key, value]) => {
    categoryBreakdown[key].percentage = expenses > 0 ? (value.amount / expenses) * 100 : 0
  })

  const COLORS = [
    "oklch(0.45 0.15 200)",
    "oklch(0.55 0.18 140)",
    "oklch(0.65 0.12 50)",
    "oklch(0.40 0.14 250)",
    "oklch(0.50 0.16 180)",
    "oklch(0.58 0.22 30)",
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="icon">
                  <ArrowLeftIcon className="h-5 w-5" />
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-foreground">Financial Reports</h1>
                <p className="mt-1 text-sm text-muted-foreground">Analyze your financial performance</p>
              </div>
            </div>
            <Button variant="outline" className="gap-2 bg-transparent">
              <DownloadIcon className="h-4 w-4" />
              Export
            </Button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Time Range Selector */}
        <div className="mb-8 flex gap-2">
          {(["month", "quarter", "year"] as const).map((range) => (
            <Button
              key={range}
              variant={timeRange === range ? "default" : "outline"}
              onClick={() => setTimeRange(range)}
              className="capitalize"
            >
              Last {range === "month" ? "Month" : range === "quarter" ? "Quarter" : "Year"}
            </Button>
          ))}
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Income</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-accent">{formatCurrency(income)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Expenses</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-destructive">{formatCurrency(expenses)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Net Income</CardTitle>
            </CardHeader>
            <CardContent>
              <p className={`text-2xl font-bold ${net >= 0 ? "text-accent" : "text-destructive"}`}>
                {formatCurrency(net)}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          {/* Trend Chart */}
          {trendData.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Income vs Expenses Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="month" stroke="var(--muted-foreground)" />
                    <YAxis stroke="var(--muted-foreground)" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "var(--card)",
                        border: `1px solid var(--border)`,
                        borderRadius: "8px",
                      }}
                      labelStyle={{ color: "var(--foreground)" }}
                      formatter={(value) => formatCurrency(value as number)}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="income" stroke="var(--accent)" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="expense" stroke="var(--destructive)" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}

          {/* Category Pie Chart */}
          {pieData.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Expense Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "var(--card)",
                        border: `1px solid var(--border)`,
                        borderRadius: "8px",
                      }}
                      labelStyle={{ color: "var(--foreground)" }}
                      formatter={(value) => formatCurrency(value as number)}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Monthly Breakdown Chart */}
        {trendData.length > 0 && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Monthly Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="month" stroke="var(--muted-foreground)" />
                  <YAxis stroke="var(--muted-foreground)" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--card)",
                      border: `1px solid var(--border)`,
                      borderRadius: "8px",
                    }}
                    labelStyle={{ color: "var(--foreground)" }}
                    formatter={(value) => formatCurrency(value as number)}
                  />
                  <Legend />
                  <Bar dataKey="income" fill="var(--accent)" />
                  <Bar dataKey="expense" fill="var(--destructive)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {/* Category Breakdown Table */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Category Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            {Object.entries(categoryBreakdown).length === 0 ? (
              <p className="text-center text-muted-foreground">No data available</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Category</th>
                      <th className="px-4 py-3 text-right text-sm font-semibold text-foreground">Amount</th>
                      <th className="px-4 py-3 text-right text-sm font-semibold text-foreground">% of Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(categoryBreakdown).map(([category, values]) => (
                      <tr key={category} className="border-b border-border hover:bg-muted">
                        <td className="px-4 py-3 text-sm text-foreground">{category}</td>
                        <td className="px-4 py-3 text-right text-sm text-destructive">
                          {formatCurrency(values.amount)}
                        </td>
                        <td className="px-4 py-3 text-right text-sm text-foreground">
                          {values.percentage.toFixed(1)}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
