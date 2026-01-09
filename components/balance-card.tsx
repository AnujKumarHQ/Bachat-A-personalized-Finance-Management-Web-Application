"use client"
"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { WalletIcon, Edit2Icon, CheckIcon, XIcon } from "lucide-react"
import { updateBalance } from "@/lib/data"
import { useCurrency } from "@/components/currency-provider"

interface BalanceCardProps {
    balance: number
    onBalanceUpdate: (newBalance: number) => void
    className?: string
}

export default function BalanceCard({ balance, onBalanceUpdate, className }: BalanceCardProps) {
    const [isEditing, setIsEditing] = useState(false)
    const [tempBalance, setTempBalance] = useState(balance.toString())
    const [isSaving, setIsSaving] = useState(false)
    const { formatAmount } = useCurrency()

    const handleSave = async () => {
        try {
            setIsSaving(true)
            const newBalance = parseFloat(tempBalance)
            if (isNaN(newBalance)) return

            const saved = await updateBalance(newBalance)
            if (saved !== null) {
                onBalanceUpdate(saved)
                setIsEditing(false)
            }
        } catch (error) {
            console.error("Failed to save balance:", error)
        } finally {
            setIsSaving(false)
        }
    }

    const handleCancel = () => {
        setTempBalance(balance.toString())
        setIsEditing(false)
    }

    return (
        <Card className={`bg-primary text-primary-foreground overflow-hidden relative ${className}`}>
            <div className="absolute right-0 top-0 p-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-3xl" />
            <div className="absolute left-0 bottom-0 p-32 bg-black/10 rounded-full -ml-16 -mb-16 blur-3xl" />

            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                <CardTitle className="text-sm font-medium text-primary-foreground/90 flex items-center gap-2">
                    <WalletIcon className="h-4 w-4" />
                    Total Balance
                </CardTitle>
                {!isEditing && (
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-primary-foreground hover:bg-white/20 hover:text-white"
                        onClick={() => {
                            setTempBalance(balance.toString())
                            setIsEditing(true)
                        }}
                    >
                        <Edit2Icon className="h-4 w-4" />
                    </Button>
                )}
            </CardHeader>
            <CardContent className="relative z-10">
                {isEditing ? (
                    <div className="flex items-center gap-2">
                        <div className="relative flex-1">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-primary">
                                {formatAmount(0).replace(/[0-9.,\s]/g, '')}
                            </span>
                            <Input
                                type="number"
                                value={tempBalance}
                                onChange={(e) => setTempBalance(e.target.value)}
                                className="pl-7 bg-white text-primary border-none h-10 font-bold text-lg"
                                autoFocus
                            />
                        </div>
                        <Button
                            size="icon"
                            className="h-10 w-10 bg-white/20 hover:bg-white/30 text-white border-none"
                            onClick={handleSave}
                            disabled={isSaving}
                        >
                            <CheckIcon className="h-4 w-4" />
                        </Button>
                        <Button
                            size="icon"
                            className="h-10 w-10 bg-white/20 hover:bg-white/30 text-white border-none"
                            onClick={handleCancel}
                            disabled={isSaving}
                        >
                            <XIcon className="h-4 w-4" />
                        </Button>
                    </div>
                ) : (
                    <div className="flex flex-col">
                        <span className="text-4xl font-bold tracking-tight">
                            {formatAmount(balance)}
                        </span>
                        <span className="text-xs text-primary-foreground/70 mt-1">
                            Available to spend
                        </span>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
