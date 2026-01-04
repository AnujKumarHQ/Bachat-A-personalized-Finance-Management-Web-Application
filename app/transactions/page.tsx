"use client"

import { useEffect, useState } from "react"
import { storageUtils, type Transaction } from "@/lib/storage"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeftIcon, PlusIcon } from "lucide-react"
import Link from "next/link"
import TransactionList from "@/components/transaction-list"
import TransactionFilters from "@/components/transaction-filters"
import AddTransactionModal from "@/components/add-transaction-modal"
import { formatCurrency } from "@/lib/currency"

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [showAddModal, setShowAddModal] = useState(false)
  const [filterType, setFilterType] = useState<"all" | "income" | "expense">("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [dateRange, setDateRange] = useState<[string, string]>(["", ""])

  useEffect(() => {
    setTransactions(storageUtils.getTransactions())
  }, [])

  const handleAddTransaction = (transaction: Omit<Transaction, "id">) => {
    storageUtils.addTransaction(transaction)
    setTransactions(storageUtils.getTransactions())
    setShowAddModal(false)
  }

  const handleDeleteTransaction = (id: string) => {
    storageUtils.deleteTransaction(id)
    setTransactions(storageUtils.getTransactions())
  }

  // Filter transactions
  let filtered = transactions

  if (filterType !== "all") {
    filtered = filtered.filter((t) => t.type === filterType)
  }

  if (searchQuery) {
    filtered = filtered.filter(
      (t) =>
        t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.category.toLowerCase().includes(searchQuery.toLowerCase()),
    )
  }

  if (dateRange[0]) {
    filtered = filtered.filter((t) => new Date(t.date) >= new Date(dateRange[0]))
  }

  if (dateRange[1]) {
    filtered = filtered.filter((t) => new Date(t.date) <= new Date(dateRange[1]))
  }

  // Calculate stats
  const totalIncome = filtered.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0)

  const totalExpense = filtered.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0)

  const categoryBreakdown = filtered.reduce(
    (acc, t) => {
      if (!acc[t.category]) {
        acc[t.category] = { income: 0, expense: 0 }
      }
      if (t.type === "income") {
        acc[t.category].income += t.amount
      } else {
        acc[t.category].expense += t.amount
      }
      return acc
    },
    {} as Record<string, { income: number; expense: number }>,
  )

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
                <h1 className="text-3xl font-bold text-foreground">All Transactions</h1>
                <p className="mt-1 text-sm text-muted-foreground">Showing {filtered.length} transactions</p>
              </div>
            </div>
            <Button onClick={() => setShowAddModal(true)} className="gap-2">
              <PlusIcon className="h-4 w-4" />
              Add Transaction
            </Button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Income</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-accent">{formatCurrency(totalIncome)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Expenses</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-destructive">{formatCurrency(totalExpense)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Net</CardTitle>
            </CardHeader>
            <CardContent>
              <p
                className={`text-2xl font-bold ${totalIncome - totalExpense >= 0 ? "text-accent" : "text-destructive"}`}
              >
                {formatCurrency(totalIncome - totalExpense)}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-4">
          {/* Filters */}
          <div className="lg:col-span-1">
            <TransactionFilters
              filterType={filterType}
              onFilterTypeChange={setFilterType}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              dateRange={dateRange}
              onDateRangeChange={setDateRange}
            />
          </div>

          {/* Transaction List */}
          <div className="lg:col-span-3">
            <TransactionList transactions={filtered} onDelete={handleDeleteTransaction} />

            {/* Category Breakdown */}
            {Object.keys(categoryBreakdown).length > 0 && (
              <Card className="mt-8">
                <CardHeader>
                  <CardTitle>Category Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(categoryBreakdown).map(([category, values]) => (
                      <div
                        key={category}
                        className="flex items-center justify-between rounded-lg border border-border p-3"
                      >
                        <span className="font-medium text-foreground">{category}</span>
                        <div className="flex gap-4">
                          {values.income > 0 && (
                            <span className="text-sm text-accent">{formatCurrency(values.income)}</span>
                          )}
                          {values.expense > 0 && (
                            <span className="text-sm text-destructive">-{formatCurrency(values.expense)}</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {showAddModal && <AddTransactionModal onAdd={handleAddTransaction} onClose={() => setShowAddModal(false)} />}
    </div>
  )
}
