"use client"

import { useState, useEffect } from "react"
import type { Investment } from "@/lib/storage"
import { getAnnualReturnPercentage } from "@/lib/investment-today-values"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertTriangleIcon, ShieldCheckIcon, TrendingUpIcon, ExternalLinkIcon, CoinsIcon, RefreshCwIcon, TrendingDownIcon, BarChart3Icon } from "lucide-react"
import { cn } from "@/lib/utils"

const INVESTMENT_TYPES = [
    { value: "fd", label: "Fixed Deposit (FD)" },
    { value: "ppf", label: "Public Provident Fund (PPF)" },
    { value: "mutual_fund", label: "Mutual Fund" },
    { value: "stocks", label: "Stocks" },
    { value: "nps", label: "National Pension Scheme (NPS)" },
    { value: "bonds", label: "Government Bonds" },
    { value: "gold", label: "Gold" },
    { value: "crypto", label: "Cryptocurrency" },
    { value: "others", label: "Others" },
]

const CRYPTO_COINS = [
    { id: "bitcoin", name: "Bitcoin", symbol: "BTC", defaultReturn: 25 },
    { id: "ethereum", name: "Ethereum", symbol: "ETH", defaultReturn: 20 },
    { id: "solana", name: "Solana", symbol: "SOL", defaultReturn: 30 },
    { id: "ripple", name: "XRP", symbol: "XRP", defaultReturn: 15 },
    { id: "binancecoin", name: "BNB", symbol: "BNB", defaultReturn: 18 },
    { id: "cardano", name: "Cardano", symbol: "ADA", defaultReturn: 22 },
    { id: "dogecoin", name: "Dogecoin", symbol: "DOGE", defaultReturn: 40 },
    { id: "polkadot", name: "Polkadot", symbol: "DOT", defaultReturn: 28 },
]

const SHORT_STOCKS = [
    { id: "AAPL", name: "Apple", symbol: "AAPL", defaultReturn: 28 },
    { id: "MSFT", name: "Microsoft", symbol: "MSFT", defaultReturn: 27 },
    { id: "GOOGL", name: "Alphabet", symbol: "GOOGL", defaultReturn: 20 },
    { id: "AMZN", name: "Amazon", symbol: "AMZN", defaultReturn: 25 },
    { id: "NVDA", name: "Nvidia", symbol: "NVDA", defaultReturn: 60 },
    { id: "META", name: "Meta", symbol: "META", defaultReturn: 23 },
]

const getRiskAssessment = (type: string): { level: "low" | "medium" | "high"; reason: string; source: string } => {
    switch (type) {
        case "fd":
            return {
                level: "low",
                reason: "Capital protection with fixed returns.",
                source: "https://www.bankbazaar.com/fixed-deposit.html"
            }
        case "ppf":
            return {
                level: "low",
                reason: "Government-backed, tax-free returns.",
                source: "https://www.nsiindia.gov.in/"
            }
        case "bonds":
            return {
                level: "low",
                reason: "Fixed income, generally lower risk.",
                source: "https://www.investopedia.com/terms/g/government-bond.asp"
            }
        case "mutual_fund":
            return {
                level: "medium",
                reason: "Subject to market risks, read scheme documents.",
                source: "https://www.amfiindia.com/"
            }
        case "nps":
            return {
                level: "medium",
                reason: "Market-linked retirement savings.",
                source: "https://www.pfrda.org.in/"
            }
        case "gold":
            return {
                level: "medium",
                reason: "Hedge against inflation, moderate volatility.",
                source: "https://www.gold.org/"
            }
        case "stocks":
            return {
                level: "high",
                reason: "High volatility, ownership in companies.",
                source: "https://www.nseindia.com/"
            }
        case "crypto":
            return {
                level: "high",
                reason: "Unregulated, highly volatile asset class.",
                source: "https://www.investopedia.com/terms/c/cryptocurrency.asp"
            }
        default:
            return {
                level: "medium",
                reason: "Risk varies based on specific asset choice.",
                source: "https://www.investopedia.com/"
            }
    }
}

interface MarketData {
    [key: string]: {
        inr: number
        inr_24h_change: number
    }
}

interface StockData {
    [key: string]: {
        price: number
        change: number
    }
}

interface AddInvestmentModalProps {
    onAdd: (investment: Omit<Investment, "id" | "createdAt">) => Promise<void>
    onClose: () => void
}

