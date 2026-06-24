import React from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Settings as SettingsIcon, Bell, Shield, Laptop } from "lucide-react"

export const Settings: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="space-y-1.5">
        <h2 className="text-2xl font-bold tracking-tight text-slate-800">Account Settings</h2>
        <p className="text-sm text-slate-500">Configure your notification preferences and security settings.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Notifications */}
        <Card className="border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-800 border-b border-slate-100 pb-3 flex items-center gap-2">
            <Bell className="h-4.5 w-4.5 text-primary" />
            Notifications
          </h3>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-semibold text-slate-800">Email Notifications</h4>
                <p className="text-xs text-slate-400 font-light">Receive clearance update alerts via email.</p>
              </div>
              <input type="checkbox" defaultChecked className="h-4 w-4 text-primary focus:ring-primary border-slate-300 rounded" />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-semibold text-slate-800">Dues Hold Alerts</h4>
                <p className="text-xs text-slate-400 font-light">Get immediate alerts when a due hold is flag raised.</p>
              </div>
              <input type="checkbox" defaultChecked className="h-4 w-4 text-primary focus:ring-primary border-slate-300 rounded" />
            </div>
          </div>
        </Card>

        {/* Security & Access */}
        <Card className="border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-800 border-b border-slate-100 pb-3 flex items-center gap-2">
            <Shield className="h-4.5 w-4.5 text-primary" />
            Security & Authentication
          </h3>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-semibold text-slate-800">Two-Factor Authentication</h4>
                <p className="text-xs text-slate-400 font-light">Secure sign-in with email confirmation pin.</p>
              </div>
              <input type="checkbox" className="h-4 w-4 text-primary focus:ring-primary border-slate-300 rounded" />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-semibold text-slate-800">Session Timeout</h4>
                <p className="text-xs text-slate-400 font-light">Automatically log out after 30 mins inactivity.</p>
              </div>
              <input type="checkbox" defaultChecked className="h-4 w-4 text-primary focus:ring-primary border-slate-300 rounded" />
            </div>
          </div>
        </Card>

      </div>
    </div>
  )
}
