import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowDownIcon, ArrowUpIcon, WalletIcon, MinusIcon } from "lucide-react"
import type { Transaction } from "@/lib/storage"
import { useCurrency } from "@/components/currency-provider"
import { format, subMonths, parseISO } from "date-fns"

interface OverviewCardsProps {
  transactions: Transaction[]
  accountBalance: number
  className?: string
}

export default function OverviewCards({ transactions, accountBalance, className }: OverviewCardsProps) {
  const { formatAmount } = useCurrency()

  // Date keys for filtering
  const currentMonthKey = format(new Date(), 'yyyy-MM')
  const prevMonthKey = format(subMonths(new Date(), 1), 'yyyy-MM')

  // Helper to get month key from transaction date string (YYYY-MM-DD)
  const getMonthKey = (dateStr: string) => dateStr.substring(0, 7)

  // Filter transactions
  const currentMonthTxns = transactions.filter(t => getMonthKey(t.date) === currentMonthKey)
  const prevMonthTxns = transactions.filter(t => getMonthKey(t.date) === prevMonthKey)

  // Calculate totals
  const calculateTotal = (txns: Transaction[], type: "income" | "expense") =>
    txns.filter(t => t.type === type).reduce((sum, t) => sum + t.amount, 0)

  const currentIncome = calculateTotal(currentMonthTxns, "income")
  const prevIncome = calculateTotal(prevMonthTxns, "income")

  const currentExpenses = calculateTotal(currentMonthTxns, "expense")
  const prevExpenses = calculateTotal(prevMonthTxns, "expense")

  // Calculate percentage change
  const calculateChange = (current: number, previous: number) => {
    if (previous === 0) return current === 0 ? 0 : 100
    return ((current - previous) / previous) * 100
  }

  const incomeChange = calculateChange(currentIncome, prevIncome)
  const expenseChange = calculateChange(currentExpenses, prevExpenses)

  // Helper to render change indicator
  const renderChange = (change: number, isExpense: boolean) => {
    const isPositive = change > 0
    const isZero = change === 0

    // For income: Increase is good (Green), Decrease is bad (Red)
    // For expense: Increase is bad (Red), Decrease is good (Green)
    const isGood = isExpense ? !isPositive : isPositive

    const colorClass = isZero
      ? "text-muted-foreground"
      : isGood
        ? "text-emerald-600"
        : "text-red-600"

    const Icon = isZero
      ? MinusIcon
      : isPositive
        ? ArrowUpIcon
        : ArrowDownIcon

    return (
      <p className={`text-xs ${colorClass} mt-1 flex items-center gap-1`}>
        {!isZero && <Icon className="h-3 w-3" />}
        <span>
          {isZero ? "No change" : `${Math.abs(change).toFixed(1)}%`} from last month
        </span>
      </p>
    )
  }

  return (
    <div className={`grid gap-4 md:grid-cols-2 ${className}`}>
      <Card className="h-full bg-white/50 backdrop-blur-sm border-none shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Total Income</CardTitle>
          <div className="h-8 w-8 rounded-full bg-emerald-100 p-1.5 text-emerald-600">
            <ArrowDownIcon className="h-full w-full" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-emerald-600">{formatAmount(currentIncome)}</div>
          {renderChange(incomeChange, false)}
        </CardContent>
      </Card>
      <Card className="h-full bg-white/50 backdrop-blur-sm border-none shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Total Expenses</CardTitle>
          <div className="h-8 w-8 rounded-full bg-red-100 p-1.5 text-red-600">
            <ArrowUpIcon className="h-full w-full" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">{formatAmount(currentExpenses)}</div>
          {renderChange(expenseChange, true)}
        </CardContent>
      </Card>
    </div>
  )
}
