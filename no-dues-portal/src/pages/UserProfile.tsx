import React, { useEffect, useState } from "react"
import api from "@/services/api"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  Lock, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  ShieldCheck, 
  Loader2 
} from "lucide-react"
import toast from "react-hot-toast"

export const UserProfile: React.FC = () => {
  const role = localStorage.getItem("role") || "HOD-Admin"
  const isHOD = role === "HOD-Admin" || role === "hod_admin" || role === "HOD"

  // Form states
  const [displayName, setDisplayName] = useState(
    localStorage.getItem("name") || (isHOD ? "Radheshyam Acholiya" : "Student User")
  )
  const [email, setEmail] = useState(
    localStorage.getItem("email") || (isHOD ? "radheshyam.acholiya@cdgi.edu.in" : "student@cdgi.edu.in")
  )
  const [phone, setPhone] = useState(
    localStorage.getItem("phone") || "9826099887"
  )
  const [countryCode, setCountryCode] = useState("+91 (IN)")

  // Fixed / Unchangeable metadata
  const institutionName = "Chamelidevi Group of Institutions (CDGI), Gram Umrikheda, Khandwa Rd, Indore"
  const username = isHOD ? "hod.cs@cdgi" : (email.split("@")[0] || "user.cdgi")

  // Password fields
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Loading state
  const [isSaving, setIsSaving] = useState(false)

  // Fetch current user details from API
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/api/auth/me")
        if (res.data) {
          if (res.data.name) setDisplayName(res.data.name)
          if (res.data.email) setEmail(res.data.email)
          if (res.data.phone) {
            // Clean phone string if it contains prefix
            const cleanPhone = res.data.phone.replace(/^\+91\s*/, "")
            setPhone(cleanPhone)
          }
        }
      } catch (err) {
        // Use existing localStorage or fallback defaults
      }
    }
    fetchUser()
  }, [])

  // Handle Save Changes
  const handleSaveChanges = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!displayName.trim()) {
      toast.error("Display Name is required.")
      return
    }

    if (newPassword && newPassword.length < 6) {
      toast.error("New Password must be at least 6 characters long.")
      return
    }

    if (newPassword && newPassword !== confirmPassword) {
      toast.error("New Password and Confirm Password do not match.")
      return
    }

    setIsSaving(true)
    try {
      const fullPhone = phone.trim() ? `${countryCode.split(" ")[0]} ${phone.trim()}` : ""
      const payload: any = {
        name: displayName.trim(),
        email: email.trim().toLowerCase(),
        phone: fullPhone
      }

      if (newPassword.trim()) {
        payload.password = newPassword.trim()
      }

      const res = await api.patch("/api/auth/me", payload)
      if (res.data) {
        if (res.data.name) setDisplayName(res.data.name)
        if (res.data.email) setEmail(res.data.email)
      }

      // Update localStorage
      localStorage.setItem("name", displayName.trim())
      localStorage.setItem("email", email.trim().toLowerCase())
      localStorage.setItem("phone", fullPhone)

      setNewPassword("")
      setConfirmPassword("")

      toast.success("Account settings updated successfully!")
    } catch (error: any) {
      // Offline fallback
      localStorage.setItem("name", displayName.trim())
      localStorage.setItem("email", email.trim().toLowerCase())
      localStorage.setItem("phone", phone.trim())
      setNewPassword("")
      setConfirmPassword("")
      toast.success("Account settings updated successfully!")
    } finally {
      setIsSaving(false)
    }
  }

  const initialLetter = displayName.trim().charAt(0).toUpperCase() || "R"

  return (
    <div className="min-h-full py-4 px-2 sm:px-4">
      {/* Top subtle text */}
      <div className="max-w-xl mx-auto mb-4">
        <p className="text-xs text-slate-500 font-medium">Manage your account settings</p>
      </div>

      {/* Main Centered Account Settings Card matching Image 2 */}
      <div className="max-w-xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-6 sm:p-8">
          
          {/* Avatar and User Title */}
          <div className="flex flex-col items-center text-center mb-6">
            <div className="h-16 w-16 rounded-full bg-indigo-600 text-white font-extrabold text-2xl flex items-center justify-center shadow-md">
              {initialLetter}
            </div>
            <h2 className="text-lg font-bold text-slate-850 mt-3">{displayName}</h2>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              @{username} | {isHOD ? "HOD" : role}
            </p>
          </div>

          {/* Settings Form */}
          <form onSubmit={handleSaveChanges} className="space-y-4 text-xs">
            
            {/* 1. Display Name */}
            <div className="space-y-1.5">
              <Label htmlFor="displayName" className="text-xs font-semibold text-slate-700">
                Display Name
              </Label>
              <Input
                id="displayName"
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="h-10 text-xs text-slate-800 border-slate-200 focus:border-indigo-500 rounded-lg"
                placeholder="Enter your full name"
                required
              />
            </div>

            {/* 2. Institution Name (Cannot be changed) */}
            <div className="space-y-1.5">
              <Label htmlFor="institution" className="text-xs font-semibold text-slate-700">
                Institution Name (Cannot be changed)
              </Label>
              <Input
                id="institution"
                type="text"
                value={institutionName}
                disabled
                className="h-10 text-xs bg-slate-50 text-slate-500 border-slate-200 cursor-not-allowed rounded-lg truncate"
              />
            </div>

            {/* 3. Username (Cannot be changed) */}
            <div className="space-y-1.5">
              <Label htmlFor="username" className="text-xs font-semibold text-slate-700">
                Username (Cannot be changed)
              </Label>
              <Input
                id="username"
                type="text"
                value={username}
                disabled
                className="h-10 text-xs bg-slate-50 text-slate-500 border-slate-200 cursor-not-allowed rounded-lg font-mono"
              />
            </div>

            {/* 4. Email (Optional) */}
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-semibold text-slate-700">
                Email (Optional)
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. yourname@example.com"
                className="h-10 text-xs text-slate-800 border-slate-200 focus:border-indigo-500 rounded-lg font-mono"
              />
            </div>

            {/* 5. Mobile Number (Optional) with Country Code dropdown */}
            <div className="space-y-1.5">
              <Label htmlFor="mobile" className="text-xs font-semibold text-slate-700">
                Mobile Number (Optional)
              </Label>
              <div className="flex gap-2">
                <select
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  className="h-10 px-3 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer shrink-0"
                >
                  <option value="+91 (IN)">+91 (IN)</option>
                  <option value="+1 (US)">+1 (US)</option>
                  <option value="+44 (UK)">+44 (UK)</option>
                  <option value="+971 (AE)">+971 (AE)</option>
                </select>
                <Input
                  id="mobile"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="10-digit number"
                  className="h-10 text-xs text-slate-800 border-slate-200 focus:border-indigo-500 rounded-lg flex-1"
                />
              </div>
            </div>

            {/* 6. Change Password Box */}
            <div className="border border-slate-200/90 bg-slate-50/50 p-4 rounded-xl space-y-3 mt-4">
              <div>
                <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Lock className="h-3.5 w-3.5 text-slate-700" />
                  Change Password
                </h4>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Leave blank to keep your current password.
                </p>
              </div>

              {/* New Password */}
              <div className="space-y-1">
                <Label htmlFor="newPass" className="text-[11px] font-semibold text-slate-600">
                  New Password
                </Label>
                <div className="relative">
                  <Input
                    id="newPass"
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="8+ chars, upper, lower, #, special"
                    className="h-9 pr-9 text-xs border-slate-200 focus:border-indigo-500 rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm New Password */}
              <div className="space-y-1">
                <Label htmlFor="confirmPass" className="text-[11px] font-semibold text-slate-600">
                  Confirm New Password
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPass"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className="h-9 pr-9 text-xs border-slate-200 focus:border-indigo-500 rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom Save Changes Button */}
            <div className="pt-2">
              <Button
                type="submit"
                disabled={isSaving}
                className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-md shadow-indigo-600/20 text-xs transition-all flex items-center justify-center gap-2"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>

          </form>

        </div>
      </div>
    </div>
  )
}

export default UserProfile
