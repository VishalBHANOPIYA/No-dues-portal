import React from "react"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { Toaster } from "react-hot-toast"
import { AuthLayout } from "./layouts/AuthLayout"
import { DashboardLayout } from "./layouts/DashboardLayout"
import { Login } from "./pages/Login"
import { StudentDashboard } from "./pages/StudentDashboard"
import { MyTasks } from "./pages/MyTasks"
import { SubmitWork } from "./pages/SubmitWork"
import { MyDues } from "./pages/MyDues"
import { FacultyDashboard } from "./pages/FacultyDashboard"
import { CreateAssignment } from "./pages/CreateAssignment"
import { ReviewSubmissions } from "./pages/ReviewSubmissions"
import { SubmissionDetail } from "./pages/SubmissionDetail"
import { CoordinatorDashboard } from "./pages/CoordinatorDashboard"
import { HODAdminPanel } from "./pages/HODAdminPanel"
import { NoDuesCertificate } from "./pages/NoDuesCertificate"
import { ClearanceStatus } from "./pages/ClearanceStatus"
import { UserProfile } from "./pages/UserProfile"
import { Settings } from "./pages/Settings"

// Dashboard Dispatcher: Decides which dashboard view to render based on user role
const DashboardDispatcher: React.FC = () => {
  const role = localStorage.getItem("role") || "Student"
  if (role === "Student") {
    return <Navigate to="/dashboard/student" replace />
  }
  if (role === "Coordinator") {
    return <Navigate to="/dashboard/coordinator" replace />
  }
  if (role === "HOD-Admin") {
    return <Navigate to="/dashboard/admin" replace />
  }
  // Faculty view
  return <FacultyDashboard />
}

export const App: React.FC = () => {
  // Simple check for authentication
  const isAuthenticated = () => {
    return !!localStorage.getItem("token")
  }

  // Guard for protected dashboard routes
  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    return isAuthenticated() ? <>{children}</> : <Navigate to="/auth/login" replace />
  }

  // Coordinator Guard
  const CoordinatorRoute = ({ children }: { children: React.ReactNode }) => {
    const role = localStorage.getItem("role")
    return role === "Coordinator" ? <>{children}</> : <Navigate to="/dashboard" replace />
  }

  // HOD / Admin Guard
  const HODAdminRoute = ({ children }: { children: React.ReactNode }) => {
    const role = localStorage.getItem("role")
    return role === "HOD-Admin" ? <>{children}</> : <Navigate to="/dashboard" replace />
  }

  return (
    <BrowserRouter>
      {/* Toast Notification Container with elegant styling */}
      <Toaster
        position="top-right"
        toastOptions={{
          className: "text-xs font-semibold rounded-xl bg-slate-900 text-white shadow-lg",
          style: {
            borderRadius: "12px",
            background: "#0f172a",
            color: "#fff",
            padding: "12px 16px",
          },
          success: {
            duration: 4000,
            iconTheme: {
              primary: "#10b981",
              secondary: "#fff",
            },
          },
          error: {
            duration: 5000,
            iconTheme: {
              primary: "#f43f5e",
              secondary: "#fff",
            },
          },
        }}
      />

      <Routes>
        {/* Public Auth Routes */}
        <Route path="/auth" element={<AuthLayout />}>
          <Route path="login" element={<Login />} />
          <Route index element={<Navigate to="login" replace />} />
        </Route>

        {/* Protected Dashboard Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          {/* Dispatcher matches user credentials to correct view */}
          <Route index element={<DashboardDispatcher />} />
          
          {/* Student Module Pages */}
          <Route path="student" element={<StudentDashboard />} />
          <Route path="tasks" element={<MyTasks />} />
          <Route path="submit" element={<SubmitWork />} />
          <Route path="dues" element={<MyDues />} />

          {/* Faculty Module Pages */}
          <Route path="create-assignment" element={<CreateAssignment />} />
          <Route path="review" element={<ReviewSubmissions />} />
          <Route path="review/:id" element={<SubmissionDetail />} />

          {/* Coordinator Module Pages */}
          <Route 
            path="coordinator" 
            element={
              <CoordinatorRoute>
                <CoordinatorDashboard />
              </CoordinatorRoute>
            } 
          />

          {/* HOD/Admin Panel Pages */}
          <Route 
            path="admin" 
            element={
              <HODAdminRoute>
                <HODAdminPanel />
              </HODAdminRoute>
            } 
          />

          {/* Clearance Certificate Page */}
          <Route path="certificate" element={<NoDuesCertificate />} />
          
          {/* Shared Pages */}
          <Route path="clearance" element={<ClearanceStatus />} />
          <Route path="profile" element={<UserProfile />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* Root Redirect Route */}
        <Route
          path="/"
          element={
            isAuthenticated() ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Navigate to="/auth/login" replace />
            )
          }
        />

        {/* Fallback 404 Route redirecting to login */}
        <Route path="*" element={<Navigate to="/auth/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
