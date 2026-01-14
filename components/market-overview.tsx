"use client"

import { useEffect, useState, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, TrendingDown, RefreshCwIcon, AlertCircleIcon, CoinsIcon, BitcoinIcon, Briefcase, ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Area, AreaChart, ResponsiveContainer, YAxis } from "recharts"
import CoinDetailModal from "./coin-detail-modal"
import StockDetailModal from "./stock-detail-modal"
import { Button } from "@/components/ui/button"

interface CoinData {
    id: string
    symbol: string
    name: string
    current_price: number
    price_change_percentage_24h: number
    sparkline_in_7d?: {
        price: number[]
    }
}

interface StockData {
    price: number
    change: number
    simpleHistory?: number[]
}

const COINS = [
    { id: "bitcoin", name: "Bitcoin", symbol: "BTC", icon: BitcoinIcon, color: "#f97316" }, // orange-500
    { id: "ethereum", name: "Ethereum", symbol: "ETH", icon: CoinsIcon, color: "#3b82f6" }, // blue-500
    { id: "solana", name: "Solana", symbol: "SOL", icon: CoinsIcon, color: "#a855f7" }, // purple-500
    { id: "pax-gold", name: "Gold (1oz)", symbol: "PAXG", icon: CoinsIcon, color: "#eab308" }, // yellow-500
    { id: "kinesis-silver", name: "Silver (1oz)", symbol: "KAG", icon: CoinsIcon, color: "#94a3b8" }, // slate-400
]

const STOCKS = [
    { id: "AAPL", name: "Apple", symbol: "AAPL", icon: Briefcase, color: "#A2AAAD" },
    { id: "MSFT", name: "Microsoft", symbol: "MSFT", icon: Briefcase, color: "#00A4EF" },
    { id: "GOOGL", name: "Google", symbol: "GOOGL", icon: Briefcase, color: "#4285F4" },
    { id: "AMZN", name: "Amazon", symbol: "AMZN", icon: Briefcase, color: "#FF9900" },
    { id: "TSLA", name: "Tesla", symbol: "TSLA", icon: Briefcase, color: "#CC0000" },
]

