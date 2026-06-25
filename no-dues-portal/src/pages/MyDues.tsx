import React, { useEffect, useState } from "react"
import api from "@/services/api"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BookOpen, CheckCircle, AlertTriangle, ShieldCheck, User, RefreshCw } from "lucide-react"
import toast from "react-hot-toast"

interface DueItem {
  id: string
  subject: string
  code: string
  status: "Cleared" | "Pending"
  remarks: string
  auditor: string
}

export const MyDues: React.FC = () => {
  const [dues, setDues] = useState<DueItem[]>([])
  const [loading, setLoading] = useState(true)

  const fetchDues = async () => {
    try {
      setLoading(true)
      const response = await api.get("/api/student/dues")
      setDues(response.data || [])
    } catch (error: any) {
      console.warn("Dues API offline. Setting mock dues list:", error)
      const mockDues: DueItem[] = [
        { id: "due-1", subject: "Database Management Systems Lab", code: "CS-801", status: "Cleared", remarks: "All lab manuals verified. No dues.", auditor: "Prof. Anjali Sen" },
        { id: "due-2", subject: "Compiler Design Lab", code: "CS-802", status: "Pending", remarks: "Experiment 9 & 10 code checks pending signature.", auditor: "Prof. Rajesh Kumar" },
        { id: "due-3", subject: "Information Security Lab", code: "CS-803", status: "Cleared", remarks: "Verified. Keycard returned.", auditor: "Dr. Sandeep Jha" },
        { id: "due-4", subject: "Major Project Phase-II", code: "CS-804", status: "Cleared", remarks: "Project model and documentation submitted.", auditor: "HOD CSE Office" },
        { id: "due-5", subject: "General Academic Dues", code: "GEN-DUE", status: "Pending", remarks: "Semester 8 tuition fee clearance certificate required.", auditor: "Registrar Office (Accounts)" },
      ]
      setDues(mockDues)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDues()
  }, [])

  // Calc values
  const total = dues.length
  const cleared = dues.filter(d => d.status === "Cleared").length
  const progressPercent = total > 0 ? Math.round((cleared / total) * 100) : 0

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight text-slate-800">Academic & Subject Dues</h2>
          <p className="text-sm text-slate-500">Track clearance checkpoints required for graduation scrolls.</p>
        </div>
        <Button 
          variant="outline"
          onClick={fetchDues}
          className="text-xs h-9 border-slate-200 flex items-center gap-1.5"
          disabled={loading}
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
          Reload List
        </Button>
      </div>

      {/* Progress Card */}
      <Card className="border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <div className="space-y-1.5 flex-1">
            <h3 className="font-bold text-slate-800 text-sm">Clearance Progress Indicator</h3>
            <p className="text-xs text-slate-400 font-light leading-relaxed">
              Dues must be 100% Cleared before generating your digital graduation gate pass.
            </p>
          </div>
          <div className="text-right shrink-0">
            <span className="text-xs font-semibold px-2.5 py-1 uppercase rounded-full text-primary bg-indigo-50 border border-indigo-100">
              {progressPercent}% Cleared
            </span>
          </div>
        </div>
        <div className="overflow-hidden h-2.5 text-xs flex rounded-full bg-slate-100 mt-4">
          <div
            style={{ width: `${progressPercent}%` }}
            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary transition-all duration-500"
          ></div>
        </div>
      </Card>

      {/* List of Subjects */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {loading ? (
          <div className="col-span-full p-12 text-center text-slate-400 text-xs flex flex-col items-center gap-2 justify-center bg-white border border-slate-200 rounded-2xl">
            <span className="h-6 w-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></span>
            Checking dues records...
          </div>
        ) : dues.length === 0 ? (
          <div className="col-span-full p-12 text-center text-slate-400 text-xs bg-white border border-slate-200 rounded-2xl">
            No subject dues found on the ledger.
          </div>
        ) : (
          dues.map((due) => (
            <Card key={due.id} className="border-slate-200 bg-white hover:shadow-md transition-all">
              <CardHeader className="flex flex-row items-start justify-between pb-3">
                <div className="space-y-1 pr-4">
                  <div className="text-[10px] font-bold text-slate-400 font-mono tracking-wider">{due.code}</div>
                  <CardTitle className="text-sm font-bold text-slate-850 leading-snug">{due.subject}</CardTitle>
                </div>
                
                {due.status === "Cleared" ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 text-[10px] font-bold uppercase shrink-0">
                    <CheckCircle className="h-3 w-3" />
                    Cleared
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-50 border border-rose-100 text-rose-600 text-[10px] font-bold uppercase shrink-0">
                    <AlertTriangle className="h-3 w-3" />
                    Pending
                  </span>
                )}
              </CardHeader>
              
              <CardContent className="space-y-3.5 pt-1 text-slate-700 text-xs">
                <p className="bg-slate-50 border border-slate-100 p-2.5 rounded-lg text-[11px] text-slate-500 font-light leading-relaxed">
                  {due.remarks}
                </p>
                
                <div className="flex justify-between items-center text-[10px] text-slate-400 pt-2 border-t border-slate-50">
                  <span className="flex items-center gap-1">
                    <User className="h-3.5 w-3.5" />
                    Audited by
                  </span>
                  <span className="font-semibold text-slate-600">{due.auditor}</span>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

    </div>
  )
}
export default MyDues
