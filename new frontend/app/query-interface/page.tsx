import CyberGrid from "@/components/cyber-grid"
import QueryInterface from "@/components/query-interface"

export default function QueryInterfacePage() {
  return (
    <main className="min-h-screen bg-black text-white relative overflow-hidden">
      <CyberGrid />
      <div className="container mx-auto px-4 py-8 relative z-10">
        <QueryInterface />
      </div>
    </main>
  )
}

