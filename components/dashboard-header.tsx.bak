"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { PlusIcon, SettingsIcon, LogOutIcon } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"
import { storageUtils } from "@/lib/storage"
import { formatCurrency } from "@/lib/currency"
import Image from "next/image"

interface DashboardHeaderProps {
  onAddClick: () => void
}

export default function DashboardHeader({ onAddClick }: DashboardHeaderProps) {
  const [totalExpenses, setTotalExpenses] = useState(0)

  useEffect(() => {
    const transactions = storageUtils.getTransactions()
    const total = transactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0)
    setTotalExpenses(total)
  }, [])

  return (
    <header className="border-b border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/bachat-logo.png"
              alt="Bachat - Save For Future"
              width={48}
              height={48}
              className="rounded-lg"
            />
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-foreground">Bachat</h1>
              <p className="text-xs text-muted-foreground">Save For Future</p>
            </div>
          </Link>

          <div className="flex gap-3 items-center">
            <Link href="/settings">
              <Button variant="outline" size="icon">
                <SettingsIcon className="h-4 w-4" />
              </Button>
            </Link>
            <Button onClick={onAddClick} className="gap-2">
              <PlusIcon className="h-4 w-4" />
              Add Transaction
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/avatar.png" alt="User" />
                    <AvatarFallback className="bg-accent text-accent-foreground">AK</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium text-foreground">anuj kumar</p>
                    <p className="text-xs text-muted-foreground">anuj@gmail.com</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="px-2 py-2">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-medium text-muted-foreground">Total Expenses</span>
                    <span className="text-sm font-bold text-destructive">{formatCurrency(totalExpenses)}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    <p>Member since: November 2024</p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/settings" className="cursor-pointer">
                    Profile Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/reports" className="cursor-pointer">
                    View Reports
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="destructive" className="cursor-pointer">
                  <LogOutIcon className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  )
}


