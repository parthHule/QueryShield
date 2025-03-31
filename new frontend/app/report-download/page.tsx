import { Suspense } from "react"
import CyberGrid from "@/components/cyber-grid"
import ReportDownloadConfirmation from "@/components/report-download-confirmation"
import { LoadingAnimation } from "@/components/loading-animation"

export default function ReportDownloadPage() {
  return (
    <main className="min-h-screen bg-black text-white relative overflow-hidden">
      <CyberGrid />
      <Suspense
        fallback={
          <div className="h-screen flex items-center justify-center">
            <LoadingAnimation />
          </div>
        }
      >
        <ReportDownloadConfirmation />
      </Suspense>
    </main>
  )
}

