import React, { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import api from "@/services/api"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { FilePlus, ArrowLeft, Loader2, Calendar, ClipboardList } from "lucide-react"
import toast from "react-hot-toast"

interface AssignmentFormInput {
  subjectId: string
  title: string
  taskType: "Lab Manual" | "Assignment" | "Case Study" | "Mini Project" | "Certificate"
  description: string
  deadline: string
}

interface FacultySubject {
  id: string
  name: string
  code: string
}

export const CreateAssignment: React.FC = () => {
  const navigate = useNavigate()
  const [subjects, setSubjects] = useState<FacultySubject[]>([])
  const [loadingSubjects, setLoadingSubjects] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<AssignmentFormInput>({
    defaultValues: {
      subjectId: "",
      title: "",
      taskType: "Assignment",
      description: "",
      deadline: "",
    }
  })

  // Fetch subjects to populate dropdown
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        setLoadingSubjects(true)
        const response = await api.get("/api/faculty/subjects")
        const subData = response.data || []
        setSubjects(subData)
        if (subData.length > 0) {
          setValue("subjectId", subData[0].id)
        }
      } catch (error) {
        console.warn("API offline, using mock subjects list.")
        const mockSubjects: FacultySubject[] = [
          { id: "sub-cdgi-1", name: "Database Management Systems (DBMS)", code: "CS-801" },
          { id: "sub-cdgi-2", name: "Compiler Design (CD)", code: "CS-802" },
          { id: "sub-cdgi-3", name: "Information Security (IS)", code: "CS-803" }
        ]
        setSubjects(mockSubjects)
        if (mockSubjects.length > 0) {
          setValue("subjectId", mockSubjects[0].id)
        }
      } finally {
        setLoadingSubjects(false)
      }
    }

    fetchSubjects()
  }, [setValue])

  const onSubmit = async (data: AssignmentFormInput) => {
    setIsSubmitting(true)
    try {
      const response = await api.post("/api/faculty/assignments", data)
      if (response.status === 200 || response.status === 201) {
        toast.success("Assignment created successfully!")
        navigate("/dashboard")
      }
    } catch (error: any) {
      console.error("Assignment submit error:", error)
      
      // Fallback offline simulator
      if (error.message && (error.message.includes("Failed to fetch") || error.message.includes("Load failed") || error.name === "TypeError" || error.response?.status === 404)) {
        toast.promise(
          new Promise((resolve) => setTimeout(resolve, 1500)),
          {
            loading: "Simulating assignment registration on CDGI server...",
            success: () => {
              navigate("/dashboard")
              return "Demo Mode: Assignment created successfully!"
            },
            error: "Failed to submit.",
          }
        )
      } else {
        toast.error(error.response?.data?.message || "Failed to create assignment. Please try again.")
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
        onClick={() => navigate("/dashboard")}
        className="text-xs text-slate-500 hover:text-slate-900 pl-0 -ml-2"
      >
        <ArrowLeft className="h-4 w-4 mr-1.5" />
        Back to Dashboard
      </Button>

      <Card className="border-slate-200 bg-white shadow-xl">
        <CardHeader className="space-y-1.5 pb-4 border-b border-slate-100">
          <CardTitle className="text-xl font-bold tracking-tight text-slate-800 flex items-center gap-2">
            <FilePlus className="h-5 w-5 text-primary" />
            Create Task / Due Checkpoint
          </CardTitle>
          <CardDescription className="text-slate-500 text-xs">
            Publish a due check assignment for students to submit verification files.
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-5 pt-6">
            
            {/* Subject Select Dropdown */}
            <div className="space-y-1.5">
              <Label htmlFor="subjectId" className="text-xs font-semibold text-slate-700">
                Select Subject / Department Ledger
              </Label>
              {loadingSubjects ? (
                <div className="h-10 w-full bg-slate-50 rounded-md border border-slate-200 flex items-center px-3 text-xs text-slate-400">
                  <Loader2 className="h-3.5 w-3.5 animate-spin mr-2" />
                  Loading academic subjects...
                </div>
              ) : (
                <Select
                  id="subjectId"
                  className={errors.subjectId ? "border-rose-500" : "border-slate-200"}
                  {...register("subjectId", { required: "Please select a subject" })}
                >
                  {subjects.map((sub) => (
                    <option key={sub.id} value={sub.id}>
                      {sub.name} ({sub.code})
                    </option>
                  ))}
                </Select>
              )}
              {errors.subjectId && (
                <p className="text-[11px] text-rose-500 font-medium mt-0.5">{errors.subjectId.message}</p>
              )}
            </div>

            {/* Task Title Input */}
            <div className="space-y-1.5">
              <Label htmlFor="title" className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                <ClipboardList className="h-3.5 w-3.5 text-slate-400" />
                Task Title
              </Label>
              <Input
                id="title"
                type="text"
                placeholder="e.g. End Semester Lab Manual Submission"
                className={errors.title ? "border-rose-500" : "border-slate-200"}
                {...register("title", {
                  required: "Task title is required",
                  minLength: { value: 5, message: "Title must be at least 5 characters" }
                })}
              />
              {errors.title && (
                <p className="text-[11px] text-rose-500 font-medium mt-0.5">{errors.title.message}</p>
              )}
            </div>

            {/* Task Type Select */}
            <div className="space-y-1.5">
              <Label htmlFor="taskType" className="text-xs font-semibold text-slate-700">
                Task Type
              </Label>
              <Select
                id="taskType"
                className={errors.taskType ? "border-rose-500" : "border-slate-200"}
                {...register("taskType", { required: "Task type selection is required" })}
              >
                <option value="Lab Manual">Lab Manual</option>
                <option value="Assignment">Assignment</option>
                <option value="Case Study">Case Study</option>
                <option value="Mini Project">Mini Project</option>
                <option value="Certificate">Certificate</option>
              </Select>
              {errors.taskType && (
                <p className="text-[11px] text-rose-500 font-medium mt-0.5">{errors.taskType.message}</p>
              )}
            </div>

            {/* Deadline Date Input */}
            <div className="space-y-1.5">
              <Label htmlFor="deadline" className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5 text-slate-400" />
                Deadline Date
              </Label>
              <Input
                id="deadline"
                type="date"
                className={errors.deadline ? "border-rose-500" : "border-slate-200"}
                {...register("deadline", { required: "Submission deadline date is required" })}
              />
              {errors.deadline && (
                <p className="text-[11px] text-rose-500 font-medium mt-0.5">{errors.deadline.message}</p>
              )}
            </div>

            {/* Description Textarea */}
            <div className="space-y-1.5">
              <Label htmlFor="description" className="text-xs font-semibold text-slate-700">
                Task Guidelines / Description
              </Label>
              <textarea
                id="description"
                rows={4}
                placeholder="Upload parameters, syllabus requirements, and guidelines for document uploads..."
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-all focus:outline-none focus:ring-1 focus:ring-ring focus:border-ring placeholder:text-muted-foreground/75 resize-none text-slate-900 border-slate-200"
                {...register("description", {
                  required: "Guidelines description is required",
                  maxLength: { value: 400, message: "Description cannot exceed 400 characters" }
                })}
              ></textarea>
              {errors.description && (
                <p className="text-[11px] text-rose-500 font-medium mt-0.5">{errors.description.message}</p>
              )}
            </div>

          </CardContent>

          <CardFooter className="border-t border-slate-100 p-6 flex gap-3 justify-end mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/dashboard")}
              className="text-xs border-slate-200"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="text-xs bg-primary text-white hover:bg-primary/95 flex items-center gap-1.5 font-semibold"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Publishing Task...
                </>
              ) : (
                "Publish Checkpoint"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
export default CreateAssignment
