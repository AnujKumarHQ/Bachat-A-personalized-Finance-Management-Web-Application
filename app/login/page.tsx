"use client"

import { useState } from "react"
import { useRouter } from 'next/navigation'
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { supabaseBrowser } from "@/lib/supabase/client"
import { authUtils } from "@/lib/auth"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { AlertCircle, ArrowRight } from 'lucide-react'
// import { authUtils } from "@/lib/auth"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    // Simulate authentication delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Basic validation
    if (!email || !password) {
      setError("Please fill in all fields")
      setLoading(false)
      return
    }

    if (!email.includes("@")) {
      setError("Please enter a valid email")
      setLoading(false)
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters")
      setLoading(false)
      return
    }

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()
      if (!res.ok || !data?.ok) {
        setError(data?.error ?? "Invalid credentials")
        setLoading(false)
        return
      }

      // Persist Supabase session on client and set local user for existing gate
      await supabaseBrowser.auth.setSession({
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
      })

      const { data: userData } = await supabaseBrowser.auth.getUser()
      const u = userData?.user
      if (u) {
        authUtils.setCurrentUser({
          id: u.id,
          email: u.email ?? "",
          name: (u.user_metadata as any)?.full_name ?? u.email?.split("@")[0] ?? "",
        })
      }

      setLoading(false)
      router.push("/")
    } catch (err: any) {
      setError(err?.message ?? "Something went wrong")
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background to-secondary px-4">
      <div className="w-full max-w-md">
        {/* Logo Section */}
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
            <span className="text-xl font-bold text-primary-foreground">₹</span>
          </div>
          <h1 className="text-3xl font-bold text-foreground">Bachat</h1>
          <p className="mt-2 text-muted-foreground">Save for your future, manage today</p>
        </div>

        {/* Login Card */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Welcome back</CardTitle>
            <CardDescription>Sign in to your Bachat account to continue</CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleLogin} className="space-y-5">
              {/* Error Message */}
              {error && (
                <div className="flex items-center gap-3 rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Email Input */}
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-foreground">
                  Email address
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  className="h-10"
                />
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-foreground">
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  className="h-10"
                />
              </div>

              {/* Remember Me */}
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 text-foreground">
                  <input type="checkbox" className="rounded" />
                  <span>Remember me</span>
                </label>
                <Link href="#" className="text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>

              {/* Sign In Button */}
              <Button type="submit" disabled={loading} className="w-full gap-2" size="lg">
                {loading ? "Signing in..." : "Sign in"}
                {!loading && <ArrowRight className="h-4 w-4" />}
              </Button>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">Or</span>
                </div>
              </div>

              {/* Sign Up Link */}
              <p className="text-center text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link href="/signup" className="font-semibold text-primary hover:underline">
                  Sign up
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>

        {/* Demo Credentials */}
        <div className="mt-6 rounded-lg border border-border bg-card/50 p-4 text-sm text-muted-foreground">
          <p className="font-medium text-foreground">Demo credentials:</p>
          <p className="mt-1">Email: demo@example.com</p>
          <p>Password: demo123</p>
        </div>
      </div>
    </div>
  )
}
