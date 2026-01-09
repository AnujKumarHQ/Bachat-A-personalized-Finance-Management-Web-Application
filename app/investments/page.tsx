"use client"

import { useEffect, useState } from "react"
<<<<<<< HEAD
import { storageUtils, type Investment } from "@/lib/storage"
import { formatCurrency } from "@/lib/currency"
import { InvestmentProjectionCard } from "@/components/investment-projection-card"
import InvestmentForm from "@/components/investment-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TrashIcon, PlusIcon } from "lucide-react"
=======
import { fetchInvestments, addInvestment, deleteInvestment, type UIInvestment } from "@/lib/data"
import { useCurrency } from "@/components/currency-provider"
import { InvestmentProjectionCard } from "@/components/investment-projection-card"
import AddInvestmentModal from "@/components/add-investment-modal"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TrashIcon, PlusIcon, ArrowLeftIcon, TrendingUpIcon, PieChartIcon, BarChart3Icon } from "lucide-react"
>>>>>>> e84ca4ff3905f27b57c9f20969a6c56742ed1608
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

<<<<<<< HEAD
const INVESTMENT_TYPES = [
  { value: "fd", label: "Fixed Deposit (FD)" },
  { value: "ppf", label: "Public Provident Fund (PPF)" },
  { value: "mutual_fund", label: "Mutual Fund" },
  { value: "stocks", label: "Stocks" },
  { value: "nps", label: "National Pension Scheme (NPS)" },
  { value: "bonds", label: "Government Bonds" },
  { value: "gold", label: "Gold" },
  { value: "crypto", label: "Cryptocurrency (Bitcoin)" },
  { value: "others", label: "Others" },
]

export default function InvestmentsPage() {
  const [investments, setInvestments] = useState<Investment[]>([])
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    setInvestments(storageUtils.getInvestments())
  }, [])

  const handleAddInvestment = (investment: Omit<Investment, "id">) => {
    storageUtils.addInvestment(investment)
    setInvestments(storageUtils.getInvestments())
    setShowForm(false)
  }

  const handleDeleteInvestment = (id: string) => {
    storageUtils.deleteInvestment(id)
    setInvestments(storageUtils.getInvestments())
=======
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
>>>>>>> e84ca4ff3905f27b57c9f20969a6c56742ed1608
  }

  const totalInvested = investments.reduce((sum, inv) => sum + inv.amount, 0)
  const totalCurrentValue = investments.reduce((sum, inv) => sum + inv.currentValue, 0)
  const totalGains = totalCurrentValue - totalInvested
<<<<<<< HEAD
=======
  const isPositive = totalGains >= 0
>>>>>>> e84ca4ff3905f27b57c9f20969a6c56742ed1608

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
<<<<<<< HEAD
    <main className="min-h-screen bg-background">
      <div className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <Link href="/">
            <Button variant="outline" className="mb-4 bg-transparent">
              ← Back to Dashboard
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-foreground">Investments</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage investments and view projected values for 1, 5, and 10 years
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Investment Summary Cards */}
        <div className="mb-8 grid gap-4 md:grid-cols-4">
          <Card>
