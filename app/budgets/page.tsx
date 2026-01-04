"use client"

import { useEffect, useState } from "react"
import { storageUtils, type Budget, type Transaction } from "@/lib/storage"
import { formatCurrency } from "@/lib/currency"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeftIcon, PlusIcon } from "lucide-react"
import Link from "next/link"
import BudgetCard from "@/components/budget-card"
import AddBudgetModal from "@/components/add-budget-modal"

export default function BudgetsPage() {
  const [budgets, setBudgets] = useState<Budget[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [showAddModal, setShowAddModal] = useState(false)

  useEffect(() => {
    setBudgets(storageUtils.getBudgets())
    setTransactions(storageUtils.getTransactions())
  }, [])

  const handleAddBudget = (budget: Omit<Budget, "id">) => {
    storageUtils.addBudget(budget)
    setBudgets(storageUtils.getBudgets())
    setShowAddModal(false)
  }

  const handleDeleteBudget = (id: string) => {
    storageUtils.deleteBudget(id)
    setBudgets(storageUtils.getBudgets())
  }

  const calculateCategorySpent = (category: string) => {
    return transactions
      .filter((t) => t.type === "expense" && t.category === category)
      .reduce((sum, t) => sum + t.amount, 0)
  }

  const budsWithSpent = budgets.map((b) => ({
    ...b,
    spent: calculateCategorySpent(b.category),
  }))

  const exceededBudgets = budsWithSpent.filter((b) => b.spent > b.limit)
  const totalBudgeted = budgets.reduce((sum, b) => sum + b.limit, 0)
  const totalSpent = budsWithSpent.reduce((sum, b) => sum + b.spent, 0)
  const totalRemaining = totalBudgeted - totalSpent

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="icon">
                  <ArrowLeftIcon className="h-5 w-5" />
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-foreground">Budget Management</h1>
                <p className="mt-1 text-sm text-muted-foreground">Track and manage your spending limits</p>
              </div>
            </div>
            <Button onClick={() => setShowAddModal(true)} className="gap-2">
              <PlusIcon className="h-4 w-4" />
              Add Budget
            </Button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Budgeted</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-foreground">{formatCurrency(totalBudgeted)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Spent</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-destructive">{formatCurrency(totalSpent)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Remaining</CardTitle>
            </CardHeader>
            <CardContent>
              <p className={`text-2xl font-bold ${totalRemaining >= 0 ? "text-accent" : "text-destructive"}`}>
                {formatCurrency(totalRemaining)}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Budgets</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-foreground">{budgets.length}</p>
              {exceededBudgets.length > 0 && (
                <p className="mt-1 text-xs text-destructive">{exceededBudgets.length} over budget</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Alerts Section */}
        {exceededBudgets.length > 0 && (
          <Card className="mt-8 border-destructive/50 bg-destructive/5">
            <CardHeader>
              <CardTitle className="text-destructive">Budget Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {exceededBudgets.map((budget) => (
                  <div key={budget.id} className="text-sm text-destructive">
                    <strong>{budget.category}</strong> is {formatCurrency(budget.spent - budget.limit)} over budget
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Budgets Grid */}
        <div className="mt-8">
          <h2 className="mb-4 text-xl font-semibold text-foreground">Your Budgets</h2>
          {budgets.length === 0 ? (
            <Card>
              <CardContent className="py-12">
                <div className="text-center">
                  <p className="mb-4 text-muted-foreground">No budgets yet</p>
                  <Button onClick={() => setShowAddModal(true)} className="gap-2">
                    <PlusIcon className="h-4 w-4" />
                    Create Your First Budget
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {budsWithSpent.map((budget) => (
                <BudgetCard key={budget.id} budget={budget} onDelete={handleDeleteBudget} />
              ))}
            </div>
          )}
        </div>
      </div>

      {showAddModal && <AddBudgetModal onAdd={handleAddBudget} onClose={() => setShowAddModal(false)} />}
    </div>
  )
}
