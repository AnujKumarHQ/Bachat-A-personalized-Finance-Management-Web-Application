"use client"

import type { Transaction } from "@/lib/storage"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TrashIcon, ShoppingBagIcon, CoffeeIcon, HomeIcon, CarIcon, ZapIcon, PlusCircleIcon, ArrowDownLeftIcon, ArrowUpRightIcon } from "lucide-react"
import { useCurrency } from "@/components/currency-provider"

interface RecentTransactionsProps {
  transactions: Transaction[]
  onDelete: (id: string) => void
}

const getCategoryIcon = (category: string) => {
  const lower = category.toLowerCase()
  if (lower.includes("food") || lower.includes("dining")) return CoffeeIcon
  if (lower.includes("shopping")) return ShoppingBagIcon
  if (lower.includes("home") || lower.includes("rent")) return HomeIcon
  if (lower.includes("transport") || lower.includes("fuel")) return CarIcon
  if (lower.includes("bill") || lower.includes("utility")) return ZapIcon
  return ShoppingBagIcon
}

export default function RecentTransactions({ transactions, onDelete }: RecentTransactionsProps) {
  const { formatAmount } = useCurrency()
  const sorted = [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  const recent = sorted.slice(0, 10)

  return (
    <Card className="overflow-hidden shadow-md h-full">
      <CardHeader className="flex flex-row items-center justify-between border-b border-border/50 bg-muted/30 pb-4">
        <CardTitle className="text-lg font-semibold">Recent Transactions</CardTitle>
        <Button variant="ghost" size="sm" className="text-xs text-muted-foreground hover:text-foreground">
          View All
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        {recent.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="rounded-full bg-muted p-4 mb-3">
              <PlusCircleIcon className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="font-medium text-foreground">No transactions yet</p>
            <p className="text-sm text-muted-foreground mt-1">Add your first transaction to get started!</p>
          </div>
        ) : (
          <div className="divide-y divide-border/50">
            {recent.map((transaction) => {
              const CategoryIcon = getCategoryIcon(transaction.category)
              const isIncome = transaction.type === "income"

              return (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 transition-colors hover:bg-muted/50"
                >
                  <div className="flex items-center gap-4">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-full ${isIncome ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                      }`}>
                      {isIncome ? <ArrowDownLeftIcon className="h-5 w-5" /> : <ArrowUpRightIcon className="h-5 w-5" />}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{transaction.description}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <CategoryIcon className="h-3 w-3" />
                          {transaction.category}
                        </span>
                        <span>•</span>
                        <span>{new Date(transaction.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span
                      className={`text-sm font-bold ${isIncome ? "text-green-600" : "text-red-600"
                        }`}
                    >
                      {isIncome ? "+" : "-"}
                      {formatAmount(transaction.amount)}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(transaction.id)}
                      className="h-8 w-8 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 hover:text-destructive hover:bg-destructive/10"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
