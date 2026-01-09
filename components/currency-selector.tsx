"use client"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useCurrency } from "@/components/currency-provider"

export default function CurrencySelector() {
    const { currency, setCurrency } = useCurrency()

    return (
        <Select value={currency} onValueChange={(val: any) => setCurrency(val)}>
            <SelectTrigger className="w-[100px] h-9 bg-background/50 backdrop-blur-sm border-border/50">
                <SelectValue placeholder="Currency" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="INR">🇮🇳 INR</SelectItem>
                <SelectItem value="USD">🇺🇸 USD</SelectItem>
                <SelectItem value="EUR">🇪🇺 EUR</SelectItem>
                <SelectItem value="GBP">🇬🇧 GBP</SelectItem>
                <SelectItem value="JPY">🇯🇵 JPY</SelectItem>
            </SelectContent>
        </Select>
    )
}
