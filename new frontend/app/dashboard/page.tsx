"use client"

import CyberGrid from "@/components/cyber-grid"
import HomeOptions from "@/components/home-options"
import Navbar from "@/components/navbar"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function HomePage() {
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in
    const user = localStorage.getItem('user')
    if (!user) {
      router.push('/')
    }
  }, [])

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-black text-white relative overflow-hidden pt-16">
        <CyberGrid />
        <HomeOptions />
      </main>
    </>
  )
}

