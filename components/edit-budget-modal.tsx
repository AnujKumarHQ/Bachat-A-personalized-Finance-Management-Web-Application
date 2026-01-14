"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { Budget } from "@/lib/storage"

interface EditBudgetModalProps {
    budget: Budget
    onUpdate: (id: string, updates: Partial<Budget>) => Promise<void>
    onClose: () => void
}

export default function EditBudgetModal({ budget, onUpdate, onClose }: EditBudgetModalProps) {
    const [limit, setLimit] = useState(String(budget.limit))
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!limit) return

        setIsLoading(true)
        try {
            await onUpdate(budget.id, {
                limit: Number.parseFloat(limit),
            })
            onClose()
        } catch (error) {
            console.error("Failed to update budget:", error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Dialog open={true} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit Budget Limit</DialogTitle>
                    <DialogDescription>
                        Update your monthly spending limit for {budget.category}.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="category">Category</Label>
                        <Input
                            id="category"
                            value={budget.category}
                            disabled
                            className="bg-muted"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="limit">Monthly Limit</Label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                ₹
                            </span>
                            <Input
                                id="limit"
                                type="number"
                                step="0.01"
                                placeholder="0.00"
                                className="pl-7"
                                value={limit}
                                onChange={(e) => setLimit(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="month">Month</Label>
                        <Input
                            id="month"
                            type="month"
                            value={budget.month}
                            disabled
                            className="bg-muted"
                        />
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? "Saving..." : "Save Changes"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
