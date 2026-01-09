"use client"
"use client"
"use client"
"use client"
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
import { AlertTriangleIcon, ShieldCheckIcon, TrendingUpIcon, ExternalLinkIcon } from "lucide-react"
import { cn } from "@/lib/utils"

const INVESTMENT_TYPES = [
    { value: "fd", label: "Fixed Deposit (FD)" },
    { value: "ppf", label: "Public Provident Fund (PPF)" },
    { value: "mutual_fund", label: "Mutual Fund" },
    { value: "stocks", label: "Stocks" },
    { value: "nps", label: "National Pension Scheme (NPS)" },
    { value: "bonds", label: "Government Bonds" },
    { value: "gold", label: "Gold" },
    { value: "crypto", label: "Cryptocurrency (Bitcoin)" },
    { value: "others", label: "Others" },
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

interface AddInvestmentModalProps {
    onAdd: (investment: Omit<Investment, "id">) => Promise<void>
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

    useEffect(() => {
        if (formData.type) {
            const annualReturn = getAnnualReturnPercentage(formData.type)
            const risk = getRiskAssessment(formData.type)
            setFormData((prev) => ({
                ...prev,
                currentValue: annualReturn.toString(),
                riskLevel: risk.level,
            }))
        }
    }, [formData.type])

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

    const riskInfo = getRiskAssessment(formData.type)

    return (
        <Dialog open={true} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Create New Investment</DialogTitle>
                    <DialogDescription>
                        Add details about your investment to track its growth.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Investment Name</Label>
                        <Input
                            id="name"
                            placeholder="e.g., SBI FD, HDFC MF, Bitcoin"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                    </div>

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

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? "Adding..." : "Add Investment"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
