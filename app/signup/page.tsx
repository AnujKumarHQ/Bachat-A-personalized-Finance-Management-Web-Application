"use client"

import { useState } from "react"
import { useRouter } from 'next/navigation'
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { AlertCircle, ArrowRight, CheckCircle } from 'lucide-react'
// import { authUtils } from "@/lib/auth"

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

    // Simulate signup delay
    await new Promise((resolve) => setTimeout(resolve, 500))

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
      setError("Password must be at least 6 characters and contain a number and special character")
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

        {/* Signup Card */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Create your account</CardTitle>
            <CardDescription>Join Bachat to start managing your finances</CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSignup} className="space-y-4">
              {/* Error Message */}
              {error && (
                <div className="flex items-center gap-3 rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Full Name Input */}
              <div className="space-y-2">
                <label htmlFor="fullName" className="text-sm font-medium text-foreground">
                  Full name
                </label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="John Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  disabled={loading}
                  className="h-10"
                />
              </div>

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

                {/* Password Strength Indicator */}
                {password && (
                  <div className="space-y-2">
                    <div
                      className={`h-1 rounded-full transition-colors ${
                        allRequirements ? "bg-accent" : "bg-muted"
                      }`}
                    />
                    <div className="space-y-1 text-xs">
                      <div className={`flex items-center gap-2 ${passwordStrength.hasLength ? "text-accent" : "text-muted-foreground"}`}>
                        <CheckCircle className="h-3 w-3" />
                        At least 6 characters
                      </div>
                      <div className={`flex items-center gap-2 ${passwordStrength.hasNumber ? "text-accent" : "text-muted-foreground"}`}>
                        <CheckCircle className="h-3 w-3" />
                        Contains a number
                      </div>
                      <div className={`flex items-center gap-2 ${passwordStrength.hasSpecial ? "text-accent" : "text-muted-foreground"}`}>
                        <CheckCircle className="h-3 w-3" />
                        Contains a special character (!@#$%^&*)
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Password Input */}
              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">
                  Confirm password
                </label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={loading}
                  className="h-10"
                />
              </div>

              {/* Terms */}
              <div className="flex items-start gap-2 text-xs text-muted-foreground">
                <input type="checkbox" className="mt-1 rounded" />
                <span>
                  I agree to the{" "}
                  <Link href="#" className="text-primary hover:underline">
                    Terms of Service
                  </Link>
                  {" "}and{" "}
                  <Link href="#" className="text-primary hover:underline">
                    Privacy Policy
                  </Link>
                </span>
              </div>

              {/* Sign Up Button */}
              <Button type="submit" disabled={loading} className="w-full gap-2" size="lg">
                {loading ? "Creating account..." : "Sign up"}
                {!loading && <ArrowRight className="h-4 w-4" />}
              </Button>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">Already have an account?</span>
                </div>
              </div>

              {/* Sign In Link */}
              <p className="text-center text-sm text-muted-foreground">
                <Link href="/login" className="font-semibold text-primary hover:underline">
                  Sign in
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
