import React, { useState, useEffect } from "react"
import { Outlet, NavLink, useNavigate } from "react-router-dom"
import { 
  LayoutDashboard, 
  FileCheck, 
  User, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  Search, 
  GraduationCap,
  Building,
  ChevronRight,
  ClipboardList,
  Upload,
  FileText,
  FilePlus
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { NotificationBell } from "@/components/NotificationBell"
import { ThemeToggle } from "@/components/ThemeToggle"
import toast from "react-hot-toast"

export const DashboardLayout: React.FC = () => {
  const navigate = useNavigate()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  
  // User credentials from localStorage
  const role = localStorage.getItem("role") || "Student"
  const email = localStorage.getItem("email") || "student@cdgi.edu.in"
  const name = localStorage.getItem("name") || email.split("@")[0].replace(".", " ").toUpperCase()
  const [avatar, setAvatar] = useState<string>(localStorage.getItem("avatar") || "")

  useEffect(() => {
    const syncAvatar = () => {
      setAvatar(localStorage.getItem("avatar") || "")
    }
    window.addEventListener("avatar_updated", syncAvatar)
    return () => window.removeEventListener("avatar_updated", syncAvatar)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("role")
    localStorage.removeItem("email")
    toast.success("Logged out successfully")
    navigate("/auth/login")
  }

  // Define sidebar items dynamically based on the current user's role
  const menuItems = role === "Student"
    ? [
        { name: "Dashboard", path: "/dashboard/student", icon: LayoutDashboard },
        { name: "My Tasks", path: "/dashboard/tasks", icon: ClipboardList },
        { name: "Submit Work", path: "/dashboard/submit", icon: Upload },
        { name: "My Dues", path: "/dashboard/dues", icon: FileText },
        { name: "Clearance Status", path: "/dashboard/clearance", icon: FileCheck },
        { name: "My Profile", path: "/dashboard/profile", icon: User },
        { name: "Settings", path: "/dashboard/settings", icon: Settings },
      ]
    : role === "Coordinator"
    ? [
        { name: "Class Overview", path: "/dashboard/coordinator", icon: LayoutDashboard },
        { name: "Clearance Status", path: "/dashboard/clearance", icon: FileCheck },
        { name: "My Profile", path: "/dashboard/profile", icon: User },
        { name: "Settings", path: "/dashboard/settings", icon: Settings },
      ]
    : role === "HOD-Admin"
    ? [
        { name: "Admin Dashboard", path: "/dashboard/admin", icon: LayoutDashboard },
        { name: "Clearance Status", path: "/dashboard/clearance", icon: FileCheck },
        { name: "My Profile", path: "/dashboard/profile", icon: User },
        { name: "Settings", path: "/dashboard/settings", icon: Settings },
      ]
    : [
        { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
        { name: "Create Assignment", path: "/dashboard/create-assignment", icon: FilePlus },
        { name: "Review Queue", path: "/dashboard/review", icon: ClipboardList },
        { name: "Clearance Status", path: "/dashboard/clearance", icon: FileCheck },
        { name: "My Profile", path: "/dashboard/profile", icon: User },
        { name: "Settings", path: "/dashboard/settings", icon: Settings },
      ]

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300">
      
      {/* Top Navbar with TTScheduler Glassmorphism */}
      <header className="h-16 border-b border-slate-200/70 dark:border-white/10 backdrop-blur-2xl bg-white/75 dark:bg-[#0b0f19]/80 sticky top-0 z-40 px-4 md:px-8 flex items-center justify-between shadow-sm transition-colors duration-300">
        <div className="flex items-center gap-3">
          {/* Mobile Hamburger menu */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10 md:hidden transition-colors"
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          {/* Brand Logo with TTScheduler Gradient */}
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => navigate("/dashboard")}>
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div>
              <span className="font-extrabold tracking-tight text-lg bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-600 bg-clip-text text-transparent">
                CDGI Portal
              </span>
              <span className="hidden sm:inline-block ml-2 px-2 py-0.5 rounded-full bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-[10px] font-bold tracking-wider uppercase">
                No-Dues
              </span>
            </div>
          </div>
        </div>

        {/* Global Search Bar (Desktop) */}
        <div className="hidden md:flex items-center max-w-sm w-full relative">
          <Search className="h-4 w-4 text-slate-400 dark:text-slate-500 absolute left-3.5 pointer-events-none" />
          <input 
            type="text" 
            placeholder="Search departments, requests..." 
            className="w-full h-9 pl-9 pr-4 rounded-xl bg-slate-100/70 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
          />
        </div>

        {/* Right controls: ThemeToggle + Notifications + User profile */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Dark / Light Mode Switcher */}
          <ThemeToggle />

          {/* Notification Bell */}
          <NotificationBell />

          {/* User Profile Summary */}
          <div className="flex items-center gap-3 border-l border-slate-200/80 dark:border-white/10 pl-3 sm:pl-4">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-100">{name}</p>
              <span className="inline-block text-[10px] font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 px-2 py-0.5 rounded-full border border-blue-200/60 dark:border-blue-800/40 uppercase tracking-wide">
                {role}
              </span>
            </div>
            {avatar ? (
              <img 
                src={avatar} 
                alt={name} 
                className="h-9 w-9 rounded-full object-cover shadow-md border border-white dark:border-slate-800 cursor-pointer hover:ring-2 hover:ring-blue-500/40 transition-all"
                onClick={() => navigate("/dashboard/profile")}
              />
            ) : (
              <div 
                className="h-9 w-9 rounded-full bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-md border border-white dark:border-slate-800 cursor-pointer hover:ring-2 hover:ring-blue-500/40 transition-all"
                onClick={() => navigate("/dashboard/profile")}
              >
                {name.charAt(0)}
              </div>
            )}
            
            <button 
              onClick={handleLogout}
              className="p-2 rounded-xl text-slate-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40 dark:hover:text-rose-400 transition-all hidden xs:block"
              title="Logout"
            >
              <LogOut className="h-4.5 w-4.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 flex relative">
        
        {/* Left Sidebar - Desktop */}
        <aside className="w-64 border-r border-slate-200/70 dark:border-white/10 backdrop-blur-2xl bg-white/70 dark:bg-[#0b0f19]/70 hidden md:flex flex-col justify-between p-4 sticky top-16 h-[calc(100vh-4rem)] transition-colors duration-300">
          <div className="space-y-6">
            
            {/* Sidebar College Branding Panel with Modern Glow */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-br from-blue-500/5 via-indigo-500/5 to-purple-500/5 dark:bg-white/[0.03] border border-blue-500/15 dark:border-white/10 flex items-start gap-2.5 shadow-sm">
              <div className="p-2 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5">
                <Building className="h-4 w-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100 leading-tight">CDGI Campus</h4>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">Chameli Devi Group of Institutions</p>
              </div>
            </div>

            {/* Sidebar Links */}
            <nav className="space-y-1.5">
              {menuItems.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.path}
                  end
                  className={({ isActive }) => `
                    flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all group
                    ${isActive 
                      ? "bg-gradient-to-r from-blue-600/15 via-indigo-600/10 to-transparent text-blue-600 dark:text-blue-400 font-semibold border-l-[3px] border-blue-600 dark:border-blue-400 shadow-sm" 
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-100/60 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white"}
                  `}
                >
                  {({ isActive }) => (
                    <>
                      <div className="flex items-center gap-3">
                        <item.icon className={`h-4.5 w-4.5 transition-colors ${isActive ? "text-blue-600 dark:text-blue-400" : "text-slate-400 dark:text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-300"}`} />
                        {item.name}
                      </div>
                      <ChevronRight className={`h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity ${isActive ? "text-blue-600 dark:text-blue-400 opacity-100" : "text-slate-400"}`} />
                    </>
                  )}
                </NavLink>
              ))}
            </nav>
          </div>

          {/* Sidebar Bottom Footer/Profile */}
          <div className="border-t border-slate-200/70 dark:border-white/10 pt-4 space-y-3">
            <div className="flex items-center justify-between text-xs px-2">
              <span className="text-slate-400 text-[11px]">Active Session</span>
              <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 font-semibold text-[10px] tracking-wide">2024-25</span>
            </div>
            
            <Button 
              variant="outline" 
              onClick={handleLogout}
              className="w-full justify-start text-xs rounded-xl text-slate-500 dark:text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 border-slate-200/80 dark:border-white/10"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </aside>

        {/* Mobile Sidebar Navigation Drawer Overlay */}
        {isMobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* Mobile Sidebar Navigation Drawer */}
        <aside className={`
          fixed top-0 left-0 bottom-0 w-72 backdrop-blur-2xl bg-white/95 dark:bg-[#0b0f19]/95 z-50 p-6 flex flex-col justify-between shadow-2xl transition-transform duration-300 md:hidden border-r border-slate-200/80 dark:border-white/10
          ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
        `}>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md">
                  <GraduationCap className="h-4 w-4" />
                </div>
                <span className="font-extrabold text-slate-800 dark:text-slate-100 text-sm">CDGI Portal</span>
              </div>
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-3.5 rounded-2xl bg-gradient-to-br from-blue-500/5 to-purple-500/5 dark:bg-white/[0.04] border border-blue-500/15 dark:border-white/10 flex items-start gap-2.5">
              <Building className="h-5 w-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100 leading-tight">CDGI Campus</h4>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">Chameli Devi Group of Institutions</p>
              </div>
            </div>

            <nav className="space-y-1">
              {menuItems.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.path}
                  end
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) => `
                    flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all group
                    ${isActive 
                      ? "bg-gradient-to-r from-blue-600/15 to-purple-600/10 text-blue-600 dark:text-blue-400 font-semibold border-l-2 border-blue-600 dark:border-blue-400" 
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-100/60 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white"}
                  `}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="h-4.5 w-4.5" />
                    {item.name}
                  </div>
                  <ChevronRight className="h-3.5 w-3.5 opacity-50" />
                </NavLink>
              ))}
            </nav>
          </div>

          <div className="border-t border-slate-200/80 dark:border-white/10 pt-4 space-y-3">
            <Button 
              variant="outline" 
              onClick={handleLogout}
              className="w-full justify-start text-xs rounded-xl text-slate-500 dark:text-slate-400 hover:text-rose-600 hover:bg-rose-50 border-slate-200/80 dark:border-white/10"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
          <Outlet />
        </main>

      </div>
    </div>
  )
}
export default DashboardLayout
