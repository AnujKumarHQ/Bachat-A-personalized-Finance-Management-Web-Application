"use client"

import type { Budget } from "@/lib/storage"
import { formatCurrency } from "@/lib/currency"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TrashIcon, AlertCircleIcon } from "lucide-react"

interface BudgetCardProps {
  budget: Budget & { spent: number }
  onDelete: (id: string) => void
}

export default function BudgetCard({ budget, onDelete }: BudgetCardProps) {
  const percentage = Math.min((budget.spent / budget.limit) * 100, 100)
  const isExceeded = budget.spent > budget.limit
  const remaining = budget.limit - budget.spent

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{budget.category}</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(budget.id)}
            className="text-muted-foreground hover:text-destructive"
          >
            <TrashIcon className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Progress Bar */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-medium text-foreground">
              {formatCurrency(budget.spent)} / {formatCurrency(budget.limit)}
            </span>
            <span className="text-sm text-muted-foreground">{Math.round(percentage)}%</span>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-muted">
            <div
              className={`h-full transition-all ${isExceeded ? "bg-destructive" : "bg-accent"}`}
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>

        {/* Status Message */}
        <div
          className={`rounded-lg p-3 ${isExceeded ? "bg-destructive/10 text-destructive" : "bg-accent/10 text-accent"}`}
        >
          {isExceeded ? (
            <div className="flex items-center gap-2">
              <AlertCircleIcon className="h-4 w-4" />
              <span className="text-sm font-medium">Over by {formatCurrency(budget.spent - budget.limit)}</span>
            </div>
          ) : (
            <span className="text-sm font-medium">{formatCurrency(remaining)} remaining</span>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
