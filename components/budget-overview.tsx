"use client"

import type { Budget, Transaction } from "@/lib/storage"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircleIcon } from "lucide-react"
import SpendingPieChart from "./spending-pie-chart"

interface BudgetOverviewProps {
  budgets: Budget[]
  transactions: Transaction[]
}

export default function BudgetOverview({ budgets, transactions }: BudgetOverviewProps) {
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
      <Card>
        <CardHeader>
          <CardTitle>Budget Status</CardTitle>
        </CardHeader>
        <CardContent>
          {budsWithSpent.length === 0 ? (
            <p className="text-center text-muted-foreground py-8 text-sm">
              No budgets set. Create one to track spending!
            </p>
          ) : (
            <div className="space-y-4">
              {budsWithSpent.map((budget) => {
                const percentage = Math.min((budget.spent / budget.limit) * 100, 100)
                const isExceeded = budget.spent > budget.limit

                return (
                  <div key={budget.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-foreground">{budget.category}</p>
                      <p className="text-sm text-muted-foreground">
                        ${budget.spent.toFixed(0)}/${budget.limit}
                      </p>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-muted">
                      <div
                        className={`h-full transition-all ${isExceeded ? "bg-destructive" : "bg-accent"}`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    {isExceeded && (
                      <div className="flex items-center gap-1 text-xs text-destructive">
                        <AlertCircleIcon className="h-3 w-3" />
                        Over budget by ${(budget.spent - budget.limit).toFixed(2)}
                      </div>
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
