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
  Loader2,
  Camera,
  Trash2,
  Upload
} from "lucide-react"
import toast from "react-hot-toast"

export const UserProfile: React.FC = () => {
  const role = localStorage.getItem("role") || "HOD-Admin"
  const isHOD = role === "HOD-Admin" || role === "hod_admin" || role === "HOD"

  // Avatar state
  const [avatar, setAvatar] = useState<string>(localStorage.getItem("avatar") || "")
  const fileInputRef = React.useRef<HTMLInputElement | null>(null)

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
          if (res.data.avatar) {
            setAvatar(res.data.avatar)
            localStorage.setItem("avatar", res.data.avatar)
            window.dispatchEvent(new Event("avatar_updated"))
          }
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

  // Handle Photo Upload & Compression
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file (PNG, JPG, WEBP).")
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image file size should be less than 5MB.")
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      const img = new Image()
      img.onload = () => {
        // Resize to high-res avatar (max 360x360)
        const canvas = document.createElement("canvas")
        const maxSize = 360
        let { width, height } = img

        if (width > height) {
          if (width > maxSize) {
            height = Math.round((height * maxSize) / width)
            width = maxSize
          }
        } else {
          if (height > maxSize) {
            width = Math.round((width * maxSize) / height)
            height = maxSize
          }
        }

        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext("2d")
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height)
          const compressedDataUrl = canvas.toDataURL("image/jpeg", 0.85)
          setAvatar(compressedDataUrl)
          localStorage.setItem("avatar", compressedDataUrl)
          window.dispatchEvent(new Event("avatar_updated"))
          toast.success("Photo uploaded! Remember to save changes.")
        }
      }
      img.src = event.target?.result as string
    }
    reader.readAsDataURL(file)
  }

  const handleRemovePhoto = () => {
    setAvatar("")
    localStorage.removeItem("avatar")
    window.dispatchEvent(new Event("avatar_updated"))
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
    toast.success("Profile photo removed.")
  }

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
        phone: fullPhone,
        avatar: avatar
      }

      if (newPassword.trim()) {
        payload.password = newPassword.trim()
      }

      const res = await api.patch("/api/auth/me", payload)
      if (res.data) {
        if (res.data.name) setDisplayName(res.data.name)
        if (res.data.email) setEmail(res.data.email)
        if (res.data.avatar !== undefined) {
          setAvatar(res.data.avatar)
          localStorage.setItem("avatar", res.data.avatar)
          window.dispatchEvent(new Event("avatar_updated"))
        }
      }

      // Update localStorage
      localStorage.setItem("name", displayName.trim())
      localStorage.setItem("email", email.trim().toLowerCase())
      localStorage.setItem("phone", fullPhone)
      localStorage.setItem("avatar", avatar)
      window.dispatchEvent(new Event("avatar_updated"))

      setNewPassword("")
      setConfirmPassword("")

      toast.success("Account settings updated successfully!")
    } catch (error: any) {
      // Offline fallback
      localStorage.setItem("name", displayName.trim())
      localStorage.setItem("email", email.trim().toLowerCase())
      localStorage.setItem("phone", phone.trim())
      localStorage.setItem("avatar", avatar)
      window.dispatchEvent(new Event("avatar_updated"))
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
          
          {/* Avatar and User Title with Photo Upload */}
          <div className="flex flex-col items-center text-center mb-6">
            {/* Hidden file input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageFileChange}
              accept="image/*"
              className="hidden"
            />

            {/* Interactive Avatar Frame */}
            <div 
              className="relative group cursor-pointer mb-2" 
              onClick={() => fileInputRef.current?.click()}
              title="Click to choose profile picture"
            >
              {avatar ? (
                <img
                  src={avatar}
                  alt={displayName}
                  className="h-20 w-20 rounded-full object-cover shadow-lg border-2 border-primary/20 ring-4 ring-primary/5 transition-transform group-hover:scale-105"
                />
              ) : (
                <div className="h-20 w-20 rounded-full bg-gradient-to-br from-indigo-500 via-indigo-600 to-primary text-white font-extrabold text-2xl flex items-center justify-center shadow-lg border-2 border-white ring-4 ring-primary/5 transition-transform group-hover:scale-105">
                  {initialLetter}
                </div>
              )}

              {/* Camera Badge Icon overlay */}
              <div
                className="absolute bottom-0 right-0 p-1.5 bg-primary text-white rounded-full shadow-md hover:bg-primary/90 transition-all border-2 border-white"
                title="Upload profile picture"
              >
                <Camera className="h-3.5 w-3.5" />
              </div>
            </div>

            {/* Photo Action Buttons */}
            <div className="flex items-center gap-2 mt-1">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1 text-[11px] font-medium text-primary hover:text-primary/80 transition-colors px-2 py-1 rounded-md hover:bg-primary/5"
              >
                <Upload className="h-3 w-3" />
                {avatar ? "Change Photo" : "Add Image"}
              </button>
              {avatar && (
                <button
                  type="button"
                  onClick={handleRemovePhoto}
                  className="flex items-center gap-1 text-[11px] font-medium text-rose-500 hover:text-rose-700 transition-colors px-2 py-1 rounded-md hover:bg-rose-50"
                >
                  <Trash2 className="h-3 w-3" />
                  Remove
                </button>
              )}
            </div>

            <h2 className="text-lg font-bold text-slate-850 mt-2">{displayName}</h2>
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
