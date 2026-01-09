"use client"

import { useState } from "react"
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
import { Textarea } from "@/components/ui/textarea"

interface AddSavingsModalProps {
    onAdd: (data: any) => Promise<void>
    onClose: () => void
}

export default function AddSavingsModal({ onAdd, onClose }: AddSavingsModalProps) {
    const [formData, setFormData] = useState({
        goalName: "",
        targetAmount: "",
        currentAmount: "",
        targetDate: "",
        description: "",
    })
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!formData.goalName || !formData.targetAmount) return

        setIsLoading(true)
        try {
            await onAdd({
                goalName: formData.goalName,
                targetAmount: Number(formData.targetAmount),
                currentAmount: Number(formData.currentAmount) || 0,
                targetDate: formData.targetDate,
                description: formData.description,
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Dialog open={true} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Create New Savings Goal</DialogTitle>
                    <DialogDescription>
                        Set a target and start saving for your future.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="goalName">Goal Name</Label>
                        <Input
                            id="goalName"
                            placeholder="e.g., Vacation, New Car"
                            value={formData.goalName}
                            onChange={(e) => setFormData({ ...formData, goalName: e.target.value })}
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="targetAmount">Target Amount</Label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                    ₹
                                </span>
                                <Input
                                    id="targetAmount"
                                    type="number"
                                    placeholder="0.00"
                                    className="pl-7"
                                    value={formData.targetAmount}
                                    onChange={(e) => setFormData({ ...formData, targetAmount: e.target.value })}
                                    required
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="currentAmount">Current Savings</Label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                    ₹
                                </span>
                                <Input
                                    id="currentAmount"
                                    type="number"
                                    placeholder="0.00"
                                    className="pl-7"
                                    value={formData.currentAmount}
                                    onChange={(e) => setFormData({ ...formData, currentAmount: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="targetDate">Target Date</Label>
                        <Input
                            id="targetDate"
                            type="date"
                            value={formData.targetDate}
                            onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description (Optional)</Label>
                        <Textarea
                            id="description"
                            placeholder="Add notes about your goal..."
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? "Creating..." : "Create Goal"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
