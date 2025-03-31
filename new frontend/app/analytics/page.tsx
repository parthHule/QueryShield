"use client"

import { Card } from "@/components/ui/card"
import { motion } from "framer-motion"
import { Shield, AlertTriangle, Clock, Users, BarChart2, TrendingUp, AlertCircle, Building2 } from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
  Area,
  AreaChart
} from "recharts"
import { useEffect, useState } from "react"
import { getTotalIncidents, getCriticalIncidents, getActiveIncidents, getMostCommonIncidentType, getActiveDepartments, getTotalDepartments, getMonthlyIncidents, getRecentIncidents, getSeverityDistribution, getIncidentTypeDistribution } from "@/lib/actions"

export default function AnalyticsPage() {
  const [totalIncidents, setTotalIncidents] = useState<number>(0)
  const [criticalIncidents, setCriticalIncidents] = useState<number>(0)
  const [activeIncidents, setActiveIncidents] = useState<number>(0)
  const [commonType, setCommonType] = useState({ type: '', count: 0 })
  const [activeDepartments, setActiveDepartments] = useState<number>(0)
  const [totalDepartments, setTotalDepartments] = useState<number>(0)
  const [monthlyIncidents, setMonthlyIncidents] = useState<{ month: string; incidents: number }[]>([])
  const [recentIncidents, setRecentIncidents] = useState<Array<{
    incident_id: number;
    incident_name: string;
    type_name: string;
    severity_name: string;
    incident_date: string;
  }>>([])
  const [severityDistribution, setSeverityDistribution] = useState<Array<{
    name: string;
    value: number;
    color: string;
  }>>([])
  const [incidentTypes, setIncidentTypes] = useState<Array<{
    name: string;
    value: number;
  }>>([])

  useEffect(() => {
    async function fetchData() {
      const total = await getTotalIncidents()
      const critical = await getCriticalIncidents()
      const active = await getActiveIncidents()
      const common = await getMostCommonIncidentType()
      const departments = await getTotalDepartments()
      const recent = await getRecentIncidents()
      const severity = await getSeverityDistribution()
      const types = await getIncidentTypeDistribution()
      
      setTotalIncidents(total)
      setCriticalIncidents(critical)
      setActiveIncidents(active)
      setCommonType(common)
      setActiveDepartments(active)
      setTotalDepartments(departments)
      setRecentIncidents(recent)
      setSeverityDistribution(severity)
      setIncidentTypes(types)
    }

    fetchData()
    
    // Update every minute
    const interval = setInterval(fetchData, 60000)
    return () => clearInterval(interval)
  }, [])

  const responseTimeData = [
    { day: "Mon", time: 45 },
    { day: "Tue", time: 35 },
    { day: "Wed", time: 55 },
    { day: "Thu", time: 40 },
    { day: "Fri", time: 30 },
    { day: "Sat", time: 45 },
    { day: "Sun", time: 50 },
  ]

  const recentHighlights = [
    {
      title: "Improved Detection Rate",
      description: "15% increase in early threat detection compared to last month",
      trend: "positive",
    },
    {
      title: "Response Efficiency",
      description: "Average response time reduced to 42 minutes",
      trend: "positive",
    },
    {
      title: "Top Threat Vector",
      description: "SQL Injection attempts remain the primary attack vector",
      trend: "neutral",
    },
    {
      title: "System Health",
      description: "All security systems operating at optimal capacity",
      trend: "positive",
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white p-8 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-1/4 w-1/2 h-1/2 bg-cyan-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 -right-1/4 w-1/2 h-1/2 bg-purple-500/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-radial from-emerald-500/5 to-transparent"></div>
      </div>

      <div className="max-w-7xl mx-auto relative">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-1"
          >
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 via-emerald-400 to-purple-500">
              Security Analytics Dashboard
            </h1>
            <p className="text-gray-400">Real-time insights and security metrics</p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-2 bg-gray-900/50 border border-cyan-900/50 rounded-full px-4 py-2"
          >
            <div className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-400">Live Updates</span>
          </motion.div>
        </div>

        {/* Enhanced Key Metrics - Now with gradient borders */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            whileHover={{ scale: 1.02 }}
            className="transform transition-all duration-200"
          >
            <Card className="bg-gray-900/50 backdrop-blur-xl border-cyan-900/50 p-6 hover:bg-gray-900/70 hover:border-cyan-500/50 hover:shadow-[0_0_15px_rgba(6,182,212,0.15)]">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-cyan-500/10 rounded-lg">
                  <Shield className="h-6 w-6 text-cyan-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Total Incidents</p>
                  <h3 className="text-2xl font-bold text-cyan-500">
                    {totalIncidents}
                    <motion.span
                      key={totalIncidents}
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="ml-2 text-xs text-cyan-600"
                    >
                      live
                    </motion.span>
                  </h3>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 1.02 }}
            className="transform transition-all duration-200"
          >
            <Card className="bg-gray-900/50 backdrop-blur-xl border-red-900/50 p-6 hover:bg-gray-900/70 hover:border-red-500/50 hover:shadow-[0_0_15px_rgba(249,115,18,0.15)]">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-red-500/10 rounded-lg">
                  <AlertTriangle className="h-6 w-6 text-red-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Critical Incidents</p>
                  <h3 className="text-2xl font-bold text-red-500">
                    {criticalIncidents}
                    <motion.span
                      key={criticalIncidents}
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="ml-2 text-xs text-red-600"
                    >
                      live
                    </motion.span>
                  </h3>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            whileHover={{ scale: 1.02 }}
            className="transform transition-all duration-200"
          >
            <Card className="bg-gray-900/50 backdrop-blur-xl border-emerald-900/50 p-6 hover:bg-gray-900/70 hover:border-emerald-500/50 hover:shadow-[0_0_15px_rgba(22,163,74,0.15)]">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-emerald-500/10 rounded-lg">
                  <BarChart2 className="h-6 w-6 text-emerald-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Most Common Type</p>
                  <h3 className="text-2xl font-bold text-emerald-500">
                    {commonType.count}
                    <span className="ml-2 text-sm font-normal text-gray-400">
                      {commonType.type}
                    </span>
                    <motion.span
                      key={commonType.count}
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="ml-2 text-xs text-emerald-600"
                    >
                      live
                    </motion.span>
                  </h3>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            whileHover={{ scale: 1.02 }}
            className="transform transition-all duration-200"
          >
            <Card className="bg-gray-900/50 backdrop-blur-xl border-purple-900/50 p-6 hover:bg-gray-900/70 hover:border-purple-500/50 hover:shadow-[0_0_15px_rgba(168,85,247,0.15)]">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-500/10 rounded-lg">
                  <Building2 className="h-6 w-6 text-purple-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Departments</p>
                  <h3 className="text-2xl font-bold text-purple-500">
                    {totalDepartments}
                    <motion.span
                      key={totalDepartments}
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="ml-2 text-xs text-purple-600"
                    >
                      live
                    </motion.span>
                  </h3>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Main Content Grid - Reorganized for better visual hierarchy */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Monthly Incidents Trend - Spans 2 columns */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            whileHover={{ scale: 1.01 }}
            className="lg:col-span-2 transform transition-all duration-200"
          >
            <Card className="bg-gray-900/50 backdrop-blur-xl border-cyan-900/50 p-6 hover:bg-gray-900/70 hover:border-cyan-500/50 hover:shadow-[0_0_25px_rgba(6,182,212,0.15)]">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 to-emerald-500">
                  Recently Reported Incidents
                </h3>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Clock className="h-4 w-4" />
                  <span>Latest Reports</span>
                </div>
              </div>
              <div className="space-y-4">
                {recentIncidents.length > 0 ? (
                  recentIncidents.map((incident) => (
                    <motion.div
                      key={incident.incident_id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="p-4 rounded-lg bg-gray-800/50 border border-gray-700/50 hover:border-cyan-500/30 transition-all duration-300"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-200">
                          {incident.incident_name || 'Unnamed Incident'}
                        </h4>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          incident.severity_name === 'Critical' ? 'bg-red-500/10 text-red-500' :
                          incident.severity_name === 'High' ? 'bg-orange-500/10 text-orange-500' :
                          incident.severity_name === 'Medium' ? 'bg-yellow-500/10 text-yellow-500' :
                          'bg-green-500/10 text-green-500'
                        }`}>
                          {incident.severity_name || 'Unknown'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">{incident.type_name || 'Unknown Type'}</span>
                        <span className="text-gray-500 text-xs">
                          {new Date(incident.incident_date).toLocaleDateString()}
                        </span>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center text-gray-400 py-4">
                    No recent incidents found
                  </div>
                )}
              </div>
            </Card>
          </motion.div>

          {/* Security Highlights Section - Replaces Response Time */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="transform transition-all duration-200"
          >
            <Card className="bg-gray-900/50 backdrop-blur-xl border-cyan-900/50 p-6 h-full hover:bg-gray-900/70 hover:border-cyan-500/50 hover:shadow-[0_0_25px_rgba(6,182,212,0.15)]">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 to-emerald-500">
                  Security Highlights
                </h3>
                <div className="p-2 bg-emerald-500/10 rounded-full">
                  <Shield className="h-4 w-4 text-emerald-500" />
                </div>
              </div>
              <div className="space-y-4">
                {recentHighlights.map((highlight, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                    className="p-4 rounded-lg bg-gray-800/50 border border-gray-700/50 hover:border-cyan-500/30 transition-all duration-300"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-200">{highlight.title}</h4>
                      <div className={`h-2 w-2 rounded-full ${
                        highlight.trend === 'positive' ? 'bg-emerald-500' :
                        highlight.trend === 'negative' ? 'bg-red-500' : 'bg-yellow-500'
                      }`}></div>
                    </div>
                    <p className="text-sm text-gray-400">{highlight.description}</p>
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Severity Distribution - Spans 2 columns */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            whileHover={{ scale: 1.01 }}
            className="lg:col-span-2 transform transition-all duration-200"
          >
            <Card className="bg-gray-900/50 backdrop-blur-xl border-cyan-900/50 p-6 hover:bg-gray-900/70 hover:border-cyan-500/50 hover:shadow-[0_0_25px_rgba(6,182,212,0.15)]">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-orange-500">
                  Severity Distribution
                </h3>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <AlertTriangle className="h-4 w-4" />
                  <span>Current Period</span>
                </div>
              </div>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={severityDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {severityDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1e1e1e', border: 'none' }}
                      labelStyle={{ color: '#94a3b8' }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </motion.div>

          {/* Incident Types */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            whileHover={{ scale: 1.01 }}
            className="transform transition-all duration-200"
          >
            <Card className="bg-gray-900/50 backdrop-blur-xl border-cyan-900/50 p-6 hover:bg-gray-900/70 hover:border-cyan-500/50 hover:shadow-[0_0_25px_rgba(6,182,212,0.15)]">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-blue-500">
                  Incident Types
                </h3>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <BarChart2 className="h-4 w-4" />
                  <span>Distribution</span>
                </div>
              </div>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={incidentTypes} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis type="number" stroke="#94a3b8" />
                    <YAxis dataKey="name" type="category" stroke="#94a3b8" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1e1e1e', border: 'none' }}
                      labelStyle={{ color: '#94a3b8' }}
                    />
                    <Bar dataKey="value" fill="#8b5cf6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
} 