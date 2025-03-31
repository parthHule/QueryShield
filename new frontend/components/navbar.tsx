"use client"

import { Shield, BarChart2, Settings, LogOut } from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

const navItems = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: Shield,
  },
  {
    name: "Analytics",
    href: "/analytics",
    icon: BarChart2,
  },
  {
    name: "Settings",
    href: "/settings",
    icon: Settings,
  },
]

export default function Navbar() {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = () => {
    localStorage.removeItem('user')
    router.push('/')
  }

  return (
    <nav className="fixed top-0 w-full border-b border-cyan-900/40 bg-gray-950/50 backdrop-blur-xl z-50">
      <div className="mx-auto">
        <div className="flex h-16 items-center justify-between px-4">
          <div className="flex items-center">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 font-semibold text-cyan-500 transition-colors hover:text-cyan-400"
            >
              <Shield className="h-6 w-6" />
              <span>QueryShield</span>
            </Link>
          </div>

          <div className="flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 text-sm transition-colors",
                  pathname === item.href
                    ? "text-cyan-500"
                    : "text-gray-400 hover:text-cyan-500"
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Link>
            ))}
            
            <div className="h-6 w-px bg-cyan-900/40" />
            
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-950/30 rounded-lg transition-all duration-200"
            >
              <LogOut className="h-5 w-5" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
} 