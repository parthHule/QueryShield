"use client"

import { Card } from "@/components/ui/card"
import { motion } from "framer-motion"
import { Lock, Phone, Shield, AlertCircle } from "lucide-react"
import { useState } from "react"
import { updatePassword, updatePhoneNumber } from "@/lib/actions"

export default function SettingsPage() {
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      setErrorMessage("New passwords don't match")
      return
    }
    
    // Use the logged in user's email
    const result = await updatePassword("ph@gmail.com", currentPassword, newPassword) // Replace with actual logged in email
    
    if (result.success) {
      setSuccessMessage(result.message)
      setErrorMessage("")
      // Reset form
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
    } else {
      setErrorMessage(result.message)
      setSuccessMessage("")
    }
  }

  const handlePhoneChange = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Basic phone validation
    const phoneRegex = /^\+?[1-9]\d{1,14}$/
    if (!phoneRegex.test(phoneNumber)) {
      setErrorMessage("Please enter a valid phone number")
      return
    }

    try {
      // Call backend function with logged-in user's email
      const result = await updatePhoneNumber("ph@gmail.com", phoneNumber)
      
      if (result.success) {
        setSuccessMessage("Phone number updated successfully!")
        setErrorMessage("")
        // Reset form
        setPhoneNumber("")
      } else {
        setErrorMessage(result.message)
        setSuccessMessage("")
      }
    } catch (error) {
      setErrorMessage("Failed to update phone number")
      setSuccessMessage("")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-purple-500">
            Settings
          </h1>
          <p className="text-gray-400 mt-2">Manage your account preferences</p>
        </motion.div>

        {/* Success/Error Messages */}
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-500 flex items-center gap-2"
          >
            <Shield className="h-5 w-5" />
            {successMessage}
          </motion.div>
        )}

        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 flex items-center gap-2"
          >
            <AlertCircle className="h-5 w-5" />
            {errorMessage}
          </motion.div>
        )}

        <div className="space-y-6">
          {/* Change Password Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-gray-900/50 backdrop-blur-xl border-cyan-900/50 p-6 hover:bg-gray-900/70">
              <div className="flex items-center gap-2 mb-6">
                <Lock className="h-5 w-5 text-cyan-500" />
                <h2 className="text-xl font-semibold text-cyan-500">Change Password</h2>
              </div>
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Current Password</label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-cyan-500 text-gray-200"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">New Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-cyan-500 text-gray-200"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Confirm New Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-cyan-500 text-gray-200"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                >
                  Update Password
                </button>
              </form>
            </Card>
          </motion.div>

          {/* Change Phone Number Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-gray-900/50 backdrop-blur-xl border-purple-900/50 p-6 hover:bg-gray-900/70">
              <div className="flex items-center gap-2 mb-6">
                <Phone className="h-5 w-5 text-purple-500" />
                <h2 className="text-xl font-semibold text-purple-500">Change Phone Number</h2>
              </div>
              <form onSubmit={handlePhoneChange} className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">New Phone Number</label>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+1234567890"
                    className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-purple-500 text-gray-200"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-purple-500 hover:bg-purple-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                >
                  Update Phone Number
                </button>
              </form>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
} 