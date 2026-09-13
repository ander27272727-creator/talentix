"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Bell, Check } from "lucide-react"
import { apiFetch } from "@/lib/api"

interface NotificationItem {
  id: string
  type: string
  title: string
  body: string
  link: string | null
  readAt: string | null
  createdAt: string
}

export function NotificationsBell() {
  const [open, setOpen] = useState(false)
  const [unread, setUnread] = useState(0)
  const [items, setItems] = useState<NotificationItem[]>([])
  const [loading, setLoading] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const router = useRouter()

  const load = () => {
    apiFetch("/api/notifications")
      .then(r => (r.ok ? r.json() : { success: false }))
      .then(data => {
        if (data.success) {
          setItems(data.notifications)
          setUnread(data.unread)
        }
      })
      .catch(() => {})
  }

  useEffect(() => {
    load()
    const interval = setInterval(load, 60000) // refresca cada minuto
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", onClick)
    return () => document.removeEventListener("mousedown", onClick)
  }, [])

  const toggle = () => {
    const next = !open
    setOpen(next)
    if (next) {
      setLoading(true)
      load()
      setTimeout(() => setLoading(false), 400)
    }
  }

  const markAllRead = async () => {
    await apiFetch("/api/notifications", { method: "PATCH", body: JSON.stringify({}) })
    setUnread(0)
    setItems(prev => prev.map(n => ({ ...n, readAt: new Date().toISOString() })))
  }

  const openItem = async (n: NotificationItem) => {
    if (!n.readAt) {
      await apiFetch("/api/notifications", { method: "PATCH", body: JSON.stringify({ id: n.id }) })
    }
    setOpen(false)
    load()
    if (n.link) router.push(n.link)
  }

  const timeAgo = (iso: string) => {
    const diff = Date.now() - new Date(iso).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 1) return "ahora"
    if (mins < 60) return `${mins} min`
    const hours = Math.floor(mins / 60)
    if (hours < 24) return `${hours} h`
    const days = Math.floor(hours / 24)
    return `${days} d`
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={toggle}
        className="relative p-2 rounded-lg hover:bg-muted transition-colors"
        aria-label="Notificaciones"
      >
        <Bell className="h-5 w-5" />
        {unread > 0 && (
          <span className="absolute top-0.5 right-0.5 min-w-[18px] h-[18px] px-1 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 max-w-[calc(100vw-2rem)] bg-popover border rounded-xl shadow-lg z-50 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b">
            <span className="font-medium text-sm">Notificaciones</span>
            {unread > 0 && (
              <button
                onClick={markAllRead}
                className="text-xs text-primary hover:underline flex items-center gap-1"
              >
                <Check className="h-3 w-3" /> Marcar todas leídas
              </button>
            )}
          </div>
          <div className="max-h-96 overflow-y-auto">
            {items.length === 0 ? (
              <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                {loading ? "Cargando..." : "No tienes notificaciones aún."}
              </div>
            ) : (
              items.map(n => (
                <button
                  key={n.id}
                  onClick={() => openItem(n)}
                  className={`w-full text-left px-4 py-3 border-b last:border-b-0 hover:bg-muted/60 transition-colors ${!n.readAt ? "bg-primary/5" : ""}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-sm font-medium leading-snug">{n.title}</span>
                    <span className="text-[10px] text-muted-foreground shrink-0 mt-0.5">{timeAgo(n.createdAt)}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-snug">{n.body}</p>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
