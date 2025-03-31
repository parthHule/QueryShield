"use client"

import { motion } from "framer-motion"
import { Shield, Search, AlertTriangle, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function HomeOptions() {
  const router = useRouter()

  return (
    <div className="min-h-screen flex flex-col md:flex-row relative z-10">
      {/* Left Side - Report Incident */}
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex-1 flex flex-col items-center justify-center p-8 relative"
      >
        <div className="absolute inset-0 bg-gradient-to-b md:bg-gradient-to-r from-red-900/20 to-transparent z-0"></div>

        <div className="relative z-10 max-w-md text-center md:text-left">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
            className="mb-6 inline-block"
          >
            <div className="relative">
              <div className="p-4 rounded-full bg-red-900/30 border border-red-800">
                <AlertTriangle className="h-12 w-12 text-red-500" />
              </div>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                className="absolute -inset-2 rounded-full border border-red-800/50 opacity-50"
              ></motion.div>
            </div>
          </motion.div>

          <motion.h2
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-3xl md:text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-400"
          >
            Threat Sentinel
          </motion.h2>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-gray-300 mb-8"
          >
            Report new cybersecurity incidents and receive immediate guidance on containment and mitigation strategies.
          </motion.p>

          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }}>
            <Button
              onClick={() => router.push("/report-incident")}
              className="group bg-gradient-to-r from-red-700 to-orange-600 hover:from-red-600 hover:to-orange-500 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 shadow-[0_0_15px_rgba(239,68,68,0.3)] hover:shadow-[0_0_25px_rgba(239,68,68,0.5)]"
            >
              <span>Report Incident</span>
              <ArrowRight className="ml-2 h-4 w-4 transform transition-transform group-hover:translate-x-1" />
            </Button>
          </motion.div>
        </div>
      </motion.div>

      {/* Center Divider */}
      <div className="hidden md:block w-px bg-gradient-to-b from-transparent via-cyan-800 to-transparent mx-4 my-20"></div>

      {/* Right Side - View Logs */}
      <motion.div
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex-1 flex flex-col items-center justify-center p-8 relative"
      >
        <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-l from-cyan-900/20 to-transparent z-0"></div>

        <div className="relative z-10 max-w-md text-center md:text-left">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
            className="mb-6 inline-block"
          >
            <div className="relative">
              <div className="p-4 rounded-full bg-cyan-900/30 border border-cyan-800">
                <Search className="h-12 w-12 text-cyan-500" />
              </div>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                className="absolute -inset-2 rounded-full border border-cyan-800/50 opacity-50"
              ></motion.div>
            </div>
          </motion.div>

          <motion.h2
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-3xl md:text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400"
          >
            Insight Explorer
          </motion.h2>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-gray-300 mb-8"
          >
            Query and analyze your security incident database using natural language to uncover patterns and insights.
          </motion.p>

          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }}>
            <Button
              onClick={() => router.push("/query-interface")}
              className="group bg-gradient-to-r from-cyan-700 to-blue-600 hover:from-cyan-600 hover:to-blue-500 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:shadow-[0_0_25px_rgba(6,182,212,0.5)]"
            >
              <span>Generate Query</span>
              <ArrowRight className="ml-2 h-4 w-4 transform transition-transform group-hover:translate-x-1" />
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}

