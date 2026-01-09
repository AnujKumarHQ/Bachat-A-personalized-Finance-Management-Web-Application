"use client"

<<<<<<< HEAD
import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import type { Transaction } from "@/lib/storage"
import { XIcon } from "lucide-react"

const CATEGORIES = {
  income: ["Salary", "Freelance", "Investment", "Other"],
  expense: ["Food", "Transport", "Entertainment", "Utilities", "Healthcare", "Other"],
}

interface AddTransactionModalProps {
  onAdd: (transaction: Omit<Transaction, "id">) => void
=======
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { CalendarIcon, ArrowUpCircle, ArrowDownCircle, CheckCircle2 } from "lucide-react"
import type { Transaction } from "@/lib/storage"

const CATEGORIES = {
  income: ["Salary", "Freelance", "Investment", "Other"],
  expense: ["Food", "Transport", "Entertainment", "Utilities", "Healthcare", "Shopping", "Rent", "Other"],
}

interface AddTransactionModalProps {
  onAdd: (transaction: Omit<Transaction, "id">) => Promise<void> | void
>>>>>>> e84ca4ff3905f27b57c9f20969a6c56742ed1608
  onClose: () => void
}

export default function AddTransactionModal({ onAdd, onClose }: AddTransactionModalProps) {
  const [type, setType] = useState<"income" | "expense">("expense")
  const [category, setCategory] = useState(CATEGORIES.expense[0])
  const [amount, setAmount] = useState("")
  const [description, setDescription] = useState("")
<<<<<<< HEAD
  const [date, setDate] = useState(new Date().toISOString().split("T")[0])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!amount || !description) return

    onAdd({
      type,
      category,
      amount: Number.parseFloat(amount),
      description,
      date,
    })

    setAmount("")
    setDescription("")
    setDate(new Date().toISOString().split("T")[0])
=======
  const [date, setDate] = useState<Date>(new Date())
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!amount || Number.isNaN(Number(amount)) || Number(amount) <= 0) {
      setError("Please enter a valid amount")
      return
    }
    if (!description) {
      setError("Please enter a description")
      return
    }

    try {
      setSubmitting(true)
      await onAdd({
        type,
        category,
        amount: Number.parseFloat(amount),
        description,
        date: date.toISOString(),
      })
    } finally {
      setSubmitting(false)
    }
>>>>>>> e84ca4ff3905f27b57c9f20969a6c56742ed1608
  }

  const handleTypeChange = (newType: "income" | "expense") => {
    setType(newType)
    setCategory(CATEGORIES[newType][0])
  }

  return (
<<<<<<< HEAD
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <Card className="w-full max-w-md">
        <div className="flex items-center justify-between border-b border-border p-6">
          <h2 className="text-lg font-semibold text-foreground">Add Transaction</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <XIcon className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 p-6">
          {/* Type Selection */}
          <div className="flex gap-2">
            {(["income", "expense"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => handleTypeChange(t)}
                className={`flex-1 rounded-lg px-4 py-2 font-medium transition-colors ${
                  type === t ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-border"
                }`}
              >
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>

          {/* Amount */}
          <div>
            <label className="text-sm font-medium text-foreground">Amount</label>
            <input
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="mt-2 w-full rounded-lg border border-border bg-input px-3 py-2 text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none"
            />
          </div>

          {/* Category */}
          <div>
            <label className="text-sm font-medium text-foreground">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="mt-2 w-full rounded-lg border border-border bg-input px-3 py-2 text-foreground focus:border-primary focus:outline-none"
            >
              {CATEGORIES[type].map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-medium text-foreground">Description</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What is this for?"
              className="mt-2 w-full rounded-lg border border-border bg-input px-3 py-2 text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none"
            />
          </div>

          {/* Date */}
          <div>
            <label className="text-sm font-medium text-foreground">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="mt-2 w-full rounded-lg border border-border bg-input px-3 py-2 text-foreground focus:border-primary focus:outline-none"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1 bg-transparent">
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Add Transaction
            </Button>
          </div>
        </form>
      </Card>
    </div>
=======
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Transaction</DialogTitle>
          <DialogDescription>
            Create a new transaction to track your financial activity.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          {error && (
            <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive flex items-center gap-2">
              <span className="font-medium">Error:</span> {error}
            </div>
          )}

          {/* Type Selection */}
          <div className="grid grid-cols-2 gap-4">
            <div
              onClick={() => handleTypeChange("expense")}
              className={cn(
                "cursor-pointer rounded-xl border-2 p-4 flex flex-col items-center gap-2 transition-all hover:bg-muted/50",
                type === "expense"
                  ? "border-destructive bg-destructive/5"
                  : "border-muted bg-transparent opacity-50 hover:opacity-100"
              )}
            >
              <ArrowDownCircle className={cn("h-6 w-6", type === "expense" ? "text-destructive" : "text-muted-foreground")} />
              <span className={cn("font-semibold text-sm", type === "expense" ? "text-destructive" : "text-muted-foreground")}>Expense</span>
            </div>
            <div
              onClick={() => handleTypeChange("income")}
              className={cn(
                "cursor-pointer rounded-xl border-2 p-4 flex flex-col items-center gap-2 transition-all hover:bg-muted/50",
                type === "income"
                  ? "border-green-600 bg-green-50"
                  : "border-muted bg-transparent opacity-50 hover:opacity-100"
              )}
            >
              <ArrowUpCircle className={cn("h-6 w-6", type === "income" ? "text-green-600" : "text-muted-foreground")} />
              <span className={cn("font-semibold text-sm", type === "income" ? "text-green-600" : "text-muted-foreground")}>Income</span>
            </div>
          </div>

          <div className="space-y-4">
            {/* Amount */}
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-semibold">₹</span>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="pl-7 text-lg font-semibold"
                  disabled={submitting}
                  autoFocus
                />
              </div>
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={category} onValueChange={setCategory} disabled={submitting}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES[type].map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What is this for?"
                disabled={submitting}
              />
            </div>

            {/* Date */}
            <div className="space-y-2 flex flex-col">
              <Label>Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full pl-3 text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                    disabled={submitting}
                  >
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(d) => d && setDate(d)}
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={submitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting} className={cn(type === "income" ? "bg-green-600 hover:bg-green-700" : "")}>
              {submitting ? "Adding..." : "Add Transaction"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
>>>>>>> e84ca4ff3905f27b57c9f20969a6c56742ed1608
  )
}
