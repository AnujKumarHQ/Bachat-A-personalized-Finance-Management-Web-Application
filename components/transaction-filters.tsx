"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
<<<<<<< HEAD
import { FilterIcon } from "lucide-react"
=======
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FilterIcon, SearchIcon, CalendarIcon, XIcon } from "lucide-react"
import { cn } from "@/lib/utils"
>>>>>>> e84ca4ff3905f27b57c9f20969a6c56742ed1608

interface TransactionFiltersProps {
  filterType: "all" | "income" | "expense"
  onFilterTypeChange: (type: "all" | "income" | "expense") => void
  searchQuery: string
  onSearchChange: (query: string) => void
  dateRange: [string, string]
  onDateRangeChange: (range: [string, string]) => void
}

export default function TransactionFilters({
  filterType,
  onFilterTypeChange,
  searchQuery,
  onSearchChange,
  dateRange,
  onDateRangeChange,
}: TransactionFiltersProps) {
  return (
<<<<<<< HEAD
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
=======
    <Card className="border-none shadow-md bg-white/50 backdrop-blur-sm h-full">
      <CardHeader className="border-b border-border/50 bg-muted/30 pb-4">
        <CardTitle className="flex items-center gap-2 text-lg font-semibold">
>>>>>>> e84ca4ff3905f27b57c9f20969a6c56742ed1608
          <FilterIcon className="h-4 w-4" />
          Filters
        </CardTitle>
      </CardHeader>
<<<<<<< HEAD
      <CardContent className="space-y-6">
        {/* Type Filter */}
        <div>
          <p className="mb-2 text-sm font-medium text-foreground">Type</p>
          <div className="space-y-2">
            {(["all", "income", "expense"] as const).map((type) => (
              <Button
                key={type}
                variant={filterType === type ? "default" : "outline"}
                className="w-full justify-start"
                onClick={() => onFilterTypeChange(type)}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </Button>
=======
      <CardContent className="space-y-6 pt-6">
        {/* Type Filter */}
        <div className="space-y-2">
          <Label className="text-xs font-semibold uppercase text-muted-foreground">Type</Label>
          <div className="flex rounded-lg bg-muted p-1">
            {(["all", "income", "expense"] as const).map((type) => (
              <button
                key={type}
                onClick={() => onFilterTypeChange(type)}
                className={cn(
                  "flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-all",
                  filterType === type
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
>>>>>>> e84ca4ff3905f27b57c9f20969a6c56742ed1608
            ))}
          </div>
        </div>

        {/* Search */}
<<<<<<< HEAD
        <div>
          <label className="text-sm font-medium text-foreground">Search</label>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Description or category..."
            className="mt-2 w-full rounded-lg border border-border bg-input px-3 py-2 text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none"
          />
        </div>

        {/* Date Range */}
        <div>
          <p className="mb-2 text-sm font-medium text-foreground">Date Range</p>
          <div className="space-y-2">
            <input
              type="date"
              value={dateRange[0]}
              onChange={(e) => onDateRangeChange([e.target.value, dateRange[1]])}
              className="w-full rounded-lg border border-border bg-input px-3 py-2 text-foreground focus:border-primary focus:outline-none"
              placeholder="From"
            />
            <input
              type="date"
              value={dateRange[1]}
              onChange={(e) => onDateRangeChange([dateRange[0], e.target.value])}
              className="w-full rounded-lg border border-border bg-input px-3 py-2 text-foreground focus:border-primary focus:outline-none"
              placeholder="To"
            />
=======
        <div className="space-y-2">
          <Label className="text-xs font-semibold uppercase text-muted-foreground">Search</Label>
          <div className="relative">
            <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search transactions..."
              className="pl-9"
            />
          </div>
        </div>

        {/* Date Range */}
        <div className="space-y-2">
          <Label className="text-xs font-semibold uppercase text-muted-foreground">Date Range</Label>
          <div className="grid grid-cols-2 gap-2">
            <div className="relative">
              <Input
                type="date"
                value={dateRange[0]}
                onChange={(e) => onDateRangeChange([e.target.value, dateRange[1]])}
                className="text-sm"
              />
            </div>
            <div className="relative">
              <Input
                type="date"
                value={dateRange[1]}
                onChange={(e) => onDateRangeChange([dateRange[0], e.target.value])}
                className="text-sm"
              />
            </div>
>>>>>>> e84ca4ff3905f27b57c9f20969a6c56742ed1608
          </div>
        </div>

        {/* Reset */}
        <Button
          variant="outline"
<<<<<<< HEAD
          className="w-full bg-transparent"
=======
          className="w-full"
>>>>>>> e84ca4ff3905f27b57c9f20969a6c56742ed1608
          onClick={() => {
            onFilterTypeChange("all")
            onSearchChange("")
            onDateRangeChange(["", ""])
          }}
        >
<<<<<<< HEAD
=======
          <XIcon className="mr-2 h-4 w-4" />
>>>>>>> e84ca4ff3905f27b57c9f20969a6c56742ed1608
          Reset Filters
        </Button>
      </CardContent>
    </Card>
  )
}
