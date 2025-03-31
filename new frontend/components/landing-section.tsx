"use client"

import { useState, useEffect } from "react"
import { Shield, Terminal } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function LandingSection() {
  const [visible, setVisible] = useState(true)
  const [textIndex, setTextIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)

  const taglines = [
    "Your AI-powered Cyber Threat Investigator",
    "Decode security incidents with natural language",
    "Turn questions into insights. Instantly.",
  ]

  const currentText = taglines[textIndex].substring(0, charIndex)

  useEffect(() => {
    const typingTimer = setTimeout(() => {
      if (charIndex < taglines[textIndex].length) {
        setCharIndex(charIndex + 1)
      } else {
        // Pause at the end of the text before moving to next tagline
        setTimeout(() => {
          setCharIndex(0)
          setTextIndex((textIndex + 1) % taglines.length)
        }, 2000)
      }
    }, 70)

    return () => clearTimeout(typingTimer)
  }, [charIndex, textIndex])

  if (!visible) return null

  return (
    <section className="py-20 text-center relative overflow-hidden">
      {/* Background grid effect */}
      <div className="absolute inset-0 grid grid-cols-[repeat(40,1fr)] grid-rows-[repeat(20,1fr)] opacity-10">
        {Array.from({ length: 800 }).map((_, i) => (
          <div
            key={i}
            className="border border-cyan-500/20"
            style={{
              opacity: Math.random() > 0.7 ? 0.5 : 0.1,
              backgroundColor: Math.random() > 0.95 ? "rgba(6, 182, 212, 0.1)" : "transparent",
            }}
          />
        ))}
      </div>

      <div className="relative z-10">
        <div className="flex justify-center mb-6">
          <div className="relative">
            <Shield className="h-20 w-20 text-cyan-500" />
            <Terminal className="h-8 w-8 text-emerald-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          </div>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-emerald-400">
          QueryShield
        </h1>

        <div className="h-16 flex items-center justify-center">
          <h2 className="text-xl md:text-2xl mb-8 text-cyan-100 font-light">
            {currentText}
            <span className="animate-blink">|</span>
          </h2>
        </div>

        <Button
          onClick={() => setVisible(false)}
          className="mt-8 bg-gradient-to-r from-cyan-600 to-emerald-500 hover:from-cyan-500 hover:to-emerald-400 text-black font-bold py-3 px-8 rounded-md text-lg transition-all duration-300 shadow-[0_0_15px_rgba(6,182,212,0.5)] hover:shadow-[0_0_25px_rgba(6,182,212,0.7)]"
        >
          Get Started
        </Button>
      </div>
    </section>
  )
}

