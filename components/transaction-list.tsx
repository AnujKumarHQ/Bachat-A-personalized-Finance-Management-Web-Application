"use client"

import type { Transaction } from "@/lib/storage"
<<<<<<< HEAD
import { formatCurrency } from "@/lib/currency"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TrashIcon } from "lucide-react"
=======
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TrashIcon, ShoppingBagIcon, CoffeeIcon, HomeIcon, CarIcon, ZapIcon, PlusCircleIcon, ArrowDownLeftIcon, ArrowUpRightIcon, SearchXIcon } from "lucide-react"
import { useCurrency } from "@/components/currency-provider"
>>>>>>> e84ca4ff3905f27b57c9f20969a6c56742ed1608

interface TransactionListProps {
  transactions: Transaction[]
  onDelete: (id: string) => void
}

<<<<<<< HEAD
export default function TransactionList({ transactions, onDelete }: TransactionListProps) {
  if (transactions.length === 0) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="text-center">
            <p className="text-muted-foreground">No transactions found</p>
=======
const getCategoryIcon = (category: string) => {
  const lower = category.toLowerCase()
  if (lower.includes("food") || lower.includes("dining")) return CoffeeIcon
  if (lower.includes("shopping")) return ShoppingBagIcon
  if (lower.includes("home") || lower.includes("rent")) return HomeIcon
  if (lower.includes("transport") || lower.includes("fuel")) return CarIcon
  if (lower.includes("bill") || lower.includes("utility")) return ZapIcon
  return ShoppingBagIcon
}

export default function TransactionList({ transactions, onDelete }: TransactionListProps) {
  const { formatAmount } = useCurrency()

  if (transactions.length === 0) {
    return (
      <Card className="border-none shadow-md bg-white/50 backdrop-blur-sm">
        <CardContent className="py-16">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="rounded-full bg-muted p-4 mb-4">
              <SearchXIcon className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-lg font-medium text-foreground">No transactions found</p>
            <p className="text-sm text-muted-foreground mt-1">Try adjusting your filters or add a new transaction.</p>
>>>>>>> e84ca4ff3905f27b57c9f20969a6c56742ed1608
          </div>
        </CardContent>
      </Card>
    )
  }

  const sorted = [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return (
<<<<<<< HEAD
    <Card>
      <CardHeader>
        <CardTitle>Transactions ({sorted.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {sorted.map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between rounded-lg border border-border p-4 transition-colors hover:bg-muted"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                    <span className="text-xs font-semibold text-foreground">{transaction.category.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{transaction.description}</p>
                    <p className="text-sm text-muted-foreground">
                      {transaction.category} • {new Date(transaction.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={`text-lg font-semibold ${
                    transaction.type === "income" ? "text-accent" : "text-destructive"
                  }`}
                >
                  {transaction.type === "income" ? "+" : "-"}
                  {formatCurrency(transaction.amount)}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(transaction.id)}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <TrashIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
=======
    <Card className="overflow-hidden border-none shadow-md bg-white/50 backdrop-blur-sm">
      <CardHeader className="border-b border-border/50 bg-muted/30 pb-4">
        <CardTitle className="text-lg font-semibold">Transactions ({sorted.length})</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-border/50">
          {sorted.map((transaction) => {
            const CategoryIcon = getCategoryIcon(transaction.category)
            const isIncome = transaction.type === "income"

            return (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-4 transition-colors hover:bg-muted/50 group"
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
>>>>>>> e84ca4ff3905f27b57c9f20969a6c56742ed1608
        </div>
      </CardContent>
    </Card>
  )
}
