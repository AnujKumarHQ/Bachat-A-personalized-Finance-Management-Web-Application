"use client"

import { useEffect, useState } from "react"
<<<<<<< HEAD
import { storageUtils, type Transaction } from "@/lib/storage"
=======
import { fetchTransactions, addTransaction, deleteTransaction, type UITransaction } from "@/lib/data"
>>>>>>> e84ca4ff3905f27b57c9f20969a6c56742ed1608
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeftIcon, PlusIcon } from "lucide-react"
import Link from "next/link"
import TransactionList from "@/components/transaction-list"
import TransactionFilters from "@/components/transaction-filters"
import AddTransactionModal from "@/components/add-transaction-modal"
import { formatCurrency } from "@/lib/currency"

export default function TransactionsPage() {
<<<<<<< HEAD
  const [transactions, setTransactions] = useState<Transaction[]>([])
=======
  const [transactions, setTransactions] = useState<UITransaction[]>([])
>>>>>>> e84ca4ff3905f27b57c9f20969a6c56742ed1608
  const [showAddModal, setShowAddModal] = useState(false)
  const [filterType, setFilterType] = useState<"all" | "income" | "expense">("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [dateRange, setDateRange] = useState<[string, string]>(["", ""])

<<<<<<< HEAD
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
=======
  const loadTransactions = async () => {
    const data = await fetchTransactions()
    setTransactions(data)
  }

  useEffect(() => {
    loadTransactions()
  }, [])

  const handleAddTransaction = async (transaction: any) => {
    // The modal passes an object that matches what addTransaction expects, 
    // but we need to be careful about types. 
    // lib/data.ts addTransaction expects { type, category, amount, description, date }
    // The modal likely passes that.
    await addTransaction({
      type: transaction.type,
      category: transaction.category,
      amount: transaction.amount,
      description: transaction.description,
      date: transaction.date
    })
    await loadTransactions()
    setShowAddModal(false)
  }

  const handleDeleteTransaction = async (id: string) => {
    await deleteTransaction(id)
    await loadTransactions()
>>>>>>> e84ca4ff3905f27b57c9f20969a6c56742ed1608
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
<<<<<<< HEAD
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
=======
    <div className="min-h-screen bg-background pb-12">
      {/* Header */}
      <header className="border-b border-border bg-card shadow-sm">
>>>>>>> e84ca4ff3905f27b57c9f20969a6c56742ed1608
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
<<<<<<< HEAD
                <Button variant="ghost" size="icon">
=======
                <Button variant="ghost" size="icon" className="rounded-full hover:bg-muted">
>>>>>>> e84ca4ff3905f27b57c9f20969a6c56742ed1608
                  <ArrowLeftIcon className="h-5 w-5" />
                </Button>
              </Link>
              <div>
<<<<<<< HEAD
                <h1 className="text-3xl font-bold text-foreground">All Transactions</h1>
                <p className="mt-1 text-sm text-muted-foreground">Showing {filtered.length} transactions</p>
              </div>
            </div>
            <Button onClick={() => setShowAddModal(true)} className="gap-2">
=======
                <h1 className="text-3xl font-bold text-foreground tracking-tight">All Transactions</h1>
                <p className="mt-1 text-sm text-muted-foreground">Manage and track your financial activity</p>
              </div>
            </div>
            <Button onClick={() => setShowAddModal(true)} className="gap-2 shadow-lg hover:shadow-xl transition-all">
>>>>>>> e84ca4ff3905f27b57c9f20969a6c56742ed1608
              <PlusIcon className="h-4 w-4" />
              Add Transaction
            </Button>
          </div>
        </div>
      </header>

<<<<<<< HEAD
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
=======
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="border-none shadow-md bg-white/50 backdrop-blur-sm overflow-hidden relative">
            <div className="absolute right-0 top-0 p-16 bg-green-500/10 rounded-full -mr-8 -mt-8 blur-2xl" />
            <CardHeader className="pb-2 relative z-10">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Income</CardTitle>
            </CardHeader>
            <CardContent className="relative z-10">
              <p className="text-3xl font-bold text-green-600">{formatCurrency(totalIncome)}</p>
            </CardContent>
          </Card>
          <Card className="border-none shadow-md bg-white/50 backdrop-blur-sm overflow-hidden relative">
            <div className="absolute right-0 top-0 p-16 bg-red-500/10 rounded-full -mr-8 -mt-8 blur-2xl" />
            <CardHeader className="pb-2 relative z-10">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Expenses</CardTitle>
            </CardHeader>
            <CardContent className="relative z-10">
              <p className="text-3xl font-bold text-red-600">{formatCurrency(totalExpense)}</p>
            </CardContent>
          </Card>
          <Card className="border-none shadow-md bg-white/50 backdrop-blur-sm overflow-hidden relative">
            <div className={`absolute right-0 top-0 p-16 rounded-full -mr-8 -mt-8 blur-2xl ${totalIncome - totalExpense >= 0 ? "bg-blue-500/10" : "bg-orange-500/10"
              }`} />
            <CardHeader className="pb-2 relative z-10">
              <CardTitle className="text-sm font-medium text-muted-foreground">Net Balance</CardTitle>
            </CardHeader>
            <CardContent className="relative z-10">
              <p
                className={`text-3xl font-bold ${totalIncome - totalExpense >= 0 ? "text-blue-600" : "text-orange-600"}`}
>>>>>>> e84ca4ff3905f27b57c9f20969a6c56742ed1608
              >
                {formatCurrency(totalIncome - totalExpense)}
              </p>
            </CardContent>
          </Card>
        </div>

<<<<<<< HEAD
        <div className="mt-8 grid gap-8 lg:grid-cols-4">
          {/* Filters */}
          <div className="lg:col-span-1">
=======
        <div className="grid gap-8 lg:grid-cols-4 items-start">
          {/* Filters */}
          <div className="lg:col-span-1 sticky top-8">
>>>>>>> e84ca4ff3905f27b57c9f20969a6c56742ed1608
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
<<<<<<< HEAD
          <div className="lg:col-span-3">
=======
          <div className="lg:col-span-3 space-y-8">
>>>>>>> e84ca4ff3905f27b57c9f20969a6c56742ed1608
            <TransactionList transactions={filtered} onDelete={handleDeleteTransaction} />

            {/* Category Breakdown */}
            {Object.keys(categoryBreakdown).length > 0 && (
<<<<<<< HEAD
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
=======
              <Card className="border-none shadow-md bg-white/50 backdrop-blur-sm">
                <CardHeader className="border-b border-border/50 bg-muted/30 pb-4">
                  <CardTitle className="text-lg font-semibold">Category Breakdown</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid gap-4 sm:grid-cols-2">
                    {Object.entries(categoryBreakdown).map(([category, values]) => (
                      <div
                        key={category}
                        className="flex items-center justify-between rounded-xl border border-border/50 bg-card/50 p-4 transition-colors hover:bg-muted/50"
                      >
                        <span className="font-medium text-foreground">{category}</span>
                        <div className="flex flex-col items-end gap-1">
                          {values.income > 0 && (
                            <span className="text-sm font-semibold text-green-600">+{formatCurrency(values.income)}</span>
                          )}
                          {values.expense > 0 && (
                            <span className="text-sm font-semibold text-red-600">-{formatCurrency(values.expense)}</span>
>>>>>>> e84ca4ff3905f27b57c9f20969a6c56742ed1608
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
