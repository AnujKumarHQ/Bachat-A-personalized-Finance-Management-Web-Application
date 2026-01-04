"use client"

import type { Transaction } from "@/lib/storage"
import { formatCurrency } from "@/lib/currency"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUpIcon, TrendingDownIcon, WalletIcon } from "lucide-react"

interface OverviewCardsProps {
  transactions: Transaction[]
}

export default function OverviewCards({ transactions }: OverviewCardsProps) {
  const income = transactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0)

  const expenses = transactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0)

  const balance = income - expenses

  const cards = [
    {
      title: "Total Income",
      value: formatCurrency(income),
      icon: TrendingUpIcon,
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
    {
      title: "Total Expenses",
      value: formatCurrency(expenses),
      icon: TrendingDownIcon,
      color: "text-destructive",
      bgColor: "bg-destructive/10",
    },
    {
      title: "Balance",
      value: formatCurrency(balance),
      icon: WalletIcon,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {cards.map((card) => {
        const Icon = card.icon
        return (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{card.title}</CardTitle>
              <div className={`rounded-lg p-2 ${card.bgColor}`}>
                <Icon className={`h-4 w-4 ${card.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-foreground">{card.value}</p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
