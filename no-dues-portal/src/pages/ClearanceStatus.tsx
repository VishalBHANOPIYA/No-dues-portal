import React from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { CheckCircle2, Clock, HelpCircle, FileCheck, ArrowRight, ShieldCheck } from "lucide-react"

export const ClearanceStatus: React.FC = () => {
  const role = localStorage.getItem("role") || "Student"

  const steps = [
    { title: "Student Submission", desc: "Clearance audit request submitted by student.", status: "completed", date: "June 18, 2026" },
    { title: "Department Verification", desc: "Respective officers verify dues status.", status: "current", date: "Active" },
    { title: "HOD Validation", desc: "HOD reviews clearance statuses.", status: "upcoming", date: "--" },
    { title: "Accounts Settlement", desc: "Accounts desk issues final financial sign-off.", status: "upcoming", date: "--" },
    { title: "Gate Pass Generated", desc: "System generates digital No-Dues gate certificate.", status: "upcoming", date: "--" },
  ]

  return (
    <div className="space-y-6">
      <div className="space-y-1.5">
        <h2 className="text-2xl font-bold tracking-tight text-slate-800">Clearance Roadmap</h2>
        <p className="text-sm text-slate-500">Track the lifecycle of your academic no-dues verification pipeline.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Timeline Flow */}
        <Card className="lg:col-span-2 border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
            <FileCheck className="h-5 w-5 text-primary" />
            Verification Lifecycle
          </h3>
          
          <div className="relative pl-6 border-l-2 border-slate-100 space-y-8 ml-3">
            {steps.map((step, idx) => (
              <div key={idx} className="relative">
                {/* Step Circle Indicator */}
                <div className={`
                  absolute -left-[35px] top-0 h-6.5 w-6.5 rounded-full flex items-center justify-center border-2 text-xs font-semibold
                  ${step.status === "completed" 
                    ? "bg-primary border-primary text-white" 
                    : step.status === "current"
                    ? "bg-white border-primary text-primary animate-pulse"
                    : "bg-white border-slate-200 text-slate-400"}
                `}>
                  {step.status === "completed" ? "✓" : idx + 1}
                </div>

                {/* Step Content */}
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <h4 className={`text-sm font-bold ${step.status === "upcoming" ? "text-slate-400" : "text-slate-800"}`}>
                      {step.title}
                    </h4>
                    <span className="text-[10px] text-slate-400 font-mono">{step.date}</span>
                  </div>
                  <p className="text-xs text-slate-400 font-light leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Informative Side Card */}
        <Card className="border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="font-bold text-slate-800">Clearance Policy</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-light">
              Clearances must be verified at least 7 working days before final university examinations or graduation sign-offs.
            </p>
            <p className="text-xs text-slate-400 leading-relaxed font-light">
              In case of any discrepancies or incorrect holds, students are advised to contact the department coordinator immediately with proof of deposits or returns.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-indigo-50/50 border border-indigo-100 mt-6 space-y-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4.5 w-4.5 text-primary shrink-0" />
              <span className="text-xs font-bold text-slate-800">Need Help?</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed font-light">
              Raise a support ticket via the Helpdesk for swift response.
            </p>
            <a href="#" className="text-xs text-primary font-semibold hover:underline flex items-center gap-1">
              Contact Coordinator Office
              <ArrowRight className="h-3 w-3" />
            </a>
          </div>
        </Card>

      </div>
    </div>
  )
}
