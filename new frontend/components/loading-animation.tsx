"use client"

import { motion } from "framer-motion"

export function LoadingAnimation() {
  return (
    <div className="flex flex-col items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative w-24 h-24"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          className="absolute inset-0 border-4 border-cyan-500/30 rounded-full"
        />
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          className="absolute inset-2 border-t-4 border-cyan-500 rounded-full"
        />
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          className="absolute inset-4 border-2 border-emerald-500/50 rounded-full"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          className="absolute inset-6 border-b-2 border-emerald-500 rounded-full"
        />
      </motion.div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mt-4 text-cyan-500 animate-pulse"
      >
        Initializing QueryShield...
      </motion.p>
    </div>
  )
}

