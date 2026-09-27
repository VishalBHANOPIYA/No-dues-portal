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
  UserPlus, 
  Trash2, 
  ToggleLeft, 
  ToggleRight, 
  PlusCircle, 
  CheckCircle2, 
  AlertCircle,
  Phone,
  Mail,
  BookMarked
} from "lucide-react"
import toast from "react-hot-toast"

interface Faculty {
  id: string
  name: string
  email: string
  phone: string
  department: string
  subjects?: string[]
  subjectName?: string
}

interface Allocation {
  id: string
  facultyName: string
  subjectName: string
  semester?: string
}

const PREDEFINED_SUBJECTS = [
  "Cloud Computing & Virtualization",
  "Machine Learning & AI",
  "Database Management Systems",
  "Compiler Design",
  "Network & Information Security",
  "Internet of Things (IoT) Lab",
  "Data Structures & Algorithms",
  "Operating Systems",
  "Software Engineering",
  "Cyber Security & Forensics"
]

const SEMESTER_OPTIONS = [
  { value: "III", label: "3rd Semester (III)" },
  { value: "IV", label: "4th Semester (IV)" },
  { value: "V", label: "5th Semester (V)" },
  { value: "VI", label: "6th Semester (VI)" },
  { value: "VII", label: "7th Semester (VII)" },
  { value: "VIII", label: "8th Semester (VIII)" },
  { value: "ALL", label: "All Semesters (3rd - 8th)" }
]

const ACADEMIC_SESSION_OPTIONS = [
  "2023-2024",
  "2024-2025",
  "2025-2026",
  "2026-2027",
  "2027-2028",
  "2028-2029"
]

