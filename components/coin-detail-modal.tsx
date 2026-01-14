"use client"

import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts"
import { TrendingUp, TrendingDown, RefreshCwIcon, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface CoinDetailModalProps {
    isOpen: boolean
    onClose: () => void
    coinId: string
    coinName: string
    coinSymbol: string
    currentPrice: number
    priceChange24h: number
    color: string
}

type TimeRange = 7 | 30 | 365

export default function CoinDetailModal({
    isOpen,
    onClose,
    coinId,
    coinName,
    coinSymbol,
    currentPrice,
    priceChange24h,
    color,
}: CoinDetailModalProps) {
    const [days, setDays] = useState<TimeRange>(7)
    const [chartData, setChartData] = useState<{ date: string; price: number }[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchChartData = async () => {
        setIsLoading(true)
        setError(null)
        try {
            // CoinGecko API for market chart
            const response = await fetch(
                `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=inr&days=${days}`
            )

            if (!response.ok) {
                throw new Error("Failed to fetch historical data")
            }

            const data = await response.json()

            // Transform data: [timestamp, price] -> { date, price }
            const formattedData = data.prices.map((item: [number, number]) => ({
                date: new Date(item[0]).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    year: days === 365 ? '2-digit' : undefined
                }),
                fullDate: new Date(item[0]).toLocaleString(),
                price: item[1]
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
        if (isOpen && coinId) {
            fetchChartData()
        }
    }, [isOpen, coinId, days])

    // Format currency
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
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
                                {coinName} <span className="text-base font-normal text-muted-foreground">({coinSymbol.toUpperCase()})</span>
                            </DialogTitle>
                            <DialogDescription className="text-lg font-medium text-foreground flex items-center gap-2 mt-1">
                                {formatCurrency(currentPrice)}
                                <span className={cn(
                                    "text-sm font-medium flex items-center px-2 py-0.5 rounded-full",
                                    priceChange24h >= 0 ? "bg-green-500/10 text-green-600" : "bg-red-500/10 text-red-600"
                                )}>
                                    {priceChange24h >= 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                                    {Math.abs(priceChange24h).toFixed(2)}% (24h)
                                </span>
                            </DialogDescription>
                        </div>
                    </div>

                    {/* Time Range Selector */}
                    <div className="hidden sm:flex items-center bg-muted/50 rounded-lg p-1">
                        <Button
                            variant={days === 7 ? "secondary" : "ghost"}
                            size="sm"
                            onClick={() => setDays(7)}
                            className="h-8 text-xs"
                        >
                            7 Days
                        </Button>
                        <Button
                            variant={days === 30 ? "secondary" : "ghost"}
                            size="sm"
                            onClick={() => setDays(30)}
                            className="h-8 text-xs"
                        >
                            30 Days
                        </Button>
                        <Button
                            variant={days === 365 ? "secondary" : "ghost"}
                            size="sm"
                            onClick={() => setDays(365)}
                            className="h-8 text-xs"
                        >
                            1 Year
                        </Button>
                    </div>
                </DialogHeader>

                {/* Mobile Selector */}
                <div className="flex sm:hidden items-center justify-center bg-muted/50 rounded-lg p-1 mb-2">
                    <Button
                        variant={days === 7 ? "secondary" : "ghost"}
                        size="sm"
                        onClick={() => setDays(7)}
                        className="h-7 text-xs flex-1"
                    >
                        7D
                    </Button>
                    <Button
                        variant={days === 30 ? "secondary" : "ghost"}
                        size="sm"
                        onClick={() => setDays(30)}
                        className="h-7 text-xs flex-1"
                    >
                        30D
                    </Button>
                    <Button
                        variant={days === 365 ? "secondary" : "ghost"}
                        size="sm"
                        onClick={() => setDays(365)}
                        className="h-7 text-xs flex-1"
                    >
                        1Y
                    </Button>
                </div>

                <div className="h-[350px] w-full mt-4">
                    {isLoading ? (
                        <div className="h-full w-full flex flex-col items-center justify-center text-muted-foreground gap-2">
                            <Loader2 className="h-8 w-8 animate-spin" />
                            <p className="text-sm">Loading historical data...</p>
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
                                    <linearGradient id={`gradient-modal-${coinId}`} x1="0" y1="0" x2="0" y2="1">
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
                                        // Shorten large numbers
                                        if (val >= 100000) return `₹${(val / 100000).toFixed(1)}L`
                                        if (val >= 1000) return `₹${(val / 1000).toFixed(0)}k`
                                        return `₹${val}`
                                    }}
                                />
                                <Tooltip content={<CustomTooltip />} />
                                <Area
                                    type="monotone"
                                    dataKey="price"
                                    stroke={color}
                                    strokeWidth={2}
                                    fill={`url(#gradient-modal-${coinId})`}
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
