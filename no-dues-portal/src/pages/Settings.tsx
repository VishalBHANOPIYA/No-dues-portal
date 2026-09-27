import React, { useState, useEffect } from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { 
  Bell, 
  Shield, 
  Calendar, 
  Clock, 
  Building2, 
  FileSpreadsheet, 
  Download, 
  Key, 
  Sliders, 
  CheckCircle2, 
  AlertTriangle, 
  Save, 
  RotateCcw,
  BookOpen,
  Users,
  Archive,
  Loader2
} from "lucide-react"
import toast from "react-hot-toast"
import { api } from "@/services/api"

interface SettingsState {
  // Academic & Deadlines
  academicSession: string
  departmentName: string
  departmentCode: string
  defaultSemester: string
  clearanceDeadline: string
  lateSubmissionPolicy: string
  gracePeriodDays: number

  // Notifications & Alerts
  emailNotifications: boolean
  dailyDigest: boolean
  duesHoldAlerts: boolean
  fullClearanceAlerts: boolean
  facultyInactivityAlerts: boolean

  // Security & Permissions
  defaultPasswordPolicy: string
  allowCustomSubjects: boolean
  sessionTimeout: string
  twoFactorAuth: boolean
  maxResubmissionAttempts: string
}

const DEFAULT_SETTINGS: SettingsState = {
  academicSession: "2024-2025",
  departmentName: "Computer Science & Engineering",
  departmentCode: "CSE",
  defaultSemester: "8th Semester",
  clearanceDeadline: "2025-05-15",
  lateSubmissionPolicy: "strict",
  gracePeriodDays: 3,

  emailNotifications: true,
  dailyDigest: true,
  duesHoldAlerts: true,
  fullClearanceAlerts: true,
  facultyInactivityAlerts: false,

  defaultPasswordPolicy: "email",
  allowCustomSubjects: true,
  sessionTimeout: "30",
  twoFactorAuth: false,
  maxResubmissionAttempts: "unlimited"
}

