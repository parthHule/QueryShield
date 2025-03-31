"use client"

import { Suspense } from "react"
import EnhancedLandingPage from "@/components/enhanced-landing-page"
import { LoadingAnimation } from "@/components/loading-animation"

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white overflow-hidden">
      <Suspense
        fallback={
          <div className="h-screen flex items-center justify-center">
            <LoadingAnimation />
          </div>
        }
      >
        <EnhancedLandingPage />
      </Suspense>
    </main>
  )
} 