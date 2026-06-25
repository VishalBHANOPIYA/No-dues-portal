import React, { useState } from "react"
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
import toast from "react-hot-toast"

export const DashboardLayout: React.FC = () => {
  const navigate = useNavigate()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  
  // User credentials from localStorage
  const role = localStorage.getItem("role") || "Student"
  const email = localStorage.getItem("email") || "student@cdgi.edu.in"
  const name = email.split("@")[0].replace(".", " ").toUpperCase()

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
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      
      {/* Top Navbar */}
      <header className="h-16 border-b border-slate-200 bg-white sticky top-0 z-40 px-4 md:px-6 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          {/* Mobile Hamburger menu */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 md:hidden"
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>

          {/* Brand Logo */}
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center text-white shadow-md shadow-primary/20">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div>
              <span className="font-bold tracking-tight text-slate-800 text-sm md:text-base">CDGI</span>
              <span className="hidden sm:inline-block ml-1.5 px-1.5 py-0.5 rounded bg-primary/10 text-primary text-[10px] font-semibold tracking-wider uppercase">Portal</span>
            </div>
          </div>
        </div>

        {/* Global Search Bar (Desktop) */}
        <div className="hidden md:flex items-center max-w-sm w-full relative">
          <Search className="h-4 w-4 text-slate-400 absolute left-3 pointer-events-none" />
          <input 
            type="text" 
            placeholder="Search departments, requests..." 
            className="w-full h-9 pl-9 pr-4 rounded-lg bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all placeholder:text-slate-400"
          />
        </div>

        {/* User profile / notification block */}
        <div className="flex items-center gap-4">
          {/* Notification Icon */}
          <NotificationBell />

          {/* User Profile Summary */}
          <div className="flex items-center gap-3 border-l border-slate-200 pl-4">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-semibold text-slate-800">{name}</p>
              <p className="text-[10px] font-medium text-slate-500 capitalize">{role}</p>
            </div>
            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-indigo-500 to-primary flex items-center justify-center text-white font-bold text-sm shadow-md border border-white">
              {name.charAt(0)}
            </div>
            
            <button 
              onClick={handleLogout}
              className="p-1.5 rounded-lg text-slate-500 hover:bg-rose-50 hover:text-rose-600 transition-all hidden xs:block"
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
        <aside className="w-64 border-r border-slate-200 bg-white hidden md:flex flex-col justify-between p-4 sticky top-16 h-[calc(100vh-4rem)]">
          <div className="space-y-6">
            
            {/* Sidebar College Branding Panel */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-2.5">
              <Building className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-slate-800 leading-tight">CDGI Campus</h4>
                <p className="text-[10px] text-slate-500 mt-0.5 leading-snug">Chameli Devi Group of Institutions</p>
              </div>
            </div>

            {/* Sidebar Links */}
            <nav className="space-y-1">
              {menuItems.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.path}
                  end
                  className={({ isActive }) => `
                    flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all group
                    ${isActive 
                      ? "bg-primary/5 text-primary font-semibold border-l-2 border-primary" 
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"}
                  `}
                >
                  {({ isActive }) => (
                    <>
                      <div className="flex items-center gap-3">
                        <item.icon className={`h-4.5 w-4.5 transition-colors ${isActive ? "text-primary" : "text-slate-400 group-hover:text-slate-600"}`} />
                        {item.name}
                      </div>
                      <ChevronRight className={`h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity ${isActive ? "text-primary opacity-100" : "text-slate-400"}`} />
                    </>
                  )}
                </NavLink>
              ))}
            </nav>
          </div>

          {/* Sidebar Bottom Footer/Profile */}
          <div className="border-t border-slate-100 pt-4 space-y-3">
            <div className="flex items-center justify-between text-xs px-2">
              <span className="text-slate-400">Account Role</span>
              <span className="px-2 py-0.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 font-semibold text-[10px] uppercase tracking-wider">{role}</span>
            </div>
            
            <Button 
              variant="outline" 
              onClick={handleLogout}
              className="w-full justify-start text-slate-500 hover:text-rose-600 hover:bg-rose-50 border-slate-200 hover:border-rose-100"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </aside>

        {/* Mobile Sidebar Navigation Drawer Overlay */}
        {isMobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* Mobile Sidebar Navigation Drawer */}
        <aside className={`
          fixed top-0 left-0 bottom-0 w-72 bg-white z-50 p-6 flex flex-col justify-between shadow-2xl transition-transform duration-300 md:hidden
          ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
        `}>
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-white shadow-md">
                  <GraduationCap className="h-4 w-4" />
                </div>
                <span className="font-bold text-slate-800 text-sm">CDGI Portal</span>
              </div>
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-2.5">
              <Building className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-slate-800 leading-tight">CDGI Campus</h4>
                <p className="text-[10px] text-slate-500 mt-0.5 leading-snug">Chameli Devi Group of Institutions</p>
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
                    flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all group
                    ${isActive 
                      ? "bg-primary/5 text-primary font-semibold border-l-2 border-primary" 
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"}
                  `}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="h-4.5 w-4.5 text-slate-400 group-hover:text-slate-600" />
                    {item.name}
                  </div>
                  <ChevronRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100" />
                </NavLink>
              ))}
            </nav>
          </div>

          <div className="border-t border-slate-100 pt-4 space-y-3">
            <div className="flex items-center justify-between text-xs px-2">
              <span className="text-slate-400">Account Role</span>
              <span className="px-2 py-0.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 font-semibold text-[10px] uppercase tracking-wider">{role}</span>
            </div>
            <Button 
              variant="outline" 
              onClick={handleLogout}
              className="w-full justify-start text-slate-500 hover:text-rose-600 hover:bg-rose-50 border-slate-200"
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
