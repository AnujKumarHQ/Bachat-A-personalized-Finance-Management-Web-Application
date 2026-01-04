"use client"

import { useEffect, useState } from "react"
import { storageUtils, type Transaction, type Budget } from "@/lib/storage"
import DashboardHeader from "@/components/dashboard-header"
import OverviewCards from "@/components/overview-cards"
import RecentTransactions from "@/components/recent-transactions"
import BudgetOverview from "@/components/budget-overview"
import AddTransactionModal from "@/components/add-transaction-modal"
import QuickLinksSection from "@/components/quick-links-section"

export default function Home() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [budgets, setBudgets] = useState<Budget[]>([])
  const [showAddModal, setShowAddModal] = useState(false)

  useEffect(() => {
    setTransactions(storageUtils.getTransactions())
    setBudgets(storageUtils.getBudgets())
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

  return (
    <main className="min-h-screen bg-background">
      <DashboardHeader onAddClick={() => setShowAddModal(true)} />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <OverviewCards transactions={transactions} />

        <QuickLinksSection />

        <div className="mt-8 grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <RecentTransactions transactions={transactions} onDelete={handleDeleteTransaction} />
          </div>
          <div>
            <BudgetOverview budgets={budgets} transactions={transactions} />
          </div>
        </div>
      </div>

      {showAddModal && <AddTransactionModal onAdd={handleAddTransaction} onClose={() => setShowAddModal(false)} />}
    </main>
  )
}
