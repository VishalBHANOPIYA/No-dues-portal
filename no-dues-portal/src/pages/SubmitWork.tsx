import React, { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { useNavigate, useLocation } from "react-router-dom"
import api from "@/services/api"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Upload, FileText, Send, Loader2, ArrowLeft, AlertCircle } from "lucide-react"
import toast from "react-hot-toast"

interface SubmitFormInput {
  taskId: string
  file: FileList
  remarks: string
}

interface ActiveTask {
  id: string
  subject: string
  taskType: string
}

export const SubmitWork: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  
  // Pre-selected Task ID from router state
  const stateTaskId = location.state?.taskId || ""

  const [activeTasks, setActiveTasks] = useState<ActiveTask[]>([])
  const [loadingTasks, setLoadingTasks] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<SubmitFormInput>({
    defaultValues: {
      taskId: stateTaskId,
      remarks: "",
    }
  })

  // Fetch tasks to populate dropdown
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoadingTasks(true)
        const response = await api.get("/api/student/tasks")
        const tasksData = response.data || []
        
        // Only show tasks that are Pending or Rejected (need submission)
        const filtered = tasksData
          .filter((t: any) => t.status === "Pending" || t.status === "Rejected")
          .map((t: any) => ({
            id: t.id,
            subject: `${t.subject} (${t.taskType})`,
            taskType: t.taskType
          }))
        
        setActiveTasks(filtered)

        // If a task ID was passed in state, set it in form
        if (stateTaskId) {
          setValue("taskId", stateTaskId)
        } else if (filtered.length > 0) {
          setValue("taskId", filtered[0].id)
        }
      } catch (error) {
        console.warn("API offline, using mock active tasks list.")
        const mockActive: ActiveTask[] = [
          { id: "task-101", subject: "Database Management Systems (DBMS) (Assignment)", taskType: "Assignment" },
          { id: "task-104", subject: "Machine Learning (ML) (Case Study)", taskType: "Case Study" },
          { id: "task-105", subject: "NPTEL/MOOC Courses (Certificate)", taskType: "Certificate" }
        ]
        setActiveTasks(mockActive)
        if (stateTaskId) {
          setValue("taskId", stateTaskId)
        } else if (mockActive.length > 0) {
          setValue("taskId", mockActive[0].id)
        }
      } finally {
        setLoadingTasks(false)
      }
    }

    fetchTasks()
  }, [stateTaskId, setValue])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size exceeds 5MB limit")
        setSelectedFile(null)
        e.target.value = "" // clear input
        return
      }
      setSelectedFile(file)
    } else {
      setSelectedFile(null)
    }
  }

  const onSubmit = async (data: SubmitFormInput) => {
    if (!selectedFile) {
      toast.error("Please select a file to upload")
      return
    }

    setIsSubmitting(true)

    // Prepare multipart/form-data
    const formData = new FormData()
    formData.append("taskId", data.taskId)
    formData.append("file", selectedFile)
    formData.append("remarks", data.remarks)

    try {
      const response = await api.post("/api/student/submissions", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      if (response.status === 200 || response.status === 201) {
        toast.success("Work submitted successfully!")
        navigate("/dashboard/tasks")
      }
    } catch (error: any) {
      console.error("Submission request error:", error)
      
      // Fallback for offline demo mode
      if (error.message && (error.message.includes("Failed to fetch") || error.message.includes("Load failed") || error.name === "TypeError" || error.response?.status === 404)) {
        toast.promise(
          new Promise((resolve) => setTimeout(resolve, 1500)),
          {
            loading: "Simulating file upload to CDGI server...",
            success: () => {
              navigate("/dashboard/tasks")
              return "Demo Mode: Submission uploaded successfully!"
            },
            error: "Failed to upload.",
          }
        )
      } else {
        toast.error(error.response?.data?.message || "Failed to submit work. Please try again.")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6 max-w-xl mx-auto">
      
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={() => navigate("/dashboard/tasks")}
        className="text-xs text-slate-500 hover:text-slate-900 pl-0 -ml-2"
      >
        <ArrowLeft className="h-4 w-4 mr-1.5" />
        Back to Tasks list
      </Button>

      <Card className="border-slate-200 bg-white shadow-xl">
        <CardHeader className="space-y-1.5 pb-4 border-b border-slate-100">
          <CardTitle className="text-xl font-bold tracking-tight text-slate-800 flex items-center gap-2">
            <Upload className="h-5 w-5 text-primary" />
            Submit Dues Documentation
          </CardTitle>
          <CardDescription className="text-slate-500 text-xs">
            Upload verified certificates, lab manual files, or assignments to clear department holds.
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-5 pt-6">
            
            {/* Task Dropdown */}
            <div className="space-y-1.5">
              <Label htmlFor="taskId" className="text-xs font-semibold text-slate-700">
                Select Active Task
              </Label>
              {loadingTasks ? (
                <div className="h-10 w-full bg-slate-50 rounded-md border border-slate-200 flex items-center px-3 text-xs text-slate-400">
                  <Loader2 className="h-3.5 w-3.5 animate-spin mr-2" />
                  Loading your pending tasks...
                </div>
              ) : activeTasks.length === 0 ? (
                <div className="p-3.5 bg-emerald-50 border border-emerald-100 rounded-xl text-emerald-700 text-xs flex items-center gap-2">
                  <AlertCircle className="h-4.5 w-4.5 shrink-0" />
                  You have no pending tasks to submit! You are all cleared.
                </div>
              ) : (
                <Select
                  id="taskId"
                  className={errors.taskId ? "border-rose-500" : "border-slate-200"}
                  {...register("taskId", { required: "Please choose a task" })}
                >
                  {activeTasks.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.subject}
                    </option>
                  ))}
                </Select>
              )}
              {errors.taskId && (
                <p className="text-[11px] text-rose-500 font-medium mt-0.5">{errors.taskId.message}</p>
              )}
            </div>

            {/* File Upload Input */}
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-slate-700">
                Upload Document (PDF or Images, Max 5MB)
              </Label>
              
              <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 hover:bg-slate-50/50 hover:border-primary/30 transition-all cursor-pointer relative flex flex-col items-center justify-center">
                <input
                  type="file"
                  accept="application/pdf, image/*"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  {...register("file", {
                    required: "Upload file is required",
                    onChange: handleFileChange
                  })}
                />
                
                <div className="h-10 w-10 bg-indigo-50 border border-indigo-100 rounded-lg flex items-center justify-center text-primary mb-3">
                  <Upload className="h-5 w-5" />
                </div>
                
                {selectedFile ? (
                  <div className="text-center space-y-1.5">
                    <p className="text-sm font-semibold text-slate-800 flex items-center gap-1.5 justify-center">
                      <FileText className="h-4 w-4 text-primary" />
                      {selectedFile.name}
                    </p>
                    <p className="text-xs text-slate-400 font-mono">
                      {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                ) : (
                  <div className="text-center space-y-1">
                    <p className="text-xs font-semibold text-slate-600">
                      Click to browse or drag & drop file
                    </p>
                    <p className="text-[10px] text-slate-400">
                      PDF, PNG, JPG files accepted (max 5MB limit)
                    </p>
                  </div>
                )}
              </div>
              
              {errors.file && (
                <p className="text-[11px] text-rose-500 font-medium mt-0.5">{errors.file.message}</p>
              )}
            </div>

            {/* Remarks Textarea */}
            <div className="space-y-1.5">
              <Label htmlFor="remarks" className="text-xs font-semibold text-slate-700">
                Remarks / Comments
              </Label>
              <textarea
                id="remarks"
                rows={3}
                placeholder="Specify details, library receipt numbers, or roll validation remarks..."
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-all focus:outline-none focus:ring-1 focus:ring-ring focus:border-ring placeholder:text-muted-foreground/75 resize-none text-slate-900 border-slate-200"
                {...register("remarks", { maxLength: { value: 200, message: "Remarks cannot exceed 200 characters" } })}
              ></textarea>
              {errors.remarks && (
                <p className="text-[11px] text-rose-500 font-medium mt-0.5">{errors.remarks.message}</p>
              )}
            </div>

          </CardContent>

          <CardFooter className="border-t border-slate-100 p-6 flex gap-3 justify-end mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/dashboard/tasks")}
              className="text-xs border-slate-200"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || activeTasks.length === 0}
              className="text-xs bg-primary text-white hover:bg-primary/95 flex items-center gap-1.5 font-semibold"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Uploading Work...
                </>
              ) : (
                <>
                  <Send className="h-3.5 w-3.5" />
                  Submit Work
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
export default SubmitWork
