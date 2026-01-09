"use client"

import { useEffect, useState } from "react"
import { fetchSavings, addSavings, deleteSavings, type UISavings } from "@/lib/data"
import { useCurrency } from "@/components/currency-provider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ArrowLeftIcon, PlusIcon, Target, TrendingUpIcon, CalendarIcon } from "lucide-react"
import Link from "next/link"
import SavingsCard from "@/components/savings-card"
import AddSavingsModal from "@/components/add-savings-modal"

export default function SavingsPage() {
  const [savings, setSavings] = useState<UISavings[]>([])
  const [showAddModal, setShowAddModal] = useState(false)
  const { formatAmount } = useCurrency()

  const loadSavings = async () => {
    const data = await fetchSavings()
    setSavings(data)
  }

  useEffect(() => {
    loadSavings()
  }, [])

  const handleAddSavings = async (data: any) => {
    await addSavings(data)
    await loadSavings()
    setShowAddModal(false)
  }

  const handleDeleteSavings = async (id: string) => {
    await deleteSavings(id)
    await loadSavings()
  }

  const totalTarget = savings.reduce((sum, s) => sum + s.targetAmount, 0)
  const totalSaved = savings.reduce((sum, s) => sum + s.currentAmount, 0)
  const overallProgress = totalTarget > 0 ? (totalSaved / totalTarget) * 100 : 0

  return (
    <div className="min-h-screen bg-background pb-12">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="icon" className="-ml-2">
                  <ArrowLeftIcon className="h-5 w-5" />
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Savings Goals</h1>
                <p className="text-sm text-muted-foreground">Track your savings and reach your financial goals</p>
              </div>
            </div>
            <Button onClick={() => setShowAddModal(true)} className="gap-2">
              <PlusIcon className="h-4 w-4" />
              New Goal
            </Button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-200/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Saved</CardTitle>
              <TrendingUpIcon className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{formatAmount(totalSaved)}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Across {savings.length} active goals
              </p>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">Overall Progress</CardTitle>
                <span className="text-sm font-bold text-foreground">{Math.round(overallProgress)}%</span>
              </div>
            </CardHeader>
            <CardContent>
              <Progress value={overallProgress} className="h-3 mb-2" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{formatAmount(totalSaved)} saved</span>
                <span>Target: {formatAmount(totalTarget)}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Savings Goals Grid */}
        <div>
          <h2 className="mb-4 text-lg font-semibold text-foreground">Your Goals</h2>
          {savings.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                <div className="rounded-full bg-muted p-4 mb-4">
                  <Target className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold">No savings goals yet</h3>
                <p className="text-sm text-muted-foreground max-w-sm mt-1 mb-6">
                  Create a goal to start saving for your dream vacation, new car, or emergency fund.
                </p>
                <Button onClick={() => setShowAddModal(true)} className="gap-2">
                  <PlusIcon className="h-4 w-4" />
                  Create Your First Goal
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {savings.map((goal) => (
                <SavingsCard
                  key={goal.id}
                  savings={goal}
                  onDelete={handleDeleteSavings}
                  onUpdate={loadSavings}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {showAddModal && <AddSavingsModal onAdd={handleAddSavings} onClose={() => setShowAddModal(false)} />}
    </div>
  )
}
