import React, { useEffect, useState } from "react"
import api from "@/services/api"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { 
  Users, 
  BookOpen, 
  Settings, 
  BarChart4, 
  UserPlus, 
  Trash2, 
  ToggleLeft, 
  ToggleRight, 
  PlusCircle, 
  CheckCircle2, 
  AlertCircle 
} from "lucide-react"
import toast from "react-hot-toast"

interface Faculty {
  id: string
  name: string
  email: string
  department: string
}

interface Allocation {
  id: string
  facultyName: string
  subjectName: string
}

export const HODAdminPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"faculty" | "allocation" | "semester" | "reports">("faculty")
  
  // Faculty Management State
  const [faculties, setFaculties] = useState<Faculty[]>([
    { id: "fac-1", name: "Dr. Sandeep Poddar", email: "s.poddar@cdgi.edu.in", department: "Computer Science" },
    { id: "fac-2", name: "Prof. Neha Sharma", email: "neha.sharma@cdgi.edu.in", department: "Information Technology" },
    { id: "fac-3", name: "Dr. R.K. Vyas", email: "rk.vyas@cdgi.edu.in", department: "Computer Science" }
  ])
  const [newFacultyName, setNewFacultyName] = useState("")
  const [newFacultyEmail, setNewFacultyEmail] = useState("")
  const [newFacultyDept, setNewFacultyDept] = useState("Computer Science")

  // Subject Allocation State
  const [allocations, setAllocations] = useState<Allocation[]>([
    { id: "alloc-1", facultyName: "Dr. Sandeep Poddar", subjectName: "Database Management Systems" },
    { id: "alloc-2", facultyName: "Prof. Neha Sharma", subjectName: "Compiler Design" }
  ])
  const [allocateFacultyId, setAllocateFacultyId] = useState("")
  const [allocateSubjectName, setAllocateSubjectName] = useState("Information Security")

  // Semester Management State
  const [isCycleOpen, setIsCycleOpen] = useState(true)
  const [academicYear, setAcademicYear] = useState("2025-2026")
  const [semesterCode, setSemesterCode] = useState("VIII Semester")

  // Fetch initial allocations & staff (or simulate)
  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const response = await api.get("/api/admin/config")
        if (response.data) {
          setIsCycleOpen(response.data.isCycleOpen)
          setAcademicYear(response.data.academicYear)
        }
      } catch (error) {
        console.warn("Admin panel API offline, using local configuration states.")
      }
    }
    fetchAdminData()
  }, [])

  // Add Faculty Handler
  const handleAddFaculty = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newFacultyName || !newFacultyEmail) {
      toast.error("Please fill in name and email fields.")
      return
    }
    const newFaculty: Faculty = {
      id: `fac-${Date.now()}`,
      name: newFacultyName,
      email: newFacultyEmail,
      department: newFacultyDept
    }
    setFaculties([...faculties, newFaculty])
    setNewFacultyName("")
    setNewFacultyEmail("")
    toast.success("Faculty member registered successfully!")
  }

  // Remove Faculty Handler
  const handleRemoveFaculty = (id: string) => {
    setFaculties(faculties.filter(f => f.id !== id))
    toast.success("Faculty member removed successfully.")
  }

  // Allocate Subject Handler
  const handleAllocateSubject = (e: React.FormEvent) => {
    e.preventDefault()
    const fac = faculties.find(f => f.id === allocateFacultyId) || faculties[0]
    if (!fac) {
      toast.error("Please select a valid faculty member.")
      return
    }

    const exists = allocations.find(a => a.facultyName === fac.name && a.subjectName === allocateSubjectName)
    if (exists) {
      toast.error("This allocation already exists.")
      return
    }

    const newAlloc: Allocation = {
      id: `alloc-${Date.now()}`,
      facultyName: fac.name,
      subjectName: allocateSubjectName
    }
    setAllocations([...allocations, newAlloc])
    toast.success(`Allocated ${allocateSubjectName} to ${fac.name}!`)
  }

  // Toggle Clearance Cycle
  const handleToggleCycle = async () => {
    try {
      // API check toggle
      await api.post("/api/admin/toggle-cycle", { isCycleOpen: !isCycleOpen })
      setIsCycleOpen(!isCycleOpen)
      toast.success(`Academic clearance cycle has been ${!isCycleOpen ? "OPENED" : "CLOSED"}.`)
    } catch (error) {
      setIsCycleOpen(!isCycleOpen)
      toast.success(`Demo Mode: Clearance cycle ${!isCycleOpen ? "Opened" : "Closed"}!`)
    }
  }

  // Reports data for SVG chart
  const reportsData = [
    { subject: "DBMS", cleared: 45, pending: 15 },
    { subject: "Compiler Design", cleared: 38, pending: 22 },
    { subject: "Information Sec.", cleared: 52, pending: 8 },
    { subject: "Comp. Networks", cleared: 30, pending: 30 },
    { subject: "Machine Learning", cleared: 48, pending: 12 },
  ]

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="space-y-1">
        <h2 className="text-2xl font-bold tracking-tight text-slate-800">HOD / Admin Operations Panel</h2>
        <p className="text-sm text-slate-500">Configure academic systems, handle faculty registers, and review clearance cycles.</p>
      </div>

      {/* Tabs list */}
      <div className="flex border-b border-slate-200 gap-2">
        <button
          onClick={() => setActiveTab("faculty")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all
            ${activeTab === "faculty" 
              ? "border-primary text-primary font-semibold bg-primary/5 rounded-t-lg" 
              : "border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50"}
          `}
        >
          <Users className="h-4 w-4" />
          Faculty Management
        </button>
        <button
          onClick={() => setActiveTab("allocation")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all
            ${activeTab === "allocation" 
              ? "border-primary text-primary font-semibold bg-primary/5 rounded-t-lg" 
              : "border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50"}
          `}
        >
          <BookOpen className="h-4 w-4" />
          Subject Allocation
        </button>
        <button
          onClick={() => setActiveTab("semester")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all
            ${activeTab === "semester" 
              ? "border-primary text-primary font-semibold bg-primary/5 rounded-t-lg" 
              : "border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50"}
          `}
        >
          <Settings className="h-4 w-4" />
          Semester Control
        </button>
        <button
          onClick={() => setActiveTab("reports")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all
            ${activeTab === "reports" 
              ? "border-primary text-primary font-semibold bg-primary/5 rounded-t-lg" 
              : "border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50"}
          `}
        >
          <BarChart4 className="h-4 w-4" />
          Analytics Reports
        </button>
      </div>

      {/* Tabs Content */}
      <div className="mt-4">
        
        {/* FACULTY MANAGEMENT */}
        {activeTab === "faculty" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Add Faculty Form */}
            <Card className="border-slate-200 bg-white shadow-sm lg:col-span-1">
              <CardHeader className="border-b border-slate-100">
                <CardTitle className="text-slate-800 text-sm font-bold flex items-center gap-1.5">
                  <UserPlus className="h-4 w-4 text-primary" />
                  Register Faculty Member
                </CardTitle>
                <CardDescription className="text-[10px] text-slate-450">Add a new professor to department ledger.</CardDescription>
              </CardHeader>
              <form onSubmit={handleAddFaculty}>
                <CardContent className="space-y-4 pt-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="facName" className="text-[11px] font-bold text-slate-600">Faculty Full Name</Label>
                    <Input 
                      id="facName"
                      type="text" 
                      placeholder="e.g. Dr. Ramesh Kumar"
                      value={newFacultyName}
                      onChange={(e) => setNewFacultyName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="facEmail" className="text-[11px] font-bold text-slate-600">College Email Address</Label>
                    <Input 
                      id="facEmail"
                      type="email" 
                      placeholder="e.g. ramesh.kumar@cdgi.edu.in"
                      value={newFacultyEmail}
                      onChange={(e) => setNewFacultyEmail(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="facDept" className="text-[11px] font-bold text-slate-600">Department</Label>
                    <Select 
                      id="facDept"
                      value={newFacultyDept}
                      onChange={(e) => setNewFacultyDept(e.target.value)}
                    >
                      <option value="Computer Science">Computer Science (CSE)</option>
                      <option value="Information Technology">Information Technology (IT)</option>
                      <option value="Electronics & Communication">Electronics & Comm (EC)</option>
                      <option value="Mechanical Engineering">Mechanical Eng (ME)</option>
                    </Select>
                  </div>
                </CardContent>
                <CardFooter className="border-t border-slate-100 pt-4 flex justify-end">
                  <Button type="submit" size="sm" className="text-xs bg-primary text-white hover:bg-primary/95">
                    Add Faculty
                  </Button>
                </CardFooter>
              </form>
            </Card>

            {/* List Faculty */}
            <Card className="border-slate-200 bg-white shadow-sm lg:col-span-2 overflow-hidden">
              <CardHeader className="border-b border-slate-100">
                <CardTitle className="text-slate-800 text-sm font-bold">Active Faculty Directory</CardTitle>
                <CardDescription className="text-[10px] text-slate-450">Faculty members authorized to review student submissions.</CardDescription>
              </CardHeader>
              <CardContent className="p-0 overflow-x-auto">
                <table className="w-full text-left text-xs whitespace-nowrap">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                      <th className="py-3 px-4">Name</th>
                      <th className="py-3 px-4">Email</th>
                      <th className="py-3 px-4">Department</th>
                      <th className="py-3 px-4 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-650">
                    {faculties.map((fac) => (
                      <tr key={fac.id} className="hover:bg-slate-50/50">
                        <td className="py-3 px-4 font-semibold text-slate-800">{fac.name}</td>
                        <td className="py-3 px-4 font-mono">{fac.email}</td>
                        <td className="py-3 px-4">{fac.department}</td>
                        <td className="py-3 px-4 text-center">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleRemoveFaculty(fac.id)}
                            className="text-rose-500 hover:text-rose-700 hover:bg-rose-50 p-1.5 h-auto rounded"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </div>
        )}

        {/* SUBJECT ALLOCATION */}
        {activeTab === "allocation" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Allocation Form */}
            <Card className="border-slate-200 bg-white shadow-sm lg:col-span-1">
              <CardHeader className="border-b border-slate-100">
                <CardTitle className="text-slate-800 text-sm font-bold flex items-center gap-1.5">
                  <PlusCircle className="h-4 w-4 text-primary" />
                  New Allocation Assignment
                </CardTitle>
                <CardDescription className="text-[10px] text-slate-450">Map active course syllabus checklist to faculty auditors.</CardDescription>
              </CardHeader>
              <form onSubmit={handleAllocateSubject}>
                <CardContent className="space-y-4 pt-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="allocFac" className="text-[11px] font-bold text-slate-600">Select Professor</Label>
                    <Select 
                      id="allocFac"
                      value={allocateFacultyId}
                      onChange={(e) => setAllocateFacultyId(e.target.value)}
                    >
                      <option value="">-- Choose Faculty --</option>
                      {faculties.map((f) => (
                        <option key={f.id} value={f.id}>{f.name}</option>
                      ))}
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="allocSub" className="text-[11px] font-bold text-slate-600">Course Syllabus Checkpoint</Label>
                    <Select 
                      id="allocSub"
                      value={allocateSubjectName}
                      onChange={(e) => setAllocateSubjectName(e.target.value)}
                    >
                      <option value="Database Management Systems">Database Management Systems</option>
                      <option value="Compiler Design">Compiler Design</option>
                      <option value="Information Security">Information Security</option>
                      <option value="Computer Networks">Computer Networks</option>
                      <option value="Machine Learning">Machine Learning</option>
                    </Select>
                  </div>
                </CardContent>
                <CardFooter className="border-t border-slate-100 pt-4 flex justify-end">
                  <Button type="submit" size="sm" className="text-xs bg-primary text-white hover:bg-primary/95">
                    Allocate Course
                  </Button>
                </CardFooter>
              </form>
            </Card>

            {/* Allocation Table */}
            <Card className="border-slate-200 bg-white shadow-sm lg:col-span-2 overflow-hidden">
              <CardHeader className="border-b border-slate-100">
                <CardTitle className="text-slate-800 text-sm font-bold">Active Course Assignments</CardTitle>
                <CardDescription className="text-[10px] text-slate-450">Active course ledger map mapping professors to compliance checks.</CardDescription>
              </CardHeader>
              <CardContent className="p-0 overflow-x-auto">
                <table className="w-full text-left text-xs whitespace-nowrap">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                      <th className="py-3 px-4">Subject Course</th>
                      <th className="py-3 px-4">Allocated Professor</th>
                      <th className="py-3 px-4 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-650">
                    {allocations.map((a) => (
                      <tr key={a.id} className="hover:bg-slate-50/50">
                        <td className="py-3 px-4 font-semibold text-slate-850">{a.subjectName}</td>
                        <td className="py-3 px-4 text-slate-700 font-medium">{a.facultyName}</td>
                        <td className="py-3 px-4 text-center">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => setAllocations(allocations.filter(al => al.id !== a.id))}
                            className="text-rose-500 hover:text-rose-700 hover:bg-rose-50 p-1.5 h-auto rounded"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </div>
        )}

        {/* SEMESTER CONTROL */}
        {activeTab === "semester" && (
          <div className="max-w-2xl mx-auto space-y-6">
            <Card className="border-slate-200 bg-white shadow-sm overflow-hidden">
              <CardHeader className="border-b border-slate-100">
                <CardTitle className="text-slate-850 text-base font-bold">Clearance Cycle Settings</CardTitle>
                <CardDescription className="text-xs text-slate-400">Open or Close academic clearance cycle checkpoints globally.</CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                
                {/* Visual state card */}
                <div className={`p-4 rounded-xl border flex items-center justify-between
                  ${isCycleOpen 
                    ? "bg-emerald-50/50 border-emerald-100 text-emerald-850" 
                    : "bg-slate-50 border-slate-150 text-slate-500"}
                `}>
                  <div className="flex items-center gap-3">
                    {isCycleOpen ? (
                      <CheckCircle2 className="h-6 w-6 text-emerald-600 shrink-0" />
                    ) : (
                      <AlertCircle className="h-6 w-6 text-slate-400 shrink-0" />
                    )}
                    <div>
                      <h4 className="text-sm font-bold">Global Cycle: {isCycleOpen ? "ACTIVE / OPEN" : "LOCKED / CLOSED"}</h4>
                      <p className="text-[10px] text-slate-500 mt-0.5 leading-snug">
                        {isCycleOpen 
                          ? "Students can currently submit clearance records and view clearance ratios." 
                          : "No new submissions can be initiated. All compliance holds are locked."}
                      </p>
                    </div>
                  </div>

                  <button 
                    onClick={handleToggleCycle}
                    className="p-1 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {isCycleOpen ? (
                      <ToggleRight className="h-10 w-10 text-emerald-600" />
                    ) : (
                      <ToggleLeft className="h-10 w-10 text-slate-400" />
                    )}
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="acadYear" className="text-[11px] font-bold text-slate-600">Active Academic Session</Label>
                    <Input 
                      id="acadYear"
                      type="text" 
                      value={academicYear} 
                      onChange={(e) => setAcademicYear(e.target.value)} 
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="semCode" className="text-[11px] font-bold text-slate-600">Target Semesters</Label>
                    <Input 
                      id="semCode"
                      type="text" 
                      value={semesterCode} 
                      onChange={(e) => setSemesterCode(e.target.value)} 
                    />
                  </div>
                </div>

              </CardContent>
              <CardFooter className="border-t border-slate-100 p-4 bg-slate-50/50 flex justify-end">
                <Button size="sm" onClick={() => toast.success("Configuration parameters updated!")}>
                  Save parameters
                </Button>
              </CardFooter>
            </Card>
          </div>
        )}

        {/* ANALYTICS REPORTS */}
        {activeTab === "reports" && (
          <div className="space-y-6">
            <Card className="border-slate-200 bg-white shadow-sm">
              <CardHeader className="border-b border-slate-100 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-slate-850 text-sm font-bold">Clearance Progress per Course</CardTitle>
                  <CardDescription className="text-[10px] text-slate-400">Total cleared (green) vs. pending (amber) student submissions count.</CardDescription>
                </div>
                <div className="flex gap-4 text-[10px] font-bold">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 bg-emerald-500 rounded-sm"></span>
                    <span className="text-slate-500">Cleared Students</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 bg-amber-500 rounded-sm"></span>
                    <span className="text-slate-500">Pending Holds</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                
                {/* GORGEOUS PURE SVG DOUBLE BAR CHART */}
                <div className="w-full flex justify-center py-4">
                  <svg className="w-full max-w-xl h-64 overflow-visible" viewBox="0 0 500 220" xmlns="http://www.w3.org/2000/svg">
                    {/* Y-axis gridlines */}
                    {[0, 25, 50, 75, 100].map((grid, index) => {
                      const y = 180 - (grid * 1.5)
                      return (
                        <g key={grid}>
                          <line x1="45" y1={y} x2="480" y2={y} stroke="#f1f5f9" strokeWidth="1.5" />
                          <text x="35" y={y + 3} textAnchor="end" className="text-[9px] fill-slate-400 font-mono font-bold">{grid}</text>
                        </g>
                      )
                    })}

                    {/* Chart Data Bars */}
                    {reportsData.map((d, index) => {
                      const groupX = 65 + (index * 85)
                      
                      // Scaled bar heights (100 max = 150px)
                      const clearedHeight = d.cleared * 1.5
                      const pendingHeight = d.pending * 1.5
                      
                      const clearedY = 180 - clearedHeight
                      const pendingY = 180 - pendingHeight

                      return (
                        <g key={d.subject} className="group cursor-pointer">
                          {/* Label X axis */}
                          <text x={groupX + 15} y="200" textAnchor="middle" className="text-[9px] fill-slate-500 font-bold">{d.subject}</text>
                          
                          {/* Cleared Bar (Green) */}
                          <rect 
                            x={groupX} 
                            y={clearedY} 
                            width="14" 
                            height={clearedHeight} 
                            fill="#10b981" 
                            rx="2"
                            className="transition-all duration-300 hover:fill-emerald-600"
                          />
                          <text x={groupX + 7} y={clearedY - 5} textAnchor="middle" className="text-[8px] fill-emerald-600 font-mono font-extrabold opacity-0 group-hover:opacity-100 transition-opacity">{d.cleared}</text>

                          {/* Pending Bar (Amber) */}
                          <rect 
                            x={groupX + 18} 
                            y={pendingY} 
                            width="14" 
                            height={pendingHeight} 
                            fill="#f59e0b" 
                            rx="2"
                            className="transition-all duration-300 hover:fill-amber-600"
                          />
                          <text x={groupX + 25} y={pendingY - 5} textAnchor="middle" className="text-[8px] fill-amber-600 font-mono font-extrabold opacity-0 group-hover:opacity-100 transition-opacity">{d.pending}</text>
                        </g>
                      )
                    })}

                    {/* X-axis baseline */}
                    <line x1="45" y1="180" x2="480" y2="180" stroke="#cbd5e1" strokeWidth="2" />
                  </svg>
                </div>
                
                {/* Analytics summary details */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 border-t border-slate-100 pt-6 text-center text-xs">
                  {reportsData.map((d) => (
                    <div key={d.subject} className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                      <p className="font-bold text-slate-800 text-[10px] uppercase truncate">{d.subject}</p>
                      <div className="flex justify-center gap-3 mt-1.5 font-semibold">
                        <span className="text-emerald-600">{d.cleared} ✔</span>
                        <span className="text-amber-600">{d.pending} ⌛</span>
                      </div>
                    </div>
                  ))}
                </div>

              </CardContent>
            </Card>
          </div>
        )}

      </div>
    </div>
  )
}
export default HODAdminPanel
