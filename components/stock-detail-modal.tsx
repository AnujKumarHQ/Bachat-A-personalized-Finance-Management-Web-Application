"use client"

import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts"
import { TrendingUp, TrendingDown, RefreshCwIcon, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface StockDetailModalProps {
    isOpen: boolean
    onClose: () => void
    stockId: string
    stockName: string
    stockSymbol: string
    currentPrice: number
    change: number
    color: string
}

type TimeRange = '7d' | '1mo' | '1y'

export default function StockDetailModal({
    isOpen,
    onClose,
    stockId,
    stockName,
    stockSymbol,
    currentPrice,
    change,
    color,
}: StockDetailModalProps) {
    const [range, setRange] = useState<TimeRange>('7d')
    const [chartData, setChartData] = useState<{ date: string; fullDate: string; price: number }[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchChartData = async () => {
        setIsLoading(true)
        setError(null)
        try {
            // Determine params based on range
            let interval = '60m'
            if (range === '1mo') interval = '1d'
            if (range === '1y') interval = '1d'

            const response = await fetch(
                `/api/stocks?symbols=${stockSymbol}&range=${range}&interval=${interval}`
            )

            if (!response.ok) {
                throw new Error("Failed to fetch historical data")
            }

            const wrapper = await response.json()
            const data = wrapper[stockSymbol]

            if (!data || !data.history) throw new Error("No history found")

            // Transform data: { date: string, value: number }[]
            const formattedData = data.history.map((item: any) => ({
                date: new Date(item.date).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    year: range === '1y' ? '2-digit' : undefined
                }),
                fullDate: new Date(item.date).toLocaleString(),
                price: item.value
            }))

            setChartData(formattedData)
        } catch (err) {
            console.error(err)
            setError("Could not load chart data. Please try again later.")
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        if (isOpen && stockSymbol) {
            fetchChartData()
        }
    }, [isOpen, stockSymbol, range])

    // Format currency
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            maximumFractionDigits: 2,
        }).format(value)
    }

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-background/95 backdrop-blur-sm border rounded-lg p-3 shadow-lg text-xs md:text-sm">
                    <p className="font-medium mb-1">{payload[0].payload.fullDate}</p>
                    <p className="font-bold" style={{ color: color }}>
                        {formatCurrency(payload[0].value)}
                    </p>
                </div>
            )
        }
        return null
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[800px]">
                <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b">
                    <div className="flex items-center gap-3">
                        <div className="flex flex-col">
                            <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                                {stockName} <span className="text-base font-normal text-muted-foreground">({stockSymbol})</span>
                            </DialogTitle>
                            <DialogDescription className="text-lg font-medium text-foreground flex items-center gap-2 mt-1">
                                {formatCurrency(currentPrice)}
                                <span className={cn(
                                    "text-sm font-medium flex items-center px-2 py-0.5 rounded-full",
                                    change >= 0 ? "bg-green-500/10 text-green-600" : "bg-red-500/10 text-red-600"
                                )}>
                                    {change >= 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                                    {Math.abs(change).toFixed(2)}% (Recent)
                                </span>
                            </DialogDescription>
                        </div>
                    </div>

                    {/* Time Range Selector */}
                    <div className="hidden sm:flex items-center bg-muted/50 rounded-lg p-1">
                        <Button
                            variant={range === '7d' ? "secondary" : "ghost"}
                            size="sm"
                            onClick={() => setRange('7d')}
                            className="h-8 text-xs"
                        >
                            7 Days
                        </Button>
                        <Button
                            variant={range === '1mo' ? "secondary" : "ghost"}
                            size="sm"
                            onClick={() => setRange('1mo')}
                            className="h-8 text-xs"
                        >
                            30 Days
                        </Button>
                        <Button
                            variant={range === '1y' ? "secondary" : "ghost"}
                            size="sm"
                            onClick={() => setRange('1y')}
                            className="h-8 text-xs"
                        >
                            1 Year
                        </Button>
                    </div>
                </DialogHeader>

                {/* Mobile Selector */}
                <div className="flex sm:hidden items-center justify-center bg-muted/50 rounded-lg p-1 mb-2">
                    <Button
                        variant={range === '7d' ? "secondary" : "ghost"}
                        size="sm"
                        onClick={() => setRange('7d')}
                        className="h-7 text-xs flex-1"
                    >
                        7D
                    </Button>
                    <Button
                        variant={range === '1mo' ? "secondary" : "ghost"}
                        size="sm"
                        onClick={() => setRange('1mo')}
                        className="h-7 text-xs flex-1"
                    >
                        30D
                    </Button>
                    <Button
                        variant={range === '1y' ? "secondary" : "ghost"}
                        size="sm"
                        onClick={() => setRange('1y')}
                        className="h-7 text-xs flex-1"
                    >
                        1Y
                    </Button>
                </div>

                <div className="h-[350px] w-full mt-4">
                    {isLoading ? (
                        <div className="h-full w-full flex flex-col items-center justify-center text-muted-foreground gap-2">
                            <Loader2 className="h-8 w-8 animate-spin" />
                            <p className="text-sm">Loading market data...</p>
                        </div>
                    ) : error ? (
                        <div className="h-full w-full flex flex-col items-center justify-center text-destructive">
                            <p>{error}</p>
                            <Button variant="outline" size="sm" onClick={fetchChartData} className="mt-4">
                                Retry
                            </Button>
                        </div>
                    ) : (
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                                <defs>
                                    <linearGradient id={`gradient-stock-modal-${stockId}`} x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                                        <stop offset="95%" stopColor={color} stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
                                <XAxis
                                    dataKey="date"
                                    tick={{ fontSize: 12 }}
                                    tickMargin={10}
                                    axisLine={false}
                                    tickLine={false}
                                    minTickGap={30}
                                />
                                <YAxis
                                    domain={['auto', 'auto']}
                                    tick={{ fontSize: 12 }}
                                    axisLine={false}
                                    tickLine={false}
                                    tickFormatter={(val) => {
                                        if (val >= 1000) return `$${(val / 1000).toFixed(1)}k`
                                        return `$${val}`
                                    }}
                                />
                                <Tooltip content={<CustomTooltip />} />
                                <Area
                                    type="monotone"
                                    dataKey="price"
                                    stroke={color}
                                    strokeWidth={2}
                                    fill={`url(#gradient-stock-modal-${stockId})`}
                                    activeDot={{ r: 6, fill: color, stroke: 'white', strokeWidth: 2 }}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}
