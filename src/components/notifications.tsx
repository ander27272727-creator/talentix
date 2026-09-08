"use client"

import { useEffect } from "react"
import { X, CheckCircle2, AlertCircle, Info, AlertTriangle } from "lucide-react"
import { useStore, Notification } from "@/store/useStore"

const iconMap = {
  success: CheckCircle2,
  error: AlertCircle,
  info: Info,
  warning: AlertTriangle,
}

const colorMap = {
  success: "border-emerald-200 bg-emerald-50 text-emerald-800",
  error: "border-red-200 bg-red-50 text-red-800",
  info: "border-blue-200 bg-blue-50 text-blue-800",
  warning: "border-amber-200 bg-amber-50 text-amber-800",
}

function NotificationToast({ notification }: { notification: Notification }) {
  const { removeNotification } = useStore()
  const Icon = iconMap[notification.type]

  useEffect(() => {
    const timer = setTimeout(() => {
      removeNotification(notification.id)
    }, 5000)
    return () => clearTimeout(timer)
  }, [notification.id, removeNotification])

  return (
    <div className={`flex items-start gap-3 p-4 rounded-xl border shadow-lg animate-in slide-in-from-right ${colorMap[notification.type]}`}>
      <Icon className="h-5 w-5 shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0">
        <div className="font-medium text-sm">{notification.title}</div>
        <div className="text-xs opacity-80 mt-0.5">{notification.message}</div>
      </div>
      <button onClick={() => removeNotification(notification.id)} className="shrink-0 opacity-60 hover:opacity-100">
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}

export default function NotificationSystem() {
  const { notifications } = useStore()

  if (notifications.length === 0) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2 max-w-sm">
      {notifications.slice(-3).map((notification) => (
        <NotificationToast key={notification.id} notification={notification} />
      ))}
    </div>
  )
}
