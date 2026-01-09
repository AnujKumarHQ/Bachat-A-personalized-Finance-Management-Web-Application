"use client"

import type { Budget } from "@/lib/storage"
import { useCurrency } from "@/components/currency-provider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TrashIcon, AlertCircleIcon, CheckCircle2Icon } from "lucide-react"
import { cn } from "@/lib/utils"

interface BudgetCardProps {
  budget: Budget & { spent: number }
  onDelete: (id: string) => void
}

export default function BudgetCard({ budget, onDelete }: BudgetCardProps) {
  const { formatAmount } = useCurrency()
  const percentage = Math.min((budget.spent / budget.limit) * 100, 100)
  const isExceeded = budget.spent > budget.limit
  const remaining = budget.limit - budget.spent

  return (
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
        </div>
      </CardContent>
    </Card>
  )
}
