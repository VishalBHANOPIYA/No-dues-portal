import React, { useState } from "react"
import { 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  HelpCircle, 
  FileText, 
  UserCheck, 
  Send,
  Search,
  Check,
  Ban,
  ArrowUpRight
} from "lucide-react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import toast from "react-hot-toast"

interface ClearanceItem {
  id: string
  department: string
  status: "Cleared" | "Pending" | "Hold"
  officer: string
  remarks: string
  updatedAt: string
}

interface StudentRequest {
  id: string
  name: string
  rollNo: string
  branch: string
  department: string
  status: "Pending" | "Cleared" | "Hold"
  reason?: string
}

export const DashboardHome: React.FC = () => {
  const role = localStorage.getItem("role") || "Student"
  const email = localStorage.getItem("email") || "student@cdgi.edu.in"
  
  // Student State
  const [clearanceList, setClearanceList] = useState<ClearanceItem[]>([
    { id: "1", department: "Central Library", status: "Hold", officer: "Dr. R. K. Sharma", remarks: "Return book 'Database System Concepts' (Accession No: B84210)", updatedAt: "2026-06-22" },
    { id: "2", department: "Accounts & Finance", status: "Cleared", officer: "Mr. Anil Mehta", remarks: "No dues for Semester 8", updatedAt: "2026-06-20" },
    { id: "3", department: "Hostel & Mess", status: "Cleared", officer: "Mrs. Sunita Sen", remarks: "Security deposit adjusted, keys returned", updatedAt: "2026-06-18" },
    { id: "4", department: "Sports Department", status: "Pending", officer: "Mr. Vikram Singh", remarks: "Verifying sports gear return", updatedAt: "2026-06-23" },
    { id: "5", department: "Computer Labs (CS/IT)", status: "Cleared", officer: "Dr. P. Patel", remarks: "Lab journals verified", updatedAt: "2026-06-21" },
  ])

  // Faculty/Admin Dues Request Approvals Queue State
  const [studentRequests, setStudentRequests] = useState<StudentRequest[]>([
    { id: "req-1", name: "Aarav Sharma", rollNo: "0812CS221001", branch: "Computer Science", department: "Central Library", status: "Pending" },
    { id: "req-2", name: "Ananya Patel", rollNo: "0812IT221045", branch: "Information Technology", department: "Central Library", status: "Pending" },
    { id: "req-3", name: "Devansh Dixit", rollNo: "0812EC221012", branch: "Electronics", department: "Accounts & Finance", status: "Pending" },
    { id: "req-4", name: "Riya Verma", rollNo: "0812CS221088", branch: "Computer Science", department: "Hostel & Mess", status: "Hold", reason: "Pending electricity bill payment" },
    { id: "req-5", name: "Kabir Mehta", rollNo: "0812ME221008", branch: "Mechanical", department: "Sports Department", status: "Cleared" },
  ])

  const [searchQuery, setSearchQuery] = useState("")

  // Handlers for Students
  const handleRequestClearance = () => {
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 1500)),
      {
        loading: "Submitting clearance request to departments...",
        success: "All clearance requests successfully re-submitted!",
        error: "Failed to submit request.",
      }
    )
  }

  // Handlers for Admins
  const handleApprove = (id: string, name: string) => {
    setStudentRequests(prev => 
      prev.map(req => req.id === id ? { ...req, status: "Cleared" } : req)
    )
    toast.success(`Clearance approved for ${name}`)
  }

  const handlePlaceHold = (id: string, name: string) => {
    const reason = prompt("Enter remark / reason for Hold status:")
    if (reason === null) return // Canceled
    if (!reason.trim()) {
      toast.error("Hold reason is required")
      return
    }
    
    setStudentRequests(prev => 
      prev.map(req => req.id === id ? { ...req, status: "Hold", reason } : req)
    )
    toast.error(`Placed clearance hold on ${name}`)
  }

  // Helper Stats Calculation
  const totalDues = clearanceList.length
  const clearedDues = clearanceList.filter(item => item.status === "Cleared").length
  const progressPercent = Math.round((clearedDues / totalDues) * 100)
  const holdCount = clearanceList.filter(item => item.status === "Hold").length
  const pendingCount = clearanceList.filter(item => item.status === "Pending").length

  const filteredRequests = studentRequests.filter(req => 
    req.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    req.rollNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
    req.branch.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const isStudent = role === "Student"

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-sm overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="space-y-1.5 relative z-10">
          <h2 className="text-2xl font-bold tracking-tight text-slate-800">
            Welcome back, {email.split("@")[0].replace(".", " ").toUpperCase()}!
          </h2>
          <p className="text-sm text-slate-500 max-w-xl leading-relaxed">
            {isStudent 
              ? "Verify your current clearance progress across all departments. Resolve holds to get your final digital gate pass."
              : `Managing clearances for your role: ${role} at Chameli Devi Group of Institutions.`}
          </p>
        </div>
        
        {isStudent ? (
          <Button 
            onClick={handleRequestClearance}
            className="shrink-0 font-medium bg-primary text-white hover:bg-primary/95 flex items-center gap-2 shadow-md shadow-primary/10 relative z-10"
          >
            <Send className="h-4 w-4" />
            Request Clearance Audit
          </Button>
        ) : (
          <div className="shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-50 border border-slate-200">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs font-semibold text-slate-600">Department Sync: Live</span>
          </div>
        )}
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {isStudent ? (
          <>
            <Card className="border-slate-200 shadow-sm bg-white">
              <CardContent className="pt-6 flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-primary shrink-0">
                  <CheckCircle2 className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-400">Cleared Departments</p>
                  <h3 className="text-2xl font-bold text-slate-800 mt-1">{clearedDues} <span className="text-xs font-medium text-slate-400">/ {totalDues}</span></h3>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200 shadow-sm bg-white">
              <CardContent className="pt-6 flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 shrink-0">
                  <Clock className="h-6 w-6 text-amber-600" />
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-400">Pending Review</p>
                  <h3 className="text-2xl font-bold text-slate-800 mt-1">{pendingCount}</h3>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200 shadow-sm bg-white">
              <CardContent className="pt-6 flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 shrink-0">
                  <AlertTriangle className="h-6 w-6 text-rose-600" />
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-400">Dues / Holds</p>
                  <h3 className="text-2xl font-bold text-slate-800 mt-1">{holdCount}</h3>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200 shadow-sm bg-white">
              <CardContent className="pt-6 flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-600 shrink-0">
                  <UserCheck className="h-6 w-6 text-teal-600" />
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-400">Audit Status</p>
                  <h3 className="text-sm font-bold text-teal-600 mt-2 bg-teal-500/5 px-2 py-0.5 rounded border border-teal-100 inline-block">IN PROGRESS</h3>
                </div>
              </CardContent>
            </Card>
          </>
        ) : (
          <>
            <Card className="border-slate-200 shadow-sm bg-white">
              <CardContent className="pt-6 flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-primary shrink-0">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-400">Total Requests</p>
                  <h3 className="text-2xl font-bold text-slate-800 mt-1">{studentRequests.length}</h3>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200 shadow-sm bg-white">
              <CardContent className="pt-6 flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 shrink-0">
                  <Clock className="h-6 w-6 text-amber-600" />
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-400">Pending Actions</p>
                  <h3 className="text-2xl font-bold text-slate-800 mt-1">
                    {studentRequests.filter(req => req.status === "Pending").length}
                  </h3>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200 shadow-sm bg-white">
              <CardContent className="pt-6 flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                  <CheckCircle2 className="h-6 w-6 text-emerald-600" />
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-400">Cleared Students</p>
                  <h3 className="text-2xl font-bold text-slate-800 mt-1">
                    {studentRequests.filter(req => req.status === "Cleared").length}
                  </h3>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200 shadow-sm bg-white">
              <CardContent className="pt-6 flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 shrink-0">
                  <Ban className="h-6 w-6 text-rose-600" />
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-400">Hold / Flagged</p>
                  <h3 className="text-2xl font-bold text-slate-800 mt-1">
                    {studentRequests.filter(req => req.status === "Hold").length}
                  </h3>
                </div>
              </CardContent>
            </Card>
          </>
        )}

      </div>

      {/* Progress & Table Section for Student */}
      {isStudent && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Progress Tracker Card */}
          <Card className="border-slate-200 shadow-sm bg-white lg:col-span-1 flex flex-col justify-between p-6">
            <div className="space-y-4">
              <h3 className="font-bold text-slate-800 text-base">Overall Clearance Status</h3>
              <div className="relative pt-1">
                <div className="flex mb-2 items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold inline-block py-1 px-2.5 uppercase rounded-full text-indigo-600 bg-indigo-50">
                      {progressPercent}% Complete
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-semibold text-indigo-600">
                      {clearedDues}/{totalDues} Departments
                    </span>
                  </div>
                </div>
                <div className="overflow-hidden h-2.5 text-xs flex rounded-full bg-slate-100">
                  <div
                    style={{ width: `${progressPercent}%` }}
                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary transition-all duration-500"
                  ></div>
                </div>
              </div>
            </div>

            <div className="my-6 space-y-4">
              <p className="text-xs text-slate-500 leading-relaxed font-light">
                To receive your official graduation scroll and marksheets, you must secure "Cleared" status from all five departments.
              </p>
              {holdCount > 0 && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-100 flex items-start gap-2.5">
                  <AlertTriangle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
                  <p className="text-xs text-rose-700 font-medium">
                    You have {holdCount} pending hold alert. Check department remarks to resolve outstanding dues.
                  </p>
                </div>
              )}
            </div>

            <Button variant="outline" className="w-full text-xs font-semibold text-slate-600 border-slate-200 flex items-center gap-2 hover:bg-slate-50">
              Download Temporary gate pass
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Button>
          </Card>

          {/* Department Clearance Table */}
          <Card className="border-slate-200 shadow-sm bg-white lg:col-span-2">
            <CardHeader className="border-b border-slate-100 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-slate-800 font-bold text-base">Department Verification</CardTitle>
                <CardDescription className="text-xs text-slate-400 mt-1">Status of individual university clearance logs.</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="p-0 overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100 text-xs text-slate-400 font-semibold uppercase tracking-wider">
                    <th className="py-4 px-6">Department</th>
                    <th className="py-4 px-6">Status</th>
                    <th className="py-4 px-6">Verifying Officer</th>
                    <th className="py-4 px-6">Remarks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-600">
                  {clearanceList.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/40 transition-colors">
                      <td className="py-4 px-6 font-semibold text-slate-800">{item.department}</td>
                      <td className="py-4 px-6">
                        {item.status === "Cleared" && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 text-[10px] font-semibold uppercase">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                            Cleared
                          </span>
                        )}
                        {item.status === "Pending" && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-100 text-amber-600 text-[10px] font-semibold uppercase animate-pulse">
                            <span className="h-1.5 w-1.5 rounded-full bg-amber-500"></span>
                            Pending
                          </span>
                        )}
                        {item.status === "Hold" && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-50 border border-rose-100 text-rose-600 text-[10px] font-semibold uppercase">
                            <span className="h-1.5 w-1.5 rounded-full bg-rose-500"></span>
                            Hold
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-xs text-slate-500">{item.officer}</td>
                      <td className="py-4 px-6 text-xs text-slate-400 max-w-[200px] truncate" title={item.remarks}>{item.remarks}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Requests & Table Section for Administrators */}
      {!isStudent && (
        <Card className="border-slate-200 shadow-sm bg-white">
          <CardHeader className="border-b border-slate-100 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle className="text-slate-800 font-bold text-base">Student Clearance Queue</CardTitle>
              <CardDescription className="text-xs text-slate-400 mt-1">Review requests, approve clearances, or issue hold flags for students.</CardDescription>
            </div>
            
            {/* Search Input in Header */}
            <div className="relative max-w-xs w-full">
              <Search className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <Input
                type="text"
                placeholder="Search student, Roll No..."
                className="pl-9 h-9 border-slate-200 text-xs w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </CardHeader>
          
          <CardContent className="p-0 overflow-x-auto">
            {filteredRequests.length === 0 ? (
              <div className="p-12 text-center text-slate-400 text-xs">
                No matching student clearance requests found.
              </div>
            ) : (
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100 text-xs text-slate-400 font-semibold uppercase tracking-wider">
                    <th className="py-4 px-6">Student Name</th>
                    <th className="py-4 px-6">Roll Number</th>
                    <th className="py-4 px-6">Branch</th>
                    <th className="py-4 px-6">Requested Dept</th>
                    <th className="py-4 px-6">Status</th>
                    <th className="py-4 px-6">Remarks / Reason</th>
                    <th className="py-4 px-6 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-600">
                  {filteredRequests.map((req) => (
                    <tr key={req.id} className="hover:bg-slate-50/40 transition-colors">
                      <td className="py-4 px-6 font-semibold text-slate-800">{req.name}</td>
                      <td className="py-4 px-6 text-slate-500 font-mono text-xs">{req.rollNo}</td>
                      <td className="py-4 px-6 text-xs text-slate-500">{req.branch}</td>
                      <td className="py-4 px-6 text-xs font-medium text-slate-700">{req.department}</td>
                      <td className="py-4 px-6">
                        {req.status === "Cleared" && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 text-[10px] font-semibold uppercase">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                            Cleared
                          </span>
                        )}
                        {req.status === "Pending" && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-100 text-amber-600 text-[10px] font-semibold uppercase">
                            <span className="h-1.5 w-1.5 rounded-full bg-amber-500"></span>
                            Pending
                          </span>
                        )}
                        {req.status === "Hold" && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-50 border border-rose-100 text-rose-600 text-[10px] font-semibold uppercase font-bold">
                            <span className="h-1.5 w-1.5 rounded-full bg-rose-500"></span>
                            Hold
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-xs text-slate-400 italic max-w-[200px] truncate" title={req.reason}>
                        {req.reason || "None"}
                      </td>
                      <td className="py-4 px-6 text-center">
                        <div className="inline-flex items-center gap-2">
                          <Button
                            size="sm"
                            disabled={req.status === "Cleared"}
                            onClick={() => handleApprove(req.id, req.name)}
                            className="bg-emerald-600 text-white hover:bg-emerald-700 h-8 px-3 rounded-md text-xs font-semibold"
                          >
                            <Check className="h-3.5 w-3.5 mr-1" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={req.status === "Hold"}
                            onClick={() => handlePlaceHold(req.id, req.name)}
                            className="border-slate-200 text-rose-600 hover:bg-rose-50 hover:border-rose-100 h-8 px-3 rounded-md text-xs font-semibold"
                          >
                            <Ban className="h-3.5 w-3.5 mr-1" />
                            Hold
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </CardContent>
        </Card>
      )}

    </div>
  )
}
