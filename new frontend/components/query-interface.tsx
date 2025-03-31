"use client"

import type React from "react"

import { useState } from "react"
import { Search, Code, AlertCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { generateSqlQuery } from "@/app/actions"
import ResultsTable from "@/components/results-table"
import { motion, AnimatePresence } from "framer-motion"
import { API_URL } from "@/app/api/config"

export default function QueryInterface() {
  const [query, setQuery] = useState("")
  const [sqlQuery, setSqlQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [results, setResults] = useState<any[]>([])

  const fetchResults = async (sql: string) => {
    try {
      const response = await fetch('/api/incidents');
      if (!response.ok) {
        throw new Error('Failed to fetch results');
      }
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error('Error fetching results:', error);
      setError('Failed to fetch results. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return

    setIsLoading(true)
    setError("")

    try {
      // Call our FastAPI backend
      const response = await fetch(`${API_URL}/api/generate-query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: query })
      });

      if (!response.ok) {
        throw new Error('Failed to generate query');
      }

      const data = await response.json();
      setSqlQuery(data.sql_query);
      setResults(data.rows);
      
    } catch (err) {
      setError("Failed to generate SQL query. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const exampleQueries = [
    {
      id: 1,
      text: "Show all incidents with CRITICAL severity level"
    },
    {
      id: 2,
      text: "List all incidents with their financial impact above $10000"
    },
    {
      id: 3,
      text: "Find incidents reported in the last 24 hours"
    },
    {
      id: 4,
      text: "Show all incidents sorted by discovered_at timestamp"
    }
  ];

  return (
    <div className="py-8">
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="relative">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask a question about cybersecurity incidents..."
                className="bg-gray-900 border-cyan-800 focus:border-cyan-500 h-14 pl-12 pr-4 text-lg rounded-lg shadow-[0_0_10px_rgba(6,182,212,0.2)] focus:shadow-[0_0_15px_rgba(6,182,212,0.4)] transition-all duration-300"
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-cyan-500" />
            </div>
            <Button
              type="submit"
              disabled={isLoading || !query.trim()}
              className="h-14 px-6 bg-cyan-600 hover:bg-cyan-500 text-black font-bold rounded-lg transition-all duration-300"
            >
              {isLoading ? <Loader2 className="animate-spin" /> : "Generate SQL"}
            </Button>
          </div>
        </div>
      </form>

      {!sqlQuery && !isLoading && !error && (
        <div className="mb-8">
          <h3 className="text-lg font-medium text-cyan-400 mb-4">Try these example queries:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {exampleQueries.map((example) => (
              <Button
                key={example.id}
                variant="outline"
                onClick={() => setQuery(example.text)}
                className="justify-start h-auto py-3 px-4 text-left border-cyan-800 hover:border-cyan-500 hover:bg-gray-900 text-white transition-all duration-300"
              >
                {example.text}
              </Button>
            ))}
          </div>
        </div>
      )}

      <AnimatePresence>
        {error && (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-8 p-4 bg-red-900/30 border border-red-800 rounded-lg flex items-center gap-3 text-red-300"
          >
            <AlertCircle className="text-red-500" />
            <p>{error}</p>
          </motion.div>
        )}

        {isLoading && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-16"
          >
            <div className="relative w-24 h-24">
              <div className="absolute inset-0 border-4 border-cyan-500/30 rounded-full"></div>
              <div className="absolute inset-2 border-t-4 border-cyan-500 rounded-full animate-spin"></div>
              <div className="absolute inset-4 border-2 border-emerald-500/50 rounded-full animate-pulse"></div>
              <div className="absolute inset-6 border-b-2 border-emerald-500 rounded-full animate-spin animate-reverse"></div>
            </div>
            <p className="mt-6 text-cyan-400">Generating SQL query...</p>
          </motion.div>
        )}

        {sqlQuery && !isLoading && (
          <motion.div
            key="sql-query"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mb-8"
          >
            <Card className="bg-gray-900 border-cyan-800 overflow-hidden">
              <div className="bg-gray-950 px-4 py-2 border-b border-cyan-800 flex items-center">
                <Code className="mr-2 text-cyan-500" />
                <h3 className="text-cyan-400 font-mono">Generated SQL Query</h3>
              </div>
              <CardContent className="p-4">
                <pre className="font-mono text-emerald-400 bg-black/50 p-4 rounded overflow-x-auto">{sqlQuery}</pre>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {results.length > 0 && !isLoading && (
          <motion.div 
            key="results"
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.2 }}
          >
            <ResultsTable results={results} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

