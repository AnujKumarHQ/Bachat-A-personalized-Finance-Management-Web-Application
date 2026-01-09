"use client"

import type React from "react"
import { useState, useEffect } from "react"
import type { Investment } from "@/lib/storage"
import { getAnnualReturnPercentage } from "@/lib/investment-today-values"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

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

interface InvestmentFormProps {
  onClose: () => void
  onSubmit: (investment: Omit<Investment, "id">) => void
}

export default function InvestmentForm({ onClose, onSubmit }: InvestmentFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    type: "fd" as Investment["type"],
    amount: "",
    currentValue: "",
    riskLevel: "medium" as "low" | "medium" | "high",
  })

  useEffect(() => {
    if (formData.type) {
      const annualReturn = getAnnualReturnPercentage(formData.type)
      setFormData((prev) => ({
        ...prev,
        currentValue: annualReturn.toString(),
      }))
    }
  }, [formData.type])

  const handleAddInvestment = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.amount) return

    const invAmount = Number(formData.amount)

    onSubmit({
      name: formData.name,
      type: formData.type,
      amount: invAmount,
      currentValue: invAmount,
      expectedReturn: 0,
      riskLevel: formData.riskLevel,
    })

    setFormData({
      name: "",
      type: "fd",
      amount: "",
      currentValue: "",
      riskLevel: "medium",
    })
  }

  return (
    <Card className="mb-8 border-primary/20 shadow-lg">
      <CardHeader>
        <CardTitle>Create New Investment</CardTitle>
        <CardDescription>Select an investment type to see the annual return percentage</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleAddInvestment} className="space-y-4">
          {/* Investment Name */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Investment Name</label>
            <Input
              placeholder="e.g., SBI FD, HDFC MF, 5g Gold, Bitcoin, etc."
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          {/* Investment Type */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Investment Type</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as Investment["type"] })}
              className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground hover:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              {INVESTMENT_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
            <p className="text-xs text-muted-foreground mt-1">Type determines the annual return percentage</p>
          </div>

          {/* Amount Invested & Annual Return */}
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Amount Invested (INR)</label>
              <Input
                type="number"
                placeholder="50000"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                required
              />
              <p className="text-xs text-muted-foreground mt-1">Principal amount you're investing</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Annual Return
                <span className="ml-2 text-xs font-semibold text-primary">— AUTO-FILLED</span>
              </label>
              <Input
                type="number"
                step="0.01"
                placeholder="Auto-filled with annual return"
                value={formData.currentValue}
                readOnly
                className="bg-primary/5"
              />
              <p
                className={`text-xs font-semibold mt-1 ${Number(formData.currentValue) < 0 ? "text-red-500" : "text-green-500"}`}
              >
                {formData.currentValue
                  ? `${Number(formData.currentValue) > 0 ? "+" : ""}${Number(formData.currentValue).toFixed(2)}% per year`
                  : "Select investment type"}
              </p>
            </div>
          </div>

          {/* Risk Level */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-3">Risk Level</label>
            <div className="flex gap-3">
              {["low", "medium", "high"].map((level) => (
                <label key={level} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="risk"
                    value={level}
                    checked={formData.riskLevel === level}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        riskLevel: e.target.value as "low" | "medium" | "high",
                      })
                    }
                    className="h-4 w-4 cursor-pointer accent-primary"
                  />
                  <span className="capitalize text-sm font-medium">{level}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1" disabled={!formData.name || !formData.amount}>
              Save Investment
            </Button>
            <Button type="button" variant="outline" onClick={onClose} className="bg-transparent">
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
