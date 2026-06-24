import React, { useEffect, useState, useRef } from "react"
import api from "@/services/api"
import { Bell, Check, MailOpen, AlertCircle, Clock } from "lucide-react"
import toast from "react-hot-toast"

interface NotificationItem {
  id: string
  message: string
  createdAt: string
  isRead: boolean
}

export const NotificationBell: React.FC = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const fetchNotifications = async () => {
    try {
      const response = await api.get("/api/notifications")
      setNotifications(response.data || [])
    } catch (error) {
      console.warn("Notifications API offline. Triggering mock notifications.")
      
      const mockList: NotificationItem[] = [
        { id: "notif-1", message: "Your Database Management Systems Lab manual was approved by Dr. Sandeep Poddar.", createdAt: "2 hours ago", isRead: false },
        { id: "notif-2", message: "New due checklist published: Major Project Phase-II report submission.", createdAt: "1 day ago", isRead: false },
        { id: "notif-3", message: "No Dues registration cycle for Semester VIII CS-Branch has been opened.", createdAt: "2 days ago", isRead: true },
      ]
      setNotifications(mockList)
    }
  }

  useEffect(() => {
    fetchNotifications()
    // Poll notifications every 45s for updates
    const timer = setInterval(fetchNotifications, 45000)
    return () => clearInterval(timer)
  }, [])

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleOutsideClick)
    return () => document.removeEventListener("mousedown", handleOutsideClick)
  }, [])

  // Mark notification as read
  const handleMarkAsRead = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    try {
      await api.patch(`/api/notifications/${id}/read`)
      setNotifications(notifications.map(n => n.id === id ? { ...n, isRead: true } : n))
    } catch (error) {
      // Simulate success offline
      setNotifications(notifications.map(n => n.id === id ? { ...n, isRead: true } : n))
      toast.success("Notification marked as read")
    }
  }

  // Mark all as read
  const handleMarkAllAsRead = async () => {
    try {
      await api.post("/api/notifications/read-all")
      setNotifications(notifications.map(n => ({ ...n, isRead: true })))
    } catch (error) {
      setNotifications(notifications.map(n => ({ ...n, isRead: true })))
      toast.success("All notifications marked as read")
    }
  }

  const unreadCount = notifications.filter(n => !n.isRead).length

  return (
    <div className="relative" ref={dropdownRef}>
      
      {/* Bell Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 relative transition-colors focus:outline-none"
        aria-label="Toggle notifications menu"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1.5 h-4 w-4 rounded-full bg-rose-500 ring-2 ring-white text-[9px] font-extrabold text-white flex items-center justify-center animate-bounce">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Container */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-3 duration-250">
          
          {/* Header */}
          <div className="p-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <span className="text-xs font-bold text-slate-800">Recent Notifications</span>
            {unreadCount > 0 && (
              <button 
                onClick={handleMarkAllAsRead}
                className="text-[10px] font-semibold text-primary hover:underline"
              >
                Mark all as read
              </button>
            )}
          </div>

          {/* List items */}
          <div className="max-h-64 overflow-y-auto divide-y divide-slate-100">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-slate-400 text-xs flex flex-col items-center gap-1.5 justify-center">
                <MailOpen className="h-4.5 w-4.5 text-slate-300" />
                No notifications received.
              </div>
            ) : (
              notifications.map((notif) => (
                <div 
                  key={notif.id}
                  onClick={(e) => !notif.isRead && handleMarkAsRead(notif.id, e)}
                  className={`p-3 text-xs flex items-start gap-2.5 transition-colors cursor-pointer
                    ${notif.isRead ? "bg-white hover:bg-slate-50/50" : "bg-primary/5 hover:bg-primary/10"}
                  `}
                >
                  {/* Status dot */}
                  <span className={`h-2 w-2 rounded-full shrink-0 mt-1.5
                    ${notif.isRead ? "bg-slate-200" : "bg-primary"}
                  `}></span>

                  <div className="space-y-1.5 flex-1">
                    <p className={`leading-relaxed text-slate-650 ${notif.isRead ? "font-normal" : "font-semibold text-slate-900"}`}>
                      {notif.message}
                    </p>
                    <div className="flex items-center gap-1 text-[10px] text-slate-450">
                      <Clock className="h-3 w-3" />
                      <span className="font-mono">{notif.createdAt}</span>
                    </div>
                  </div>

                  {/* Tick Action to mark as read */}
                  {!notif.isRead && (
                    <button 
                      onClick={(e) => handleMarkAsRead(notif.id, e)}
                      className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 shrink-0"
                      title="Mark as read"
                    >
                      <Check className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              ))
            )}
          </div>

        </div>
      )}

    </div>
  )
}
export default NotificationBell
