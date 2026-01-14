"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { PlusIcon, SettingsIcon, LogOutIcon, UserIcon, BarChart3Icon, WalletIcon, HelpCircleIcon } from 'lucide-react'
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
import { fetchTransactions } from "@/lib/data"
import { formatCurrency } from "@/lib/currency"
import Image from "next/image"
import { authUtils, type AuthUser } from "@/lib/auth"
import { useRouter } from 'next/navigation'
import CurrencySelector from "@/components/currency-selector"

import { useCurrency } from "@/components/currency-provider"
import { ModeToggle } from "@/components/mode-toggle"

import { useUser } from "@/components/user-provider"

interface DashboardHeaderProps {
  onAddClick: () => void
}

export default function DashboardHeader({ onAddClick }: DashboardHeaderProps) {
  const [totalExpenses, setTotalExpenses] = useState(0)
  const { user } = useUser()
  const [mounted, setMounted] = useState(false)
  const router = useRouter()
  const { formatAmount } = useCurrency()

  useEffect(() => {
    setMounted(true)
    if (user) {
      fetchTransactions().then(transactions => {
        const total = transactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0)
        setTotalExpenses(total)
      })
    }
  }, [user])

  const handleLogout = () => {
    authUtils.logout()
    router.push("/login")
  }

  if (!mounted) return null

  return (
    <header className="border-b border-border bg-card sticky top-0 z-50">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative overflow-hidden rounded-xl shadow-sm transition-transform group-hover:scale-105">
              <Image
                src="/bachat-logo.png"
                alt="Bachat"
                width={42}
                height={42}
                className="object-cover"
              />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">Bachat</h1>
              <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest">Save For Future</p>
            </div>
          </Link>

          <div className="flex gap-3 items-center">
            {user ? (
              <>
                <ModeToggle />
                <CurrencySelector />
                <Link href="/settings">
                  <Button variant="ghost" size="icon" className="text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-full">
                    <SettingsIcon className="h-5 w-5" />
                  </Button>
                </Link>
                <Button
                  onClick={onAddClick}
                  className="gap-2 bg-slate-900 hover:bg-slate-800 text-white shadow-lg shadow-slate-900/20 transition-all active:scale-95"
                >
                  <PlusIcon className="h-4 w-4" />
                  <span className="hidden sm:inline">Add Transaction</span>
                  <span className="sm:hidden">Add</span>
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full h-10 w-10 border-2 border-white shadow-sm hover:shadow-md transition-all ml-2">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={user.avatar_url || "/placeholder-user.jpg"} alt="User" />
                        <AvatarFallback className="bg-slate-900 text-white font-bold">
                          {user.name.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-80 p-0 overflow-hidden border-none shadow-2xl bg-white/95 backdrop-blur-xl rounded-2xl mt-2 ring-1 ring-black/5">
                    {/* Header Section */}
                    <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 relative overflow-hidden">
                      {/* Decorative circles */}
                      <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white/5 rounded-full blur-2xl"></div>
                      <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-20 h-20 bg-emerald-500/10 rounded-full blur-xl"></div>

                      <div className="relative z-10 flex items-center gap-4">
                        <Avatar className="h-14 w-14 border-2 border-white/20 shadow-xl ring-2 ring-white/10">
                          <AvatarImage src={user.avatar_url || "/placeholder-user.jpg"} alt="User" />
                          <AvatarFallback className="bg-slate-700 text-white text-lg font-bold">
                            {user.name.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="space-y-1">
                          <p className="text-lg font-bold text-white leading-none tracking-tight">{user.name}</p>
                          <p className="text-xs text-slate-400 font-medium">{user.email}</p>

                        </div>
                      </div>

                      {/* Mini Stat Card */}
                      <div className="mt-6 bg-white/10 rounded-xl p-4 border border-white/10 backdrop-blur-md shadow-inner">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-medium text-slate-300 uppercase tracking-wider">Total Spent</span>
                          <div className="p-1.5 rounded-md bg-white/10">
                            <WalletIcon className="h-3.5 w-3.5 text-emerald-400" />
                          </div>
                        </div>
                        <p className="text-2xl font-bold text-white tracking-tight">{formatAmount(totalExpenses)}</p>
                        <div className="mt-3 h-1.5 w-full bg-slate-950/50 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 w-[70%] rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                        </div>
                        <p className="text-[10px] text-slate-400 mt-2 text-right">70% of monthly budget</p>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="p-2 bg-white">
                      <DropdownMenuItem asChild className="p-3 cursor-pointer rounded-xl hover:bg-slate-50 focus:bg-slate-50 transition-colors outline-none group">
                        <Link href="/profile" className="flex items-center gap-4">
                          <div className="p-2.5 rounded-full bg-slate-100 text-slate-600 group-hover:bg-slate-200 group-hover:text-slate-900 transition-colors">
                            <UserIcon className="h-4.5 w-4.5" />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-slate-700 group-hover:text-slate-900">My Profile</span>
                            <span className="text-[11px] text-slate-500">Account settings & preferences</span>
                          </div>
                        </Link>
                      </DropdownMenuItem>

                      <DropdownMenuItem asChild className="p-3 cursor-pointer rounded-xl hover:bg-slate-50 focus:bg-slate-50 transition-colors outline-none group mt-1">
                        <Link href="/reports" className="flex items-center gap-4">
                          <div className="p-2.5 rounded-full bg-blue-50 text-blue-600 group-hover:bg-blue-100 group-hover:text-blue-700 transition-colors">
                            <BarChart3Icon className="h-4.5 w-4.5" />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-slate-700 group-hover:text-slate-900">Financial Reports</span>
                            <span className="text-[11px] text-slate-500">Insights & analytics</span>
                          </div>
                        </Link>
                      </DropdownMenuItem>

                      <DropdownMenuSeparator className="my-2 bg-slate-100" />

                      <DropdownMenuItem
                        onClick={handleLogout}
                        className="p-3 cursor-pointer rounded-xl hover:bg-red-50 focus:bg-red-50 text-red-600 focus:text-red-700 transition-colors outline-none group"
                      >
                        <div className="flex items-center gap-4 w-full">
                          <div className="p-2.5 rounded-full bg-red-100 text-red-600 group-hover:bg-red-200 transition-colors">
                            <LogOutIcon className="h-4.5 w-4.5" />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm font-bold">Sign Out</span>
                            <span className="text-[11px] text-red-400/80">End your session securely</span>
                          </div>
                        </div>
                      </DropdownMenuItem>
                    </div>

                    {/* Footer */}
                    <div className="bg-slate-50 p-3 text-center border-t border-slate-100">
                      <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-400 font-medium">
                        <span>Bachat v1.0.0</span>
                        <span>•</span>
                        <span className="flex items-center gap-0.5 text-emerald-600/70">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          Secure
                        </span>
                      </div>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" className="text-slate-600 hover:text-slate-900">Login</Button>
                </Link>
                <Link href="/signup">
                  <Button className="bg-slate-900 text-white hover:bg-slate-800 shadow-lg shadow-slate-900/20">Create Account</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
