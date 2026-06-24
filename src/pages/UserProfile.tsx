import React from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { User, Mail, ShieldAlert, Award, GraduationCap, Building2 } from "lucide-react"

export const UserProfile: React.FC = () => {
  const role = localStorage.getItem("role") || "Student"
  const email = localStorage.getItem("email") || "student@cdgi.edu.in"
  const name = email.split("@")[0].replace(".", " ").toUpperCase()

  return (
    <div className="space-y-6">
      <div className="space-y-1.5">
        <h2 className="text-2xl font-bold tracking-tight text-slate-800">My Profile</h2>
        <p className="text-sm text-slate-500">Manage and view your academic profile and credentials.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Profile Card */}
        <Card className="md:col-span-1 border-slate-200 bg-white p-6 shadow-sm flex flex-col items-center text-center space-y-4">
          <div className="h-24 w-24 rounded-full bg-gradient-to-br from-indigo-500 to-primary flex items-center justify-center text-white font-extrabold text-3xl shadow-lg border-2 border-white">
            {name.charAt(0)}
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-800">{name}</h3>
            <span className="mt-1.5 inline-block px-2.5 py-0.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 font-semibold text-[10px] uppercase tracking-wider">{role}</span>
          </div>
          <p className="text-xs text-slate-400 font-light">Chameli Devi Group of Institutions</p>
        </Card>

        {/* Profile Details */}
        <Card className="md:col-span-2 border-slate-200 bg-white p-6 shadow-sm space-y-6">
          <h3 className="font-bold text-slate-800 pb-3 border-b border-slate-100 flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-primary" />
            University Credentials
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-400">Email Address</span>
              <p className="text-slate-800 flex items-center gap-2">
                <Mail className="h-4 w-4 text-slate-400" />
                {email}
              </p>
            </div>
            
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-400">Enrollment / Roll Number</span>
              <p className="text-slate-800 font-mono text-xs">0812CS221001</p>
            </div>

            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-400">Academic Branch</span>
              <p className="text-slate-800 flex items-center gap-2">
                <Building2 className="h-4 w-4 text-slate-400" />
                Computer Science & Engineering
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-400">Current Semester / Batch</span>
              <p className="text-slate-800 flex items-center gap-2">
                <Award className="h-4 w-4 text-slate-400" />
                Semester 8 (Class of 2026)
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-100 flex items-start gap-3">
            <ShieldAlert className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-amber-800">Note on Profile Edits</h4>
              <p className="text-[11px] text-slate-500 leading-relaxed font-light">
                To request modifications to your registered email, name, branch, or semester records, please contact the Registrar Office directly. Verification requires physical enrollment proof.
              </p>
            </div>
          </div>
        </Card>

      </div>
    </div>
  )
}
