import Image from "next/image"
import Link from "next/link"
import { GithubIcon, LinkedinIcon, ExternalLinkIcon } from "lucide-react"

export default function AppFooter() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-border bg-card mt-auto">
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

          {/* Creator Section */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Created By</h4>
            <p className="text-sm font-medium text-foreground mb-3">Anuj Kumar</p>
            <div className="flex flex-col gap-2">
              <a
                href="https://www.linkedin.com/in/anuj-kumar-29ab30298/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-[#0077b5] transition-colors"
              >
                <LinkedinIcon className="h-4 w-4" />
                <span>LinkedIn Profile</span>
              </a>
              <a
                href="https://github.com/AnujKumarHQ"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <GithubIcon className="h-4 w-4" />
                <span>GitHub Profile</span>
              </a>
              <a
                href="https://www.fiverr.com/anujdjrue"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-[#1dbf73] transition-colors"
              >
                <ExternalLinkIcon className="h-4 w-4" />
                <span>Hire me on Fiverr</span>
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-border mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-center text-sm text-muted-foreground">
            © {currentYear} Bachat. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            Made with ❤️ by <span className="font-semibold text-foreground">Anuj Kumar</span>
          </p>
        </div>
      </div>
    </footer>
  )
}
