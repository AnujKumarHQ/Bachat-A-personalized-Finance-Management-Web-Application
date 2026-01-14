"use client"

import { useState } from "react"
import { useRouter } from 'next/navigation'
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { supabaseBrowser } from "@/lib/supabase/client"
import { authUtils } from "@/lib/auth"
import { AlertCircle, ArrowRight, CheckCircle2, Globe2, ShieldCheck } from 'lucide-react'

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

    // Simulate authentication delay for smoother feel
    await new Promise((resolve) => setTimeout(resolve, 800))

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

      // Persist Supabase session on client
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

      router.push("/")
    } catch (err: any) {
      setError(err?.message ?? "Something went wrong")
      setLoading(false)
    }
  }

  return (
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2">
      {/* Left Column: Form */}
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="mx-auto grid w-full max-w-[400px] gap-6">
          {/* Mobile Logo (only visible on small screens) */}
          <div className="flex lg:hidden flex-col items-center mb-6 text-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary mb-2">
              <span className="text-lg font-bold text-primary-foreground">₹</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Bachat</h1>
          </div>

          <div className="grid gap-2 text-center lg:text-left">
            <h1 className="text-3xl font-bold tracking-tight">Welcome back</h1>
            <p className="text-balance text-muted-foreground">
              Enter your email to sign in to your accounts
            </p>
          </div>

          <form onSubmit={handleLogin} className="grid gap-4">
            {error && (
              <div className="flex items-center gap-3 rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive animate-in fade-in slide-in-from-top-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="grid gap-2">
              <label htmlFor="email" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className="h-11 bg-muted/30"
                required
              />
            </div>

            <div className="grid gap-2">
              <div className="flex items-center">
                <label htmlFor="password" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="ml-auto inline-block text-sm text-primary underline-offset-4 hover:underline"
                >
                  Forgot your password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                className="h-11 bg-muted/30"
                required
              />
            </div>

            <Button type="submit" className="w-full h-11 mt-2" disabled={loading}>
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Verifying...
                </div>
              ) : (
                "Sign in"
              )}
            </Button>
          </form>

          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="underline font-medium text-primary hover:text-primary/90">
              Sign up
            </Link>
          </div>
        </div>
      </div>

      {/* Right Column: Visuals */}
      <div className="hidden bg-muted lg:block relative overflow-hidden">
        {/* Background Image / Gradient */}
        <div className="absolute inset-0 bg-zinc-900">
          <div className="absolute inset-0 bg-gradient-to-tr from-violet-600/20 via-transparent to-blue-600/20" />
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=2832&auto=format&fit=crop')] bg-cover bg-center opacity-20 mix-blend-overlay" />
        </div>

        <div className="relative h-full flex flex-col justify-between p-12 text-white">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-white text-black">
              <span className="font-bold">₹</span>
            </div>
            <span className="text-xl font-bold tracking-tight">Bachat</span>
          </div>

          <div className="space-y-6 max-w-lg">
            <blockquote className="space-y-2">
              <p className="text-2xl font-medium leading-relaxed">
                &ldquo;Bachat has completely transformed how I track my university expenses. Ideally, finances shouldn't be stressful.&rdquo;
              </p>
              <footer className="text-sm opacity-80">
                Ian Dev Swift, Production Engineering Student
              </footer>
            </blockquote>

            <div className="flex gap-4 pt-4 border-t border-white/10">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <ShieldCheck className="h-4 w-4 text-green-400" />
                  Secure
                </div>
                <p className="text-xs opacity-60">Bank-grade encryption</p>
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Globe2 className="h-4 w-4 text-blue-400" />
                  Global
                </div>
                <p className="text-xs opacity-60">Multi-currency support</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
