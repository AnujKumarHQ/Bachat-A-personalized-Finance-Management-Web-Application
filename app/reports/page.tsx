"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ArrowLeftIcon, DownloadIcon, TrendingUpIcon, TrendingDownIcon, WalletIcon, PieChartIcon, BarChart3Icon } from "lucide-react"
import { fetchTransactions, type UITransaction } from "@/lib/data"
import { useCurrency } from "@/components/currency-provider"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts"
import { cn } from "@/lib/utils"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"

export default function ReportsPage() {
  const [transactions, setTransactions] = useState<UITransaction[]>([])
  const [isExporting, setIsExporting] = useState(false)
  const reportRef = useRef<HTMLDivElement>(null)
  const { formatAmount, currency } = useCurrency()

  useEffect(() => {
    const loadData = async () => {
      const data = await fetchTransactions()
      setTransactions(data)
    }
    loadData()
  }, [])

  const handleExport = () => {
    setIsExporting(true)

    try {
      const doc = new jsPDF()

      // Helper for PDF currency formatting
      const formatPdfCurrency = (amount: number) => {
        const symbol = currency === 'INR' ? 'Rs.' : currency
        return `${symbol} ${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
      }

      // Title
      doc.setFontSize(20)
      doc.setTextColor(15, 23, 42) // Keep PDF standard black/slate
      doc.text("Financial Report", 14, 22)

      // Date Range
      doc.setFontSize(10)
      doc.setTextColor(100, 116, 139)
      const dateText = `Generated on ${new Date().toLocaleDateString()}`
      doc.text(dateText, 14, 30)

      // Summary Section
      doc.setFontSize(12)
      doc.setTextColor(15, 23, 42)
      doc.text("Financial Summary", 14, 45)

      const summaryData = [
        ["Total Income", formatPdfCurrency(income)],
        ["Total Expenses", formatPdfCurrency(expenses)],
        ["Net Income", formatPdfCurrency(net)],
        ["Savings Rate", `${savingsRate.toFixed(1)}%`]
      ]

      autoTable(doc, {
        startY: 50,
        head: [['Metric', 'Value']],
        body: summaryData,
        theme: 'grid',
        headStyles: { fillColor: [15, 23, 42], halign: 'left' },
        styles: { fontSize: 10, cellPadding: 5 },
        columnStyles: {
          0: { fontStyle: 'bold', cellWidth: 100 },
          1: { halign: 'right' }
        }
      })

      // Category Breakdown
      const finalY = (doc as any).lastAutoTable.finalY || 50
      doc.text("Expense Breakdown", 14, finalY + 15)

      const categoryRows = sortedCategories.map(([category, values]) => [
        category,
        formatPdfCurrency(values.amount),
        `${values.percentage.toFixed(1)}%`
      ])

      autoTable(doc, {
        startY: finalY + 20,
        head: [['Category', 'Amount', '% of Total']],
        body: categoryRows,
        theme: 'striped',
        headStyles: { fillColor: [71, 85, 105], halign: 'left' },
        styles: { fontSize: 9 },
        columnStyles: {
          0: { cellWidth: 'auto' },
          1: { halign: 'right', cellWidth: 40 },
          2: { halign: 'right', cellWidth: 30 }
        }
      })

      // Transaction List
      doc.addPage()
      doc.text("Detailed Transactions", 14, 20)

      const transactionRows = filtered
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .map(t => [
          new Date(t.date).toLocaleDateString(),
          t.description,
          t.category,
          t.type.toUpperCase(),
          formatPdfCurrency(t.amount)
        ])

      autoTable(doc, {
        startY: 25,
        head: [['Date', 'Description', 'Category', 'Type', 'Amount']],
        body: transactionRows,
        theme: 'striped',
        headStyles: { fillColor: [15, 23, 42], halign: 'left' },
        styles: { fontSize: 8 },
        columnStyles: {
          0: { cellWidth: 25 },
          1: { cellWidth: 'auto' },
          2: { cellWidth: 30 },
          3: { cellWidth: 20 },
          4: { halign: 'right', fontStyle: 'bold', cellWidth: 35 }
        },
        didParseCell: function (data) {
          if (data.section === 'body' && data.column.index === 4) {
            const type = (data.row.raw as string[])[3];
            if (type === 'INCOME') {
              data.cell.styles.textColor = [22, 163, 74]; // Green
            } else {
              data.cell.styles.textColor = [220, 38, 38]; // Red
            }
          }
        }
      })

      doc.save(`financial-report-${new Date().toISOString().split("T")[0]}.pdf`)
    } catch (error) {
      console.error("Export failed:", error)
    } finally {
      setIsExporting(false)
    }
  }

  const getDateRange = () => {
    const start = new Date()
    start.setMonth(start.getMonth() - 1) // Default to last month
    return start
  }

  const dateRangeStart = getDateRange()
  const filtered = transactions.filter((t) => new Date(t.date) >= dateRangeStart)

  // Calculate summary stats
  const income = filtered.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0)
  const expenses = filtered.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0)
  const net = income - expenses
  const savingsRate = income > 0 ? ((income - expenses) / income) * 100 : 0

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

  const pieData = Object.entries(categoryData)
    .map(([name, value]) => ({
      name,
      value: Math.round(value),
    }))
    .sort((a, b) => b.value - a.value)

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

  // Sort categories by amount
  const sortedCategories = Object.entries(categoryBreakdown).sort((a, b) => b[1].amount - a[1].amount)

  const COLORS = [
    "#8b5cf6", // Violet
    "#ec4899", // Pink
    "#f43f5e", // Rose
    "#f97316", // Orange
    "#eab308", // Yellow
    "#22c55e", // Green
    "#06b6d4", // Cyan
    "#3b82f6", // Blue
  ]

  return (
    <div className="min-h-screen bg-background pb-12">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="icon" className="rounded-full hover:bg-muted">
                  <ArrowLeftIcon className="h-5 w-5 text-muted-foreground" />
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  Financial Reports
                </h1>
                <p className="text-xs text-muted-foreground font-medium">Analyze your financial health</p>
              </div>
            </div>
            <Button
              onClick={handleExport}
              disabled={isExporting}
              className="gap-2 shadow-lg transition-all"
            >
              {isExporting ? (
                <span className="animate-spin">⏳</span>
              ) : (
                <DownloadIcon className="h-4 w-4" />
              )}
              {isExporting ? "Exporting..." : "Export Report"}
            </Button>
          </div>
        </div>
      </header>

      <div ref={reportRef} className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        {/* Latest Activities Label */}
        <div className="flex justify-center">
          <div className="inline-flex px-6 py-2 bg-card rounded-full border border-border shadow-sm">
            <span className="text-sm font-medium text-foreground">Latest Activities</span>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-6 md:grid-cols-4">
          <Card className="border-border shadow-sm bg-card hover:shadow-md transition-all duration-300 group">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                <div className="p-1.5 rounded-md bg-green-500/10 text-green-500 group-hover:scale-110 transition-transform">
                  <TrendingUpIcon className="h-3.5 w-3.5" />
                </div>
                Total Income
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-foreground">{formatAmount(income)}</p>
              <p className="text-xs text-green-500 font-medium mt-1">+12% from last period</p>
            </CardContent>
          </Card>

          <Card className="border-border shadow-sm bg-card hover:shadow-md transition-all duration-300 group">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                <div className="p-1.5 rounded-md bg-red-500/10 text-red-500 group-hover:scale-110 transition-transform">
                  <TrendingDownIcon className="h-3.5 w-3.5" />
                </div>
                Total Expenses
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-foreground">{formatAmount(expenses)}</p>
              <p className="text-xs text-red-500 font-medium mt-1">-5% from last period</p>
            </CardContent>
          </Card>

          <Card className="border-border shadow-sm bg-card hover:shadow-md transition-all duration-300 group">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                <div className="p-1.5 rounded-md bg-blue-500/10 text-blue-500 group-hover:scale-110 transition-transform">
                  <WalletIcon className="h-3.5 w-3.5" />
                </div>
                Net Income
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className={cn("text-2xl font-bold", net >= 0 ? "text-foreground" : "text-red-500")}>
                {formatAmount(net)}
              </p>
              <p className="text-xs text-muted-foreground font-medium mt-1">Cash flow status</p>
            </CardContent>
          </Card>

          <Card className="border-border shadow-sm bg-card hover:shadow-md transition-all duration-300 group">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                <div className="p-1.5 rounded-md bg-purple-500/10 text-purple-500 group-hover:scale-110 transition-transform">
                  <PieChartIcon className="h-3.5 w-3.5" />
                </div>
                Savings Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className={cn("text-2xl font-bold", savingsRate >= 20 ? "text-green-500" : savingsRate >= 0 ? "text-yellow-500" : "text-red-500")}>
                {savingsRate.toFixed(1)}%
              </p>
              <div className="w-full bg-muted h-1.5 rounded-full mt-2 overflow-hidden">
                <div
                  className={cn("h-full rounded-full transition-all duration-500", savingsRate >= 20 ? "bg-green-500" : "bg-yellow-500")}
                  style={{ width: `${Math.max(0, Math.min(100, savingsRate))}%` }}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Trend Chart - Takes up 2 columns */}
          <Card className="lg:col-span-2 border-border shadow-sm bg-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-bold text-foreground">Income vs Expenses</CardTitle>
                  <CardDescription>Monthly financial performance trend</CardDescription>
                </div>
                <div className="p-2 bg-muted rounded-lg">
                  <BarChart3Icon className="h-5 w-5 text-muted-foreground" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[350px] w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={trendData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }} barGap={8}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                    <XAxis
                      dataKey="month"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                      dy={10}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                      tickFormatter={(value) => `${currency === 'INR' ? '₹' : '$'}${value / 1000}k`}
                    />
                    <Tooltip
                      cursor={{ fill: 'hsl(var(--muted)/0.5)' }}
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        borderColor: "hsl(var(--border))",
                        borderRadius: "12px",
                        boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                        padding: "12px",
                        color: "hsl(var(--foreground))"
                      }}
                      formatter={(value: number) => [formatAmount(value), ""]}
                    />
                    <Legend
                      iconType="circle"
                      wrapperStyle={{ paddingTop: "20px" }}
                    />
                    <Bar
                      dataKey="income"
                      name="Income"
                      fill="#22c55e"
                      radius={[4, 4, 0, 0]}
                      maxBarSize={50}
                    />
                    <Bar
                      dataKey="expense"
                      name="Expenses"
                      fill="#ef4444"
                      radius={[4, 4, 0, 0]}
                      maxBarSize={50}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Category Pie Chart - Takes up 1 column */}
          <Card className="border-border shadow-sm bg-card flex flex-col">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-foreground">Expense Distribution</CardTitle>
              <CardDescription>Where your money goes</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col justify-center">
              <div className="h-[300px] w-full relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} strokeWidth={0} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        borderColor: "hsl(var(--border))",
                        borderRadius: "8px",
                        boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                        color: "hsl(var(--foreground))"
                      }}
                      formatter={(value: number) => formatAmount(value)}
                    />
                  </PieChart>
                </ResponsiveContainer>
                {/* Center Text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-xs text-muted-foreground font-medium">Total</span>
                  <span className="text-lg font-bold text-foreground">{formatAmount(expenses)}</span>
                </div>
              </div>

              {/* Custom Legend */}
              <div className="mt-4 space-y-2 max-h-[150px] overflow-y-auto pr-2 custom-scrollbar">
                {pieData.map((entry, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                      <span className="text-muted-foreground truncate max-w-[100px]">{entry.name}</span>
                    </div>
                    <span className="font-medium text-foreground">{((entry.value / expenses) * 100).toFixed(1)}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Category Breakdown Table */}
        <Card className="border-border shadow-sm bg-card overflow-hidden">
          <CardHeader className="border-b border-border bg-muted/30">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-bold text-foreground">Category Analysis</CardTitle>
                <CardDescription>Detailed breakdown of your spending</CardDescription>
              </div>
              <Button variant="outline" size="sm" className="hidden sm:flex">
                View All Transactions
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {sortedCategories.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                No expense data available for this period
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-muted/30">
                      <th className="px-6 py-4 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider">Category</th>
                      <th className="px-6 py-4 text-right text-xs font-bold text-muted-foreground uppercase tracking-wider">Amount</th>
                      <th className="px-6 py-4 text-right text-xs font-bold text-muted-foreground uppercase tracking-wider">% of Total</th>
                      <th className="px-6 py-4 text-right text-xs font-bold text-muted-foreground uppercase tracking-wider">Trend</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {sortedCategories.map(([category, values], index) => (
                      <tr key={category} className="hover:bg-muted/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div
                              className="w-2 h-8 rounded-full"
                              style={{ backgroundColor: COLORS[index % COLORS.length] }}
                            />
                            <span className="font-medium text-foreground">{category}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right font-semibold text-foreground">
                          {formatAmount(values.amount)}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-muted text-foreground">
                            {values.percentage.toFixed(1)}%
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="w-24 ml-auto h-1.5 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full"
                              style={{
                                width: `${values.percentage}%`,
                                backgroundColor: COLORS[index % COLORS.length]
                              }}
                            />
                          </div>
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
