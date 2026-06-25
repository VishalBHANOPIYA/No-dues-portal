import React, { useEffect, useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { 
  BookOpen, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  FileText, 
  User, 
  Plus, 
  ArrowRight,
  RefreshCw
} from "lucide-react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import api from "@/services/api"

interface FacultyStats {
  subjects: number
  pending: number
  approved: number
  rejected: number
}

interface RecentSubmission {
  id: string
  studentName: string
  enrollmentNo: string
  subject: string
  taskType: string
  submittedAt: string
  status: "Pending" | "Approved" | "Rejected" | "Resubmission Requested"
}

export const FacultyDashboard: React.FC = () => {
  const navigate = useNavigate()
  const [stats, setStats] = useState<FacultyStats>({
    subjects: 3,
    pending: 4,
    approved: 12,
    rejected: 2,
  })
  const [submissions, setSubmissions] = useState<RecentSubmission[]>([])
  const [loading, setLoading] = useState(true)

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      // Attempt to load submissions and subjects from API
      const [submissionsRes, subjectsRes] = await Promise.all([
        api.get("/api/faculty/submissions"),
        api.get("/api/faculty/subjects")
      ])
      
      const subList = submissionsRes.data || []
      const subCount = subjectsRes.data?.length || 3
      
      setStats({
        subjects: subCount,
        pending: subList.filter((s: any) => s.status === "Pending").length,
        approved: subList.filter((s: any) => s.status === "Approved").length,
        rejected: subList.filter((s: any) => s.status === "Rejected").length,
      })
      
      setSubmissions(subList.slice(0, 5))
    } catch (error) {
      console.warn("Faculty API offline, using premium mock dashboard stats & submissions")
      
      // Fallback mock submissions
      const mockSubmissions: RecentSubmission[] = [
        { id: "sub-201", studentName: "Aarav Sharma", enrollmentNo: "0812CS221001", subject: "Database Management Systems Lab", taskType: "Lab Manual", submittedAt: "2026-06-24", status: "Pending" },
        { id: "sub-202", studentName: "Ananya Patel", enrollmentNo: "0812IT221045", subject: "Compiler Design Lab", taskType: "Assignment", submittedAt: "2026-06-23", status: "Pending" },
        { id: "sub-203", studentName: "Devansh Dixit", enrollmentNo: "0812EC221012", subject: "Database Management Systems Lab", taskType: "Mini Project", submittedAt: "2026-06-22", status: "Approved" },
        { id: "sub-204", studentName: "Riya Verma", enrollmentNo: "0812CS221088", subject: "Information Security Lab", taskType: "Certificate", submittedAt: "2026-06-20", status: "Rejected" },
        { id: "sub-205", studentName: "Kabir Mehta", enrollmentNo: "0812ME221008", subject: "Compiler Design Lab", taskType: "Lab Manual", submittedAt: "2026-06-24", status: "Pending" },
      ]
      setSubmissions(mockSubmissions)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()
  }, [])

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight text-slate-800">Faculty Dashboard</h2>
          <p className="text-sm text-slate-500">Track student compliance submissions and due approvals.</p>
        </div>
        
        <div className="flex gap-2">
          <Button 
            onClick={() => navigate("/dashboard/create-assignment")}
            className="text-xs bg-primary text-white hover:bg-primary/95 flex items-center gap-1.5 h-9"
          >
            <Plus className="h-4 w-4" />
            Create Task / Due Check
          </Button>
          <Button
            variant="outline"
            onClick={fetchDashboardData}
            className="text-xs h-9 border-slate-200"
            disabled={loading}
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Subjects */}
        <Card className="border-slate-200 shadow-sm bg-white hover:shadow-md transition-shadow">
          <CardContent className="pt-6 flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
              <BookOpen className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Subjects</p>
              <h3 className="text-2xl font-bold text-slate-800 mt-1">{stats.subjects}</h3>
            </div>
          </CardContent>
        </Card>

        {/* Pending Reviews */}
        <Card className="border-slate-200 shadow-sm bg-white hover:shadow-md transition-shadow">
          <CardContent className="pt-6 flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 shrink-0">
              <Clock className="h-6 w-6 animate-pulse" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Pending Reviews</p>
              <h3 className="text-2xl font-bold text-slate-800 mt-1">{stats.pending}</h3>
            </div>
          </CardContent>
        </Card>

        {/* Approved */}
        <Card className="border-slate-200 shadow-sm bg-white hover:shadow-md transition-shadow">
          <CardContent className="pt-6 flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Approved</p>
              <h3 className="text-2xl font-bold text-slate-800 mt-1">{stats.approved}</h3>
            </div>
          </CardContent>
        </Card>

        {/* Rejected */}
        <Card className="border-slate-200 shadow-sm bg-white hover:shadow-md transition-shadow">
          <CardContent className="pt-6 flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 shrink-0">
              <XCircle className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Rejected / Hold</p>
              <h3 className="text-2xl font-bold text-slate-800 mt-1">{stats.rejected}</h3>
            </div>
          </CardContent>
        </Card>

      </div>

      {/* Recent Submissions List Table Preview */}
      <Card className="border-slate-200 bg-white shadow-sm overflow-hidden">
        <CardHeader className="border-b border-slate-100 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-slate-800 font-bold text-base">Recent Student Submissions</CardTitle>
            <CardDescription className="text-xs text-slate-400 mt-0.5">Quick lookup of recently uploaded documents waiting review.</CardDescription>
          </div>
          <Link 
            to="/dashboard/review"
            className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
          >
            View All Queue
            <ArrowRight className="h-3 w-3" />
          </Link>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          {loading ? (
            <div className="p-12 text-center text-slate-400 text-xs flex flex-col items-center gap-2 justify-center">
              <span className="h-5 w-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></span>
              Synchronizing records...
            </div>
          ) : submissions.length === 0 ? (
            <div className="p-12 text-center text-slate-400 text-xs">
              No submissions received yet.
            </div>
          ) : (
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100 text-xs text-slate-400 font-semibold uppercase tracking-wider">
                  <th className="py-4 px-6">Student</th>
                  <th className="py-4 px-6">Enrollment No</th>
                  <th className="py-4 px-6">Subject</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-600">
                {submissions.map((sub) => (
                  <tr key={sub.id} className="hover:bg-slate-50/40 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <div className="h-7 w-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 font-bold text-xs">
                          {sub.studentName.charAt(0)}
                        </div>
                        <span className="font-semibold text-slate-800">{sub.studentName}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 font-mono text-xs text-slate-500">{sub.enrollmentNo}</td>
                    <td className="py-4 px-6 text-xs text-slate-700">{sub.subject} <span className="text-[10px] text-slate-400">({sub.taskType})</span></td>
                    <td className="py-4 px-6">
                      {sub.status === "Pending" && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-100 text-amber-600 text-[10px] font-bold uppercase animate-pulse">
                          Pending Review
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
export default FacultyDashboard
