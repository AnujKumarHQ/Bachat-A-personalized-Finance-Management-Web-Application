"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency } from "@/lib/currency"
import { getProjections } from "@/lib/investment-calculator"
import { TrendingUpIcon, InfoIcon } from "lucide-react"

interface InvestmentProjectionCardProps {
  name: string
  type: string
  currentValue: number
  amount: number
}

export function InvestmentProjectionCard({ name, type, currentValue, amount }: InvestmentProjectionCardProps) {
  const projections = getProjections(currentValue, type)
  const gains = currentValue - amount
  const gainPercentage = amount > 0 ? ((gains / amount) * 100).toFixed(1) : 0

  return (
    <Card className="border-l-4 border-l-primary">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-base">{name}</CardTitle>
            <CardDescription className="text-xs mt-1">{type.toUpperCase().replace(/_/g, " ")}</CardDescription>
          </div>
          <div className="flex items-center gap-1 rounded-full bg-green-100 px-2 py-1">
            <TrendingUpIcon className="h-4 w-4 text-green-600" />
            <span className="text-xs font-semibold text-green-600">+{gainPercentage}%</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 text-sm">
          <div className="flex justify-between items-center pb-2 border-b border-border">
            <div className="flex items-center gap-1.5">
              <span className="text-muted-foreground">Amount Invested</span>
              <div className="group relative">
                <InfoIcon className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                <div className="invisible group-hover:visible absolute bottom-full left-0 mb-2 w-48 rounded bg-slate-900 text-white text-xs p-2 z-10">
                  The principal amount you invested initially
                </div>
              </div>
            </div>
            <span className="font-semibold text-foreground">{formatCurrency(amount)}</span>
          </div>

          <div className="flex justify-between items-center pb-2 border-b border-border">
            <div className="flex items-center gap-1.5">
              <span className="text-muted-foreground">Current Value</span>
              <div className="group relative">
                <InfoIcon className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                <div className="invisible group-hover:visible absolute bottom-full left-0 mb-2 w-48 rounded bg-slate-900 text-white text-xs p-2 z-10">
                  Current market worth of your investment today
                </div>
              </div>
            </div>
            <span className="font-bold text-primary">{formatCurrency(currentValue)}</span>
          </div>

          <div className="flex justify-between items-center pb-2 border-b border-border bg-green-50 -mx-4 px-4 py-2 rounded">
            <div className="flex items-center gap-1.5">
              <span className="text-green-700 font-semibold">Gain/Loss</span>
              <div className="group relative">
                <InfoIcon className="h-3.5 w-3.5 text-green-600 cursor-help" />
                <div className="invisible group-hover:visible absolute bottom-full left-0 mb-2 w-48 rounded bg-slate-900 text-white text-xs p-2 z-10">
                  Current Value minus Amount Invested = Your profit/loss
                </div>
              </div>
            </div>
            <span className="font-bold text-green-600">+{formatCurrency(gains)}</span>
          </div>
        </div>

        <div className="bg-muted rounded-lg p-3 space-y-2 border border-border">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Projected Values</p>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="rounded bg-background p-2">
              <p className="text-xs text-muted-foreground mb-1">1 Year</p>
              <p className="text-sm font-bold text-primary">{formatCurrency(projections.year1)}</p>
            </div>
            <div className="rounded bg-background p-2">
              <p className="text-xs text-muted-foreground mb-1">5 Years</p>
              <p className="text-sm font-bold text-primary">{formatCurrency(projections.year5)}</p>
            </div>
            <div className="rounded bg-background p-2">
              <p className="text-xs text-muted-foreground mb-1">10 Years</p>
              <p className="text-sm font-bold text-primary">{formatCurrency(projections.year10)}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
