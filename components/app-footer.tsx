import Image from "next/image"
import Link from "next/link"

export default function AppFooter() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Logo and Brand Section */}
          <div className="flex flex-col gap-2">
            <Link href="/" className="flex items-center gap-2 w-fit">
              <Image
                src="/bachat-logo.png"
                alt="Bachat - Save For Future"
                width={48}
                height={48}
                className="rounded-lg"
              />
              <div>
                <h3 className="font-bold text-foreground">Bachat</h3>
                <p className="text-xs text-muted-foreground">Save For Future</p>
              </div>
            </Link>
            <p className="text-sm text-muted-foreground mt-2">
              Manage your finances smartly and plan for a better future.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/reports" className="text-sm text-muted-foreground hover:text-foreground transition">
                  Reports
                </Link>
              </li>
              <li>
                <Link href="/settings" className="text-sm text-muted-foreground hover:text-foreground transition">
                  Settings
                </Link>
              </li>
            </ul>
          </div>

          {/* Support and Legal */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Support</h4>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-border mt-8 pt-8">
          <p className="text-center text-sm text-muted-foreground">
            © {currentYear} Bachat. All rights reserved. Save For Future.
          </p>
        </div>
      </div>
    </footer>
  )
}
