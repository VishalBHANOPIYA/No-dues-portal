import React from "react"
import { Outlet, Link } from "react-router-dom"
import { ShieldCheck, Award, GraduationCap, Building2 } from "lucide-react"

export const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#f8fafc]">
      {/* Left Sidebar - Dark Theme College Branding */}
      <div className="w-full md:w-5/12 bg-gradient-to-b from-[#0f172a] via-[#1e1b4b] to-[#0f172a] text-white p-8 md:p-12 lg:p-16 flex flex-col justify-between relative overflow-hidden select-none">
        {/* Decorative Grid and Gradients */}
        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-primary/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl"></div>

        {/* Top Header Section */}
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            {/* College Logo Placeholder */}
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 border border-white/10">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">CDGI</h1>
              <p className="text-[10px] text-indigo-300 font-medium tracking-widest uppercase">Academic Clearing</p>
            </div>
          </div>
        </div>

        {/* Middle Branding/Illustration Section */}
        <div className="my-12 md:my-auto relative z-10 space-y-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-indigo-300 font-medium">
            <ShieldCheck className="h-3.5 w-3.5" />
            Official University Portal
          </div>
          
          <div className="space-y-4">
            <h2 className="text-3xl lg:text-4xl font-extrabold leading-tight tracking-tight text-slate-100">
              Chameli Devi Group of Institutions
            </h2>
            <p className="text-slate-300 text-sm lg:text-base leading-relaxed max-w-md font-light">
              Welcome to the unified No-Dues Portal. Seamlessly process clearances, track verification status, and obtain digital sign-offs across all college departments.
            </p>
          </div>

          {/* Feature Highlights */}
          <div className="pt-6 space-y-3 border-t border-white/5">
            <div className="flex items-center gap-3 text-xs text-slate-400">
              <div className="h-5 w-5 rounded-md bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                <Building2 className="h-3 w-3 text-indigo-400" />
              </div>
              Multi-department clearances in one click
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-400">
              <div className="h-5 w-5 rounded-md bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                <Award className="h-3 w-3 text-indigo-400" />
              </div>
              Secure digital signatures and PDF certificates
            </div>
          </div>
        </div>

        {/* Bottom Footer Section */}
        <div className="relative z-10 text-xs text-slate-400 flex flex-wrap gap-x-6 gap-y-2 justify-between">
          <p>© 2026 CDGI. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Support</a>
          </div>
        </div>
      </div>

      {/* Right Column - Centered Card Container */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12 lg:p-16 relative overflow-hidden bg-slate-50">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100/30 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-100/30 rounded-full blur-3xl pointer-events-none"></div>

        <div className="w-full max-w-[460px] relative z-10">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
