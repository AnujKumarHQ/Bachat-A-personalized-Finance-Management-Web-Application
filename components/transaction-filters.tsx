"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FilterIcon } from "lucide-react"

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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FilterIcon className="h-4 w-4" />
          Filters
        </CardTitle>
      </CardHeader>
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
            ))}
          </div>
        </div>

        {/* Search */}
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
          </div>
        </div>

        {/* Reset */}
        <Button
          variant="outline"
          className="w-full bg-transparent"
          onClick={() => {
            onFilterTypeChange("all")
            onSearchChange("")
            onDateRangeChange(["", ""])
          }}
        >
          Reset Filters
        </Button>
      </CardContent>
    </Card>
  )
}
