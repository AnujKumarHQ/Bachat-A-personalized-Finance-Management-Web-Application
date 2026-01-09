"use client"

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
  onClose: () => void
}

export default function AddTransactionModal({ onAdd, onClose }: AddTransactionModalProps) {
  const [type, setType] = useState<"income" | "expense">("expense")
  const [category, setCategory] = useState(CATEGORIES.expense[0])
  const [amount, setAmount] = useState("")
  const [description, setDescription] = useState("")
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
  }

  const handleTypeChange = (newType: "income" | "expense") => {
    setType(newType)
    setCategory(CATEGORIES[newType][0])
  }

  return (
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
  )
}