export default function MarketOverview() {
    const [selectedCoin, setSelectedCoin] = useState<CoinData & { color: string, icon: any } | null>(null)
    const [selectedStock, setSelectedStock] = useState<StockData & { id: string, name: string, symbol: string, color: string } | null>(null)
    const [data, setData] = useState<CoinData[]>([])
    const [stockData, setStockData] = useState<Record<string, StockData>>({})
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

    // Scroll handling
    const scrollContainerRef = useRef<HTMLDivElement>(null)

    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const scrollAmount = 300 // Approx one card width + gap
            scrollContainerRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            })
        }
    }

    const fetchData = async () => {
        setIsLoading(true)
        setError(null)
        try {
            // Fetch Crypto
            const ids = COINS.map(c => c.id).join(",")
            const coinsPromise = fetch(
                `https://api.coingecko.com/api/v3/coins/markets?vs_currency=inr&ids=${ids}&order=market_cap_desc&sparkline=true&price_change_percentage=24h`
            )

            // Fetch Stocks
            const symbols = STOCKS.map(s => s.symbol).join(",")
            const stocksPromise = fetch(`/api/stocks?symbols=${symbols}`)

            const [coinsRes, stocksRes] = await Promise.all([coinsPromise, stocksPromise])

            if (!coinsRes.ok) throw new Error("Failed to fetch market data")

            const coinsResult = await coinsRes.json()
            setData(coinsResult)

            if (stocksRes.ok) {
                const stocksResult = await stocksRes.json()
                setStockData(stocksResult)
            } else {
                console.warn("Failed to fetch stocks")
            }

            setLastUpdated(new Date())
        } catch (err) {
            setError("Limit reached or API error. Try again later.")
            console.error(err)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
        const interval = setInterval(fetchData, 60000)
        return () => clearInterval(interval)
    }, [])

    const formatCurrency = (value: number, type: 'INR' | 'USD' = 'INR') => {
        return new Intl.NumberFormat(type === 'INR' ? "en-IN" : "en-US", {
            style: "currency",
            currency: type,
            maximumFractionDigits: 2,
        }).format(value)
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                    Market Trends
                    {lastUpdated && (
                        <span className="text-xs font-normal text-muted-foreground">
                            Updated: {lastUpdated.toLocaleTimeString()}
                        </span>
                    )}
                </h2>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" className="h-8 w-8 rounded-full" onClick={() => scroll('left')}>
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" className="h-8 w-8 rounded-full" onClick={() => scroll('right')}>
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                    <button
                        onClick={fetchData}
                        disabled={isLoading}
                        className="p-2 rounded-full hover:bg-muted transition-colors disabled:opacity-50 ml-2"
                        title="Refresh prices"
                    >
                        <RefreshCwIcon className={cn("h-4 w-4", isLoading && "animate-spin")} />
                    </button>
                </div>
            </div>

            {error ? (
                <div className="p-4 rounded-lg border border-destructive/50 bg-destructive/10 text-destructive flex items-center gap-2 text-sm">
                    <AlertCircleIcon className="h-4 w-4" />
                    {error}
                </div>
            ) : (
                <div
                    ref={scrollContainerRef}
                    className="flex overflow-x-auto gap-4 pb-4 -mx-4 px-4 scrollbar-hide snap-x snap-mandatory"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {/* Crypto Cards */}
                    {COINS.map((coinConf) => {
                        const coinData = data.find(d => d.id === coinConf.id)
                        const price = coinData?.current_price ?? 0
                        const change = coinData?.price_change_percentage_24h ?? 0
                        const isPositive = change >= 0
                        const chartData = coinData?.sparkline_in_7d?.price.map((val, i) => ({ i, value: val })) ?? []

                        const min = Math.min(...(chartData.map(d => d.value) || [0]))
                        const max = Math.max(...(chartData.map(d => d.value) || [0]))

                        return (
                            <Card
                                key={coinConf.id}
                                className="shadow-sm hover:shadow-md transition-shadow overflow-hidden relative group cursor-pointer active:scale-95 transition-transform min-w-[240px] md:min-w-[280px] snap-center flex-shrink-0"
                                onClick={() => coinData && setSelectedCoin({ ...coinData, color: coinConf.color, icon: coinConf.icon })}
                            >
                                <CardContent className="p-4 pb-0 h-[140px] flex flex-col justify-between relative z-10">
                                    <div className="flex items-center gap-2">
                                        <coinConf.icon className="h-5 w-5" style={{ color: coinConf.color }} />
                                        <span className="font-medium text-sm text-muted-foreground">{coinConf.name}</span>
                                    </div>
                                    <div className="mt-2">
                                        {isLoading && !coinData ? (
                                            <div className="space-y-2 animate-pulse">
                                                <div className="h-6 w-24 bg-muted rounded"></div>
                                                <div className="h-4 w-16 bg-muted rounded"></div>
                                            </div>
                                        ) : (
                                            <>
                                                <div className="text-lg font-bold">
                                                    {formatCurrency(price)}
                                                </div>
                                                <div className={cn(
                                                    "text-xs font-medium flex items-center gap-1",
                                                    isPositive ? "text-green-500" : "text-red-500"
                                                )}>
                                                    {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                                                    {Math.abs(change).toFixed(2)}%
                                                </div>
                                            </>
                                        )}
                                    </div>
                                    <div className="h-4" />
                                </CardContent>
                                {chartData.length > 0 && (
                                    <div className="absolute bottom-0 left-0 right-0 h-[60px] opacity-20 group-hover:opacity-30 transition-opacity">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <AreaChart data={chartData}>
                                                <defs>
                                                    <linearGradient id={`gradient-${coinConf.id}`} x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor={coinConf.color} stopOpacity={0.8} />
                                                        <stop offset="95%" stopColor={coinConf.color} stopOpacity={0} />
                                                    </linearGradient>
                                                </defs>
                                                <YAxis domain={[min, max]} hide />
                                                <Area type="monotone" dataKey="value" stroke={coinConf.color} fill={`url(#gradient-${coinConf.id})`} strokeWidth={2} />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </div>
                                )}
                            </Card>
                        )
                    })}

                    {/* Stock Cards */}
                    {STOCKS.map((stockConf) => {
                        const stock = stockData[stockConf.symbol]
                        const price = stock?.price ?? 0
                        const change = stock?.change ?? 0
                        const isPositive = change >= 0

                        // Process stock history for chart
                        const historyPoints = stock?.simpleHistory || []
                        const chartData = historyPoints.map((val, i) => ({ i, value: val }))

                        const min = Math.min(...(historyPoints.length > 0 ? historyPoints : [0]))
                        const max = Math.max(...(historyPoints.length > 0 ? historyPoints : [0]))

                        return (
                            <Card
                                key={stockConf.id}
                                className="shadow-sm hover:shadow-md transition-shadow overflow-hidden relative group min-w-[240px] md:min-w-[280px] snap-center flex-shrink-0 cursor-pointer active:scale-95 transition-transform"
                                onClick={() => stock && setSelectedStock({ ...stock, id: stockConf.id, name: stockConf.name, symbol: stockConf.symbol, color: stockConf.color })}
                            >
                                <CardContent className="p-4 pb-0 h-[140px] flex flex-col justify-between relative z-10">
                                    <div className="flex items-center gap-2">
                                        <stockConf.icon className="h-5 w-5" style={{ color: stockConf.color }} />
                                        <span className="font-medium text-sm text-muted-foreground">{stockConf.name}</span>
                                    </div>
                                    <div className="mt-2">
                                        {isLoading && !stock ? (
                                            <div className="space-y-2 animate-pulse">
                                                <div className="h-6 w-24 bg-muted rounded"></div>
                                                <div className="h-4 w-16 bg-muted rounded"></div>
                                            </div>
                                        ) : (
                                            <>
                                                <div className="text-lg font-bold">
                                                    {formatCurrency(price, 'USD')}
                                                </div>
                                                <div className={cn(
                                                    "text-xs font-medium flex items-center gap-1",
                                                    isPositive ? "text-green-500" : "text-red-500"
                                                )}>
                                                    {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                                                    {Math.abs(change).toFixed(2)}%
                                                </div>
                                            </>
                                        )}
                                    </div>
                                    <div className="flex-1" />
                                </CardContent>
                                {chartData.length > 0 && (
                                    <div className="absolute bottom-0 left-0 right-0 h-[60px] opacity-20 group-hover:opacity-30 transition-opacity">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <AreaChart data={chartData}>
                                                <defs>
                                                    <linearGradient id={`gradient-${stockConf.id}`} x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor={stockConf.color} stopOpacity={0.8} />
                                                        <stop offset="95%" stopColor={stockConf.color} stopOpacity={0} />
                                                    </linearGradient>
                                                </defs>
                                                <YAxis domain={[min, max]} hide />
                                                <Area type="monotone" dataKey="value" stroke={stockConf.color} fill={`url(#gradient-${stockConf.id})`} strokeWidth={2} />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </div>
                                )}
                            </Card>
                        )
                    })}
                </div>
            )}

            {selectedCoin && (
                <CoinDetailModal
                    isOpen={!!selectedCoin}
                    onClose={() => setSelectedCoin(null)}
                    coinId={selectedCoin.id}
                    coinName={selectedCoin.name}
                    coinSymbol={selectedCoin.symbol}
                    currentPrice={selectedCoin.current_price}
                    priceChange24h={selectedCoin.price_change_percentage_24h}
                    color={selectedCoin.color}
                />
            )}

            {selectedStock && (
                <StockDetailModal
                    isOpen={!!selectedStock}
                    onClose={() => setSelectedStock(null)}
                    stockId={selectedStock.id}
                    stockName={selectedStock.name}
                    stockSymbol={selectedStock.symbol}
                    currentPrice={selectedStock.price}
                    change={selectedStock.change}
                    color={selectedStock.color}
                />
            )}

            <p className="text-[10px] text-muted-foreground text-right italic">
                * Real-time 7-day trend data via CoinGecko & Yahoo Finance
            </p>
        </div>
    )
}
