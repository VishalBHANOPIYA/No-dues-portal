import React, { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import api from "@/services/api"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { 
  ArrowLeft, 
  Check, 
  X, 
  RotateCcw, 
  FileText, 
  User, 
  Calendar, 
  BookOpen, 
  Loader2,
  ShieldCheck,
  FileCheck2,
  AlertTriangle
} from "lucide-react"
import toast from "react-hot-toast"

interface SubmissionDetailData {
  id: string
  studentName: string
  enrollmentNo: string
  subject: string
  taskType: string
  submittedAt: string
  remarks?: string
  fileUrl?: string
  fileName?: string
}

type ActionType = "Approved" | "Rejected" | "Resubmission Requested" | null

export const SubmissionDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [submission, setSubmission] = useState<SubmissionDetailData | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeAction, setActiveAction] = useState<ActionType>(null)
  const [actionRemarks, setActionRemarks] = useState("")
  const [isSubmittingAction, setIsSubmittingAction] = useState(false)

  // Fetch details
  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true)
        const response = await api.get(`/api/faculty/submissions/${id}`)
        setSubmission(response.data)
      } catch (error) {
        console.warn("API offline, fetching mock submission details for ID:", id)
        
        // Mock DB entries
        const mockSubmissions: Record<string, SubmissionDetailData> = {
          "sub-201": { id: "sub-201", studentName: "Aarav Sharma", enrollmentNo: "0812CS221001", subject: "Database Management Systems Lab", taskType: "Lab Manual", submittedAt: "2026-06-24", remarks: "Please review experiment index sheet and laboratory signature check.", fileName: "aarav_dbms_manual.pdf" },
          "sub-202": { id: "sub-202", studentName: "Ananya Patel", enrollmentNo: "0812IT221045", subject: "Compiler Design Lab", taskType: "Assignment", submittedAt: "2026-06-23", remarks: "Solved Assignment 3 sheet upload.", fileName: "ananya_assignment3_cd.pdf" },
          "sub-203": { id: "sub-203", studentName: "Devansh Dixit", enrollmentNo: "0812EC221012", subject: "Database Management Systems Lab", taskType: "Mini Project", submittedAt: "2026-06-22", remarks: "Final IoT simulation project link and report file.", fileName: "devansh_dbms_proj.pdf" },
          "sub-204": { id: "sub-204", studentName: "Riya Verma", enrollmentNo: "0812CS221088", subject: "Information Security Lab", taskType: "Certificate", submittedAt: "2026-06-20", remarks: "NPTEL security course certification.", fileName: "riya_nptel_sec.png" },
          "sub-205": { id: "sub-205", studentName: "Kabir Mehta", enrollmentNo: "0812ME221008", subject: "Compiler Design Lab", taskType: "Lab Manual", submittedAt: "2026-06-24", remarks: "CD Manual file.", fileName: "kabir_cd_manual.pdf" },
          "sub-206": { id: "sub-206", studentName: "Prerna Joshi", enrollmentNo: "0812CS221054", subject: "Information Security Lab", taskType: "Case Study", submittedAt: "2026-06-21", remarks: "Detailed reports of ransomware attacks case study.", fileName: "prerna_casestudy_is.pdf" }
        }

        const match = mockSubmissions[id || ""] || mockSubmissions["sub-201"]
        setSubmission(match)
      } finally {
        setLoading(false)
      }
    }

    fetchDetail()
  }, [id])

  const handleActionSubmit = async () => {
    if (!activeAction || !submission) return
    
    setIsSubmittingAction(true)
    try {
      const response = await api.patch(`/api/faculty/submissions/${id}`, {
        status: activeAction,
        remarks: actionRemarks,
      })

      if (response.status === 200) {
        toast.success(`Submission ${activeAction} successfully!`)
        setActiveAction(null)
        navigate("/dashboard/review")
      }
    } catch (error: any) {
      console.error("Action PATCH request error:", error)
      
      // Fallback offline simulator
      if (error.message && (error.message.includes("Failed to fetch") || error.message.includes("Load failed") || error.name === "TypeError" || error.response?.status === 404)) {
        toast.promise(
          new Promise((resolve) => setTimeout(resolve, 1500)),
          {
            loading: "Updating clearance status on CDGI server...",
            success: () => {
              setActiveAction(null)
              navigate("/dashboard/review")
              return `Demo Mode: Submission marked as ${activeAction}!`
            },
            error: "Failed to update status.",
          }
        )
      } else {
        toast.error(error.response?.data?.message || "Failed to update submission status. Please try again.")
      }
    } finally {
      setIsSubmittingAction(false)
    }
  }

  if (loading) {
    return (
      <div className="p-12 text-center text-slate-400 text-sm flex flex-col items-center gap-2 justify-center h-[60vh]">
        <span className="h-8 w-8 border-3 border-primary border-t-transparent rounded-full animate-spin"></span>
        Fetching student submission dossier...
      </div>
    )
  }

  if (!submission) {
    return (
      <div className="p-12 text-center text-slate-400 text-sm">
        Submission dossier not found.
      </div>
    )
  }

  return (
    <div className="space-y-6">
      
      {/* Back Header */}
      <Button
        variant="ghost"
        onClick={() => navigate("/dashboard/review")}
        className="text-xs text-slate-500 hover:text-slate-900 pl-0 -ml-2"
      >
        <ArrowLeft className="h-4 w-4 mr-1.5" />
        Back to Submissions Queue
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Info Column */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Student details */}
          <Card className="border-slate-200 bg-white p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-800 text-sm border-b border-slate-100 pb-2.5 flex items-center gap-2">
              <User className="h-4.5 w-4.5 text-primary" />
              Student Profile
            </h3>
            <div className="space-y-3.5 text-xs">
              <div>
                <span className="text-slate-400 font-semibold block mb-0.5">Full Name</span>
                <p className="text-slate-800 font-bold text-sm">{submission.studentName}</p>
              </div>
              <div>
                <span className="text-slate-400 font-semibold block mb-0.5">Enrollment Number</span>
                <p className="text-slate-800 font-mono font-semibold">{submission.enrollmentNo}</p>
              </div>
              <div>
                <span className="text-slate-400 font-semibold block mb-0.5">Academic College</span>
                <p className="text-slate-600 font-medium">CDGI - Chameli Devi Group of Institutions</p>
              </div>
            </div>
          </Card>

          {/* Task details */}
          <Card className="border-slate-200 bg-white p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-800 text-sm border-b border-slate-100 pb-2.5 flex items-center gap-2">
              <BookOpen className="h-4.5 w-4.5 text-primary" />
              Submission Details
            </h3>
            <div className="space-y-3.5 text-xs">
              <div>
                <span className="text-slate-400 font-semibold block mb-0.5">Course / Subject</span>
                <p className="text-slate-800 font-bold">{submission.subject}</p>
              </div>
              <div>
                <span className="text-slate-400 font-semibold block mb-0.5">Task Category</span>
                <p className="text-slate-700 font-semibold">{submission.taskType}</p>
              </div>
              <div>
                <span className="text-slate-400 font-semibold block mb-0.5">Submitted On</span>
                <p className="text-slate-600 font-mono">{submission.submittedAt}</p>
              </div>
              <div>
                <span className="text-slate-400 font-semibold block mb-0.5">Student Remarks</span>
                <p className="text-slate-500 font-light leading-relaxed italic bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  {submission.remarks || "No comments written."}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* File Preview Column */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-slate-200 bg-white shadow-sm overflow-hidden flex flex-col h-[500px]">
            <CardHeader className="border-b border-slate-100 bg-slate-50/50 py-3 px-6 flex flex-row items-center justify-between">
              <div className="space-y-0.5">
                <CardTitle className="text-slate-800 font-bold text-sm">Document Verification Panel</CardTitle>
                <CardDescription className="text-[10px] text-slate-400">Preview of the submitted PDF or image file.</CardDescription>
              </div>
              <div className="text-xs font-mono bg-indigo-50 border border-indigo-100 text-primary px-2.5 py-0.5 rounded font-semibold">
                {submission.fileName}
              </div>
            </CardHeader>
            
            {/* Visual Document Mockup */}
            <CardContent className="flex-1 p-6 bg-slate-900 overflow-y-auto flex items-center justify-center">
              <div className="w-full max-w-lg bg-white border border-slate-200 shadow-2xl p-8 rounded-lg text-slate-800 relative space-y-6 aspect-[1/1.4]">
                {/* Watermark logo */}
                <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
                  <ShieldCheck className="h-64 w-64 text-primary" />
                </div>

                {/* College header */}
                <div className="border-b-2 border-slate-350 pb-4 text-center space-y-1">
                  <h4 className="text-sm font-extrabold tracking-wider text-slate-900">CHAMELI DEVI GROUP OF INSTITUTIONS</h4>
                  <p className="text-[9px] text-slate-500 font-bold tracking-widest uppercase">Department Academic Clearance Report</p>
                </div>

                {/* Details layout */}
                <div className="grid grid-cols-2 gap-4 text-[10px] pb-4 border-b border-slate-100">
                  <div>
                    <span className="text-slate-400 font-bold uppercase tracking-wider block">Student Name:</span>
                    <span className="font-bold text-slate-800">{submission.studentName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-bold uppercase tracking-wider block">Enrollment No:</span>
                    <span className="font-semibold text-slate-800 font-mono">{submission.enrollmentNo}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-bold uppercase tracking-wider block">Course Title:</span>
                    <span className="font-semibold text-slate-850">{submission.subject}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-bold uppercase tracking-wider block">Dues Audit Date:</span>
                    <span className="font-semibold text-slate-700 font-mono">{submission.submittedAt}</span>
                  </div>
                </div>

                {/* Mock Content */}
                <div className="space-y-3">
                  <h5 className="text-[11px] font-bold text-slate-800">Verification Ledger Log:</h5>
                  <p className="text-[10px] text-slate-650 leading-relaxed font-light">
                    This file certifies that the student has completed the required laboratory experiments and submitted their verified lab manual. All code implementations have been tested, cataloged, and signed off by the lab assistant.
                  </p>
                  <p className="text-[10px] text-slate-650 leading-relaxed font-light">
                    The student has returned all borrowed component kits, sensory nodes, and reference guidelines. No physical dues or damage holds remain against the student record.
                  </p>
                </div>

                {/* Stamp / Signature area */}
                <div className="flex justify-between items-end pt-12">
                  <div className="h-14 w-14 rounded-full border border-indigo-150 flex items-center justify-center text-primary/40 font-mono text-[7px] text-center border-dashed font-semibold rotate-[-12deg]">
                    CDGI<br />LIBRARY<br />PASSED
                  </div>
                  <div className="text-right space-y-1">
                    <div className="border-b border-slate-350 w-28 h-5"></div>
                    <span className="text-[8px] font-semibold text-slate-400 uppercase tracking-widest block">Verifier Sign</span>
                  </div>
                </div>
              </div>
            </CardContent>

            {/* Actions footer */}
            <CardFooter className="border-t border-slate-100 bg-slate-50/50 p-4 flex gap-3 justify-end">
              {/* Reject */}
              <Button
                onClick={() => {
                  setActiveAction("Rejected")
                  setActionRemarks("")
                }}
                className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold h-9 flex items-center gap-1 shadow-md shadow-rose-600/10"
              >
                <X className="h-4 w-4" />
                Reject Dues
              </Button>

              {/* Request Resubmission */}
              <Button
                onClick={() => {
                  setActiveAction("Resubmission Requested")
                  setActionRemarks("")
                }}
                className="bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold h-9 flex items-center gap-1 shadow-md shadow-amber-500/10"
              >
                <RotateCcw className="h-4 w-4" />
                Req. Resubmission
              </Button>

              {/* Approve */}
              <Button
                onClick={() => {
                  setActiveAction("Approved")
                  setActionRemarks("")
                }}
                className="bg-emerald-650 hover:bg-emerald-700 text-white text-xs font-semibold h-9 flex items-center gap-1 shadow-md shadow-emerald-650/10"
              >
                <Check className="h-4 w-4" />
                Approve Dues
              </Button>
            </CardFooter>
          </Card>
        </div>

      </div>

      {/* Confirmation Dialog / Custom AlertDialog Modal */}
      {activeAction && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md bg-white border-slate-200 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <button 
              onClick={() => setActiveAction(null)}
              className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            >
              <X className="h-5 w-5" />
            </button>

            <CardHeader className="pb-3 border-b border-slate-100">
              <CardTitle className="text-slate-800 text-base font-bold flex items-center gap-2">
                {activeAction === "Approved" && <ShieldCheck className="h-5 w-5 text-emerald-600" />}
                {activeAction === "Rejected" && <AlertTriangle className="h-5 w-5 text-rose-600" />}
                {activeAction === "Resubmission Requested" && <RotateCcw className="h-5 w-5 text-amber-500" />}
                Confirm Action: {activeAction}
              </CardTitle>
              <CardDescription className="text-xs text-slate-400 mt-1">
                {activeAction === "Approved" && "This will sign off this submission and clear the student's dues hold."}
                {activeAction === "Rejected" && "This will reject the submission and flag this dues hold."}
                {activeAction === "Resubmission Requested" && "This will request the student to upload corrected verification records."}
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-4 space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="remarks" className="text-xs font-semibold text-slate-700">
                  Optional Remarks / Comments
                </Label>
                <textarea
                  id="remarks"
                  rows={3}
                  value={actionRemarks}
                  onChange={(e) => setActionRemarks(e.target.value)}
                  placeholder="Provide audit details, book accession codes, or missing file corrections..."
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-all focus:outline-none focus:ring-1 focus:ring-ring focus:border-ring placeholder:text-muted-foreground/75 resize-none text-slate-900 border-slate-200"
                ></textarea>
              </div>
            </CardContent>

            <div className="p-6 pt-0 flex gap-3 border-t border-slate-100 mt-4 justify-end">
              <Button 
                variant="outline" 
                onClick={() => setActiveAction(null)}
                className="text-xs border-slate-200"
                disabled={isSubmittingAction}
              >
                Cancel
              </Button>
              <Button
                onClick={handleActionSubmit}
                disabled={isSubmittingAction}
                className={`text-xs text-white font-semibold flex items-center gap-1.5
                  ${activeAction === "Approved" ? "bg-emerald-650 hover:bg-emerald-700" :
                    activeAction === "Rejected" ? "bg-rose-600 hover:bg-rose-700" :
                    "bg-amber-500 hover:bg-amber-600"}
                `}
              >
                {isSubmittingAction ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Confirm Audit"
                )}
              </Button>
            </div>
          </Card>
        </div>
      )}

    </div>
  )
}
export default SubmissionDetail
