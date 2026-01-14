"use client"

import { useState, useEffect } from "react"
import type { Budget, Transaction } from "@/lib/storage"
import { getMonthlyLimitForCurrentMonth, setMonthlyLimit } from "@/lib/data"
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

import { useCurrency } from "@/components/currency-provider"

interface SpendingPieChartProps {
  budgets: Budget[]
  transactions: Transaction[]
}

export default function SpendingPieChart({ budgets, transactions }: SpendingPieChartProps) {
  const { formatAmount } = useCurrency()
  const [monthlyLimit, setMonthlyLimitState] = useState<number>(0)
  const [inputValue, setInputValue] = useState<string>("")
  const [open, setOpen] = useState(false)

  useEffect(() => {
    getMonthlyLimitForCurrentMonth().then(limitData => {
      const limit = limitData?.limit || 0
      setMonthlyLimitState(limit)
      setInputValue(limit.toString())
    })
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

  const handleSetLimit = async () => {
    const newLimit = Number.parseInt(inputValue) || 0
    if (newLimit > 0) {
      await setMonthlyLimit(newLimit)
      setMonthlyLimitState(newLimit)
      setOpen(false)
    }
  }

  // Extract currency symbol for input prefix
  const currencySymbol = formatAmount(0).replace(/[0-9.,\s]/g, '')

  return (
    <Card className="overflow-hidden shadow-md">
      <CardHeader className="flex flex-row items-center justify-between border-b border-border/50 bg-muted/30 pb-4">
        <CardTitle className="text-lg font-semibold">Monthly Overview</CardTitle>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="h-8 text-xs">
              Set Limit
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Set Monthly Spending Limit</DialogTitle>
              <DialogDescription>Enter your target spending limit for this month.</DialogDescription>
            </DialogHeader>
            <div className="flex items-center gap-2 py-4">
              <span className="text-lg font-semibold text-muted-foreground">{currencySymbol}</span>
              <Input
                type="number"
                placeholder="e.g. 50000"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                min="0"
                step="1000"
                className="text-lg font-medium"
              />
            </div>
            <DialogFooter>
              <Button variant="ghost" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSetLimit}>Save Limit</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
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
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={100}
                    paddingAngle={4}
                    dataKey="value"
                    cornerRadius={4}
                    stroke="none"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip
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
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Stats Section */}
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
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
