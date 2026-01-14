"use client"

import Link from "next/link"
import { ListIcon, TrendingUpIcon, PiggyBankIcon, BarChart3Icon, PieChartIcon, ArrowRightIcon } from "lucide-react"
import { cn } from "@/lib/utils"

export default function QuickLinksSection({ className }: { className?: string }) {
  const links = [
    {
      title: "All Transactions",
      description: "Manage finances",
      href: "/transactions",
      icon: ListIcon,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      hover: "group-hover:bg-blue-500/20",
      border: "hover:border-blue-500/30"
    },
    {
      title: "Budgets",
      description: "Set expense limits",
      href: "/budgets",
      icon: PieChartIcon,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
      hover: "group-hover:bg-emerald-500/20",
      border: "hover:border-emerald-500/30"
    },
    {
      title: "Savings Goals",
      description: "Track progress",
      href: "/savings",
      icon: PiggyBankIcon,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
      hover: "group-hover:bg-purple-500/20",
      border: "hover:border-purple-500/30"
    },
    {
      title: "Investments",
      description: "Portfolio analysis",
      href: "/investments",
      icon: TrendingUpIcon,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
      hover: "group-hover:bg-amber-500/20",
      border: "hover:border-amber-500/30"
    },
    {
      title: "Reports",
      description: "Deep analytics",
      href: "/reports",
      icon: BarChart3Icon,
      color: "text-rose-500",
      bg: "bg-rose-500/10",
      hover: "group-hover:bg-rose-500/20",
      border: "hover:border-rose-500/30"
    },
  ]

  return (
    <div className={cn("mt-8", className)}>
      <h2 className="mb-4 text-xl font-bold text-foreground flex items-center gap-2">
        <span className="w-1 h-6 bg-primary rounded-full" />
        Quick Access
      </h2>
      <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
        {links.map((link) => {
          const Icon = link.icon
          return (
            <Link key={link.href} href={link.href} className="group relative block h-full">
              <div
                className={cn(
                  "relative h-full overflow-hidden rounded-2xl border border-border bg-card p-5 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 block",
                  link.border
                )}
              >
                {/* Background Gradient Blob */}
                <div className={cn(
                  "absolute -right-4 -top-4 w-20 h-20 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500",
                  link.bg.replace('/10', '/30')
                )} />

                <div className="relative z-10 flex flex-col h-full justify-between gap-4">
                  <div className="flex items-start justify-between">
                    <div className={cn("p-3 rounded-xl transition-colors duration-300", link.bg, link.hover)}>
                      <Icon className={cn("h-6 w-6 stroke-[1.5]", link.color)} />
                    </div>
                    <div className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                      <ArrowRightIcon className="h-5 w-5 text-muted-foreground/50" />
                    </div>
                  </div>

                  <div>
                    <h3 className="font-bold text-base text-foreground group-hover:text-primary transition-colors">
                      {link.title}
                    </h3>
                    <p className="mt-1 text-xs font-medium text-muted-foreground line-clamp-1">
                      {link.description}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
