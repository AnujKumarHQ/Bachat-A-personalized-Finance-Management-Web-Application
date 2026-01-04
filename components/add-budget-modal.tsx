"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import type { Budget } from "@/lib/storage"
import { XIcon } from "lucide-react"

const BUDGET_CATEGORIES = [
  "Food",
  "Transport",
  "Entertainment",
  "Utilities",
  "Healthcare",
  "Shopping",
  "Dining",
  "Other",
]

interface AddBudgetModalProps {
  onAdd: (budget: Omit<Budget, "id">) => void
  onClose: () => void
}

export default function AddBudgetModal({ onAdd, onClose }: AddBudgetModalProps) {
  const [category, setCategory] = useState(BUDGET_CATEGORIES[0])
  const [limit, setLimit] = useState("")
  const [month, setMonth] = useState(new Date().toISOString().split("T")[0].slice(0, 7))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!limit) return

    onAdd({
      category,
      limit: Number.parseFloat(limit),
      spent: 0,
      month,
    })

    setLimit("")
    setCategory(BUDGET_CATEGORIES[0])
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <Card className="w-full max-w-md">
        <div className="flex items-center justify-between border-b border-border p-6">
          <h2 className="text-lg font-semibold text-foreground">Create Budget</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <XIcon className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 p-6">
          {/* Category */}
          <div>
            <label className="text-sm font-medium text-foreground">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="mt-2 w-full rounded-lg border border-border bg-input px-3 py-2 text-foreground focus:border-primary focus:outline-none"
            >
              {BUDGET_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Limit */}
          <div>
            <label className="text-sm font-medium text-foreground">Monthly Limit</label>
            <input
              type="number"
              step="0.01"
              value={limit}
              onChange={(e) => setLimit(e.target.value)}
              placeholder="0.00"
              className="mt-2 w-full rounded-lg border border-border bg-input px-3 py-2 text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none"
            />
          </div>

          {/* Month */}
          <div>
            <label className="text-sm font-medium text-foreground">Month</label>
            <input
              type="month"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="mt-2 w-full rounded-lg border border-border bg-input px-3 py-2 text-foreground focus:border-primary focus:outline-none"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1 bg-transparent">
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Create Budget
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
