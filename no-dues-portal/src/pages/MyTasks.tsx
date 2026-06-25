import React, { useEffect, useState } from "react"
import api from "@/services/api"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ClipboardList, Calendar, Info, X, Clock, HelpCircle } from "lucide-react"
import toast from "react-hot-toast"

interface Task {
  _id?: string
  id: string
  subject: string
  taskType: "Lab Manual" | "Assignment" | "Case Study" | "Mini Project" | "Certificate"
  deadline: string
  status: "Pending" | "Submitted" | "Approved" | "Rejected"
  description?: string
  remarks?: string
}

export const MyTasks: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)

  const fetchTasks = async () => {
    try {
      setLoading(true)
      const response = await api.get("/api/student/tasks")
      setTasks(response.data || [])
    } catch (error: any) {
      console.warn("Tasks API offline. Initializing mockup items:", error)
      // Fallback premium mock data
      const mockTasks: Task[] = [
        { id: "task-101", subject: "Database Management Systems (DBMS)", taskType: "Assignment", deadline: "2026-06-30", status: "Pending", description: "Submit solved queries for Assignment 3 (Relational Algebra and Calculus).", remarks: "Must show query plans." },
        { id: "task-102", subject: "Compiler Design (CD)", taskType: "Lab Manual", deadline: "2026-06-25", status: "Submitted", description: "Upload the fully scanned PDF of Compiler Design Lab Manual, verified up to Experiment 10.", remarks: "Checked by lab instructor." },
        { id: "task-103", subject: "Internet of Things (IoT)", taskType: "Mini Project", deadline: "2026-06-28", status: "Approved", description: "Design a node sensor simulation and submit the final repository code link with video.", remarks: "Excellent implementation." },
        { id: "task-104", subject: "Machine Learning (ML)", taskType: "Case Study", deadline: "2026-06-22", status: "Rejected", description: "Submit a case study report on Support Vector Machines implementation on real-world datasets.", remarks: "Dataset reference missing. Please re-upload with bibliography." },
        { id: "task-105", subject: "NPTEL/MOOC Courses", taskType: "Certificate", deadline: "2026-07-05", status: "Pending", description: "Upload NPTEL course completion certificate for 8-week course.", remarks: "Required for elective credits." },
      ]
      setTasks(mockTasks)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTasks()
  }, [])

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight text-slate-800">My Tasks & Submissions</h2>
          <p className="text-sm text-slate-500">View academic tasks, manual clearances, and approvals.</p>
        </div>
        <Button 
          variant="outline"
          onClick={fetchTasks}
          className="text-xs h-9 border-slate-200"
          disabled={loading}
        >
          Refresh Log
        </Button>
      </div>

      {/* Main Table */}
      <Card className="border-slate-200 bg-white shadow-sm overflow-hidden">
        <CardContent className="p-0 overflow-x-auto">
          {loading ? (
            <div className="p-12 text-center text-slate-400 text-xs flex flex-col items-center gap-2 justify-center">
              <span className="h-6 w-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></span>
              Loading academic tasks...
            </div>
          ) : tasks.length === 0 ? (
            <div className="p-12 text-center text-slate-400 text-xs">
              No tasks currently listed for your batch.
            </div>
          ) : (
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100 text-xs text-slate-400 font-semibold uppercase tracking-wider">
                  <th className="py-4 px-6">Subject</th>
                  <th className="py-4 px-6">Task Type</th>
                  <th className="py-4 px-6">Deadline</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-600">
                {tasks.map((task) => (
                  <tr key={task.id} className="hover:bg-slate-50/40 transition-colors">
                    <td className="py-4 px-6 font-semibold text-slate-800">
                      {task.subject}
                    </td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-700 text-xs font-medium">
                        {task.taskType}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-xs font-mono text-slate-500">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-slate-400" />
                        {task.deadline}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      {task.status === "Approved" && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 text-[10px] font-bold uppercase">
                          Approved
                        </span>
                      )}
                      {task.status === "Submitted" && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-[10px] font-bold uppercase">
                          Submitted
                        </span>
                      )}
                      {task.status === "Pending" && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-100 text-amber-600 text-[10px] font-bold uppercase">
                          Pending
                        </span>
                      )}
                      {task.status === "Rejected" && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-50 border border-rose-100 text-rose-600 text-[10px] font-bold uppercase">
                          Rejected
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-center">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedTask(task)}
                        className="text-xs h-8 border-slate-200 text-primary hover:bg-primary/5 hover:border-primary/20"
                      >
                        View Details
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>

      {/* Task Details Dialog Modal */}
      {selectedTask && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-lg bg-white border-slate-200 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <button 
              onClick={() => setSelectedTask(null)}
              className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            <CardHeader className="pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest">
                <ClipboardList className="h-4 w-4" />
                Task ID: {selectedTask.id}
              </div>
              <CardTitle className="text-slate-800 text-lg font-bold mt-1.5 leading-snug">
                {selectedTask.subject}
              </CardTitle>
              <div className="flex gap-2 mt-2.5">
                <span className="text-[10px] font-semibold bg-slate-100 text-slate-600 border border-slate-200 px-2 py-0.5 rounded">
                  {selectedTask.taskType}
                </span>
                <span className={`text-[10px] font-semibold border px-2 py-0.5 rounded uppercase tracking-wider
                  ${selectedTask.status === "Approved" ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                    selectedTask.status === "Submitted" ? "bg-blue-50 text-blue-600 border-blue-100" :
                    selectedTask.status === "Pending" ? "bg-amber-50 text-amber-600 border-amber-100 animate-pulse" :
                    "bg-rose-50 text-rose-600 border-rose-100"}
                `}>
                  Status: {selectedTask.status}
                </span>
              </div>
            </CardHeader>

            <CardContent className="pt-5 space-y-4 text-slate-700 text-sm">
              <div className="space-y-1">
                <span className="text-xs font-semibold text-slate-400">Description / Guidelines</span>
                <p className="text-slate-600 font-light leading-relaxed">
                  {selectedTask.description || "No custom guidelines uploaded."}
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-xs font-semibold text-slate-400">Instructor / Auditor Remarks</span>
                <p className="text-slate-600 bg-slate-50 border border-slate-100 rounded-lg p-3 italic text-xs font-light">
                  {selectedTask.remarks || "No verification comments left yet."}
                </p>
              </div>

              <div className="flex justify-between items-center bg-slate-50 border border-slate-100 p-3 rounded-lg text-xs">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Clock className="h-4 w-4" />
                  Submit before
                </span>
                <span className="font-semibold text-slate-700 font-mono">{selectedTask.deadline}</span>
              </div>
            </CardContent>

            <div className="p-6 pt-0 flex gap-3 border-t border-slate-100 mt-4 justify-end">
              <Button 
                variant="outline" 
                onClick={() => setSelectedTask(null)}
                className="text-xs border-slate-200"
              >
                Close
              </Button>
              {selectedTask.status !== "Approved" && (
                <Button 
                  onClick={() => {
                    setSelectedTask(null)
                    // Navigate to SubmitWork with task identifier
                    navigate("/dashboard/submit", { state: { taskId: selectedTask.id } })
                  }}
                  className="text-xs bg-primary text-white hover:bg-primary/95"
                >
                  Upload Submission
                </Button>
              )}
            </div>
          </Card>
        </div>
      )}

    </div>
  )
}
export default MyTasks
