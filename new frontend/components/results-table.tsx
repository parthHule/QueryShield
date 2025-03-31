"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BarChart, FileText, AlertTriangle, AlertOctagon, AlertCircle } from "lucide-react"
import { motion } from "framer-motion"

interface ResultsTableProps {
  results: Array<{
    [key: string]: any;
  }>;
}

export default function ResultsTable({ results }: ResultsTableProps) {
  const [view, setView] = useState<"table" | "chart">("table")

  if (!results.length) return null

  const columns = Object.keys(results[0])

  return (
    <Card className="bg-gray-900 border-cyan-800 overflow-hidden">
      <div className="bg-gray-950 px-4 py-2 border-b border-cyan-800 flex items-center justify-between">
        <div className="flex items-center">
          <FileText className="mr-2 text-cyan-500" />
          <h3 className="text-cyan-400">Query Results</h3>
          <span className="ml-2 text-sm text-gray-400">({results.length} records found)</span>
        </div>
        <div className="flex gap-2">
          <Button
            variant={view === "table" ? "default" : "outline"}
            size="sm"
            onClick={() => setView("table")}
            className={view === "table" ? "bg-cyan-600 hover:bg-cyan-500 text-black" : "border-cyan-800"}
          >
            <FileText className="w-4 h-4 mr-1" />
            Table
          </Button>
          <Button
            variant={view === "chart" ? "default" : "outline"}
            size="sm"
            onClick={() => setView("chart")}
            className={view === "chart" ? "bg-cyan-600 hover:bg-cyan-500 text-black" : "border-cyan-800"}
          >
            <BarChart className="w-4 h-4 mr-1" />
            Chart
          </Button>
        </div>
      </div>
      <CardContent className="p-0">
        {view === "table" ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-cyan-800 bg-gray-950">
                  {columns.map((column) => (
                    <TableHead key={column} className="text-cyan-400 font-mono">
                      {column.replace(/_/g, " ")}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {results.map((row, rowIndex) => (
                  <motion.tr
                    key={rowIndex}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: rowIndex * 0.05 }}
                    className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors"
                  >
                    {columns.map((column) => (
                      <TableCell key={`${rowIndex}-${column}`} className="font-mono">
                        {column === "severity" ? (
                          <div className="flex items-center">
                            {row[column] === "High" ? (
                              <AlertOctagon className="w-4 h-4 mr-2 text-red-500" />
                            ) : row[column] === "Medium" ? (
                              <AlertTriangle className="w-4 h-4 mr-2 text-yellow-500" />
                            ) : (
                              <AlertCircle className="w-4 h-4 mr-2 text-blue-500" />
                            )}
                            <span
                              className={
                                row[column] === "High"
                                  ? "text-red-400"
                                  : row[column] === "Medium"
                                    ? "text-yellow-400"
                                    : "text-blue-400"
                              }
                            >
                              {row[column]}
                            </span>
                          </div>
                        ) : (
                          row[column]
                        )}
                      </TableCell>
                    ))}
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="p-6 h-80 flex items-center justify-center">
            <CyberSecurityChart data={results} />
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function CyberSecurityChart({ data }: { data: any[] }) {
  // This is a simplified chart visualization
  // In a real app, you would use a charting library like recharts or chart.js

  // Count incidents by type
  const incidentCounts: Record<string, number> = {}
  data.forEach((item) => {
    const type = item.incident_type
    incidentCounts[type] = (incidentCounts[type] || 0) + 1
  })

  const types = Object.keys(incidentCounts)
  const maxCount = Math.max(...Object.values(incidentCounts))

  return (
    <div className="w-full h-full flex flex-col">
      <h3 className="text-center text-cyan-400 mb-4">Incident Types Distribution</h3>
      <div className="flex-1 flex items-end gap-4">
        {types.map((type, index) => {
          const count = incidentCounts[type]
          const height = `${(count / maxCount) * 100}%`

          return (
            <div key={type} className="flex-1 flex flex-col items-center">
              <div className="w-full flex justify-center mb-2">
                <span className="text-cyan-300 text-sm">{count}</span>
              </div>
              <motion.div
                initial={{ height: 0 }}
                animate={{ height }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="w-full bg-gradient-to-t from-cyan-600 to-emerald-400 rounded-t-sm relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-grid-pattern opacity-30"></div>
              </motion.div>
              <div className="w-full text-center mt-2">
                <span className="text-xs text-gray-400 truncate block">{type}</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

