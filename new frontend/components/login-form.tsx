"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Shield, User, Lock, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import { API_URL } from "@/app/api/config"

interface LoginFormProps {
  onLoginSuccess: () => void;
}

export default function LoginForm({ onLoginSuccess }: LoginFormProps) {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch(`${API_URL}/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password
        })
      })

      if (!response.ok) {
        throw new Error('Invalid credentials')
      }

      const data = await response.json()
      
      localStorage.setItem('user', JSON.stringify(data.user))
      
      onLoginSuccess()
    } catch (error) {
      setError("Invalid email or password")
      console.error('Login error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md p-8 relative z-10"
    >
      <div className="bg-gray-900/70 backdrop-blur-md rounded-2xl border border-cyan-900 p-8 shadow-[0_0_30px_rgba(6,182,212,0.2)]">
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
            className="flex justify-center mb-4"
          >
            <div className="relative">
              <Shield className="h-16 w-16 text-cyan-500" />
              <Lock className="h-6 w-6 text-emerald-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
            </div>
          </motion.div>

          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-3xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-emerald-400"
          >
            Secure Access
          </motion.h1>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-gray-400"
          >
            Enter your credentials to access QueryShield
          </motion.p>
        </div>

        <motion.form
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm text-gray-300 flex items-center gap-2">
              <User className="h-4 w-4 text-cyan-500" />
              Email
            </label>
            <div className="relative">
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="bg-gray-800 border-cyan-900 focus:border-cyan-500 pl-4 h-12 rounded-lg shadow-[0_0_10px_rgba(6,182,212,0.1)] focus:shadow-[0_0_15px_rgba(6,182,212,0.2)] transition-all duration-300"
                required
              />
              <motion.span
                initial={{ width: "0%" }}
                animate={{ width: email ? "100%" : "0%" }}
                transition={{ duration: 0.3 }}
                className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-cyan-500 to-emerald-400"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm text-gray-300 flex items-center gap-2">
              <Lock className="h-4 w-4 text-cyan-500" />
              Password
            </label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="bg-gray-800 border-cyan-900 focus:border-cyan-500 pl-4 pr-10 h-12 rounded-lg shadow-[0_0_10px_rgba(6,182,212,0.1)] focus:shadow-[0_0_15px_rgba(6,182,212,0.2)] transition-all duration-300"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-cyan-500 transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
              <motion.span
                initial={{ width: "0%" }}
                animate={{ width: password ? "100%" : "0%" }}
                transition={{ duration: 0.3 }}
                className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-cyan-500 to-emerald-400"
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center">
              <input
                id="remember"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-600 bg-gray-800 text-cyan-500 focus:ring-cyan-500"
              />
              <label htmlFor="remember" className="ml-2 text-gray-400">
                Remember me
              </label>
            </div>
            <a href="#" className="text-cyan-500 hover:text-cyan-400 transition-colors">
              Forgot password?
            </a>
          </div>

          {error && (
            <div className="text-red-400 text-sm mt-2">
              {error}
            </div>
          )}

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 bg-gradient-to-r from-cyan-600 to-emerald-500 hover:from-cyan-500 hover:to-emerald-400 text-black font-bold rounded-lg transition-all duration-300 shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:shadow-[0_0_25px_rgba(6,182,212,0.5)]"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-black"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Authenticating...
              </div>
            ) : (
              "Access System"
            )}
          </Button>
        </motion.form>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-6 text-center text-sm text-gray-400"
        >
          Don't have an account?{" "}
          <a href="#" className="text-cyan-500 hover:text-cyan-400 transition-colors">
            Request Access
          </a>
        </motion.div>
      </div>

      {/* Decorative elements */}
      <div className="absolute -top-20 -left-20 w-40 h-40 border border-cyan-900 rounded-full opacity-20"></div>
      <div className="absolute -bottom-20 -right-20 w-60 h-60 border border-cyan-900 rounded-full opacity-20"></div>
      <div className="absolute top-1/2 -right-10 w-20 h-20 border border-emerald-900 rounded-full opacity-20"></div>
      <div className="absolute bottom-1/3 -left-10 w-20 h-20 border border-emerald-900 rounded-full opacity-20"></div>
    </motion.div>
  )
}

