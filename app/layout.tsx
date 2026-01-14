import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { CurrencyProvider } from "@/components/currency-provider"
import { UserProvider } from "@/components/user-provider"
import { ThemeProvider } from "@/components/theme-provider"
import AppFooter from "@/components/app-footer"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Bachat - Save For Future",
  description: "Manage your finances and save for the future with Bachat",
  generator: "v0.app",
  icons: {
    icon: "/bachat-logo.png",
    apple: "/bachat-logo.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <UserProvider>
            <CurrencyProvider>
              <div className="flex min-h-screen flex-col">
                <div className="flex-1">
                  {children}
                </div>
                <AppFooter />
              </div>
            </CurrencyProvider>
          </UserProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
