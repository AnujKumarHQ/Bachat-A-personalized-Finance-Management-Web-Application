"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from 'next/navigation'

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const userSession = localStorage.getItem("userSession")
    const isAuthed = !!userSession

    setIsAuthenticated(isAuthed)
    setIsLoading(false)

    // Redirect to login if not authenticated
    if (!isAuthed && pathname !== "/login" && pathname !== "/signup") {
      router.push("/login")
    }
  }, [pathname, router])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary animate-pulse">
            <span className="text-xl font-bold text-primary-foreground">₹</span>
          </div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
