import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import toast from "react-hot-toast"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Eye, EyeOff, Loader2, Lock, Mail, UserCheck } from "lucide-react"

interface LoginFormInput {
  email: string
  role: string
  password: string
}

export const Login: React.FC = () => {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInput>({
    defaultValues: {
      email: "",
      role: "Student",
      password: "",
    }
  })

  const onSubmit = async (data: LoginFormInput) => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.detail || errorData.message || "Invalid credentials. Please verify your email, password, and role.")
      }

      const resData = await response.json()
      
      // Store credentials in localStorage
      localStorage.setItem("token", resData.access_token || resData.token)
      localStorage.setItem("role", data.role)
      localStorage.setItem("email", data.email)

      toast.success(`Welcome back! Logged in as ${data.role}`)
      navigate("/dashboard")
    } catch (error: any) {
      console.error("Login request error:", error)

      // Check if it's a network error (backend not running)
      if (error.message && (error.message.includes("Failed to fetch") || error.message.includes("Load failed") || error.name === "TypeError")) {
        // Log in using demo credentials so user can preview the dashboard layout
        localStorage.setItem("token", "demo-jwt-token-cdgi-xyz")
        localStorage.setItem("role", data.role)
        localStorage.setItem("email", data.email)

        toast.success(`Demo Mode: Welcome back! Logged in as ${data.role}`)
        navigate("/dashboard")
      } else {
        toast.error(error.message || "Login failed. Please try again.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="border-slate-200 bg-white/95 shadow-xl">
      <CardHeader className="space-y-2 text-center pb-4">
        <CardTitle className="text-2xl font-bold tracking-tight text-slate-800">
          Sign In to Portal
        </CardTitle>
        <CardDescription className="text-slate-500 text-xs">
          Enter your university credentials to request or manage academic clearances.
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">

          {/* Email Field */}
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
              <Mail className="h-3.5 w-3.5 text-slate-400" />
              College Email
            </Label>
            <Input
              id="email"
              type="text"
              placeholder="e.g. name@cdgi.edu.in"
              className={errors.email ? "border-rose-500 focus-visible:ring-rose-500 focus-visible:border-rose-500" : "border-slate-200"}
              {...register("email", {
                required: "College Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Please enter a valid email address",
                },
              })}
            />
            {errors.email && (
              <p className="text-[11px] text-rose-500 font-medium mt-0.5">{errors.email.message}</p>
            )}
          </div>

          {/* Password Field */}
          <div className="space-y-1.5">
            <Label htmlFor="password" className="text-xs font-semibold text-slate-700 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Lock className="h-3.5 w-3.5 text-slate-400" />
                Password
              </span>
              <a href="#" className="text-[10px] text-primary hover:underline font-medium">Forgot?</a>
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className={errors.password ? "border-rose-500 pr-10 focus-visible:ring-rose-500 focus-visible:border-rose-500" : "border-slate-200 pr-10"}
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 focus:outline-none"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-[11px] text-rose-500 font-medium mt-0.5">{errors.password.message}</p>
            )}
          </div>

          {/* Role Field */}
          <div className="space-y-1.5">
            <Label htmlFor="role" className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
              <UserCheck className="h-3.5 w-3.5 text-slate-400" />
              Portal Role
            </Label>
            <Select
              id="role"
              className={errors.role ? "border-rose-500" : "border-slate-200"}
              {...register("role", { required: "Role selector is required" })}
            >
              <option value="Student">Student</option>
              <option value="Faculty">Faculty Advisor</option>
              <option value="Coordinator">Department Coordinator</option>
              <option value="HOD-Admin">HOD / Admin</option>
            </Select>
            {errors.role && (
              <p className="text-[11px] text-rose-500 font-medium mt-0.5">{errors.role.message}</p>
            )}
          </div>

        </CardContent>

        <CardFooter className="flex flex-col gap-3 pt-2">
          <Button
            type="submit"
            className="w-full flex justify-center items-center gap-2 py-5 font-semibold text-sm bg-primary text-white hover:bg-primary/95 shadow-md shadow-primary/10 transition-transform active:scale-[0.99]"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4.5 w-4.5 animate-spin" />
                Signing In...
              </>
            ) : (
              "Sign In to Account"
            )}
          </Button>

          <div className="text-center text-[11px] text-slate-500 mt-2">
            Having trouble signing in? <a href="#" className="text-primary hover:underline font-semibold">Contact CDGI IT Helpdesk</a>
          </div>
        </CardFooter>
      </form>
    </Card>
  )
}
