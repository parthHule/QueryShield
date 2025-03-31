"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { FileText, Download, Check, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function ReportDownloadConfirmation() {
  const router = useRouter()
  const [downloadComplete, setDownloadComplete] = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    // Simulate download progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setDownloadComplete(true)
          return 100
        }
        return prev + 5
      })
    }, 150)

    // Auto-trigger download after a delay
    const downloadTimeout = setTimeout(() => {
      // Create a fake download by creating a blob and downloading it
      const blob = new Blob(["Incident Report Document"], {
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = "QueryShield_Incident_Report.docx"
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }, 2000)

    return () => {
      clearInterval(interval)
      clearTimeout(downloadTimeout)
    }
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full"
      >
        <div className="bg-gray-900/70 backdrop-blur-md rounded-2xl border border-cyan-900 p-8 shadow-[0_0_30px_rgba(6,182,212,0.2)]">
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="inline-flex items-center justify-center p-4 bg-cyan-900/30 rounded-full mb-4"
            >
              {downloadComplete ? (
                <Check className="h-12 w-12 text-green-500" />
              ) : (
                <FileText className="h-12 w-12 text-cyan-500" />
              )}
            </motion.div>

            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400"
            >
              {downloadComplete ? "Download Complete" : "Preparing Your Report"}
            </motion.h1>

            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-2 text-gray-400"
            >
              {downloadComplete
                ? "Your incident report has been successfully downloaded."
                : "We're generating a comprehensive report of the incident you reported."}
            </motion.p>
          </div>

          {!downloadComplete && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="mb-8">
              <div className="relative h-2 bg-gray-800 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: "0%" }}
                  animate={{ width: `${progress}%` }}
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
                />
              </div>
              <div className="flex justify-between mt-2 text-sm text-gray-500">
                <span>Generating report</span>
                <span>{progress}%</span>
              </div>
            </motion.div>
          )}

          <div className="flex flex-col space-y-4">
            {downloadComplete ? (
              <>
                <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                  <div className="flex items-center">
                    <div className="mr-4">
                      <FileText className="h-10 w-10 text-cyan-500" />
                    </div>
                    <div>
                      <h3 className="font-medium text-white">QueryShield_Incident_Report.docx</h3>
                      <p className="text-sm text-gray-400">DOCX Document • Just now</p>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={() => router.push("/home")}
                  className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold py-3 rounded-lg transition-all duration-300"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Return to Home
                </Button>

                <Button
                  variant="outline"
                  onClick={() => {
                    // Trigger another download
                    const blob = new Blob(["Incident Report Document"], {
                      type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                    })
                    const url = URL.createObjectURL(blob)
                    const a = document.createElement("a")
                    a.href = url
                    a.download = "QueryShield_Incident_Report.docx"
                    document.body.appendChild(a)
                    a.click()
                    document.body.removeChild(a)
                    URL.revokeObjectURL(url)
                  }}
                  className="border-cyan-900 hover:bg-gray-800 text-cyan-400"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download Again
                </Button>
              </>
            ) : (
              <div className="flex items-center justify-center">
                <Download className="h-5 w-5 text-cyan-500 animate-bounce" />
                <span className="ml-2 text-cyan-400">Your download will begin automatically</span>
              </div>
            )}
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute -top-20 -left-20 w-40 h-40 border border-cyan-900 rounded-full opacity-20"></div>
        <div className="absolute -bottom-20 -right-20 w-60 h-60 border border-cyan-900 rounded-full opacity-20"></div>
      </motion.div>
    </div>
  )
}

