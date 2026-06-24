import React, { useEffect, useState } from "react"
import api from "@/services/api"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { Download, Search, RefreshCw, GraduationCap, CheckCircle2, Clock, AlertCircle } from "lucide-react"
import toast from "react-hot-toast"

interface StudentRow {
  id: string
  studentName: string
  enrollmentNo: string
  semester: string
  duesClearedCount: number
  totalDuesCount: number
  status: "Cleared" | "Pending"
}

export const CoordinatorDashboard: React.FC = () => {
  const [students, setStudents] = useState<StudentRow[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")

  const fetchStudents = async () => {
    try {
      setLoading(true)
      const response = await api.get("/api/coordinator/students")
      setStudents(response.data || [])
    } catch (error) {
      console.warn("Coordinator API offline, using mock classroom statistics")
      
      const mockList: StudentRow[] = [
        { id: "stud-101", studentName: "Aarav Sharma", enrollmentNo: "0812CS221001", semester: "VIII", duesClearedCount: 4, totalDuesCount: 5, status: "Pending" },
        { id: "stud-102", studentName: "Aditi Joshi", enrollmentNo: "0812CS221005", semester: "VIII", duesClearedCount: 5, totalDuesCount: 5, status: "Cleared" },
        { id: "stud-103", studentName: "Kabir Mehta", enrollmentNo: "0812CS221034", semester: "VIII", duesClearedCount: 3, totalDuesCount: 5, status: "Pending" },
        { id: "stud-104", studentName: "Riya Verma", enrollmentNo: "0812CS221088", semester: "VIII", duesClearedCount: 5, totalDuesCount: 5, status: "Cleared" },
        { id: "stud-105", studentName: "Devansh Dixit", enrollmentNo: "0812CS221021", semester: "VIII", duesClearedCount: 5, totalDuesCount: 5, status: "Cleared" },
        { id: "stud-106", studentName: "Ananya Patel", enrollmentNo: "0812CS221011", semester: "VIII", duesClearedCount: 2, totalDuesCount: 5, status: "Pending" },
        { id: "stud-107", studentName: "Prerna Joshi", enrollmentNo: "0812CS221054", semester: "VIII", duesClearedCount: 4, totalDuesCount: 5, status: "Pending" },
        { id: "stud-108", studentName: "Yash Vardhan", enrollmentNo: "0812CS221099", semester: "VIII", duesClearedCount: 5, totalDuesCount: 5, status: "Cleared" }
      ]
      setStudents(mockList)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStudents()
  }, [])

  // Filtering
  const filteredStudents = students.filter(student => {
    const matchesSearch = 
      student.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.enrollmentNo.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = statusFilter === "All" || student.status === statusFilter

    return matchesSearch && matchesStatus
  })

  // Export to CSV Function
  const exportToCSV = () => {
    if (filteredStudents.length === 0) {
      toast.error("No student data available to export.")
      return
    }

    const headers = ["Student Name", "Enrollment No", "Semester", "Dues Cleared", "Total Dues", "Status"]
    const rows = filteredStudents.map(s => [
      s.studentName,
      s.enrollmentNo,
      s.semester,
      s.duesClearedCount,
      s.totalDuesCount,
      s.status
    ])

    const csvContent = 
      "data:text/csv;charset=utf-8," + 
      [headers.join(","), ...rows.map(e => e.join(","))].join("\n")

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", `CDGI_NoDues_ClassReport_${new Date().toISOString().split("T")[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast.success("CSV report downloaded successfully!")
  }

  // Summary counts
  const totalStudents = students.length
  const clearedStudents = students.filter(s => s.status === "Cleared").length
  const pendingStudents = students.filter(s => s.status === "Pending").length

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight text-slate-800">Class Coordinator Dashboard</h2>
          <p className="text-sm text-slate-500">Overview dues completion status for CS-Branch VIII Semester.</p>
        </div>
        
        <div className="flex gap-2">
          <Button
            onClick={exportToCSV}
            className="text-xs bg-emerald-600 text-white hover:bg-emerald-700 flex items-center gap-1.5 h-9 font-semibold shadow-md shadow-emerald-600/10"
          >
            <Download className="h-4 w-4" />
            Export Class CSV
          </Button>
          <Button
            variant="outline"
            onClick={fetchStudents}
            className="text-xs h-9 border-slate-200"
            disabled={loading}
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </div>

      {/* Classroom Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Class Count */}
        <Card className="border-slate-200 shadow-sm bg-white">
          <CardContent className="pt-5 flex items-center gap-4">
            <div className="h-10 w-10 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-primary shrink-0">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Strength</p>
              <h3 className="text-xl font-extrabold text-slate-800 mt-0.5">{totalStudents}</h3>
            </div>
          </CardContent>
        </Card>

        {/* Cleared Count */}
        <Card className="border-slate-200 shadow-sm bg-white">
          <CardContent className="pt-5 flex items-center gap-4">
            <div className="h-10 w-10 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-650 shrink-0">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Clearance Approved</p>
              <h3 className="text-xl font-extrabold text-slate-800 mt-0.5">{clearedStudents}</h3>
            </div>
          </CardContent>
        </Card>

        {/* Pending Count */}
        <Card className="border-slate-200 shadow-sm bg-white">
          <CardContent className="pt-5 flex items-center gap-4">
            <div className="h-10 w-10 rounded-lg bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 shrink-0">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Clearance Pending</p>
              <h3 className="text-xl font-extrabold text-slate-800 mt-0.5">{pendingStudents}</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <Input
            type="text"
            placeholder="Search student by name or enrollment number..."
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
            <option value="All">All Clearance Status</option>
            <option value="Cleared">Cleared Only</option>
            <option value="Pending">Pending Only</option>
          </Select>
        </div>
      </div>

      {/* Classroom Status Grid */}
      <Card className="border-slate-200 bg-white shadow-sm overflow-hidden">
        <CardContent className="p-0 overflow-x-auto">
          {loading ? (
            <div className="p-12 text-center text-slate-400 text-xs flex flex-col items-center gap-2 justify-center">
              <span className="h-6 w-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></span>
              Compiling class clearance index...
            </div>
          ) : filteredStudents.length === 0 ? (
            <div className="p-12 text-center text-slate-400 text-xs flex flex-col items-center gap-1">
              <AlertCircle className="h-5 w-5 text-slate-350" />
              No student records matched the active filters.
            </div>
          ) : (
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100 text-xs text-slate-400 font-semibold uppercase tracking-wider">
                  <th className="py-4 px-6">Student Name</th>
                  <th className="py-4 px-6">Enrollment No</th>
                  <th className="py-4 px-6">Semester</th>
                  <th className="py-4 px-6">Clearance Ratio</th>
                  <th className="py-4 px-6">Clearance Progress</th>
                  <th className="py-4 px-6">Dues Status</th>
                  <th className="py-4 px-6 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-650">
                {filteredStudents.map((stud) => {
                  const pct = Math.round((stud.duesClearedCount / stud.totalDuesCount) * 100)
                  return (
                    <tr key={stud.id} className="hover:bg-slate-50/40 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2.5">
                          <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 font-bold text-xs">
                            {stud.studentName.charAt(0)}
                          </div>
                          <span className="font-semibold text-slate-800">{stud.studentName}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 font-mono text-xs text-slate-500">{stud.enrollmentNo}</td>
                      <td className="py-4 px-6 text-xs text-slate-600">{stud.semester} Semester</td>
                      <td className="py-4 px-6 font-semibold text-slate-700 text-xs">
                        {stud.duesClearedCount} / {stud.totalDuesCount} departments
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="h-2 w-28 bg-slate-100 rounded-full overflow-hidden border border-slate-200/50">
                            <div 
                              className={`h-full rounded-full transition-all duration-500 ${pct === 100 ? "bg-emerald-500" : "bg-primary"}`}
                              style={{ width: `${pct}%` }}
                            ></div>
                          </div>
                          <span className="text-[10px] font-bold text-slate-500 font-mono">{pct}%</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        {stud.status === "Cleared" ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 text-[10px] font-bold uppercase">
                            No Dues
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-100 text-amber-600 text-[10px] font-bold uppercase">
                            Pending holds
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-center">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => navigate(`/dashboard/certificate?studentId=${stud.id}`)}
                          className="text-xs h-8 border-slate-200 text-slate-600 hover:bg-slate-50"
                        >
                          View Certificate
                        </Button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>

    </div>
  )
}
export default CoordinatorDashboard
