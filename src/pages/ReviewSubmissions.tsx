import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "@/services/api"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { Search, FileText, CheckCircle2, XCircle, RefreshCw, AlertCircle } from "lucide-react"

interface Submission {
  id: string
  studentName: string
  enrollmentNo: string
  subject: string
  taskType: "Lab Manual" | "Assignment" | "Case Study" | "Mini Project" | "Certificate"
  submittedAt: string
  status: "Pending" | "Approved" | "Rejected" | "Resubmission Requested"
}

export const ReviewSubmissions: React.FC = () => {
  const navigate = useNavigate()
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")

  const fetchSubmissions = async () => {
    try {
      setLoading(true)
      const response = await api.get("/api/faculty/submissions")
      setSubmissions(response.data || [])
    } catch (error) {
      console.warn("Submissions API offline. Loading mockup submissions list:")
      const mockList: Submission[] = [
        { id: "sub-201", studentName: "Aarav Sharma", enrollmentNo: "0812CS221001", subject: "Database Management Systems Lab", taskType: "Lab Manual", submittedAt: "2026-06-24", status: "Pending" },
        { id: "sub-202", studentName: "Ananya Patel", enrollmentNo: "0812IT221045", subject: "Compiler Design Lab", taskType: "Assignment", submittedAt: "2026-06-23", status: "Pending" },
        { id: "sub-203", studentName: "Devansh Dixit", enrollmentNo: "0812EC221012", subject: "Database Management Systems Lab", taskType: "Mini Project", submittedAt: "2026-06-22", status: "Approved" },
        { id: "sub-204", studentName: "Riya Verma", enrollmentNo: "0812CS221088", subject: "Information Security Lab", taskType: "Certificate", submittedAt: "2026-06-20", status: "Rejected" },
        { id: "sub-205", studentName: "Kabir Mehta", enrollmentNo: "0812ME221008", subject: "Compiler Design Lab", taskType: "Lab Manual", submittedAt: "2026-06-24", status: "Pending" },
        { id: "sub-206", studentName: "Prerna Joshi", enrollmentNo: "0812CS221054", subject: "Information Security Lab", taskType: "Case Study", submittedAt: "2026-06-21", status: "Resubmission Requested" },
      ]
      setSubmissions(mockList)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSubmissions()
  }, [])

  // Filtering
  const filteredSubmissions = submissions.filter(sub => {
    const matchesSearch = 
      sub.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.enrollmentNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.subject.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === "All" || sub.status === statusFilter

    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight text-slate-800">Student Submissions Queue</h2>
          <p className="text-sm text-slate-500">Review uploads and manage dues clearances for your courses.</p>
        </div>
        <Button 
          variant="outline"
          onClick={fetchSubmissions}
          className="text-xs h-9 border-slate-200 flex items-center gap-1.5"
          disabled={loading}
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
          Reload Queue
        </Button>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <Input
            type="text"
            placeholder="Search student name, enrollment no, or subject..."
            className="pl-9 h-10 border-slate-200 text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="w-full sm:w-48">
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-10 border-slate-200 text-sm"
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending Review</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
            <option value="Resubmission Requested">Resubmission Req.</option>
          </Select>
        </div>
      </div>

      {/* Submissions Table */}
      <Card className="border-slate-200 bg-white shadow-sm overflow-hidden">
        <CardContent className="p-0 overflow-x-auto">
          {loading ? (
            <div className="p-12 text-center text-slate-400 text-xs flex flex-col items-center gap-2 justify-center">
              <span className="h-6 w-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></span>
              Synchronizing submissions database...
            </div>
          ) : filteredSubmissions.length === 0 ? (
            <div className="p-12 text-center text-slate-400 text-xs flex flex-col items-center gap-1">
              <AlertCircle className="h-5 w-5 text-slate-300" />
              No matching student submissions found.
            </div>
          ) : (
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100 text-xs text-slate-400 font-semibold uppercase tracking-wider">
                  <th className="py-4 px-6">Student Name</th>
                  <th className="py-4 px-6">Enrollment No</th>
                  <th className="py-4 px-6">Subject</th>
                  <th className="py-4 px-6">Task Type</th>
                  <th className="py-4 px-6">Submitted On</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-600">
                {filteredSubmissions.map((sub) => (
                  <tr key={sub.id} className="hover:bg-slate-50/40 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2.5">
                        <div className="h-8 w-8 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-primary font-bold text-xs">
                          {sub.studentName.charAt(0)}
                        </div>
                        <span className="font-semibold text-slate-800">{sub.studentName}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 font-mono text-xs text-slate-500">{sub.enrollmentNo}</td>
                    <td className="py-4 px-6 text-xs font-semibold text-slate-700">{sub.subject}</td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center px-2 py-0.5 rounded bg-slate-50 border border-slate-100 text-slate-600 text-[11px]">
                        {sub.taskType}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-xs text-slate-400 font-mono">{sub.submittedAt}</td>
                    <td className="py-4 px-6">
                      {sub.status === "Pending" && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-100 text-amber-600 text-[10px] font-bold uppercase animate-pulse">
                          Pending
                        </span>
                      )}
                      {sub.status === "Approved" && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 text-[10px] font-bold uppercase">
                          Approved
                        </span>
                      )}
                      {sub.status === "Rejected" && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-50 border border-rose-100 text-rose-600 text-[10px] font-bold uppercase">
                          Rejected
                        </span>
                      )}
                      {sub.status === "Resubmission Requested" && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-[10px] font-bold uppercase">
                          Resubmission
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-center">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => navigate(`/dashboard/review/${sub.id}`)}
                        className="text-xs h-8 border-slate-200 text-primary hover:bg-primary/5 hover:border-primary/20"
                      >
                        Review
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>

    </div>
  )
}
export default ReviewSubmissions
