import { NextResponse } from "next/server"

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const symbols = searchParams.get("symbols")
    const range = searchParams.get("range") || "7d"
    const interval = searchParams.get("interval") || "60m"

    if (!symbols) {
        return NextResponse.json({ error: "Symbols parameter is required" }, { status: 400 })
    }

    const symbolList = symbols.split(",")

    try {
        const requests = symbolList.map(async (symbol) => {
            const response = await fetch(
                `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=${interval}&range=${range}`,
                {
                    headers: {
                        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
                    },
                    cache: 'no-store'
                }
            )

            if (!response.ok) return null

            const data = await response.json()
            const result = data.chart?.result?.[0]

            if (!result) return null

            const meta = result.meta
            const quotes = result.indicators?.quote?.[0]
            const timestamp = result.timestamp || []

            const history: { date: string, value: number }[] = []

            if (quotes?.close) {
                quotes.close.forEach((price: number | null, index: number) => {
                    if (price !== null && timestamp[index]) {
                        history.push({
                            date: new Date(timestamp[index] * 1000).toISOString(),
                            value: price
                        })
                    }
                })
            }

            // Calculate change if not provided directly
            const currentPrice = meta.regularMarketPrice
            const previousClose = meta.chartPreviousClose
            const changePercent = previousClose ? ((currentPrice - previousClose) / previousClose) * 100 : 0

            return {
                symbol: symbol,
                data: {
                    price: currentPrice,
                    change: changePercent,
                    history: history, // Return full objects with date for the modal
                    simpleHistory: history.map(h => h.value) // Keep simple array for sparklines
                }
            }
        })

        const results = await Promise.all(requests)

        const formattedData: Record<string, { price: number; change: number; history: { date: string, value: number }[]; simpleHistory: number[] }> = {}

        results.forEach(item => {
            if (item) {
                formattedData[item.symbol] = item.data
            }
        })

        return NextResponse.json(formattedData)
    } catch (error: any) {
        console.warn("Failed to fetch stock data from Yahoo, using fallback data:", error.message)

        // Fallback Mock Data with simulated history
        const MOCK_DATA = {
            AAPL: { price: 228.22, change: 0.5 },
            MSFT: { price: 415.30, change: -0.2 },
            GOOGL: { price: 175.40, change: 1.2 },
            AMZN: { price: 185.60, change: 0.8 },
            TSLA: { price: 230.12, change: 4.5 },
            NVDA: { price: 125.50, change: 2.5 },
            META: { price: 495.20, change: -0.5 }
        } as any

        const fallbackResponse: any = {}
        const now = new Date()

        symbolList.forEach((s: string) => {
            if (MOCK_DATA[s]) {
                const basePrice = MOCK_DATA[s].price
                const history = Array.from({ length: 20 }, (_, i) => {
                    const date = new Date(now.getTime() - (20 - i) * 3600 * 1000)
                    const value = basePrice * (1 + (Math.random() * 0.1 - 0.05))
                    return {
                        date: date.toISOString(),
                        value
                    }
                })

                fallbackResponse[s] = {
                    ...MOCK_DATA[s],
                    history,
                    simpleHistory: history.map(h => h.value)
                }
            }
        })

        if (Object.keys(fallbackResponse).length > 0) {
            return NextResponse.json(fallbackResponse)
        }

        return NextResponse.json({ error: "Failed to fetch stock data", details: error.message }, { status: 500 })
    }
}
