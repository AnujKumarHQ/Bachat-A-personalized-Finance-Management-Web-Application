"use client"

<<<<<<< HEAD
import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import type { Budget } from "@/lib/storage"
import { XIcon } from "lucide-react"
=======
import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { Budget } from "@/lib/storage"
>>>>>>> e84ca4ff3905f27b57c9f20969a6c56742ed1608

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
<<<<<<< HEAD

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
=======
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!limit) return

    setIsLoading(true)
    try {
      await onAdd({
        category,
        limit: Number.parseFloat(limit),
        spent: 0,
        month,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Budget</DialogTitle>
          <DialogDescription>
            Set a monthly spending limit for a specific category.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {BUDGET_CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="limit">Monthly Limit</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                ₹
              </span>
              <Input
                id="limit"
                type="number"
                step="0.01"
                placeholder="0.00"
                className="pl-7"
                value={limit}
                onChange={(e) => setLimit(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="month">Month</Label>
            <Input
              id="month"
              type="month"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              required
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Budget"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
>>>>>>> e84ca4ff3905f27b57c9f20969a6c56742ed1608
  )
}
