"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Navbar from "@/components/navbar"

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in
    const user = localStorage.getItem('user')
    if (!user) {
      router.push('/')
    }
    setIsLoading(false)
  }, [router])

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <Navbar />
      <main className="pt-16"> {/* Add padding-top to account for fixed navbar */}
        {children}
      </main>
    </div>
  )
} 