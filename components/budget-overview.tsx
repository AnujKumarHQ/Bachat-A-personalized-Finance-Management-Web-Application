"use client"

import type { Budget, Transaction } from "@/lib/storage"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircleIcon } from "lucide-react"
import SpendingPieChart from "./spending-pie-chart"

import { useCurrency } from "@/components/currency-provider"

interface BudgetOverviewProps {
  budgets: Budget[]
  transactions: Transaction[]
}

export default function BudgetOverview({ budgets, transactions }: BudgetOverviewProps) {
  const { formatAmount } = useCurrency()

  const calculateCategorySpent = (category: string) => {
    return transactions
      .filter((t) => t.type === "expense" && t.category === category)
      .reduce((sum, t) => sum + t.amount, 0)
  }

  const budsWithSpent = budgets.map((b) => ({
    ...b,
    spent: calculateCategorySpent(b.category),
  }))

  const exceededBudgets = budsWithSpent.filter((b) => b.spent > b.limit)

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden shadow-md">
        <CardHeader className="border-b border-border/50 bg-muted/30 pb-4">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            Budget Status
            {exceededBudgets.length > 0 && (
              <span className="inline-flex items-center rounded-full bg-destructive/10 px-2.5 py-0.5 text-xs font-medium text-destructive">
                {exceededBudgets.length} Alert{exceededBudgets.length > 1 ? "s" : ""}
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          {budsWithSpent.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="rounded-full bg-muted p-3 mb-3">
                <AlertCircleIcon className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium text-foreground">No budgets set</p>
              <p className="text-xs text-muted-foreground mt-1">Create a budget to track your spending!</p>
            </div>
          ) : (
            <div className="space-y-6">
              {budsWithSpent.map((budget) => {
                const percentage = Math.min((budget.spent / budget.limit) * 100, 100)
                const isExceeded = budget.spent > budget.limit
                const colorClass = isExceeded ? "bg-destructive" : percentage > 85 ? "bg-orange-500" : "bg-primary"

                return (
                  <div key={budget.id} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-foreground">{budget.category}</span>
                        {isExceeded && <AlertCircleIcon className="h-3 w-3 text-destructive" />}
                      </div>
                      <div className="flex items-baseline gap-1">
                        <span className={`font-semibold ${isExceeded ? "text-destructive" : "text-foreground"}`}>
                          {formatAmount(budget.spent)}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          / {formatAmount(budget.limit)}
                        </span>
                      </div>
                    </div>
                    <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted/50">
                      <div
                        className={`h-full transition-all duration-500 ease-out rounded-full ${colorClass}`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    {isExceeded && (
                      <p className="text-xs text-destructive font-medium">
                        Exceeded by {formatAmount(budget.spent - budget.limit)}
                      </p>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <SpendingPieChart budgets={budgets} transactions={transactions} />
    </div>
  )
}
