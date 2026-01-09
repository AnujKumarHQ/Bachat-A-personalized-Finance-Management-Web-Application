"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import { supabaseBrowser } from "@/lib/supabase/client"

type Currency = "INR" | "USD" | "EUR" | "GBP" | "JPY"

interface CurrencyContextType {
    currency: Currency
    setCurrency: (currency: Currency) => Promise<void>
    formatAmount: (amount: number) => string
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined)

const CURRENCY_LOCALES: Record<Currency, string> = {
    INR: "en-IN",
    USD: "en-US",
    EUR: "de-DE",
    GBP: "en-GB",
    JPY: "ja-JP",
}

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
    const [currency, setCurrencyState] = useState<Currency>("INR")
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        loadCurrency()
    }, [])

    const loadCurrency = async () => {
        try {
            const { data: { user } } = await supabaseBrowser.auth.getUser()
            if (user) {
                const { data } = await supabaseBrowser
                    .from("profiles")
                    .select("currency")
                    .eq("id", user.id)
                    .single()

                if (data?.currency) {
                    setCurrencyState(data.currency as Currency)
                }
            }
        } catch (error) {
            console.error("Failed to load currency preference:", error)
        } finally {
            setIsLoading(false)
        }
    }

    const setCurrency = async (newCurrency: Currency) => {
        setCurrencyState(newCurrency)
        try {
            const { data: { user } } = await supabaseBrowser.auth.getUser()
            if (user) {
                await supabaseBrowser
                    .from("profiles")
                    .update({ currency: newCurrency })
                    .eq("id", user.id)
            }
        } catch (error) {
            console.error("Failed to save currency preference:", error)
        }
    }

    const formatAmount = (amount: number) => {
        return new Intl.NumberFormat(CURRENCY_LOCALES[currency], {
            style: "currency",
            currency: currency,
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount)
    }

    return (
        <CurrencyContext.Provider value={{ currency, setCurrency, formatAmount }}>
            {children}
        </CurrencyContext.Provider>
    )
}

export function useCurrency() {
    const context = useContext(CurrencyContext)
    if (context === undefined) {
        throw new Error("useCurrency must be used within a CurrencyProvider")
    }
    return context
}
