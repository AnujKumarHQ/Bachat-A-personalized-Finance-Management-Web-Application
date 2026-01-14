"use client"

import { useEffect, useState } from "react"
import { type Budget, type Transaction } from "@/lib/storage"
import { useCurrency } from "@/components/currency-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeftIcon, PlusIcon, WalletIcon, AlertTriangleIcon, CheckCircleIcon } from "lucide-react"
import Link from "next/link"
import BudgetCard from "@/components/budget-card"
import AddBudgetModal from "@/components/add-budget-modal"
import EditBudgetModal from "@/components/edit-budget-modal"
import { fetchBudgets, addBudget as addBudgetDb, updateBudget as updateBudgetDb, deleteBudget as deleteBudgetDb, fetchTransactions } from "@/lib/data"

export default function BudgetsPage() {
  const [budgets, setBudgets] = useState<Budget[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null)
  const { formatAmount } = useCurrency()

  useEffect(() => {
    ; (async () => {
      const [buds, txns] = await Promise.all([fetchBudgets(), fetchTransactions()])
      setBudgets(buds as any)
      setTransactions(txns as any)
    })()
  }, [])

  const handleAddBudget = async (budget: Omit<Budget, "id">) => {
    await addBudgetDb({ category: budget.category, limit: budget.limit, month: budget.month })
    const buds = await fetchBudgets()
    setBudgets(buds as any)
    setShowAddModal(false)
  }

  const handleDeleteBudget = async (id: string) => {
    await deleteBudgetDb(id)
    const buds = await fetchBudgets()
    setBudgets(buds as any)
  }

  const handleUpdateBudget = async (id: string, updates: Partial<Budget>) => {
    await updateBudgetDb(id, updates)
    const buds = await fetchBudgets()
    setBudgets(buds as any)
    setEditingBudget(null)
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
                <h1 className="text-2xl font-bold text-foreground">Budget Management</h1>
                <p className="text-sm text-muted-foreground">Track and manage your spending limits</p>
              </div>
            </div>
            <Button onClick={() => setShowAddModal(true)} className="gap-2">
              <PlusIcon className="h-4 w-4" />
              Add Budget
            </Button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-200/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Budgeted</CardTitle>
              <WalletIcon className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{formatAmount(totalBudgeted)}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Across {budgets.length} categories
              </p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-red-500/10 to-red-600/5 border-red-200/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Spent</CardTitle>
              <AlertTriangleIcon className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{formatAmount(totalSpent)}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {Math.round((totalSpent / (totalBudgeted || 1)) * 100)}% of total budget
              </p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-200/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Remaining</CardTitle>
              <CheckCircleIcon className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${totalRemaining >= 0 ? "text-green-600" : "text-red-600"}`}>
                {formatAmount(totalRemaining)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Available to spend
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Alerts Section */}
        {exceededBudgets.length > 0 && (
          <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
            <div className="flex items-center gap-2 text-destructive mb-2">
              <AlertTriangleIcon className="h-5 w-5" />
              <h3 className="font-semibold">Budget Alerts</h3>
            </div>
            <div className="space-y-1">
              {exceededBudgets.map((budget) => (
                <p key={budget.id} className="text-sm text-destructive/90">
                  You have exceeded your <strong>{budget.category}</strong> budget by {formatAmount(budget.spent - budget.limit)}
                </p>
              ))}
            </div>
          </div>
        )}

        {/* Budgets Grid */}
        <div>
          <h2 className="mb-4 text-lg font-semibold text-foreground">Your Budgets</h2>
          {budgets.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                <div className="rounded-full bg-muted p-4 mb-4">
                  <WalletIcon className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold">No budgets set</h3>
                <p className="text-sm text-muted-foreground max-w-sm mt-1 mb-6">
                  Create a budget to track your spending and save more money.
                </p>
                <Button onClick={() => setShowAddModal(true)} className="gap-2">
                  <PlusIcon className="h-4 w-4" />
                  Create Your First Budget
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {budsWithSpent.map((budget) => (
                <BudgetCard
                  key={budget.id}
                  budget={budget}
                  onDelete={handleDeleteBudget}
                  onEdit={setEditingBudget}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {showAddModal && <AddBudgetModal onAdd={handleAddBudget} onClose={() => setShowAddModal(false)} />}

      {editingBudget && (
        <EditBudgetModal
          budget={editingBudget}
          onUpdate={handleUpdateBudget}
          onClose={() => setEditingBudget(null)}
        />
      )}
    </div>
  )
}
