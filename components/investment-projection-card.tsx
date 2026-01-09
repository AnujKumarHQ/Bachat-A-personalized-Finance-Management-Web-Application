"use client"

import { useCurrency } from "@/components/currency-provider"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { getProjections } from "@/lib/investment-calculator"
import { TrendingUpIcon, InfoIcon, TrendingDownIcon } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

interface InvestmentProjectionCardProps {
  name: string
  type: string
  currentValue: number
  amount: number
}

export function InvestmentProjectionCard({ name, type, currentValue, amount }: InvestmentProjectionCardProps) {
  const { formatAmount } = useCurrency()
  const projections = getProjections(currentValue, type)
  const gains = currentValue - amount
  const gainPercentage = amount > 0 ? ((gains / amount) * 100).toFixed(1) : "0.0"
  const isPositive = gains >= 0

  return (
    <Card className="overflow-hidden border-none shadow-md bg-white/50 backdrop-blur-sm transition-all hover:shadow-lg group">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-base font-semibold line-clamp-1">{name}</CardTitle>
            <CardDescription className="text-xs mt-1 capitalize">{type.replace(/_/g, " ")}</CardDescription>
          </div>
          <div className={cn(
            "flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold",
            isPositive ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
          )}>
            {isPositive ? <TrendingUpIcon className="h-3 w-3" /> : <TrendingDownIcon className="h-3 w-3" />}
            <span>{isPositive ? "+" : ""}{gainPercentage}%</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 text-sm">
          <div className="flex justify-between items-center pb-2 border-b border-border/50">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <span>Invested</span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <InfoIcon className="h-3.5 w-3.5 cursor-help opacity-70" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>The principal amount you invested initially</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <span className="font-medium text-foreground">{formatAmount(amount)}</span>
          </div>

          <div className="flex justify-between items-center pb-2 border-b border-border/50">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <span>Current Value</span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <InfoIcon className="h-3.5 w-3.5 cursor-help opacity-70" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Current market worth of your investment today</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <span className="font-bold text-primary">{formatAmount(currentValue)}</span>
          </div>


        </div>

        <div className="bg-muted/50 rounded-lg p-3 space-y-2 border border-border/50">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Projected Growth</p>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="rounded bg-background/50 p-2 shadow-sm">
              <p className="text-[10px] text-muted-foreground mb-1">1 Year</p>
              <p className="text-xs font-bold text-primary">{formatAmount(projections.year1)}</p>
            </div>
            <div className="rounded bg-background/50 p-2 shadow-sm">
              <p className="text-[10px] text-muted-foreground mb-1">5 Years</p>
              <p className="text-xs font-bold text-primary">{formatAmount(projections.year5)}</p>
            </div>
            <div className="rounded bg-background/50 p-2 shadow-sm">
              <p className="text-[10px] text-muted-foreground mb-1">10 Years</p>
              <p className="text-xs font-bold text-primary">{formatAmount(projections.year10)}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
