"use client"

import { useEffect, useState } from "react"
import { useRouter } from 'next/navigation'
import { supabaseBrowser } from "@/lib/supabase/client"
import DashboardHeader from "@/components/dashboard-header"
import OverviewCards from "@/components/overview-cards"
import RecentTransactions from "@/components/recent-transactions"
import BudgetOverview from "@/components/budget-overview"
import AddTransactionModal from "@/components/add-transaction-modal"
import QuickLinksSection from "@/components/quick-links-section"
import BalanceCard from "@/components/balance-card"
import { fetchTransactions, addTransaction as addTxn, deleteTransaction as deleteTxn, fetchBudgets, fetchBalance, type UITransaction, type UIBudget } from "@/lib/data"

export default function Home() {
  const [transactions, setTransactions] = useState<UITransaction[]>([])
  const [budgets, setBudgets] = useState<UIBudget[]>([])
  const [showAddModal, setShowAddModal] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [balance, setBalance] = useState<number>(0)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  const loadData = async () => {
    try {
      const [txns, buds, bal] = await Promise.all([
        fetchTransactions(),
        fetchBudgets(),
        fetchBalance(),
      ])
      setTransactions(txns)
      setBudgets(buds)
      setBalance(bal)
    } catch (error) {
      console.error("Failed to load data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    ; (async () => {
      const { data: userData } = await supabaseBrowser.auth.getUser()
      if (!userData?.user) {
        router.push("/login")
        return
      }
      setIsLoggedIn(true)
      loadData()
    })()
  }, [router])

  const handleAddTransaction = async (transaction: any) => {
    try {
      await addTxn({
        type: transaction.type,
        category: transaction.category,
        amount: transaction.amount,
        description: transaction.description,
        date: transaction.date,
      })
      await loadData() // Reload all data to update balance and lists
      setShowAddModal(false)
    } catch (e: any) {
      alert(`Failed to add transaction: ${e?.message ?? "Unknown error"}`)
    }
  }

  const handleDeleteTransaction = async (id: string) => {
    try {
      await deleteTxn(id)
      await loadData()
    } catch (e: any) {
      alert(`Failed to delete transaction: ${e?.message ?? "Unknown error"}`)
    }
  }

  if (!isLoggedIn) return null

  return (
    <main className="min-h-screen bg-background pb-12">
      <DashboardHeader onAddClick={() => setShowAddModal(true)} />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        {/* Top Section: Balance and Overview */}
        <div className="grid gap-6 md:grid-cols-12 items-stretch">
          {/* Balance Card - Takes up 4 columns on medium screens */}
          <div className="md:col-span-4 lg:col-span-3">
            <BalanceCard balance={balance} onBalanceUpdate={setBalance} className="h-full" />
          </div>

          {/* Overview Cards - Takes up 8 columns */}
          <div className="md:col-span-8 lg:col-span-9">
            <OverviewCards transactions={transactions} accountBalance={balance} className="h-full" />
          </div>
        </div>

        {/* Quick Actions */}
        <QuickLinksSection />

        {/* Main Content Grid */}
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left Column: Recent Transactions (2/3 width) */}
          <div className="lg:col-span-2 space-y-6">
            <RecentTransactions transactions={transactions} onDelete={handleDeleteTransaction} />
          </div>

          {/* Right Column: Budget Overview (1/3 width) */}
          <div className="space-y-6">
            <BudgetOverview budgets={budgets} transactions={transactions} />
          </div>
        </div>
      </div>

      {showAddModal && <AddTransactionModal onAdd={handleAddTransaction} onClose={() => setShowAddModal(false)} />}
    </main>
  )
}
