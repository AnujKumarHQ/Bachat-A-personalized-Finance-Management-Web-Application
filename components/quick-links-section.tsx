"use client"

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { ListIcon, TrendingUpIcon, PiggyBankIcon, BarChart3Icon, PieChartIcon } from "lucide-react"

export default function QuickLinksSection() {
  const links = [
    {
      title: "All Transactions",
      description: "View and manage all transactions",
      href: "/transactions",
      icon: ListIcon,
    },
    {
      title: "Budgets",
      description: "Set and track your budgets",
      href: "/budgets",
      icon: PieChartIcon,
    },
    {
      title: "Savings Goals",
      description: "Track your savings progress",
      href: "/savings",
      icon: PiggyBankIcon,
    },
    {
      title: "Investments",
      description: "Manage your investments",
      href: "/investments",
      icon: TrendingUpIcon,
    },
    {
      title: "Reports",
      description: "View financial analytics",
      href: "/reports",
      icon: BarChart3Icon,
    },
  ]

  return (
    <div className="mt-8">
      <h2 className="mb-4 text-xl font-semibold text-foreground">Quick Access</h2>
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-5">
        {links.map((link) => {
          const Icon = link.icon
          return (
            <Link key={link.href} href={link.href} className="block h-full">
              <Card className="transition-all hover:border-primary hover:shadow-md h-full">
                <CardContent className="pt-6">
                  <div className="mb-3 inline-flex rounded-lg bg-primary/10 p-3">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground">{link.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{link.description}</p>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
