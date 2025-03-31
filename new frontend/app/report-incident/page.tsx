import CyberGrid from "@/components/cyber-grid"
import IncidentReportForm from "@/components/incident-report-form"

export default function ReportIncidentPage() {
  return (
    <main className="min-h-screen bg-black text-white relative overflow-hidden">
      <CyberGrid />
      <IncidentReportForm />
    </main>
  )
}

