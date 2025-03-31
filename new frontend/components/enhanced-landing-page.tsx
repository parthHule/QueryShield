"use client"

import { useState, useEffect, useRef } from "react"
import { Shield, Database, Terminal, Lock, Server, Cpu, Wifi, HardDrive, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion, useScroll, useTransform } from "framer-motion"
import Link from "next/link"

export default function EnhancedLandingPage() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  })

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.9])

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
        setTimeout(() => {
          setCharIndex(0)
          setTextIndex((textIndex + 1) % taglines.length)
        }, 2000)
      }
    }, 70)

    return () => clearTimeout(typingTimer)
  }, [charIndex, textIndex])

  const features = [
    {
      icon: <Terminal className="h-10 w-10 text-cyan-500" />,
      title: "Natural Language Queries",
      description: "Convert plain English questions into powerful SQL queries with our advanced AI engine.",
    },
    {
      icon: <Shield className="h-10 w-10 text-emerald-500" />,
      title: "Incident Response",
      description: "Report and track security incidents with guided protocols and real-time updates.",
    },
    {
      icon: <Database className="h-10 w-10 text-purple-500" />,
      title: "Comprehensive Analytics",
      description: "Visualize security data with interactive charts and customizable dashboards.",
    },
    {
      icon: <Lock className="h-10 w-10 text-red-500" />,
      title: "Secure Access",
      description: "Role-based permissions ensure sensitive security data remains protected.",
    },
  ]

  const stats = [
    { value: "99.9%", label: "Threat Detection" },
    { value: "< 5s", label: "Query Response" },
    { value: "24/7", label: "Monitoring" },
  ]

  return (
    <div ref={containerRef} className="relative">
      {/* Floating Background Icons */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {[Server, Cpu, Wifi, HardDrive, Globe, Lock].map((Icon, index) => (
          <motion.div
            key={index}
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              opacity: 0.1 + Math.random() * 0.2,
            }}
            animate={{
              x: [
                Math.random() * window.innerWidth,
                Math.random() * window.innerWidth,
                Math.random() * window.innerWidth,
              ],
              y: [
                Math.random() * window.innerHeight,
                Math.random() * window.innerHeight,
                Math.random() * window.innerHeight,
              ],
              opacity: [0.1, 0.2, 0.1],
            }}
            transition={{
              duration: 30 + Math.random() * 30,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute text-cyan-900"
          >
            <Icon size={30 + Math.random() * 50} />
          </motion.div>
        ))}
      </div>

      {/* Hero Section */}
      <motion.section
        style={{ opacity, scale }}
        className="min-h-screen flex flex-col items-center justify-center relative z-10 px-4"
      >
        <div className="absolute inset-0 flex items-center justify-center opacity-10">
          <div className="relative w-[800px] h-[800px] rounded-full border border-cyan-500">
            <div className="absolute inset-4 rounded-full border border-emerald-500 animate-pulse"></div>
            <div
              className="absolute inset-8 rounded-full border border-purple-500 animate-spin"
              style={{ animationDuration: "30s" }}
            ></div>
            <div className="absolute inset-16 rounded-full border border-cyan-800"></div>
            <div
              className="absolute inset-32 rounded-full border border-emerald-800 animate-spin"
              style={{ animationDuration: "60s", animationDirection: "reverse" }}
            ></div>
          </div>
        </div>

        <div className="text-center relative z-10 max-w-4xl">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, type: "spring" }}
            className="flex justify-center mb-6"
          >
            <div className="relative">
              <Shield className="h-24 w-24 text-cyan-500" />
              <Terminal className="h-10 w-10 text-emerald-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
            </div>
          </motion.div>

          <motion.h1
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-6xl md:text-8xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 via-emerald-400 to-purple-500"
          >
            QueryShield
          </motion.h1>

          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="h-16 flex items-center justify-center"
          >
            <h2 className="text-xl md:text-2xl mb-8 text-cyan-100 font-light">
              {currentText}
              <span className="animate-blink">|</span>
            </h2>
          </motion.div>

          <motion.p
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="text-gray-400 max-w-2xl mx-auto mb-8 text-lg"
          >
            Harness the power of artificial intelligence to investigate, report, and analyze cybersecurity incidents
            with unprecedented speed and accuracy.
          </motion.p>

          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.9 }}
          >
            <Link
              href="/login"
              className="bg-gradient-to-r from-cyan-600 to-emerald-500 hover:from-cyan-500 hover:to-emerald-400 text-black font-bold py-3 px-8 rounded-lg transition-all duration-300 shadow-[0_0_15px_rgba(6,182,212,0.5)] hover:shadow-[0_0_25px_rgba(6,182,212,0.7)]"
            >
              Access System
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.2 }}
            className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-cyan-500"
          >
            <div className="animate-bounce">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 5v14M19 12l-7 7-7-7" />
              </svg>
            </div>
            <span className="text-sm text-cyan-300">Scroll to explore</span>
          </motion.div>
        </div>
      </motion.section>

      {/* Features Section */}
      <section className="min-h-screen flex flex-col items-center justify-center py-20 px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-emerald-400">
            Advanced Capabilities
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            QueryShield combines cutting-edge AI with cybersecurity expertise to deliver a comprehensive incident
            management platform.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-gray-900/50 backdrop-blur-sm border border-cyan-900 rounded-lg p-6 hover:border-cyan-500 transition-all duration-300 hover:shadow-[0_0_15px_rgba(6,182,212,0.3)]"
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold mb-2 text-white">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gray-900/30 backdrop-blur-sm border border-cyan-900 rounded-lg p-8 text-center"
              >
                <h3 className="text-4xl md:text-5xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-emerald-400">
                  {stat.value}
                </h3>
                <p className="text-gray-400">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-purple-500">
            Ready to strengthen your security posture?
          </h2>
          <p className="text-gray-400 mb-8 text-lg">
            Join the ranks of organizations that trust QueryShield to manage their cybersecurity incidents.
          </p>
          <Link
            href="/login"
            className="bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-black font-bold py-3 px-8 rounded-lg transition-all duration-300 shadow-[0_0_15px_rgba(6,182,212,0.5)] hover:shadow-[0_0_25px_rgba(6,182,212,0.7)]"
          >
            Get Started Now
          </Link>
        </motion.div>
      </section>
    </div>
  )
}

