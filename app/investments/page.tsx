"use client"

import { useEffect, useState } from "react"
import { fetchInvestments, addInvestment, deleteInvestment, type UIInvestment } from "@/lib/data"
import { useCurrency } from "@/components/currency-provider"
import { InvestmentProjectionCard } from "@/components/investment-projection-card"
import MarketOverview from "@/components/market-overview"
import AddInvestmentModal from "@/components/add-investment-modal"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TrashIcon, PlusIcon, ArrowLeftIcon, TrendingUpIcon, PieChartIcon, BarChart3Icon } from "lucide-react"
import Link from "next/link"
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts"

export default function InvestmentsPage() {
  const [investments, setInvestments] = useState<UIInvestment[]>([])
  const [showAddModal, setShowAddModal] = useState(false)
  const { formatAmount } = useCurrency()

  const loadInvestments = async () => {
    const data = await fetchInvestments()
    setInvestments(data)
  }

  useEffect(() => {
    loadInvestments()
  }, [])

  const handleAddInvestment = async (investment: Omit<UIInvestment, "id" | "createdAt">) => {
    await addInvestment(investment)
    await loadInvestments()
    setShowAddModal(false)
  }

  const handleDeleteInvestment = async (id: string) => {
    await deleteInvestment(id)
    await loadInvestments()
  }

  const totalInvested = investments.reduce((sum, inv) => sum + inv.amount, 0)
  const totalCurrentValue = investments.reduce((sum, inv) => sum + inv.currentValue, 0)
  const totalGains = totalCurrentValue - totalInvested
  const isPositive = totalGains >= 0

  // Chart data
  const investmentDistribution = investments.map((inv) => ({
    name: inv.name,
    value: inv.currentValue,
  }))

  const typeDistribution = investments.reduce(
    (acc, inv) => {
      const existing = acc.find((item) => item.name === inv.type)
      if (existing) {
        existing.value += inv.currentValue
      } else {
        acc.push({ name: inv.type.toUpperCase().replace(/_/g, " "), value: inv.currentValue })
      }
      return acc
    },
    [] as Array<{ name: string; value: number }>,
  )

  const COLORS = ["#0ea5e9", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#14b8a6"]

  return (
    <div className="min-h-screen bg-background pb-12">
      <div className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="icon" className="-ml-2">
                  <ArrowLeftIcon className="h-5 w-5" />
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Investments</h1>
                <p className="text-sm text-muted-foreground">
                  Manage your portfolio and track growth
                </p>
              </div>
            </div>
            <Button onClick={() => setShowAddModal(true)} className="gap-2">
              <PlusIcon className="h-4 w-4" />
              New Investment
            </Button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        {/* Market Overview */}
        <div className="w-full">
          <MarketOverview />
        </div>

        {/* Investment Summary Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-200/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Invested</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-blue-600">{formatAmount(totalInvested)}</p>
              <p className="mt-1 text-xs text-muted-foreground">Across {investments.length} assets</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-indigo-500/10 to-indigo-600/5 border-indigo-200/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Current Value</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-indigo-600">{formatAmount(totalCurrentValue)}</p>
              <p className="mt-1 text-xs text-muted-foreground">Portfolio worth today</p>
            </CardContent>
          </Card>
          <Card className={`bg-gradient-to-br ${isPositive ? "from-green-500/10 to-green-600/5 border-green-200/20" : "from-red-500/10 to-red-600/5 border-red-200/20"}`}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Gains</CardTitle>
            </CardHeader>
            <CardContent>
              <p className={`text-2xl font-bold ${isPositive ? "text-green-600" : "text-red-600"}`}>
                {isPositive ? "+" : ""}{formatAmount(totalGains)}
              </p>
              <p className={`mt-1 text-xs ${isPositive ? "text-green-600" : "text-red-600"}`}>
                {totalInvested > 0 ? `${((totalGains / totalInvested) * 100).toFixed(1)}%` : "0%"} return
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Avg Risk Level</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-foreground capitalize">
                {investments.length > 0
                  ? (() => {
                    const avgRisk = investments.reduce((risk, inv) => {
                      const riskValue = { low: 1, medium: 2, high: 3 }[inv.riskLevel]
                      return risk + riskValue
                    }, 0) / investments.length

                    if (avgRisk > 2.3) return "High"
                    if (avgRisk > 1.6) return "Medium"
                    return "Low"
                  })()
                  : "N/A"}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">Portfolio volatility</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        {investments.length > 0 && (
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <PieChartIcon className="h-5 w-5 text-muted-foreground" />
                  <CardTitle>Asset Allocation</CardTitle>
                </div>
                <CardDescription>Distribution by investment name</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={investmentDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {investmentDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value) => formatAmount(value as number)}
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      />
                      <Legend />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <BarChart3Icon className="h-5 w-5 text-muted-foreground" />
                  <CardTitle>Type Distribution</CardTitle>
                </div>
                <CardDescription>Portfolio breakdown by category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={typeDistribution}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                      <XAxis
                        dataKey="name"
                        angle={-45}
                        textAnchor="end"
                        height={80}
                        tick={{ fontSize: 12 }}
                      />
                      <YAxis
                        tickFormatter={(value) => `${value / 1000}k`}
                        tick={{ fontSize: 12 }}
                      />
                      <Tooltip
                        formatter={(value) => formatAmount(value as number)}
                        cursor={{ fill: 'transparent' }}
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      />
                      <Bar dataKey="value" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Investments List with Projections */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4">Your Portfolio</h2>
          {investments.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                <div className="rounded-full bg-muted p-4 mb-4">
                  <TrendingUpIcon className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold">No Investments Yet</h3>
                <p className="text-sm text-muted-foreground max-w-sm mt-1 mb-6">
                  Start investing by creating your first investment from popular Indian schemes or crypto.
                </p>
                <Button onClick={() => setShowAddModal(true)} className="gap-2">
                  <PlusIcon className="h-4 w-4" />
                  Add Your First Investment
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {investments.map((investment) => (
                <div key={investment.id} className="relative group">
                  <InvestmentProjectionCard
                    name={investment.name}
                    type={investment.type}
                    currentValue={investment.currentValue}
                    amount={investment.amount}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteInvestment(investment.id)}
                    className="absolute top-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showAddModal && <AddInvestmentModal onClose={() => setShowAddModal(false)} onAdd={handleAddInvestment} />}
    </div>
  )
}
