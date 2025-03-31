"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { AlertTriangle, Shield, X, Check, Info, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { API_URL } from "@/app/api/config"
import { toast } from "@/components/ui/use-toast"

interface IncidentType {
  type_id: number;
  type_name: string;
}

interface SeverityLevel {
  severity_id: number;
  severity_name: string;
}

interface AffectedSystem {
  system_id: number;
  system_name: string;
}

interface Department {
  department_id: number;
  department_name: string;
}

interface Guideline {
  description: string;
  risk_level: string;
}

interface Guidelines {
  DO: Guideline[];
  DONT: Guideline[];
}

export default function IncidentReportForm() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showDialog, setShowDialog] = useState(false)
  const [showReportDialog, setShowReportDialog] = useState(false)
  const [incidentTypes, setIncidentTypes] = useState<IncidentType[]>([])
  const [severityLevels, setSeverityLevels] = useState<SeverityLevel[]>([])
  const [affectedSystems, setAffectedSystems] = useState<AffectedSystem[]>([])
  const [departments, setDepartments] = useState<Department[]>([])
  const [formData, setFormData] = useState({
    title: '',
    type: '',
    severity: '',
    affected_system: '',
    department: '',
    description: '',
    initial_response: ''
  })
  const [guidelines, setGuidelines] = useState<Guidelines>({ DO: [], DONT: [] });
  const [incidentId, setIncidentId] = useState<number | null>(null);
  const [securityTeam, setSecurityTeam] = useState([]);
  const [assignmentError, setAssignmentError] = useState<string | null>(null);

  // Fetch incident types, severity levels, affected systems, and departments on component mount
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [typesRes, severityRes, systemsRes, deptsRes] = await Promise.all([
          fetch(`${API_URL}/api/incident-types`),
          fetch(`${API_URL}/api/severity-levels`),
          fetch(`${API_URL}/api/affected-systems`),
          fetch(`${API_URL}/api/departments`)
        ]);
        
        const types = await typesRes.json();
        const severity = await severityRes.json();
        const systems = await systemsRes.json();
        const departments = await deptsRes.json();
        
        setIncidentTypes(types);
        setSeverityLevels(severity);
        setAffectedSystems(systems);
        setDepartments(departments);
      } catch (error) {
        console.error("Error fetching options:", error);
      }
    };

    fetchOptions();
  }, []);

  // Function to fetch guidelines
  const fetchGuidelines = async (incidentTypeId: string) => {
    try {
      const response = await fetch(`${API_URL}/api/threat-guidelines/${incidentTypeId}`);
      if (!response.ok) throw new Error('Failed to fetch guidelines');
      const data = await response.json();
      setGuidelines(data);
    } catch (error) {
      console.error('Error fetching guidelines:', error);
    }
  };

  // Fetch security team members
  useEffect(() => {
    const fetchSecurityTeam = async () => {
      try {
        const response = await fetch(`${API_URL}/api/security-team`);
        const data = await response.json();
        setSecurityTeam(data);
      } catch (error) {
        console.error('Error fetching security team:', error);
      }
    };
    
    fetchSecurityTeam();
  }, []);

  // Add this function to generate fancy incident titles
  const generateIncidentTitle = (type: string) => {
    const timestamp = new Date().getTime().toString().slice(-4);
    const prefix = type.toUpperCase().replace(/\s+/g, '_');
    
    const titleMap: { [key: string]: string[] } = {
      'Phishing': [
        "Poseidon's Net",
        'Digital Deception',
        'Phantom Hook',
        'Shadow Bait',
        'Trojan Wave'
      ],
      'Malware': [
        'Binary Storm',
        'Code Venom',
        'Cyber Plague',
        'Digital Infection',
        'System Havoc'
      ],
      'DDoS': [
        'Tsunami Strike',
        'Digital Flood',
        'Network Storm',
        'Bandwidth Siege',
        'Traffic Tempest'
      ],
      'Data Breach': [
        'Data Eclipse',
        'Vault Break',
        'Shadow Leak',
        'Info Breach',
        'Cyber Heist'
      ],
      'Unauthorized Access': [
        'Ghost Entry',
        'Phantom Access',
        'Shadow Gate',
        'Stealth Breach',
        'Dark Portal'
      ]
    };

    const defaultTitles = [
      'Cyber Incident',
      'Security Event',
      'Digital Disruption',
      'System Alert',
      'Network Event'
    ];

    const titles = titleMap[type] || defaultTitles;
    const randomTitle = titles[Math.floor(Math.random() * titles.length)];
    
    return `${randomTitle} #${prefix}_${timestamp}`;
  };

  // Modify the handleSubmit function
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setAssignmentError(null);

    try {
      // Generate fancy title based on incident type
      const incidentType = incidentTypes.find(t => t.type_id.toString() === formData.type)?.type_name || '';
      const generatedTitle = generateIncidentTitle(incidentType);

      const formDataToSubmit = {
        title: generatedTitle, // Use generated title instead of form title
        type: formData.type,
        severity: formData.severity,
        affected_system: formData.affected_system,
        department: formData.department,
        description: formData.description,
        initial_response: formData.initial_response
      };

      console.log("Submitting form data:", formDataToSubmit);

      // First, generate SQL query using Gemini
      const queryResponse = await fetch(`${API_URL}/api/generate-insert-query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formDataToSubmit)
      });

      if (!queryResponse.ok) {
        throw new Error('Failed to generate SQL query');
      }

      const { sql_query } = await queryResponse.json();
      console.log("Generated SQL query:", sql_query); // Debug log

      // Execute the generated SQL query
      const insertResponse = await fetch(`${API_URL}/api/execute-query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: sql_query })
      });

      if (!insertResponse.ok) {
        const error = await insertResponse.json();
        throw new Error(error.detail || 'Failed to insert incident');
      }

      const result = await insertResponse.json();
      const newIncidentId = result.incident_id;
      setIncidentId(newIncidentId);

      // After successful submission, fetch guidelines
      await fetchGuidelines(formData.type);
      setShowDialog(true)

      // Assign security team after incident creation
      await assignSecurityTeam(newIncidentId);

      setFormData({
        title: '',
        type: '',
        severity: '',
        affected_system: '',
        department: '',
        description: '',
        initial_response: ''
      });

    } catch (error) {
      console.error('Error submitting incident:', error)
      toast({
        title: "Error",
        description: error.message || "Failed to submit incident report",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false)
    }
  }

  // Update the form inputs to use formData state
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // Add a function to handle the first dialog close and show the second dialog
  const handleFirstDialogClose = () => {
    setShowDialog(false)
    setShowReportDialog(true)
  }

  // Add this function to handle report download
  const handleDownloadReport = async () => {
    try {
      // Get the incident_id from the response after submission
      const response = await fetch(`${API_URL}/api/generate-report/${incidentId}`, {
        method: 'GET',
      });

      if (!response.ok) throw new Error('Failed to generate report');

      // Create blob from response
      const blob = await response.blob();
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Incident_Report.docx`;
      document.body.appendChild(a);
      a.click();
      
      // Cleanup
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      setShowReportDialog(false);
      router.push("/home");
    } catch (error) {
      console.error('Error downloading report:', error);
    }
  };

  // Add a function to handle declining the report
  const handleDeclineReport = () => {
    setShowReportDialog(false)
    router.push("/home")
  }

  // Modify the assignSecurityTeam function
  const assignSecurityTeam = async (incidentId: number) => {
    try {
      if (!securityTeam || securityTeam.length === 0) {
        throw new Error("No security team members available");
      }

      // Update the incident with assigned security team member
      const response = await fetch(`${API_URL}/api/incidents/${incidentId}/assign`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          member_id: securityTeam[0].member_id,
          status: 'Investigation'
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to assign security team');
      }

      const data = await response.json();
      return data;

    } catch (error) {
      console.error('Error assigning security team:', error);
      setAssignmentError(error.message);
      throw error;
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-3xl"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="inline-flex items-center justify-center p-2 bg-red-900/30 rounded-full mb-4"
          >
            <AlertTriangle className="h-10 w-10 text-red-500" />
          </motion.div>

          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-400"
          >
            Threat Sentinel
          </motion.h1>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-2 text-gray-400 max-w-xl mx-auto"
          >
            Report cybersecurity incidents to initiate immediate response protocols and receive guidance on containment
            strategies.
          </motion.p>
        </div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-gray-900/70 backdrop-blur-md rounded-2xl border border-red-900 p-8 shadow-[0_0_30px_rgba(239,68,68,0.2)]"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm text-gray-300">Incident Type</label>
                <Select name="type" onValueChange={(value) => setFormData({ ...formData, type: value })}>
                  <SelectTrigger className="bg-gray-800 border-red-900 focus:border-red-500 h-12 rounded-lg shadow-[0_0_10px_rgba(239,68,68,0.1)] focus:shadow-[0_0_15px_rgba(239,68,68,0.2)] transition-all duration-300">
                    <SelectValue placeholder="Select incident type" />
                  </SelectTrigger>
                  <SelectContent>
                    {incidentTypes.map((type) => (
                      <SelectItem 
                        key={`type-${type.type_id}`}
                        value={type.type_id.toString()}
                      >
                        {type.type_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-gray-300">Severity Level</label>
                <Select name="severity" onValueChange={(value) => setFormData({ ...formData, severity: value })}>
                  <SelectTrigger className="bg-gray-800 border-red-900 focus:border-red-500 h-12 rounded-lg shadow-[0_0_10px_rgba(239,68,68,0.1)] focus:shadow-[0_0_15px_rgba(239,68,68,0.2)] transition-all duration-300">
                    <SelectValue placeholder="Select severity" />
                  </SelectTrigger>
                  <SelectContent>
                    {severityLevels.map((level) => (
                      <SelectItem 
                        key={`severity-${level.severity_id}`}
                        value={level.severity_id.toString()}
                      >
                        {level.severity_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm text-gray-300">Affected System</label>
                <Select 
                  name="system" 
                  onValueChange={(value) => setFormData({ ...formData, affected_system: value })}
                >
                  <SelectTrigger className="bg-gray-800 border-red-900 focus:border-red-500 h-12 rounded-lg shadow-[0_0_10px_rgba(239,68,68,0.1)] focus:shadow-[0_0_15px_rgba(239,68,68,0.2)] transition-all duration-300">
                    <SelectValue placeholder="Select affected system" />
                  </SelectTrigger>
                  <SelectContent>
                    {affectedSystems.map((system) => (
                      <SelectItem 
                        key={`system-${system.system_id}`}
                        value={system.system_id.toString()}
                      >
                        {system.system_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-gray-300">Affected Department</label>
                <Select 
                  name="department" 
                  onValueChange={(value) => setFormData({ ...formData, department: value })}
                >
                  <SelectTrigger className="bg-gray-800 border-red-900 focus:border-red-500 h-12 rounded-lg shadow-[0_0_10px_rgba(239,68,68,0.1)] focus:shadow-[0_0_15px_rgba(239,68,68,0.2)] transition-all duration-300">
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem 
                        key={`dept-${dept.department_id}`}
                        value={dept.department_id.toString()}
                      >
                        {dept.department_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-gray-300">Incident Description</label>
              <Textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Provide a detailed description of the incident..."
                className="bg-gray-800 border-red-900 focus:border-red-500 min-h-[120px] rounded-lg"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-gray-300">Initial Response Actions Taken</label>
              <Textarea
                name="initial_response"
                value={formData.initial_response}
                onChange={handleInputChange}
                placeholder="Describe any immediate actions already taken..."
                className="bg-gray-800 border-red-900 focus:border-red-500 min-h-[80px] rounded-lg"
              />
            </div>

            <div className="pt-4">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-12 bg-gradient-to-r from-red-700 to-orange-600 hover:from-red-600 hover:to-orange-500 text-white font-bold rounded-lg transition-all duration-300 shadow-[0_0_15px_rgba(239,68,68,0.3)] hover:shadow-[0_0_25px_rgba(239,68,68,0.5)]"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Submitting Report...
                  </div>
                ) : (
                  "Submit Incident Report"
                )}
              </Button>
            </div>
          </form>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-6 text-center"
        >
          <Button variant="ghost" onClick={() => router.push("/home")} className="text-gray-400 hover:text-gray-300">
            Return to Home
          </Button>
        </motion.div>
      </motion.div>

      <AnimatePresence>
        {showDialog && (
          <Dialog open={showDialog} onOpenChange={setShowDialog}>
            <DialogContent className="bg-gray-900 border border-red-900 text-white max-w-4xl w-full">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-400 flex items-center gap-2">
                  <Shield className="h-5 w-5 text-red-500" />
                  Incident Reported
                </DialogTitle>
                <DialogDescription className="text-gray-400">
                  Your incident has been successfully reported. Here are the specific guidelines for this type of incident:
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-2">
                <h3 className="text-lg font-medium text-red-400">Do's and Don'ts After This Incident</h3>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    {guidelines.DO.map((guideline, index) => (
                      <div key={`do-${index}`} className="flex items-start gap-2 bg-gray-800/50 p-2 rounded">
                        <div className="mt-1 bg-green-900/30 p-1 rounded-full">
                          <Check className="h-4 w-4 text-green-500" />
                        </div>
                        <div className="flex-1">
                          <p className="text-green-400 font-medium">Do:</p>
                          <p className="text-gray-400 text-sm">{guideline.description}</p>
                          <span className={`text-xs ${
                            guideline.risk_level === 'CRITICAL' ? 'text-red-400' :
                            guideline.risk_level === 'HIGH' ? 'text-orange-400' :
                            guideline.risk_level === 'MEDIUM' ? 'text-yellow-400' :
                            'text-blue-400'
                          }`}>
                            Risk Level: {guideline.risk_level}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2">
                    {guidelines.DONT.map((guideline, index) => (
                      <div key={`dont-${index}`} className="flex items-start gap-2 bg-gray-800/50 p-2 rounded">
                        <div className="mt-1 bg-red-900/30 p-1 rounded-full">
                          <X className="h-4 w-4 text-red-500" />
                        </div>
                        <div className="flex-1">
                          <p className="text-red-400 font-medium">Don't:</p>
                          <p className="text-gray-400 text-sm">{guideline.description}</p>
                          <span className={`text-xs ${
                            guideline.risk_level === 'CRITICAL' ? 'text-red-400' :
                            guideline.risk_level === 'HIGH' ? 'text-orange-400' :
                            guideline.risk_level === 'MEDIUM' ? 'text-yellow-400' :
                            'text-blue-400'
                          }`}>
                            Risk Level: {guideline.risk_level}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-blue-900/20 border border-blue-900 rounded-lg p-3 mt-2">
                  <div className="flex items-start gap-2">
                    <Info className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                    <p className="text-gray-300 text-sm">
                      A security analyst has been assigned to your case and will contact you within 15 minutes. Please
                      keep your communication channels open.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-4 mt-2">
                <Button
                  onClick={handleFirstDialogClose}
                  className="bg-gradient-to-r from-red-700 to-orange-600 hover:from-red-600 hover:to-orange-500 text-white"
                >
                  Continue
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showReportDialog && (
          <Dialog open={showReportDialog} onOpenChange={setShowReportDialog}>
            <DialogContent className="bg-gray-900 border border-cyan-900 text-white max-w-md">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 flex items-center gap-2">
                  <Download className="h-5 w-5 text-cyan-500" />
                  Download Incident Report
                </DialogTitle>
                <DialogDescription className="text-gray-400">
                  Would you like to download a detailed report of this incident in DOCX format?
                </DialogDescription>
              </DialogHeader>

              <div className="py-4">
                <p className="text-gray-300">
                  The report will include all the information you've provided along with recommended actions and a case
                  reference number.
                </p>
              </div>

              <div className="flex justify-end gap-4">
                <Button
                  variant="outline"
                  onClick={handleDeclineReport}
                  className="border-gray-700 text-gray-300 hover:bg-gray-800"
                >
                  No, Return to Home
                </Button>
                <Button
                  onClick={handleDownloadReport}
                  className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white"
                >
                  Yes, Download Report
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </div>
  )
}

