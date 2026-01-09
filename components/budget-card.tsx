"use client"

import type { Budget } from "@/lib/storage"
<<<<<<< HEAD
import { formatCurrency } from "@/lib/currency"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TrashIcon, AlertCircleIcon } from "lucide-react"
=======
import { useCurrency } from "@/components/currency-provider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TrashIcon, AlertCircleIcon, CheckCircle2Icon } from "lucide-react"
import { cn } from "@/lib/utils"
>>>>>>> e84ca4ff3905f27b57c9f20969a6c56742ed1608

interface BudgetCardProps {
  budget: Budget & { spent: number }
  onDelete: (id: string) => void
}

export default function BudgetCard({ budget, onDelete }: BudgetCardProps) {
<<<<<<< HEAD
=======
  const { formatAmount } = useCurrency()
>>>>>>> e84ca4ff3905f27b57c9f20969a6c56742ed1608
  const percentage = Math.min((budget.spent / budget.limit) * 100, 100)
  const isExceeded = budget.spent > budget.limit
  const remaining = budget.limit - budget.spent

  return (
<<<<<<< HEAD
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
=======
    <Card className="overflow-hidden border-none shadow-md bg-white/50 backdrop-blur-sm transition-all hover:shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-semibold">{budget.category}</CardTitle>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(budget.id)}
          className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
        >
          <TrashIcon className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Spent</span>
            <span className="font-medium">
              {formatAmount(budget.spent)} <span className="text-muted-foreground">/ {formatAmount(budget.limit)}</span>
            </span>
          </div>

          <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
            <div
              className={cn(
                "h-full transition-all duration-500 ease-in-out",
                isExceeded ? "bg-destructive" : percentage > 85 ? "bg-yellow-500" : "bg-green-500"
              )}
              style={{ width: `${percentage}%` }}
            />
          </div>

          <div className={cn(
            "flex items-center gap-2 rounded-md p-2 text-sm",
            isExceeded ? "bg-destructive/10 text-destructive" : "bg-green-500/10 text-green-600"
          )}>
            {isExceeded ? (
              <>
                <AlertCircleIcon className="h-4 w-4" />
                <span className="font-medium">Exceeded by {formatAmount(budget.spent - budget.limit)}</span>
              </>
            ) : (
              <>
                <CheckCircle2Icon className="h-4 w-4" />
                <span className="font-medium">{formatAmount(remaining)} remaining</span>
              </>
            )}
          </div>
>>>>>>> e84ca4ff3905f27b57c9f20969a6c56742ed1608
        </div>
      </CardContent>
    </Card>
  )
}