export const Settings: React.FC = () => {
  const role = localStorage.getItem("role") || "HOD-Admin"
  const isHOD = role === "HOD-Admin"

  const [activeTab, setActiveTab] = useState<"academic" | "notifications" | "security" | "reports">("academic")
  const [settings, setSettings] = useState<SettingsState>(() => {
    const saved = localStorage.getItem("hod_system_settings")
    if (saved) {
      try {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) }
      } catch (e) {
        return DEFAULT_SETTINGS
      }
    }
    return DEFAULT_SETTINGS
  })

  const [isSaving, setIsSaving] = useState(false)
  const [isExportingExcel, setIsExportingExcel] = useState(false)

  const handleToggle = (key: keyof SettingsState) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  const handleChange = (key: keyof SettingsState, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const handleSave = () => {
    setIsSaving(true)
    setTimeout(() => {
      localStorage.setItem("hod_system_settings", JSON.stringify(settings))
      setIsSaving(false)
      toast.success("Settings saved successfully! Portal configuration updated.", {
        icon: "⚙️"
      })
    }, 400)
  }

  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset settings to default values?")) {
      setSettings(DEFAULT_SETTINGS)
      localStorage.setItem("hod_system_settings", JSON.stringify(DEFAULT_SETTINGS))
      toast.success("Settings restored to system defaults.")
    }
  }

  const handleDownloadExcel = async () => {
    try {
      setIsExportingExcel(true)
      const response = await api.get('/api/admin/export/excel', { responseType: 'blob' })
      const blob = new Blob([response.data], { 
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
      })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `CDGI_No_Dues_Ledger_${settings.academicSession.replace('-', '_')}_${new Date().toISOString().slice(0, 10)}.xlsx`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      toast.success("No-Dues Excel ledger downloaded successfully!", { icon: "📊" })
    } catch (err: any) {
      console.error(err)
      toast.error("Failed to generate Excel ledger. Make sure backend is running.")
    } finally {
      setIsExportingExcel(false)
    }
  }

  const handleArchiveSession = () => {
    if (window.confirm(`⚠️ Warning: Are you sure you want to archive academic session "${settings.academicSession}"? Active submissions will be marked as archived.`)) {
      toast.success(`Academic session ${settings.academicSession} archived successfully.`, { icon: "📦" })
    }
  }

  return (
    <div className="space-y-6 max-w-6xl pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold tracking-tight text-slate-800">
              {isHOD ? "Department & System Settings" : "Account Settings"}
            </h2>
            {isHOD && (
              <span className="bg-primary/10 text-primary text-xs font-semibold px-2.5 py-0.5 rounded-full border border-primary/20">
                HOD Administrator
              </span>
            )}
          </div>
          <p className="text-sm text-slate-500 mt-1">
            {isHOD 
              ? "Configure academic rules, deadlines, notification alerts, and security policies for your department."
              : "Manage your notification preferences and personal security credentials."}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors shadow-sm"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset Defaults
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-primary hover:bg-primary/90 rounded-lg transition-all shadow-md shadow-primary/20 active:scale-95 disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-3.5 w-3.5" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>

      {/* Tabs */}
      {isHOD && (
        <div className="flex border-b border-slate-200 space-x-1 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setActiveTab("academic")}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
              activeTab === "academic"
                ? "bg-primary text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <Calendar className="h-4 w-4" />
            Academic & Deadlines
          </button>

          <button
            onClick={() => setActiveTab("notifications")}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
              activeTab === "notifications"
                ? "bg-primary text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <Bell className="h-4 w-4" />
            Alerts & Notifications
          </button>

          <button
            onClick={() => setActiveTab("security")}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
              activeTab === "security"
                ? "bg-primary text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <Shield className="h-4 w-4" />
            Security & Permissions
          </button>

          <button
            onClick={() => setActiveTab("reports")}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
              activeTab === "reports"
                ? "bg-primary text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <FileSpreadsheet className="h-4 w-4" />
            Reports & Data Ledger
          </button>
        </div>
      )}

      {/* TAB 1: ACADEMIC & DEADLINES */}
      {(!isHOD || activeTab === "academic") && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Department Information */}
          <Card className="border-slate-200 bg-white p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-800 border-b border-slate-100 pb-3 flex items-center gap-2">
              <Building2 className="h-4.5 w-4.5 text-primary" />
              Department & Academic Details
            </h3>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Department Name</label>
                <input
                  type="text"
                  value={settings.departmentName}
                  onChange={(e) => handleChange("departmentName", e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  placeholder="e.g. Computer Science & Engineering"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Department Code</label>
                  <input
                    type="text"
                    value={settings.departmentCode}
                    onChange={(e) => handleChange("departmentCode", e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800 uppercase focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    placeholder="e.g. CSE"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Active Academic Session</label>
                  <select
                    value={settings.academicSession}
                    onChange={(e) => handleChange("academicSession", e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white"
                  >
                    <option value="2024-2025">2024 - 2025</option>
                    <option value="2025-2026">2025 - 2026</option>
                    <option value="2026-2027">2026 - 2027</option>
                    <option value="2023-2024">2023 - 2024</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Primary Clearance Target Semester</label>
                <select
                  value={settings.defaultSemester}
                  onChange={(e) => handleChange("defaultSemester", e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white"
                >
                  <option value="8th Semester">8th Semester (Final Year Degree Clearance)</option>
                  <option value="7th Semester">7th Semester</option>
                  <option value="6th Semester">6th Semester</option>
                  <option value="5th Semester">5th Semester</option>
                  <option value="4th Semester">4th Semester</option>
                  <option value="3rd Semester">3rd Semester</option>
                  <option value="All Semesters">All Semesters (3rd to 8th)</option>
                </select>
                <p className="text-[11px] text-slate-400 mt-1 font-light">
                  Determines which students are prioritized for clearance workflow.
                </p>
              </div>
            </div>
          </Card>

          {/* Clearance Rules & Deadlines */}
          <Card className="border-slate-200 bg-white p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-800 border-b border-slate-100 pb-3 flex items-center gap-2">
              <Clock className="h-4.5 w-4.5 text-primary" />
              Submission Deadlines & Rules
            </h3>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Clearance Submission Last Date</label>
                <div className="relative">
                  <input
                    type="date"
                    value={settings.clearanceDeadline}
                    onChange={(e) => handleChange("clearanceDeadline", e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1 font-light">
                  Students will see this deadline countdown on their dashboard.
                </p>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Late Submissions Handling</label>
                <select
                  value={settings.lateSubmissionPolicy}
                  onChange={(e) => handleChange("lateSubmissionPolicy", e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white"
                >
                  <option value="strict">Strictly Locked (No submissions after deadline)</option>
                  <option value="grace">Allow with Grace Period</option>
                  <option value="hod_approval">Require Special HOD Permission</option>
                  <option value="open">Keep Open (Mark as Late)</option>
                </select>
              </div>

              {settings.lateSubmissionPolicy === "grace" && (
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Grace Period Window ({settings.gracePeriodDays} Days)
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="14"
                    value={settings.gracePeriodDays}
                    onChange={(e) => handleChange("gracePeriodDays", parseInt(e.target.value))}
                    className="w-full accent-primary cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>1 Day</span>
                    <span>7 Days</span>
                    <span>14 Days</span>
                  </div>
                </div>
              )}

              <div className="p-3 bg-amber-50 rounded-lg border border-amber-200/60 flex items-start gap-2.5">
                <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
                <div className="text-[11px] text-amber-800 leading-relaxed">
                  Deadline changes apply immediately to all enrolled students and faculty dashboards in this session.
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* TAB 2: ALERTS & NOTIFICATIONS */}
      {(!isHOD || activeTab === "notifications") && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-slate-200 bg-white p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-800 border-b border-slate-100 pb-3 flex items-center gap-2">
              <Bell className="h-4.5 w-4.5 text-primary" />
              Administrative Notification Rules
            </h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-semibold text-slate-800">Email Notifications Master Switch</h4>
                  <p className="text-xs text-slate-400 font-light">Send system email updates for important clearance milestones.</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.emailNotifications}
                  onChange={() => handleToggle("emailNotifications")}
                  className="h-4 w-4 text-primary focus:ring-primary border-slate-300 rounded cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-semibold text-slate-800">Daily HOD Clearance Digest</h4>
                  <p className="text-xs text-slate-400 font-light">Receive a daily morning summary of pending vs cleared student counts.</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.dailyDigest}
                  onChange={() => handleToggle("dailyDigest")}
                  className="h-4 w-4 text-primary focus:ring-primary border-slate-300 rounded cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-semibold text-slate-800">Dues Hold Escalation Alerts</h4>
                  <p className="text-xs text-slate-400 font-light">Get immediate alert when a faculty places a due/hold on a student.</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.duesHoldAlerts}
                  onChange={() => handleToggle("duesHoldAlerts")}
                  className="h-4 w-4 text-primary focus:ring-primary border-slate-300 rounded cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-semibold text-slate-800">100% Cleared Student Alert</h4>
                  <p className="text-xs text-slate-400 font-light">Notifies when all faculty approve a student and they are ready for final sign-off.</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.fullClearanceAlerts}
                  onChange={() => handleToggle("fullClearanceAlerts")}
                  className="h-4 w-4 text-primary focus:ring-primary border-slate-300 rounded cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-semibold text-slate-800">Faculty Inactivity Alerts</h4>
                  <p className="text-xs text-slate-400 font-light">Alert HOD if a faculty has not reviewed student submissions for 48+ hours.</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.facultyInactivityAlerts}
                  onChange={() => handleToggle("facultyInactivityAlerts")}
                  className="h-4 w-4 text-primary focus:ring-primary border-slate-300 rounded cursor-pointer"
                />
              </div>
            </div>
          </Card>

          <Card className="border-slate-200 bg-white p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-800 border-b border-slate-100 pb-3 flex items-center gap-2">
              <Mail className="h-4.5 w-4.5 text-primary" />
              Automated Email Dispatch Templates
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-lg">
                <div className="flex items-center justify-between font-semibold text-slate-700 mb-1">
                  <span>Student Submission Confirmation</span>
                  <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">Active</span>
                </div>
                <p className="text-[11px] text-slate-500 font-light">
                  Sent to students automatically upon submitting work for subject clearance.
                </p>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-lg">
                <div className="flex items-center justify-between font-semibold text-slate-700 mb-1">
                  <span>Faculty Due Hold Notice</span>
                  <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">Active</span>
                </div>
                <p className="text-[11px] text-slate-500 font-light">
                  Sent immediately to the student specifying reason and instructions for resolving dues.
                </p>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-lg">
                <div className="flex items-center justify-between font-semibold text-slate-700 mb-1">
                  <span>Certificate Ready Notification</span>
                  <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">Active</span>
                </div>
                <p className="text-[11px] text-slate-500 font-light">
                  Includes unique verification hash and printable official clearance certificate.
                </p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* TAB 3: SECURITY & PERMISSIONS */}
      {(!isHOD || activeTab === "security") && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-slate-200 bg-white p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-800 border-b border-slate-100 pb-3 flex items-center gap-2">
              <Key className="h-4.5 w-4.5 text-primary" />
              Credentials & Password Policy
            </h3>

            <div className="space-y-4 text-xs">
              <div className="p-3 bg-indigo-50 border border-indigo-200/60 rounded-lg">
                <div className="flex items-center gap-2 font-semibold text-indigo-900 mb-1">
                  <CheckCircle2 className="h-4 w-4 text-indigo-600" />
                  Default Faculty Password Policy
                </div>
                <p className="text-[11px] text-indigo-800 leading-relaxed">
                  Currently configured: <strong>Faculty Password = College Email Address</strong>.
                  New faculty registered via HOD Panel can immediately log in using their email ID.
                </p>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Allow Custom Subjects on Faculty Add</label>
                <div className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                  <div>
                    <div className="font-semibold text-slate-800">Custom Subject Entry</div>
                    <p className="text-[11px] text-slate-400 font-light">Allow HOD to type new elective/custom subjects beyond preset list.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.allowCustomSubjects}
                    onChange={() => handleToggle("allowCustomSubjects")}
                    className="h-4 w-4 text-primary focus:ring-primary border-slate-300 rounded cursor-pointer"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Student Resubmission Limit</label>
                <select
                  value={settings.maxResubmissionAttempts}
                  onChange={(e) => handleChange("maxResubmissionAttempts", e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white"
                >
                  <option value="unlimited">Unlimited (Allowed until approved)</option>
                  <option value="3">Max 3 attempts per subject</option>
                  <option value="2">Max 2 attempts per subject</option>
                  <option value="1">Single submission only</option>
                </select>
              </div>
            </div>
          </Card>

          <Card className="border-slate-200 bg-white p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-800 border-b border-slate-100 pb-3 flex items-center gap-2">
              <Shield className="h-4.5 w-4.5 text-primary" />
              Session & Access Control
            </h3>

            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-semibold text-slate-800">Two-Factor Authentication (2FA)</h4>
                  <p className="text-xs text-slate-400 font-light">Prompt email verification OTP for critical clearance overrides.</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.twoFactorAuth}
                  onChange={() => handleToggle("twoFactorAuth")}
                  className="h-4 w-4 text-primary focus:ring-primary border-slate-300 rounded cursor-pointer"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Auto Session Timeout</label>
                <select
                  value={settings.sessionTimeout}
                  onChange={(e) => handleChange("sessionTimeout", e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white"
                >
                  <option value="15">15 Minutes Inactivity</option>
                  <option value="30">30 Minutes Inactivity (Recommended)</option>
                  <option value="60">1 Hour Inactivity</option>
                  <option value="never">Never (Stay logged in)</option>
                </select>
                <p className="text-[11px] text-slate-400 mt-1 font-light">
                  Safeguards administrative panel on shared college lab terminals.
                </p>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-lg text-[11px] text-slate-600">
                <span className="font-semibold text-slate-700">Audit Logging:</span> All approval/rejection actions and subject allocations are recorded in backend audit ledger with IP and timestamp.
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* TAB 4: REPORTS & DATA BACKUP */}
      {isHOD && activeTab === "reports" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-slate-200 bg-white p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-800 border-b border-slate-100 pb-3 flex items-center gap-2">
              <FileSpreadsheet className="h-4.5 w-4.5 text-emerald-600" />
              Official No-Dues Ledger (Excel Export)
            </h3>

            <div className="space-y-4 text-xs">
              <p className="text-slate-600 leading-relaxed">
                Download the complete departmental No-Dues ledger formatted for university exam cell submission.
                Includes Student Name, Enrollment Number, Semester, Subjects, Status, and Faculty Verifiers.
              </p>

              <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-lg flex items-center justify-between">
                <div>
                  <div className="font-semibold text-emerald-900">Format: Microsoft Excel (.xlsx)</div>
                  <div className="text-[11px] text-emerald-700">Pre-styled table with headers and verification timestamps</div>
                </div>
                <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-1 rounded font-mono font-medium">.xlsx</span>
              </div>

              <button
                onClick={handleDownloadExcel}
                disabled={isExportingExcel}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg shadow-sm transition-all active:scale-95 disabled:opacity-50"
              >
                {isExportingExcel ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Generating Excel Ledger...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4" />
                    Download Official Excel Ledger (.xlsx)
                  </>
                )}
              </button>
            </div>
          </Card>

          <Card className="border-slate-200 bg-white p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-800 border-b border-slate-100 pb-3 flex items-center gap-2">
              <Archive className="h-4.5 w-4.5 text-primary" />
              Session Archival & Maintenance
            </h3>

            <div className="space-y-4 text-xs">
              <p className="text-slate-600 leading-relaxed">
                When a semester concludes and degree certificates are issued, archive the current cycle to freeze records and prepare the portal for the incoming batch.
              </p>

              <div className="p-3 bg-amber-50 border border-amber-200/80 rounded-lg space-y-1">
                <div className="font-semibold text-amber-900 flex items-center gap-1.5">
                  <AlertTriangle className="h-3.5 w-3.5 text-amber-600" />
                  Active Session: {settings.academicSession} ({settings.defaultSemester})
                </div>
                <div className="text-[11px] text-amber-800">
                  Archiving creates a read-only historical record of all clearance statuses for compliance audits.
                </div>
              </div>

              <button
                onClick={handleArchiveSession}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-white hover:bg-amber-50 text-amber-800 border border-amber-300 font-semibold rounded-lg shadow-sm transition-all active:scale-95"
              >
                <Archive className="h-4 w-4 text-amber-600" />
                Archive Current Session ({settings.academicSession})
              </button>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
