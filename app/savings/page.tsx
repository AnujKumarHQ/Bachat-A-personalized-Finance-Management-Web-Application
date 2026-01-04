"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { storageUtils, type Savings } from "@/lib/storage"
import { formatCurrency } from "@/lib/currency"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { TrashIcon, PlusIcon, Target } from "lucide-react"
import Link from "next/link"

export default function SavingsPage() {
  const [savings, setSavings] = useState<Savings[]>([])
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    goalName: "",
    targetAmount: "",
    currentAmount: "",
    targetDate: "",
    description: "",
  })

  useEffect(() => {
    setSavings(storageUtils.getSavings())
  }, [])

  const handleAddSavings = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.goalName || !formData.targetAmount) return

    storageUtils.addSavings({
      goalName: formData.goalName,
      targetAmount: Number(formData.targetAmount),
      currentAmount: Number(formData.currentAmount) || 0,
      targetDate: formData.targetDate,
      description: formData.description,
    })

    setSavings(storageUtils.getSavings())
    setFormData({ goalName: "", targetAmount: "", currentAmount: "", targetDate: "", description: "" })
    setShowForm(false)
  }

  const handleDeleteSavings = (id: string) => {
    storageUtils.deleteSavings(id)
    setSavings(storageUtils.getSavings())
  }

  const totalTarget = savings.reduce((sum, s) => sum + s.targetAmount, 0)
  const totalSaved = savings.reduce((sum, s) => sum + s.currentAmount, 0)
  const overallProgress = totalTarget > 0 ? (totalSaved / totalTarget) * 100 : 0

  return (
    <main className="min-h-screen bg-background">
      <div className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <Link href="/">
            <Button variant="outline" className="mb-4 bg-transparent">
              ← Back to Dashboard
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-foreground">Savings Goals</h1>
          <p className="mt-1 text-sm text-muted-foreground">Track your savings and reach your financial goals</p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Overall Progress */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Overall Savings Progress</CardTitle>
            <CardDescription>Combined progress across all your saving goals</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="mb-2 flex justify-between">
                  <span className="text-sm font-medium text-foreground">Total Saved</span>
                  <span className="text-sm font-bold text-accent">{formatCurrency(totalSaved)}</span>
                </div>
                <Progress value={overallProgress} className="h-3" />
                <div className="mt-2 text-xs text-muted-foreground">
                  {formatCurrency(totalSaved)} of {formatCurrency(totalTarget)} ({Math.round(overallProgress)}%)
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Add Savings Button */}
        {!showForm && (
          <Button onClick={() => setShowForm(true)} className="mb-8 gap-2">
            <PlusIcon className="h-4 w-4" />
            Add Savings Goal
          </Button>
        )}

        {/* Add Savings Form */}
        {showForm && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Create New Savings Goal</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddSavings} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Goal Name</label>
                  <Input
                    placeholder="e.g., Vacation, Car, House"
                    value={formData.goalName}
                    onChange={(e) => setFormData({ ...formData, goalName: e.target.value })}
                    required
                  />
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Target Amount (INR)</label>
                    <Input
                      type="number"
                      placeholder="50000"
                      value={formData.targetAmount}
                      onChange={(e) => setFormData({ ...formData, targetAmount: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Current Amount (INR)</label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={formData.currentAmount}
                      onChange={(e) => setFormData({ ...formData, currentAmount: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Target Date</label>
                  <Input
                    type="date"
                    value={formData.targetDate}
                    onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Description</label>
                  <Textarea
                    placeholder="Add notes about your goal..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
                <div className="flex gap-3">
                  <Button type="submit">Save Goal</Button>
                  <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Savings Goals Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {savings.map((goal) => {
            const progressPercent = (goal.currentAmount / goal.targetAmount) * 100
            const remaining = goal.targetAmount - goal.currentAmount

            return (
              <Card key={goal.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="flex items-center gap-2">
                        <Target className="h-5 w-5 text-primary" />
                        {goal.goalName}
                      </CardTitle>
                      {goal.description && <CardDescription className="mt-1">{goal.description}</CardDescription>}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteSavings(goal.id)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-semibold">{Math.round(progressPercent)}%</span>
                    </div>
                    <Progress value={progressPercent} className="h-2" />
                  </div>

                  <div className="grid gap-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Saved</span>
                      <span className="font-semibold text-accent">{formatCurrency(goal.currentAmount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Target</span>
                      <span className="font-semibold text-foreground">{formatCurrency(goal.targetAmount)}</span>
                    </div>
                    <div className="flex justify-between border-t border-border pt-2">
                      <span className="text-muted-foreground">Remaining</span>
                      <span className={`font-bold ${remaining <= 0 ? "text-accent" : "text-destructive"}`}>
                        {formatCurrency(remaining)}
                      </span>
                    </div>
                  </div>

                  {goal.targetDate && (
                    <div className="text-xs text-muted-foreground">
                      Target Date: {new Date(goal.targetDate).toLocaleDateString("en-IN")}
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>

        {savings.length === 0 && (
          <div className="rounded-lg border border-dashed border-border bg-muted/20 py-12 text-center">
            <Target className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-2 font-semibold text-foreground">No Savings Goals Yet</h3>
            <p className="mt-1 text-sm text-muted-foreground">Create your first savings goal to get started</p>
          </div>
        )}
      </div>
    </main>
  )
}
