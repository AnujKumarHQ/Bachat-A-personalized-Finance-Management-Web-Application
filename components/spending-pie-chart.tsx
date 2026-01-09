"use client"

import { useState, useEffect } from "react"
import type { Budget, Transaction } from "@/lib/storage"
<<<<<<< HEAD
import { storageUtils } from "@/lib/storage"
=======
import { getMonthlyLimitForCurrentMonth, setMonthlyLimit } from "@/lib/data"
>>>>>>> e84ca4ff3905f27b57c9f20969a6c56742ed1608
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

<<<<<<< HEAD
=======
import { useCurrency } from "@/components/currency-provider"

>>>>>>> e84ca4ff3905f27b57c9f20969a6c56742ed1608
interface SpendingPieChartProps {
  budgets: Budget[]
  transactions: Transaction[]
}

export default function SpendingPieChart({ budgets, transactions }: SpendingPieChartProps) {
<<<<<<< HEAD
=======
  const { formatAmount } = useCurrency()
>>>>>>> e84ca4ff3905f27b57c9f20969a6c56742ed1608
  const [monthlyLimit, setMonthlyLimitState] = useState<number>(0)
  const [inputValue, setInputValue] = useState<string>("")
  const [open, setOpen] = useState(false)

  useEffect(() => {
<<<<<<< HEAD
    const limit = storageUtils.getMonthlyLimitForCurrentMonth()?.limit || 0
    setMonthlyLimitState(limit)
    setInputValue(limit.toString())
=======
    getMonthlyLimitForCurrentMonth().then(limitData => {
      const limit = limitData?.limit || 0
      setMonthlyLimitState(limit)
      setInputValue(limit.toString())
    })
>>>>>>> e84ca4ff3905f27b57c9f20969a6c56742ed1608
  }, [])

  const calculateCategorySpent = (category: string) => {
    return transactions
      .filter((t) => t.type === "expense" && t.category === category)
      .reduce((sum, t) => sum + t.amount, 0)
  }

  const totalSpent = transactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0)

  const spentPercentage = monthlyLimit > 0 ? (totalSpent / monthlyLimit) * 100 : 0

  const getStatusColor = (percentage: number) => {
    if (percentage >= 75) return "#dc2626" // red-600
    if (percentage >= 50) return "#ea580c" // orange-600
    if (percentage >= 25) return "#2563eb" // blue-600
    return "#16a34a" // green-600
  }

  const statusColor = getStatusColor(spentPercentage)
  const remainingColor = "#e5e7eb" // light gray

  const pieData = [
    { name: "Spent", value: totalSpent, fill: statusColor },
    { name: "Remaining", value: Math.max(0, monthlyLimit - totalSpent), fill: remainingColor },
  ]

  const getStatusInfo = () => {
    if (spentPercentage >= 75) {
      return {
        label: "Critical: Budget mostly spent (75%+)",
        icon: "⚠️",
        color: "text-red-600",
      }
    }
    if (spentPercentage >= 50) {
      return {
        label: "Caution: Budget half spent (50%+)",
        icon: "⚡",
        color: "text-orange-600",
      }
    }
    if (spentPercentage >= 25) {
      return {
        label: "Moderate: 25% of budget spent",
        icon: "ℹ️",
        color: "text-blue-600",
      }
    }
    return {
      label: "Good: Under 25% of budget spent",
      icon: "✓",
      color: "text-green-600",
    }
  }

  const statusInfo = getStatusInfo()

