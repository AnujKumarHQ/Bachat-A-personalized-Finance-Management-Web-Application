"use client"

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
  )
}
