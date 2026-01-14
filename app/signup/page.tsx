"use client"

import { useState } from "react"
import { useRouter } from 'next/navigation'
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AlertCircle, CheckCircle, ShieldCheck, Globe2 } from 'lucide-react'

export default function SignupPage() {
  const router = useRouter()
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const passwordStrength = {
    hasLength: password.length >= 6,
    hasNumber: /\d/.test(password),
    hasSpecial: /[!@#$%^&*]/.test(password),
  }

  const allRequirements = Object.values(passwordStrength).every(Boolean)

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    // Simulate signup delay for smoother feel
    await new Promise((resolve) => setTimeout(resolve, 800))

    // Validation
    if (!fullName || !email || !password || !confirmPassword) {
      setError("Please fill in all fields")
      setLoading(false)
      return
    }

    if (!email.includes("@")) {
      setError("Please enter a valid email")
      setLoading(false)
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      setLoading(false)
      return
    }

    if (!allRequirements) {
      setError("Password must meet all strength requirements")
      setLoading(false)
      return
    }

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, full_name: fullName }),
      })

      const data = await res.json()
      if (!res.ok || !data?.ok) {
        setError(data?.error ?? "Failed to create account")
        setLoading(false)
        return
      }

      setLoading(false)
      router.push("/login")
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
          {/* Mobile Logo */}
          <div className="flex lg:hidden flex-col items-center mb-6 text-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary mb-2">
              <span className="text-lg font-bold text-primary-foreground">₹</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Bachat</h1>
          </div>

          <div className="grid gap-2 text-center lg:text-left">
            <h1 className="text-3xl font-bold tracking-tight">Create an account</h1>
            <p className="text-balance text-muted-foreground">
              Enter your information below to get started
            </p>
          </div>

          <form onSubmit={handleSignup} className="grid gap-4">
            {error && (
              <div className="flex items-center gap-3 rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive animate-in fade-in slide-in-from-top-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="grid gap-2">
              <label htmlFor="fullName" className="text-sm font-medium leading-none">
                Full Name
              </label>
              <Input
                id="fullName"
                type="text"
                placeholder="John Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                disabled={loading}
                className="h-11 bg-muted/30"
                required
              />
            </div>

            <div className="grid gap-2">
              <label htmlFor="email" className="text-sm font-medium leading-none">
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
              <label htmlFor="password" className="text-sm font-medium leading-none">
                Password
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                className="h-11 bg-muted/30"
                required
              />
              {/* Password Strength */}
              {password && (
                <div className="space-y-2 mt-2 p-3 bg-muted/50 rounded-lg border border-border/50">
                  <div className="space-y-1.5 text-xs">
                    <div className={`flex items-center gap-2 ${passwordStrength.hasLength ? "text-green-500" : "text-muted-foreground"}`}>
                      <CheckCircle className="h-3.5 w-3.5" />
                      At least 6 characters
                    </div>
                    <div className={`flex items-center gap-2 ${passwordStrength.hasNumber ? "text-green-500" : "text-muted-foreground"}`}>
                      <CheckCircle className="h-3.5 w-3.5" />
                      Contains a number
                    </div>
                    <div className={`flex items-center gap-2 ${passwordStrength.hasSpecial ? "text-green-500" : "text-muted-foreground"}`}>
                      <CheckCircle className="h-3.5 w-3.5" />
                      Contains special character (!@#$)
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="grid gap-2">
              <label htmlFor="confirmPassword" className="text-sm font-medium leading-none">
                Confirm Password
              </label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={loading}
                className="h-11 bg-muted/30"
                required
              />
            </div>

            <Button type="submit" className="w-full h-11 mt-2" disabled={loading}>
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Creating account...
                </div>
              ) : (
                "Create account"
              )}
            </Button>
          </form>

          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Link href="/login" className="underline font-medium text-primary hover:text-primary/90">
              Sign in
            </Link>
          </div>
        </div>
      </div>

      {/* Right Column: Visuals */}
      <div className="hidden bg-muted lg:block relative overflow-hidden">
        {/* Background Image / Gradient */}
        <div className="absolute inset-0 bg-zinc-900">
          <div className="absolute inset-0 bg-gradient-to-tl from-indigo-600/20 via-transparent to-rose-600/20" />
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=2936&auto=format&fit=crop')] bg-cover bg-center opacity-20 mix-blend-overlay" />
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
                &ldquo;The best time to start managing your finances was yesterday. The second best time is today.&rdquo;
              </p>
            </blockquote>

            <div className="flex gap-4 pt-4 border-t border-white/10">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <ShieldCheck className="h-4 w-4 text-green-400" />
                  Privacy First
                </div>
                <p className="text-xs opacity-60">We never sell your data</p>
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Globe2 className="h-4 w-4 text-blue-400" />
                  Accessible
                </div>
                <p className="text-xs opacity-60">Manage from anywhere</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
