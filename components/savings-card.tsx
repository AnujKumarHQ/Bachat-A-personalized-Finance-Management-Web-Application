"use client"

import { useState } from "react"
import type { UISavings } from "@/lib/data"
import { useCurrency } from "@/components/currency-provider"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { TrashIcon, Target, PlusIcon, CalendarIcon, PencilIcon, CheckIcon, XIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { updateSavings } from "@/lib/data"

interface SavingsCardProps {
    savings: UISavings
    onDelete: (id: string) => void
    onUpdate: () => void
}

export default function SavingsCard({ savings, onDelete, onUpdate }: SavingsCardProps) {
    const { formatAmount } = useCurrency()
    const [isAddingMoney, setIsAddingMoney] = useState(false)
    const [addAmount, setAddAmount] = useState("")
    const [isSaving, setIsSaving] = useState(false)

    const progressPercent = Math.min((savings.currentAmount / savings.targetAmount) * 100, 100)
    const remaining = savings.targetAmount - savings.currentAmount
    const isCompleted = savings.currentAmount >= savings.targetAmount

    const handleAddMoney = async () => {
        if (!addAmount || isNaN(Number(addAmount))) return

        setIsSaving(true)
        try {
            const newAmount = savings.currentAmount + Number(addAmount)
            await updateSavings(savings.id, { currentAmount: newAmount })
            onUpdate()
            setIsAddingMoney(false)
            setAddAmount("")
        } catch (error) {
            console.error("Failed to update savings:", error)
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <Card className="overflow-hidden shadow-md transition-all hover:shadow-lg group">
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                    <div className="space-y-1">
                        <CardTitle className="flex items-center gap-2 text-base">
                            <div className={cn("p-2 rounded-lg", isCompleted ? "bg-green-100 text-green-600" : "bg-primary/10 text-primary")}>
                                <Target className="h-4 w-4" />
                            </div>
                            {savings.goalName}
                        </CardTitle>
                        {savings.description && (
                            <CardDescription className="line-clamp-1 text-xs">
                                {savings.description}
                            </CardDescription>
                        )}
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDelete(savings.id)}
                        className="h-8 w-8 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 hover:text-destructive hover:bg-destructive/10"
                    >
                        <TrashIcon className="h-4 w-4" />
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Progress</span>
                        <span className={cn("font-semibold", isCompleted ? "text-green-600" : "text-primary")}>
                            {Math.round(progressPercent)}%
                        </span>
                    </div>
                    <Progress
                        value={progressPercent}
                        className="h-2"
                    // indicatorClassName={isCompleted ? "bg-green-500" : "bg-primary"} 
                    />
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <p className="text-muted-foreground text-xs">Saved</p>
                        <p className="font-bold text-foreground">{formatAmount(savings.currentAmount)}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-muted-foreground text-xs">Target</p>
                        <p className="font-bold text-foreground">{formatAmount(savings.targetAmount)}</p>
                    </div>
                </div>

                {isAddingMoney ? (
                    <div className="flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
                        <div className="relative flex-1">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">
                                +
                            </span>
                            <Input
                                type="number"
                                placeholder="Amount"
                                value={addAmount}
                                onChange={(e) => setAddAmount(e.target.value)}
                                className="pl-6 h-9 text-sm"
                                autoFocus
                            />
                        </div>
                        <Button size="icon" className="h-9 w-9" onClick={handleAddMoney} disabled={isSaving}>
                            <CheckIcon className="h-4 w-4" />
                        </Button>
                        <Button
                            size="icon"
                            variant="ghost"
                            className="h-9 w-9"
                            onClick={() => {
                                setIsAddingMoney(false)
                                setAddAmount("")
                            }}
                        >
                            <XIcon className="h-4 w-4" />
                        </Button>
                    </div>
                ) : (
                    <Button
                        variant="outline"
                        className="w-full gap-2 border-dashed hover:border-solid hover:bg-primary/5 hover:text-primary"
                        onClick={() => setIsAddingMoney(true)}
                        disabled={isCompleted}
                    >
                        <PlusIcon className="h-4 w-4" />
                        {isCompleted ? "Goal Reached!" : "Add Money"}
                    </Button>
                )}

                {savings.targetDate && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground border-t border-border/50 pt-3">
                        <CalendarIcon className="h-3 w-3" />
                        <span>Target: {new Date(savings.targetDate).toLocaleDateString()}</span>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
