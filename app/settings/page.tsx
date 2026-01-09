"use client"

import { useState, useEffect } from "react"
import { fetchTransactions, fetchBudgets, deleteAllData, type UITransaction, type UIBudget } from "@/lib/data"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeftIcon, DownloadIcon, TrashIcon, InfoIcon } from "lucide-react"
import Link from "next/link"

export default function SettingsPage() {
  const [showClearConfirm, setShowClearConfirm] = useState(false)
  const [exportMessage, setExportMessage] = useState("")
  const [transactions, setTransactions] = useState<UITransaction[]>([])
  const [budgets, setBudgets] = useState<UIBudget[]>([])

  useEffect(() => {
    const loadData = async () => {
      const txs = await fetchTransactions()
      const bgs = await fetchBudgets()
      setTransactions(txs)
      setBudgets(bgs)
    }
    loadData()
  }, [])

  const handleExportData = () => {
    const data = {
      exported: new Date().toISOString(),
      transactions,
      budgets,
    }

    const dataStr = JSON.stringify(data, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = `finance-data-${new Date().toISOString().split("T")[0]}.json`
    link.click()
    URL.revokeObjectURL(url)

    setExportMessage("Data exported successfully!")
    setTimeout(() => setExportMessage(""), 3000)
  }

  const handleClearAllData = async () => {
    await deleteAllData()
    setShowClearConfirm(false)
    window.location.href = "/"
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon">
                <ArrowLeftIcon className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Settings</h1>
              <p className="mt-1 text-sm text-muted-foreground">Manage your data and preferences</p>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Export Message */}
        {exportMessage && <div className="mb-6 rounded-lg bg-accent/10 p-4 text-accent">{exportMessage}</div>}

        {/* Data Overview */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <InfoIcon className="h-5 w-5" />
              Data Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <p className="text-sm text-muted-foreground">Total Transactions</p>
                <p className="mt-1 text-3xl font-bold text-foreground">{transactions.length}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Budgets</p>
                <p className="mt-1 text-3xl font-bold text-foreground">{budgets.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data Export */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Export Data</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-sm text-muted-foreground">
              Download all your transactions and budgets as a JSON file. This is useful for backing up your data or
              transferring to another system.
            </p>
            <Button onClick={handleExportData} className="gap-2" variant="default">
              <DownloadIcon className="h-4 w-4" />
              Export as JSON
            </Button>
          </CardContent>
        </Card>

        {/* About Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>About</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-foreground">Personal Finance Manager</h3>
              <p className="mt-2 text-sm text-muted-foreground">Version 1.0.0</p>
            </div>
            <div>
              <h4 className="font-medium text-foreground">Features</h4>
              <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                <li>• Track income and expenses</li>
                <li>• Create and manage budgets</li>
                <li>• View financial reports and analytics</li>
                <li>• Local data storage (no cloud sync)</li>
                <li>• Export your data anytime</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-foreground">Data Storage</h4>
              <p className="mt-2 text-sm text-muted-foreground">
                All your data is stored locally in your browser's local storage. No information is sent to external
                servers.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-destructive/50 bg-destructive/5">
          <CardHeader>
            <CardTitle className="text-destructive">Danger Zone</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-sm text-destructive">
              This action will permanently delete all your transactions and budgets. This cannot be undone.
            </p>

            {!showClearConfirm ? (
              <Button onClick={() => setShowClearConfirm(true)} variant="destructive" className="gap-2">
                <TrashIcon className="h-4 w-4" />
                Clear All Data
              </Button>
            ) : (
              <div className="space-y-3">
                <p className="text-sm font-medium text-destructive">
                  Are you sure? This will delete {transactions.length} transactions and {budgets.length} budgets.
                </p>
                <div className="flex gap-3">
                  <Button onClick={handleClearAllData} variant="destructive" className="gap-2">
                    <TrashIcon className="h-4 w-4" />
                    Yes, Clear Everything
                  </Button>
                  <Button onClick={() => setShowClearConfirm(false)} variant="outline">
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