<<<<<<< HEAD
  const handleSetLimit = () => {
    const newLimit = Number.parseInt(inputValue) || 0
    if (newLimit > 0) {
      storageUtils.setMonthlyLimit(newLimit)
=======
  const handleSetLimit = async () => {
    const newLimit = Number.parseInt(inputValue) || 0
    if (newLimit > 0) {
      await setMonthlyLimit(newLimit)
>>>>>>> e84ca4ff3905f27b57c9f20969a6c56742ed1608
      setMonthlyLimitState(newLimit)
      setOpen(false)
    }
  }

<<<<<<< HEAD
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Monthly Spending Overview</CardTitle>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
=======
  // Extract currency symbol for input prefix
  const currencySymbol = formatAmount(0).replace(/[0-9.,\s]/g, '')

  return (
    <Card className="overflow-hidden border-none shadow-md bg-white/50 backdrop-blur-sm">
      <CardHeader className="flex flex-row items-center justify-between border-b border-border/50 bg-muted/30 pb-4">
        <CardTitle className="text-lg font-semibold">Monthly Overview</CardTitle>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="h-8 text-xs">
>>>>>>> e84ca4ff3905f27b57c9f20969a6c56742ed1608
              Set Limit
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Set Monthly Spending Limit</DialogTitle>
<<<<<<< HEAD
              <DialogDescription>Enter how much you want to spend this month (₹50,000 or ₹1,00,000)</DialogDescription>
            </DialogHeader>
            <div className="flex items-center gap-2">
              <span className="text-lg font-semibold">₹</span>
              <Input
                type="number"
                placeholder="Enter amount"
=======
              <DialogDescription>Enter your target spending limit for this month.</DialogDescription>
            </DialogHeader>
            <div className="flex items-center gap-2 py-4">
              <span className="text-lg font-semibold text-muted-foreground">{currencySymbol}</span>
              <Input
                type="number"
                placeholder="e.g. 50000"
>>>>>>> e84ca4ff3905f27b57c9f20969a6c56742ed1608
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                min="0"
                step="1000"
<<<<<<< HEAD
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSetLimit}>Set Limit</Button>
=======
                className="text-lg font-medium"
              />
            </div>
            <DialogFooter>
              <Button variant="ghost" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSetLimit}>Save Limit</Button>
>>>>>>> e84ca4ff3905f27b57c9f20969a6c56742ed1608
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
<<<<<<< HEAD
      <CardContent>
        {monthlyLimit === 0 ? (
          <div className="flex flex-col items-center justify-center gap-4 py-8">
            <p className="text-center text-muted-foreground">No monthly limit set. Click "Set Limit" to get started!</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-6">
            <div className="w-full h-64">
=======
      <CardContent className="pt-6">
        {monthlyLimit === 0 ? (
          <div className="flex flex-col items-center justify-center gap-4 py-12 text-center">
            <div className="rounded-full bg-primary/10 p-4">
              <span className="text-2xl">🎯</span>
            </div>
            <div>
              <p className="font-medium text-foreground">No monthly limit set</p>
              <p className="text-sm text-muted-foreground mt-1">Set a limit to track your monthly spending goals.</p>
            </div>
            <Button variant="outline" onClick={() => setOpen(true)}>
              Set Limit Now
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            <div className="w-full h-64 relative">
              <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
                <span className="text-3xl font-bold text-foreground">{spentPercentage.toFixed(0)}%</span>
                <span className="text-xs text-muted-foreground uppercase tracking-wider">Used</span>
              </div>
>>>>>>> e84ca4ff3905f27b57c9f20969a6c56742ed1608
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
<<<<<<< HEAD
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
=======
                    innerRadius={80}
                    outerRadius={100}
                    paddingAngle={4}
                    dataKey="value"
                    cornerRadius={4}
                    stroke="none"
>>>>>>> e84ca4ff3905f27b57c9f20969a6c56742ed1608
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip
<<<<<<< HEAD
                    formatter={(value) => `₹${Number(value).toLocaleString()}`}
                    contentStyle={{
                      backgroundColor: "rgba(0, 0, 0, 0.8)",
                      border: "none",
                      borderRadius: "8px",
                      color: "#fff",
                    }}
                  />
                  <Legend />
=======
                    formatter={(value) => formatAmount(Number(value))}
                    contentStyle={{
                      backgroundColor: "rgba(255, 255, 255, 0.95)",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                      color: "#1f2937",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    }}
                    itemStyle={{ color: "#1f2937", fontWeight: 500 }}
                  />
>>>>>>> e84ca4ff3905f27b57c9f20969a6c56742ed1608
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Stats Section */}
<<<<<<< HEAD
            <div className="w-full space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted">
                <span className="text-sm font-medium">Total Spent</span>
                <span className="text-lg font-bold">₹{totalSpent.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted">
                <span className="text-sm font-medium">Monthly Limit</span>
                <span className="text-lg font-bold">₹{monthlyLimit.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted">
                <span className="text-sm font-medium">Spent Percentage</span>
                <span
                  className="text-lg font-bold rounded px-2 py-1 text-white"
                  style={{ backgroundColor: statusColor }}
                >
                  {spentPercentage.toFixed(1)}%
                </span>
              </div>

              {/* Status Indicator */}
              <div className="flex items-center gap-2 p-3 rounded-lg bg-muted mt-4">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: statusColor }} />
                <span className={`text-sm font-medium ${statusInfo.color}`}>
                  {statusInfo.icon} {statusInfo.label}
                </span>
=======
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg bg-muted/50 p-3 text-center">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Spent</p>
                <p className="text-lg font-bold text-foreground mt-1">{formatAmount(totalSpent)}</p>
              </div>
              <div className="rounded-lg bg-muted/50 p-3 text-center">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Remaining</p>
                <p className="text-lg font-bold text-foreground mt-1">
                  {formatAmount(Math.max(0, monthlyLimit - totalSpent))}
                </p>
              </div>
            </div>

            {/* Status Indicator */}
            <div className={`flex items-center gap-3 p-3 rounded-lg border ${spentPercentage >= 100 ? "bg-destructive/10 border-destructive/20" :
              spentPercentage >= 75 ? "bg-orange-500/10 border-orange-500/20" :
                "bg-green-500/10 border-green-500/20"
              }`}>
              <div className="text-xl">{statusInfo.icon}</div>
              <div>
                <p className={`text-sm font-semibold ${statusInfo.color}`}>{statusInfo.label.split(":")[0]}</p>
                <p className="text-xs text-muted-foreground">{statusInfo.label.split(":")[1]}</p>
>>>>>>> e84ca4ff3905f27b57c9f20969a6c56742ed1608
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