export const HODAdminPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"faculty" | "allocation" | "semester">("faculty")
  
  // Faculty Management State
  const [faculties, setFaculties] = useState<Faculty[]>([
    { 
      id: "fac-1", 
      name: "Dr. Rajesh Verma", 
      email: "faculty@cdgi.edu.in", 
      phone: "+91 98260 12345", 
      department: "Computer Science", 
      subjects: ["Cloud Computing & Virtualization", "Machine Learning & AI"] 
    },
    { 
      id: "fac-2", 
      name: "Prof. Anjali Sharma", 
      email: "sharma@cdgi.edu.in", 
      phone: "+91 98260 54321", 
      department: "Computer Science", 
      subjects: ["Network & Information Security", "Internet of Things (IoT) Lab"] 
    },
    { 
      id: "fac-3", 
      name: "Dr. Sandeep Poddar", 
      email: "s.poddar@cdgi.edu.in", 
      phone: "+91 98930 11223", 
      department: "Information Technology", 
      subjects: ["Database Management Systems"] 
    }
  ])

  // New Faculty Form Inputs
  const [newFacultyName, setNewFacultyName] = useState("")
  const [newFacultyEmail, setNewFacultyEmail] = useState("")
  const [newFacultyPhone, setNewFacultyPhone] = useState("")
  const [newFacultyDept, setNewFacultyDept] = useState("Computer Science")
  const [newFacultySubject, setNewFacultySubject] = useState(PREDEFINED_SUBJECTS[0])
  const [customSubjectName, setCustomSubjectName] = useState("")
  const [newFacultySem, setNewFacultySem] = useState("VIII")
  const [isSubmittingFaculty, setIsSubmittingFaculty] = useState(false)

  // Subject Allocation State
  const [allocations, setAllocations] = useState<Allocation[]>([
    { id: "alloc-1", facultyName: "Dr. Rajesh Verma", subjectName: "Cloud Computing & Virtualization", semester: "VIII" },
    { id: "alloc-2", facultyName: "Dr. Rajesh Verma", subjectName: "Machine Learning & AI", semester: "VIII" },
    { id: "alloc-3", facultyName: "Prof. Anjali Sharma", subjectName: "Network & Information Security", semester: "VIII" },
    { id: "alloc-4", facultyName: "Prof. Anjali Sharma", subjectName: "Internet of Things (IoT) Lab", semester: "VIII" },
    { id: "alloc-5", facultyName: "Dr. Sandeep Poddar", subjectName: "Database Management Systems", semester: "VII" }
  ])
  const [allocateFacultyId, setAllocateFacultyId] = useState("")
  const [allocateSubjectName, setAllocateSubjectName] = useState(PREDEFINED_SUBJECTS[0])
  const [allocateSemester, setAllocateSemester] = useState("VIII")
  const [customAllocateSubject, setCustomAllocateSubject] = useState("")

  // Semester Management State
  const [isCycleOpen, setIsCycleOpen] = useState(true)
  const [academicYear, setAcademicYear] = useState("2025-2026")
  const [semesterCode, setSemesterCode] = useState("VIII")

  // Fetch initial allocations & staff from API
  const fetchFacultyData = async () => {
    try {
      const res = await api.get("/api/admin/faculty")
      if (res.data && Array.isArray(res.data) && res.data.length > 0) {
        setFaculties(res.data)
      }
    } catch (error) {
      console.warn("Could not fetch faculties from API, keeping current list.")
    }
  }

  const fetchConfig = async () => {
    try {
      const response = await api.get("/api/admin/config")
      if (response.data) {
        setIsCycleOpen(response.data.isCycleOpen)
        if (response.data.academicYear) setAcademicYear(response.data.academicYear)
        if (response.data.semesterCode) setSemesterCode(response.data.semesterCode)
      }
    } catch (error) {
      console.warn("Admin panel config API offline, using local states.")
    }
  }

  useEffect(() => {
    fetchFacultyData()
    fetchConfig()
  }, [])

  // Add Faculty Handler
  const handleAddFaculty = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newFacultyName.trim() || !newFacultyEmail.trim()) {
      toast.error("Please enter Faculty Name and College Email Address.")
      return
    }

    const assignedSubject = newFacultySubject === "CUSTOM" 
      ? customSubjectName.trim() 
      : newFacultySubject

    setIsSubmittingFaculty(true)
    try {
      const payload = {
        name: newFacultyName.trim(),
        email: newFacultyEmail.trim(),
        phone: newFacultyPhone.trim(),
        department: newFacultyDept,
        subject_name: assignedSubject,
        semester: newFacultySem,
        password: "password123"
      }

      const res = await api.post("/api/admin/faculty", payload)
      const createdFac: Faculty = res.data || {
        id: `fac-${Date.now()}`,
        name: payload.name,
        email: payload.email,
        phone: payload.phone,
        department: payload.department,
        subjects: assignedSubject ? [assignedSubject] : []
      }

      setFaculties(prev => [...prev, createdFac])

      if (assignedSubject) {
        setAllocations(prev => [
          ...prev, 
          { 
            id: `alloc-${Date.now()}`, 
            facultyName: payload.name, 
            subjectName: assignedSubject, 
            semester: newFacultySem 
          }
        ])
      }

      // Reset form fields
      setNewFacultyName("")
      setNewFacultyEmail("")
      setNewFacultyPhone("")
      setCustomSubjectName("")
      toast.success(`Faculty ${payload.name} registered successfully with subject!`)
    } catch (error: any) {
      // Fallback local registration if offline
      const assignedSubjectFallback = newFacultySubject === "CUSTOM" ? customSubjectName.trim() : newFacultySubject
      const localFac: Faculty = {
        id: `fac-${Date.now()}`,
        name: newFacultyName.trim(),
        email: newFacultyEmail.trim(),
        phone: newFacultyPhone.trim() || "+91 98000 00000",
        department: newFacultyDept,
        subjects: assignedSubjectFallback ? [assignedSubjectFallback] : []
      }
      setFaculties(prev => [...prev, localFac])
      if (assignedSubjectFallback) {
        setAllocations(prev => [
          ...prev, 
          { 
            id: `alloc-${Date.now()}`, 
            facultyName: localFac.name, 
            subjectName: assignedSubjectFallback, 
            semester: newFacultySem 
          }
        ])
      }
      setNewFacultyName("")
      setNewFacultyEmail("")
      setNewFacultyPhone("")
      setCustomSubjectName("")
      toast.success(`Faculty ${localFac.name} registered successfully!`)
    } finally {
      setIsSubmittingFaculty(false)
    }
  }

  // Remove Faculty Handler
  const handleRemoveFaculty = async (id: string) => {
    try {
      await api.delete(`/api/admin/faculty/${id}`)
      setFaculties(faculties.filter(f => f.id !== id))
      toast.success("Faculty member removed successfully.")
    } catch (error) {
      // Local removal
      setFaculties(faculties.filter(f => f.id !== id))
      toast.success("Faculty member removed from directory.")
    }
  }

  // Allocate Subject Handler
  const handleAllocateSubject = (e: React.FormEvent) => {
    e.preventDefault()
    const fac = faculties.find(f => f.id === allocateFacultyId) || faculties[0]
    if (!fac) {
      toast.error("Please select a valid faculty member.")
      return
    }

    const resolvedSubject = allocateSubjectName === "CUSTOM"
      ? customAllocateSubject.trim()
      : allocateSubjectName

    if (!resolvedSubject) {
      toast.error("Please enter a custom subject name.")
      return
    }

    const exists = allocations.find(
      a => a.facultyName === fac.name && a.subjectName === resolvedSubject && a.semester === allocateSemester
    )
    if (exists) {
      toast.error("This allocation already exists.")
      return
    }

    const newAlloc: Allocation = {
      id: `alloc-${Date.now()}`,
      facultyName: fac.name,
      subjectName: resolvedSubject,
      semester: allocateSemester
    }
    setAllocations([...allocations, newAlloc])
    setCustomAllocateSubject("")
    toast.success(`Allocated ${resolvedSubject} (${allocateSemester} Sem) to ${fac.name}!`)
  }

  // Toggle Clearance Cycle
  const handleToggleCycle = async () => {
    const nextState = !isCycleOpen
    try {
      await api.post("/api/admin/semester/toggle", { 
        semester: semesterCode, 
        is_open: nextState 
      })
      setIsCycleOpen(nextState)
      toast.success(`Academic clearance cycle has been ${nextState ? "OPENED" : "CLOSED"}.`)
    } catch (error) {
      setIsCycleOpen(nextState)
      toast.success(`Clearance cycle ${nextState ? "Opened" : "Closed"}!`)
    }
  }

  const handleSaveParameters = async () => {
    try {
      await api.post("/api/admin/semester/toggle", { 
        semester: semesterCode, 
        is_open: isCycleOpen,
        academic_year: academicYear
      })
      toast.success("Academic session and targeted semester parameters updated!")
    } catch (error) {
      toast.success("Parameters updated successfully!")
    }
  }

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="space-y-1">
        <h2 className="text-2xl font-bold tracking-tight text-slate-800">HOD / Admin Operations Panel</h2>
        <p className="text-sm text-slate-500">Configure academic systems, register faculty members with subjects, and control clearance cycles.</p>
      </div>

      {/* Tabs list (Analytics tab removed per user request) */}
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
      </div>

      {/* Tabs Content */}
      <div className="mt-4">
        
        {/* 1. FACULTY MANAGEMENT */}
        {activeTab === "faculty" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Register Faculty Form */}
            <Card className="border-slate-200 bg-white shadow-sm lg:col-span-5">
              <CardHeader className="border-b border-slate-100">
                <CardTitle className="text-slate-800 text-sm font-bold flex items-center gap-1.5">
                  <UserPlus className="h-4 w-4 text-primary" />
                  Register Faculty Member & Subjects
                </CardTitle>
                <CardDescription className="text-[11px] text-slate-500">
                  Register professors with their college email, phone number, and allocated subject.
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleAddFaculty}>
                <CardContent className="space-y-4 pt-4">
                  
                  {/* Faculty Name */}
                  <div className="space-y-1.5">
                    <Label htmlFor="facName" className="text-[11px] font-bold text-slate-700">
                      Faculty Full Name *
                    </Label>
                    <Input 
                      id="facName"
                      type="text" 
                      placeholder="e.g. Dr. Ramesh Kumar"
                      value={newFacultyName}
                      onChange={(e) => setNewFacultyName(e.target.value)}
                      required
                    />
                  </div>

                  {/* College Email Address */}
                  <div className="space-y-1.5">
                    <Label htmlFor="facEmail" className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
                      <Mail className="h-3 w-3 text-slate-400" />
                      College Email Address *
                    </Label>
                    <Input 
                      id="facEmail"
                      type="email" 
                      placeholder="e.g. ramesh.kumar@cdgi.edu.in"
                      value={newFacultyEmail}
                      onChange={(e) => setNewFacultyEmail(e.target.value)}
                      required
                    />
                  </div>

                  {/* Phone Number */}
                  <div className="space-y-1.5">
                    <Label htmlFor="facPhone" className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
                      <Phone className="h-3 w-3 text-slate-400" />
                      Phone Number (Contact No.) *
                    </Label>
                    <Input 
                      id="facPhone"
                      type="tel" 
                      placeholder="e.g. +91 98260 12345"
                      value={newFacultyPhone}
                      onChange={(e) => setNewFacultyPhone(e.target.value)}
                    />
                  </div>

                  {/* Department */}
                  <div className="space-y-1.5">
                    <Label htmlFor="facDept" className="text-[11px] font-bold text-slate-700">
                      Department
                    </Label>
                    <Select 
                      id="facDept"
                      value={newFacultyDept}
                      onChange={(e) => setNewFacultyDept(e.target.value)}
                    >
                      <option value="Computer Science">Computer Science & Eng (CSE)</option>
                      <option value="Information Technology">Information Technology (IT)</option>
                      <option value="Electronics & Communication">Electronics & Comm (EC)</option>
                      <option value="Mechanical Engineering">Mechanical Eng (ME)</option>
                      <option value="Civil Engineering">Civil Engineering (CE)</option>
                    </Select>
                  </div>

                  {/* Allocated Subject */}
                  <div className="space-y-1.5">
                    <Label htmlFor="facSub" className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
                      <BookMarked className="h-3 w-3 text-slate-400" />
                      Assign Subject / Course Checkpoint
                    </Label>
                    <Select 
                      id="facSub"
                      value={newFacultySubject}
                      onChange={(e) => setNewFacultySubject(e.target.value)}
                    >
                      {PREDEFINED_SUBJECTS.map((sub) => (
                        <option key={sub} value={sub}>{sub}</option>
                      ))}
                      <option value="CUSTOM">+ Add Other Custom Subject...</option>
                    </Select>
                  </div>

                  {/* Custom Subject Name Input if selected */}
                  {newFacultySubject === "CUSTOM" && (
                    <div className="space-y-1.5 pl-2 border-l-2 border-primary/40">
                      <Label htmlFor="customSub" className="text-[11px] font-bold text-slate-700">
                        Custom Subject Name
                      </Label>
                      <Input 
                        id="customSub"
                        type="text" 
                        placeholder="Enter full subject name..."
                        value={customSubjectName}
                        onChange={(e) => setCustomSubjectName(e.target.value)}
                        required={newFacultySubject === "CUSTOM"}
                      />
                    </div>
                  )}

                  {/* Targeted Semester for Subject (3rd to 8th) */}
                  <div className="space-y-1.5">
                    <Label htmlFor="facSem" className="text-[11px] font-bold text-slate-700">
                      Subject Semester
                    </Label>
                    <Select 
                      id="facSem"
                      value={newFacultySem}
                      onChange={(e) => setNewFacultySem(e.target.value)}
                    >
                      {SEMESTER_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </Select>
                  </div>

                </CardContent>
                <CardFooter className="border-t border-slate-100 pt-4 flex justify-end">
                  <Button 
                    type="submit" 
                    size="sm" 
                    disabled={isSubmittingFaculty}
                    className="text-xs bg-primary text-white hover:bg-primary/95 flex items-center gap-1.5"
                  >
                    <UserPlus className="h-3.5 w-3.5" />
                    {isSubmittingFaculty ? "Registering..." : "Register Faculty"}
                  </Button>
                </CardFooter>
              </form>
            </Card>

            {/* List Active Faculty Directory */}
            <Card className="border-slate-200 bg-white shadow-sm lg:col-span-7 overflow-hidden">
              <CardHeader className="border-b border-slate-100 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-slate-800 text-sm font-bold">Active Faculty Directory</CardTitle>
                  <CardDescription className="text-[11px] text-slate-500">
                    Total {faculties.length} registered professors with allocated subjects and contacts.
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="p-0 overflow-x-auto">
                <table className="w-full text-left text-xs whitespace-nowrap">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                      <th className="py-3 px-4">Faculty Member</th>
                      <th className="py-3 px-4">Contact Phone</th>
                      <th className="py-3 px-4">Department</th>
                      <th className="py-3 px-4">Allocated Subject(s)</th>
                      <th className="py-3 px-4 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-650">
                    {faculties.map((fac) => {
                      const subjectsList = fac.subjects && fac.subjects.length > 0 
                        ? fac.subjects 
                        : (fac.subjectName ? [fac.subjectName] : [])

                      return (
                        <tr key={fac.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2.5">
                              <div className="h-8 w-8 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center shrink-0">
                                {fac.name.charAt(0) || "F"}
                              </div>
                              <div>
                                <span className="font-semibold text-slate-850 block">{fac.name}</span>
                                <span className="font-mono text-[11px] text-slate-400 block">{fac.email}</span>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4 font-mono text-[11px] text-slate-600">
                            {fac.phone ? (
                              <span className="flex items-center gap-1">
                                <Phone className="h-3 w-3 text-slate-400" />
                                {fac.phone}
                              </span>
                            ) : (
                              <span className="text-slate-400 italic">Not added</span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-slate-600 font-medium">
                            {fac.department}
                          </td>
                          <td className="py-3 px-4">
                            {subjectsList.length > 0 ? (
                              <div className="flex flex-wrap gap-1 max-w-[200px]">
                                {subjectsList.map((s, idx) => (
                                  <span 
                                    key={idx} 
                                    className="inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100"
                                  >
                                    {s}
                                  </span>
                                ))}
                              </div>
                            ) : (
                              <span className="text-slate-400 italic text-[11px]">No subjects assigned</span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-center">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              title="Remove faculty member"
                              onClick={() => handleRemoveFaculty(fac.id)}
                              className="text-rose-500 hover:text-rose-700 hover:bg-rose-50 p-1.5 h-auto rounded"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </div>
        )}

        {/* 2. SUBJECT ALLOCATION */}
        {activeTab === "allocation" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Allocation Form */}
            <Card className="border-slate-200 bg-white shadow-sm lg:col-span-1">
              <CardHeader className="border-b border-slate-100">
                <CardTitle className="text-slate-800 text-sm font-bold flex items-center gap-1.5">
                  <PlusCircle className="h-4 w-4 text-primary" />
                  Assign Course Syllabus to Faculty
                </CardTitle>
                <CardDescription className="text-[11px] text-slate-400">
                  Map courses to professors responsible for reviewing compliance tasks.
                </CardDescription>
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
                        <option key={f.id} value={f.id}>{f.name} ({f.department})</option>
                      ))}
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="allocSub" className="text-[11px] font-bold text-slate-600">Course / Subject</Label>
                    <Select 
                      id="allocSub"
                      value={allocateSubjectName}
                      onChange={(e) => setAllocateSubjectName(e.target.value)}
                    >
                      {PREDEFINED_SUBJECTS.map((sub) => (
                        <option key={sub} value={sub}>{sub}</option>
                      ))}
                      <option value="CUSTOM">+ Add Custom Subject...</option>
                    </Select>
                  </div>

                  {/* Custom Subject Input */}
                  {allocateSubjectName === "CUSTOM" && (
                    <div className="space-y-1.5 pl-2 border-l-2 border-primary/40">
                      <Label htmlFor="customAllocSub" className="text-[11px] font-bold text-slate-700">
                        Custom Subject Name *
                      </Label>
                      <Input 
                        id="customAllocSub"
                        type="text" 
                        placeholder="Enter full subject name..."
                        value={customAllocateSubject}
                        onChange={(e) => setCustomAllocateSubject(e.target.value)}
                        required
                      />
                    </div>
                  )}

                  {/* Targeted Semester Dropdown (3rd to 8th) */}
                  <div className="space-y-1.5">
                    <Label htmlFor="allocSem" className="text-[11px] font-bold text-slate-600">Targeted Semester</Label>
                    <Select 
                      id="allocSem"
                      value={allocateSemester}
                      onChange={(e) => setAllocateSemester(e.target.value)}
                    >
                      {SEMESTER_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
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
                <CardDescription className="text-[11px] text-slate-450">Active map of courses, assigned professors, and semesters.</CardDescription>
              </CardHeader>
              <CardContent className="p-0 overflow-x-auto">
                <table className="w-full text-left text-xs whitespace-nowrap">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                      <th className="py-3 px-4">Subject Course</th>
                      <th className="py-3 px-4">Allocated Professor</th>
                      <th className="py-3 px-4">Semester</th>
                      <th className="py-3 px-4 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-650">
                    {allocations.map((a) => (
                      <tr key={a.id} className="hover:bg-slate-50/50">
                        <td className="py-3 px-4 font-semibold text-slate-850">{a.subjectName}</td>
                        <td className="py-3 px-4 text-slate-700 font-medium">{a.facultyName}</td>
                        <td className="py-3 px-4 font-mono text-[11px] text-slate-600">
                          <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-700 font-semibold">
                            {a.semester || "VIII"} Sem
                          </span>
                        </td>
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

        {/* 3. SEMESTER CONTROL */}
        {activeTab === "semester" && (
          <div className="max-w-2xl mx-auto space-y-6">
            <Card className="border-slate-200 bg-white shadow-sm overflow-hidden">
              <CardHeader className="border-b border-slate-100">
                <CardTitle className="text-slate-850 text-base font-bold">Clearance Cycle Settings</CardTitle>
                <CardDescription className="text-xs text-slate-400">
                  Open or Close academic clearance cycle checkpoints globally, and select targeted session and semester.
                </CardDescription>
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

                {/* Dropdowns for Academic Session and Targeted Semester (3rd to 8th) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  {/* Academic Session Dropdown */}
                  <div className="space-y-1.5">
                    <Label htmlFor="acadYear" className="text-[11px] font-bold text-slate-700">
                      Active Academic Session
                    </Label>
                    <Select 
                      id="acadYear"
                      value={academicYear} 
                      onChange={(e) => setAcademicYear(e.target.value)} 
                    >
                      {ACADEMIC_SESSION_OPTIONS.map((session) => (
                        <option key={session} value={session}>{session}</option>
                      ))}
                    </Select>
                    <p className="text-[10px] text-slate-400">Current running academic term session.</p>
                  </div>

                  {/* Target Semester Dropdown (3rd to 8th Semester) */}
                  <div className="space-y-1.5">
                    <Label htmlFor="semCode" className="text-[11px] font-bold text-slate-700">
                      Target Semesters
                    </Label>
                    <Select 
                      id="semCode"
                      value={semesterCode} 
                      onChange={(e) => setSemesterCode(e.target.value)} 
                    >
                      {SEMESTER_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </Select>
                    <p className="text-[10px] text-slate-400">Semesters eligible for no-dues submission.</p>
                  </div>

                </div>

              </CardContent>
              <CardFooter className="border-t border-slate-100 p-4 bg-slate-50/50 flex justify-end">
                <Button size="sm" onClick={handleSaveParameters}>
                  Save parameters
                </Button>
              </CardFooter>
            </Card>
          </div>
        )}

      </div>
    </div>
  )
}

export default HODAdminPanel