=======
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
        {/* Investment Summary Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-200/20">
>>>>>>> e84ca4ff3905f27b57c9f20969a6c56742ed1608
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Invested</CardTitle>
            </CardHeader>
            <CardContent>
<<<<<<< HEAD
              <p className="text-2xl font-bold text-foreground">{formatCurrency(totalInvested)}</p>
              <p className="mt-1 text-xs text-muted-foreground">Across {investments.length} investments</p>
            </CardContent>
          </Card>
          <Card>
=======
              <p className="text-2xl font-bold text-blue-600">{formatAmount(totalInvested)}</p>
              <p className="mt-1 text-xs text-muted-foreground">Across {investments.length} assets</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-indigo-500/10 to-indigo-600/5 border-indigo-200/20">
>>>>>>> e84ca4ff3905f27b57c9f20969a6c56742ed1608
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Current Value</CardTitle>
            </CardHeader>
            <CardContent>
<<<<<<< HEAD
              <p className="text-2xl font-bold text-primary">{formatCurrency(totalCurrentValue)}</p>
              <p className="mt-1 text-xs text-muted-foreground">Portfolio worth today</p>
            </CardContent>
          </Card>
          <Card>
=======
              <p className="text-2xl font-bold text-indigo-600">{formatAmount(totalCurrentValue)}</p>
              <p className="mt-1 text-xs text-muted-foreground">Portfolio worth today</p>
            </CardContent>
          </Card>
          <Card className={`bg-gradient-to-br ${isPositive ? "from-green-500/10 to-green-600/5 border-green-200/20" : "from-red-500/10 to-red-600/5 border-red-200/20"}`}>
>>>>>>> e84ca4ff3905f27b57c9f20969a6c56742ed1608
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Gains</CardTitle>
            </CardHeader>
            <CardContent>
<<<<<<< HEAD
              <p className="text-2xl font-bold text-green-600">+{formatCurrency(totalGains)}</p>
              <p className="mt-1 text-xs text-green-600">
=======
              <p className={`text-2xl font-bold ${isPositive ? "text-green-600" : "text-red-600"}`}>
                {isPositive ? "+" : ""}{formatAmount(totalGains)}
              </p>
              <p className={`mt-1 text-xs ${isPositive ? "text-green-600" : "text-red-600"}`}>
>>>>>>> e84ca4ff3905f27b57c9f20969a6c56742ed1608
                {totalInvested > 0 ? `${((totalGains / totalInvested) * 100).toFixed(1)}%` : "0%"} return
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Avg Risk Level</CardTitle>
            </CardHeader>
            <CardContent>
<<<<<<< HEAD
              <p className="text-2xl font-bold text-accent capitalize">
                {investments.length > 0
                  ? investments.reduce((risk, inv) => {
                      const riskValue = { low: 1, medium: 2, high: 3 }[inv.riskLevel]
                      return risk + riskValue
                    }, 0) /
                      investments.length >
                    2
                    ? "High"
                    : investments.reduce((risk, inv) => {
                          const riskValue = { low: 1, medium: 2, high: 3 }[inv.riskLevel]
                          return risk + riskValue
                        }, 0) /
                          investments.length >
                        1.5
                      ? "Medium"
                      : "Low"
=======
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
>>>>>>> e84ca4ff3905f27b57c9f20969a6c56742ed1608
                  : "N/A"}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">Portfolio volatility</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        {investments.length > 0 && (
<<<<<<< HEAD
          <div className="mb-8 grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Investment Distribution</CardTitle>
                <CardDescription>Breakdown by investment name</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Pie
                      data={investmentDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {investmentDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(value as number)} />
                    <Legend />
                  </RechartsPieChart>
                </ResponsiveContainer>
=======
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
>>>>>>> e84ca4ff3905f27b57c9f20969a6c56742ed1608
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
<<<<<<< HEAD
                <CardTitle>Investment Type Distribution</CardTitle>
                <CardDescription>Portfolio allocation by type</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={typeDistribution}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                    <YAxis />
                    <Tooltip formatter={(value) => formatCurrency(value as number)} />
                    <Bar dataKey="value" fill="#0ea5e9" />
                  </BarChart>
                </ResponsiveContainer>
=======
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
>>>>>>> e84ca4ff3905f27b57c9f20969a6c56742ed1608
              </CardContent>
            </Card>
          </div>
        )}

<<<<<<< HEAD
        {/* Add Investment Button */}
        {!showForm && (
          <Button onClick={() => setShowForm(true)} className="mb-8 gap-2">
            <PlusIcon className="h-4 w-4" />
            Add Investment
          </Button>
        )}

        {/* Add Investment Form */}
        {showForm && <InvestmentForm onClose={() => setShowForm(false)} onSubmit={handleAddInvestment} />}

        {/* Investments List with Projections */}
        <div className="mb-4">
          <h2 className="text-xl font-bold text-foreground mb-4">Your Investments</h2>
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
                  size="sm"
                  onClick={() => handleDeleteInvestment(investment.id)}
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                >
                  <TrashIcon className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        {investments.length === 0 && (
          <div className="rounded-lg border border-dashed border-border bg-muted/20 py-12 text-center">
            <PlusIcon className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-2 font-semibold text-foreground">No Investments Yet</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Start investing by creating your first investment from popular Indian schemes or crypto
            </p>
          </div>
        )}
      </div>
    </main>
=======
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
>>>>>>> e84ca4ff3905f27b57c9f20969a6c56742ed1608
  )
}
