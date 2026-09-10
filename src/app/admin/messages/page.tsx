"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { MessagesSquare, Search, Send, Loader2, ArrowLeft, Building2, Users, Shield } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { apiFetch } from "@/lib/api"

interface ConversationRow {
  id: string
  other: { id: string; name: string; role: string }
  lastMessage: { body: string; senderId: string; createdAt: string; isMine: boolean } | null
  unread: number
  updatedAt: string
}

interface MessageRow {
  id: string
  body: string
  createdAt: string
  isMine: boolean
  readAt: string | null
}

interface DirectoryUser {
  id: string
  name: string
  role: string
  email: string
}

const ROLE_ICON: Record<string, typeof Users> = {
  COMPANY: Building2,
  CANDIDATE: Users,
  ADMIN: Shield,
}

const ROLE_LABEL: Record<string, string> = {
  COMPANY: "Empresa",
  CANDIDATE: "Candidato",
  ADMIN: "Admin",
}

export default function AdminMessagesPage() {
  const [loading, setLoading] = useState(true)
  const [conversations, setConversations] = useState<ConversationRow[]>([])
  const [directory, setDirectory] = useState<DirectoryUser[]>([])
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
  const [messages, setMessages] = useState<MessageRow[]>([])
  const [otherName, setOtherName] = useState("")
  const [input, setInput] = useState("")
  const [sending, setSending] = useState(false)
  const [search, setSearch] = useState("")
  const [showDirectory, setShowDirectory] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const loadConversations = useCallback(() => {
    return apiFetch("/api/messages")
      .then(r => r.json())
      .then(data => { if (data.success) setConversations(data.conversations) })
      .finally(() => setLoading(false))
  }, [])

  // Cargar directorio de usuarios (admin puede hablar con todos)
  useEffect(() => {
    apiFetch("/api/admin/directory")
      .then(r => r.json())
      .then(data => { if (data.success) setDirectory(data.users) })
    loadConversations()
  }, [loadConversations])

  // Polling del chat abierto cada 4s
  useEffect(() => {
    if (!selectedUserId) return
    const load = () =>
      apiFetch(`/api/messages/${selectedUserId}`)
        .then(r => r.json())
        .then(data => {
          if (data.success) {
            setMessages(data.messages)
            setOtherName(data.other.name)
          }
        })
    load()
    pollRef.current = setInterval(load, 4000)
    return () => { if (pollRef.current) clearInterval(pollRef.current) }
  }, [selectedUserId])

  // Refresh de conversaciones cuando el chat está abierto (unread badges)
  useEffect(() => {
    if (!selectedUserId) return
    const t = setInterval(loadConversations, 8000)
    return () => clearInterval(t)
  }, [selectedUserId, loadConversations])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  async function send() {
    if (!input.trim() || !selectedUserId || sending) return
    setSending(true)
    try {
      const res = await apiFetch(`/api/messages/${selectedUserId}`, {
        method: "POST",
        body: JSON.stringify({ body: input.trim() }),
      })
      const data = await res.json()
      if (data.success) {
        setInput("")
        const refresh = await apiFetch(`/api/messages/${selectedUserId}`).then(r => r.json())
        if (refresh.success) setMessages(refresh.messages)
        loadConversations()
      }
    } finally {
      setSending(false)
    }
  }

  const totalUnread = conversations.reduce((s, c) => s + c.unread, 0)
  const filteredConvs = conversations.filter(c =>
    c.other.name.toLowerCase().includes(search.toLowerCase())
  )
  const filteredDirectory = directory.filter(d =>
    d.name.toLowerCase().includes(search.toLowerCase()) &&
    !conversations.some(c => c.other.id === d.id)
  )

  const selectedUser = directory.find(d => d.id === selectedUserId) ||
    conversations.find(c => c.other.id === selectedUserId)?.other

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <MessagesSquare className="h-8 w-8 text-primary" />
          Mensajes
        </h1>
        {totalUnread > 0 && (
          <Badge className="bg-red-100 text-red-800">{totalUnread} sin leer</Badge>
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-6 h-[calc(100vh-220px)]">
        {/* Lista de conversaciones */}
        <Card className="lg:col-span-1 flex flex-col overflow-hidden">
          <CardContent className="p-4 border-b space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Buscar..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
            </div>
            <Button variant="fb-outline" size="sm" className="w-full" onClick={() => setShowDirectory(!showDirectory)}>
              <Users className="h-4 w-4 mr-1" />
              {showDirectory ? "Ver conversaciones" : "Nueva conversación"}
            </Button>
          </CardContent>
          <div className="flex-1 overflow-y-auto p-2">
            {loading ? (
              <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
            ) : showDirectory ? (
              /* Directorio: iniciar chat con cualquiera */
              filteredDirectory.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center p-4">No hay más usuarios disponibles.</p>
              ) : (
                filteredDirectory.map((d) => {
                  const Icon = ROLE_ICON[d.role] || Users
                  return (
                    <button
                      key={d.id}
                      className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors text-left"
                      onClick={() => { setSelectedUserId(d.id); setShowDirectory(false); setMessages([]); setOtherName(d.name) }}
                    >
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-fb-blue to-fb-purple flex items-center justify-center text-white text-sm font-medium shrink-0">
                        {d.name.split(" ").map(n => n[0]).slice(0, 2).join("")}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm truncate">{d.name}</div>
                        <div className="text-xs text-muted-foreground flex items-center gap-1">
                          <Icon className="h-3 w-3" /> {ROLE_LABEL[d.role] || d.role}
                        </div>
                      </div>
                    </button>
                  )
                })
              )
            ) : filteredConvs.length === 0 ? (
              <div className="text-center py-8 px-4">
                <MessagesSquare className="h-10 w-10 mx-auto mb-2 text-muted-foreground/40" />
                <p className="text-sm text-muted-foreground">Sin conversaciones. Usa "Nueva conversación" para escribir a una empresa o candidato.</p>
              </div>
            ) : (
              filteredConvs.map((c) => {
                const Icon = ROLE_ICON[c.other.role] || Users
                return (
                  <button
                    key={c.id}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors text-left ${
                      selectedUserId === c.other.id ? "bg-primary/10" : "hover:bg-muted"
                    }`}
                    onClick={() => { setSelectedUserId(c.other.id); setMessages([]) }}
                  >
                    <div className="relative shrink-0">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-fb-blue to-fb-purple flex items-center justify-center text-white text-sm font-medium">
                        {c.other.name.split(" ").map(n => n[0]).slice(0, 2).join("")}
                      </div>
                      {c.unread > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full h-5 min-w-5 px-1 flex items-center justify-center">
                          {c.unread}
                        </span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className={`text-sm truncate ${c.unread > 0 ? "font-bold" : "font-medium"}`}>{c.other.name}</div>
                      <div className="text-xs text-muted-foreground truncate">
                        {c.lastMessage ? `${c.lastMessage.isMine ? "Tú: " : ""}${c.lastMessage.body}` : "Sin mensajes"}
                      </div>
                    </div>
                    <Icon className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                  </button>
                )
              })
            )}
          </div>
        </Card>

        {/* Chat */}
        <Card className="lg:col-span-2 flex flex-col overflow-hidden">
          {selectedUserId ? (
            <>
              <div className="p-4 border-b flex items-center gap-3">
                <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSelectedUserId(null)}>
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-fb-blue to-fb-purple flex items-center justify-center text-white text-sm font-medium">
                  {otherName.split(" ").map(n => n[0]).slice(0, 2).join("")}
                </div>
                <div>
                  <div className="font-semibold">{otherName}</div>
                  <div className="text-xs text-muted-foreground">
                    {ROLE_LABEL[(selectedUser as DirectoryUser | { role?: string })?.role || ""] || ""}
                  </div>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.length === 0 ? (
                  <p className="text-center text-sm text-muted-foreground py-8">
                    Inicia la conversación con un mensaje.
                  </p>
                ) : (
                  messages.map((m) => (
                    <div key={m.id} className={`flex ${m.isMine ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`max-w-[75%] rounded-2xl px-4 py-2 ${
                          m.isMine
                            ? "bg-primary text-primary-foreground rounded-br-sm"
                            : "bg-muted rounded-bl-sm"
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap break-words">{m.body}</p>
                        <p className={`text-[10px] mt-1 ${m.isMine ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                          {new Date(m.createdAt).toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })}
                          {m.isMine && (m.readAt ? " · Leído" : " · Enviado")}
                        </p>
                      </div>
                    </div>
                  ))
                )}
                <div ref={bottomRef} />
              </div>
              <div className="p-4 border-t flex gap-2">
                <Input
                  placeholder="Escribe un mensaje..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send() } }}
                />
                <Button variant="fb" size="icon" onClick={send} disabled={sending || !input.trim()}>
                  {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </Button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center p-8">
              <div className="text-center">
                <MessagesSquare className="h-12 w-12 mx-auto mb-3 text-muted-foreground/40" />
                <p className="text-muted-foreground">Selecciona una conversación o inicia una nueva.</p>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
