"use client"

import { useState, useEffect } from "react"
import type { Budget, Transaction } from "@/lib/storage"
import { storageUtils } from "@/lib/storage"
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

interface SpendingPieChartProps {
  budgets: Budget[]
  transactions: Transaction[]
}

export default function SpendingPieChart({ budgets, transactions }: SpendingPieChartProps) {
  const [monthlyLimit, setMonthlyLimitState] = useState<number>(0)
  const [inputValue, setInputValue] = useState<string>("")
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const limit = storageUtils.getMonthlyLimitForCurrentMonth()?.limit || 0
    setMonthlyLimitState(limit)
    setInputValue(limit.toString())
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

  const handleSetLimit = () => {
    const newLimit = Number.parseInt(inputValue) || 0
    if (newLimit > 0) {
      storageUtils.setMonthlyLimit(newLimit)
      setMonthlyLimitState(newLimit)
      setOpen(false)
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Monthly Spending Overview</CardTitle>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              Set Limit
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Set Monthly Spending Limit</DialogTitle>
              <DialogDescription>Enter how much you want to spend this month (₹50,000 or ₹1,00,000)</DialogDescription>
            </DialogHeader>
            <div className="flex items-center gap-2">
              <span className="text-lg font-semibold">₹</span>
              <Input
                type="number"
                placeholder="Enter amount"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                min="0"
                step="1000"
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSetLimit}>Set Limit</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {monthlyLimit === 0 ? (
          <div className="flex flex-col items-center justify-center gap-4 py-8">
            <p className="text-center text-muted-foreground">No monthly limit set. Click "Set Limit" to get started!</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-6">
            <div className="w-full h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => `₹${Number(value).toLocaleString()}`}
                    contentStyle={{
                      backgroundColor: "rgba(0, 0, 0, 0.8)",
                      border: "none",
                      borderRadius: "8px",
                      color: "#fff",
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Stats Section */}
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
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