export default function AddInvestmentModal({ onAdd, onClose }: AddInvestmentModalProps) {
    const [formData, setFormData] = useState({
        name: "",
        type: "fd" as Investment["type"],
        amount: "",
        currentValue: "",
        riskLevel: "low" as "low" | "medium" | "high",
    })
    const [isLoading, setIsLoading] = useState(false)
    const [cryptoData, setCryptoData] = useState<MarketData | null>(null)
    const [isCryptoLoading, setIsCryptoLoading] = useState(false)
    const [stockData, setStockData] = useState<StockData | null>(null)
    const [isStockLoading, setIsStockLoading] = useState(false)

    useEffect(() => {
        if (formData.type) {
            // Only auto-fill return if NOT crypto OR stocks
            if (formData.type !== 'crypto' && formData.type !== 'stocks') {
                const annualReturn = getAnnualReturnPercentage(formData.type)
                setFormData((prev) => ({
                    ...prev,
                    currentValue: annualReturn.toString(),
                }))
            }

            const risk = getRiskAssessment(formData.type)
            setFormData((prev) => ({
                ...prev,
                riskLevel: risk.level,
            }))
        }
    }, [formData.type])

    useEffect(() => {
        if (formData.type === 'crypto' && !cryptoData) {
            fetchCryptoData()
        }
        if (formData.type === 'stocks' && !stockData) {
            fetchStockData()
        }
    }, [formData.type])

    const fetchCryptoData = async () => {
        setIsCryptoLoading(true)
        try {
            const ids = CRYPTO_COINS.map(c => c.id).join(",")
            const response = await fetch(
                `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=inr&include_24hr_change=true`
            )
            if (response.ok) {
                const data = await response.json()
                setCryptoData(data)
            }
        } catch (error) {
            console.error("Failed to fetch crypto data", error)
        } finally {
            setIsCryptoLoading(false)
        }
    }

    const fetchStockData = async () => {
        setIsStockLoading(true)
        try {
            const symbols = SHORT_STOCKS.map(s => s.symbol).join(",")
            const response = await fetch(`/api/stocks?symbols=${symbols}`)
            if (response.ok) {
                const data = await response.json()
                setStockData(data)
            }
        } catch (error) {
            console.error("Failed to fetch stock data", error)
        } finally {
            setIsStockLoading(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!formData.name || !formData.amount) return

        setIsLoading(true)
        try {
            const invAmount = Number(formData.amount)
            await onAdd({
                name: formData.name,
                type: formData.type,
                amount: invAmount,
                currentValue: invAmount,
                expectedReturn: 0,
                riskLevel: formData.riskLevel,
            })
        } finally {
            setIsLoading(false)
        }
    }

    const handleCryptoSelect = (coin: typeof CRYPTO_COINS[0]) => {
        setFormData(prev => ({
            ...prev,
            name: `${coin.name} (${coin.symbol})`,
            currentValue: coin.defaultReturn.toString(), // Use default return for projection
            riskLevel: 'high'
        }))
    }

    const handleStockSelect = (stock: typeof SHORT_STOCKS[0]) => {
        setFormData(prev => ({
            ...prev,
            name: `${stock.name} (${stock.symbol})`,
            currentValue: stock.defaultReturn.toString(),
            riskLevel: 'high'
        }))
    }

    const riskInfo = getRiskAssessment(formData.type)
    const isCrypto = formData.type === 'crypto'
    const isStocks = formData.type === 'stocks'
    const showSidebar = isCrypto || isStocks

    return (
        <Dialog open={true} onOpenChange={onClose}>
            <DialogContent className={cn("sm:max-w-[500px]", showSidebar && "sm:max-w-[850px]")}>
                <DialogHeader>
                    <DialogTitle>Create New Investment</DialogTitle>
                    <DialogDescription>
                        Add details about your investment to track its growth.
                    </DialogDescription>
                </DialogHeader>

                <div className={cn("grid gap-6", showSidebar && "grid-cols-1 md:grid-cols-2")}>
                    {/* Main Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="type">Investment Type</Label>
                            <Select
                                value={formData.type}
                                onValueChange={(value) => setFormData({ ...formData, type: value as Investment["type"] })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                    {INVESTMENT_TYPES.map((type) => (
                                        <SelectItem key={type.value} value={type.value}>
                                            {type.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="name">Investment Name</Label>
                            <Input
                                id="name"
                                placeholder={showSidebar ? "Select from sidebar..." : "e.g., SBI FD, HDFC MF"}
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="amount">Amount Invested</Label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                        ₹
                                    </span>
                                    <Input
                                        id="amount"
                                        type="number"
                                        placeholder="0.00"
                                        className="pl-7"
                                        value={formData.amount}
                                        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Est. Annual Return</Label>
                                <div className="relative">
                                    <Input
                                        value={`${formData.currentValue}%`}
                                        readOnly
                                        className="bg-muted font-medium text-primary"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Risk Assessment</Label>
                            <div className={cn(
                                "flex items-start gap-3 p-3 rounded-lg border",
                                riskInfo.level === "low" && "bg-green-500/10 border-green-200 text-green-700",
                                riskInfo.level === "medium" && "bg-yellow-500/10 border-yellow-200 text-yellow-700",
                                riskInfo.level === "high" && "bg-red-500/10 border-red-200 text-red-700",
                            )}>
                                {riskInfo.level === "low" && <ShieldCheckIcon className="h-5 w-5 shrink-0 mt-0.5" />}
                                {riskInfo.level === "medium" && <TrendingUpIcon className="h-5 w-5 shrink-0 mt-0.5" />}
                                {riskInfo.level === "high" && <AlertTriangleIcon className="h-5 w-5 shrink-0 mt-0.5" />}
                                <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                        <p className="font-semibold capitalize">{riskInfo.level} Risk</p>
                                        <a
                                            href={riskInfo.source}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-xs flex items-center gap-1 hover:underline opacity-80 hover:opacity-100"
                                        >
                                            Learn more <ExternalLinkIcon className="h-3 w-3" />
                                        </a>
                                    </div>
                                    <p className="text-xs opacity-90 mt-0.5">{riskInfo.reason}</p>
                                </div>
                            </div>
                        </div>

                        <DialogFooter className={cn(showSidebar && "md:col-span-2")}>
                            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? "Adding..." : "Add Investment"}
                            </Button>
                        </DialogFooter>
                    </form>

                    {/* Sidebar Area */}
                    {showSidebar && (
                        <div className="border-l pl-6 space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="font-semibold flex items-center gap-2">
                                    {isCrypto ? <CoinsIcon className="h-4 w-4" /> : <BarChart3Icon className="h-4 w-4" />}
                                    {isCrypto ? "Popular Currencies" : "Top Stock Companies"}
                                </h3>
                                <button
                                    onClick={isCrypto ? fetchCryptoData : fetchStockData}
                                    disabled={isCrypto ? isCryptoLoading : isStockLoading}
                                    className="p-1 rounded-full hover:bg-muted transition-colors disabled:opacity-50"
                                >
                                    <RefreshCwIcon className={cn("h-4 w-4", (isCrypto ? isCryptoLoading : isStockLoading) && "animate-spin")} />
                                </button>
                            </div>

                            <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
                                {isCrypto ? (
                                    CRYPTO_COINS.map((coin) => {
                                        const market = cryptoData?.[coin.id]
                                        const change = market?.inr_24h_change ?? 0
                                        const isPositive = change >= 0

                                        return (
                                            <div
                                                key={coin.id}
                                                onClick={() => handleCryptoSelect(coin)}
                                                className="p-3 rounded-lg border bg-card hover:bg-accent/50 cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98]"
                                            >
                                                <div className="flex items-center justify-between mb-1">
                                                    <div className="font-medium">{coin.name}</div>
                                                    <div className="text-xs font-medium text-muted-foreground">{coin.symbol}</div>
                                                </div>
                                                <div className="flex items-center justify-between text-sm">
                                                    <div>
                                                        {market ? (
                                                            <span>₹{market.inr.toLocaleString()}</span>
                                                        ) : (
                                                            <span className="text-muted-foreground text-xs">Loading...</span>
                                                        )}
                                                    </div>
                                                    {market && (
                                                        <div className={cn("flex items-center text-xs", isPositive ? "text-green-600" : "text-red-600")}>
                                                            {isPositive ? <TrendingUpIcon className="h-3 w-3 mr-1" /> : <TrendingDownIcon className="h-3 w-3 mr-1" />}
                                                            {Math.abs(change).toFixed(2)}%
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="mt-1 text-xs text-muted-foreground flex justify-between border-t pt-1">
                                                    <span>Est. Return:</span>
                                                    <span className="font-medium text-foreground">{coin.defaultReturn}%</span>
                                                </div>
                                            </div>
                                        )
                                    })
                                ) : (
                                    SHORT_STOCKS.map((stock) => {
                                        const market = stockData?.[stock.symbol]
                                        const change = market?.change ?? 0
                                        const isPositive = change >= 0

                                        return (
                                            <div
                                                key={stock.id}
                                                onClick={() => handleStockSelect(stock)}
                                                className="p-3 rounded-lg border bg-card hover:bg-accent/50 cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98]"
                                            >
                                                <div className="flex items-center justify-between mb-1">
                                                    <div className="font-medium">{stock.name}</div>
                                                    <div className="text-xs font-medium text-muted-foreground">{stock.symbol}</div>
                                                </div>
                                                <div className="flex items-center justify-between text-sm">
                                                    <div>
                                                        {market ? (
                                                            <span>${market.price.toFixed(2)}</span>
                                                        ) : (
                                                            <span className="text-muted-foreground text-xs">Loading...</span>
                                                        )}
                                                    </div>
                                                    {market && (
                                                        <div className={cn("flex items-center text-xs", isPositive ? "text-green-600" : "text-red-600")}>
                                                            {isPositive ? <TrendingUpIcon className="h-3 w-3 mr-1" /> : <TrendingDownIcon className="h-3 w-3 mr-1" />}
                                                            {Math.abs(change).toFixed(2)}%
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="mt-1 text-xs text-muted-foreground flex justify-between border-t pt-1">
                                                    <span>Est. Return:</span>
                                                    <span className="font-medium text-foreground">{stock.defaultReturn}%</span>
                                                </div>
                                            </div>
                                        )
                                    })
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}
