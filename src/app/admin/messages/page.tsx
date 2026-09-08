"use client"

import { useState, useEffect, useCallback } from "react"
import {
  MessageSquare, Send, Phone, Search, Building2, Users, Clock,
  Check, CheckCheck, Paperclip, ArrowLeft, Bell
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useStore } from "@/store/useStore"

interface Message {
  id: string
  from: "admin" | "empresa" | "candidato"
  text: string
  time: string
  read: boolean
}

interface Conversation {
  id: string
  name: string
  type: "empresa" | "candidato"
  avatar: string
  lastMessage: string
  time: string
  unread: number
  whatsapp: string
  messages: Message[]
}

const initialConversations: Conversation[] = [
  {
    id: "1", name: "TechCorp Solutions", type: "empresa", avatar: "TC",
    lastMessage: "Gracias por derivar a María, la hemos contactado", time: "Hace 1h", unread: 0,
    whatsapp: "+573112345678", messages: [
      { id: "1", from: "admin", text: "Hola, les derivamos a María García para el puesto de Senior Developer. Tiene 89% de match.", time: "10:30 AM", read: true },
      { id: "2", from: "empresa", text: "Perfecto, la revisaremos. ¿Pueden enviar su CV actualizado?", time: "10:45 AM", read: true },
      { id: "3", from: "admin", text: "Ya lo tiene disponible en la plataforma. Su perfil está completo.", time: "11:00 AM", read: true },
      { id: "4", from: "empresa", text: "Gracias por derivar a María, la hemos contactado", time: "11:30 AM", read: true },
    ]
  },
  {
    id: "2", name: "María García", type: "candidato", avatar: "MG",
    lastMessage: "¿Qué empresa me recomiendan según mi perfil?", time: "Hace 3h", unread: 2,
    whatsapp: "+573101234567", messages: [
      { id: "1", from: "candidato", text: "Hola, completué todas mis evaluaciones. ¿Qué sigue?", time: "9:00 AM", read: true },
      { id: "2", from: "admin", text: "¡Excelente María! Tu perfil tiene 89% de compatibilidad con varias empresas.", time: "9:15 AM", read: true },
      { id: "3", from: "candidato", text: "¿Qué empresa me recomiendan según mi perfil?", time: "9:30 AM", read: false },
    ]
  },
  {
    id: "3", name: "GlobalTech Corp", type: "empresa", avatar: "GT",
    lastMessage: "Necesitamos 5 desarrolladores urgentemente", time: "Ayer", unread: 1,
    whatsapp: "+15559876543", messages: [
      { id: "1", from: "empresa", text: "Necesitamos 5 desarrolladores urgentemente", time: "Ayer 4:00 PM", read: false },
    ]
  },
  {
    id: "4", name: "Carlos Ruiz", type: "candidato", avatar: "CR",
    lastMessage: "Recibí la notificación de match con DataPro", time: "Ayer", unread: 0,
    whatsapp: "+52559876543", messages: [
      { id: "1", from: "admin", text: "Carlos, tienes un nuevo match con DataPro Analytics. 88% de compatibilidad.", time: "Ayer 2:00 PM", read: true },
      { id: "2", from: "candidato", text: "Recibí la notificación de match con DataPro", time: "Ayer 3:00 PM", read: true },
    ]
  },
]

export default function MessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>(initialConversations)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [messageText, setMessageText] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const { setUnreadMessages } = useStore()

  const selectedConvo = conversations.find(c => c.id === selectedId) || null

  // Calculate total unread for badge
  const totalUnread = conversations.reduce((sum, c) => sum + c.unread, 0)

  // Sync unread count to store
  useEffect(() => {
    setUnreadMessages(totalUnread)
  }, [totalUnread, setUnreadMessages])

  // Mark conversation as read when selected
  useEffect(() => {
    if (!selectedId) return
    setConversations(prev =>
      prev.map(c => {
        if (c.id !== selectedId || c.unread === 0) return c
        return {
          ...c,
          unread: 0,
          messages: c.messages.map(m => ({ ...m, read: true })),
        }
      })
    )
  }, [selectedId])

  const handleSend = useCallback(() => {
    if (!messageText.trim() || !selectedId) return
    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      from: "admin",
      text: messageText.trim(),
      time: new Date().toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" }),
      read: true,
    }
    setConversations(prev =>
      prev.map(c => {
        if (c.id !== selectedId) return c
        return {
          ...c,
          messages: [...c.messages, newMsg],
          lastMessage: newMsg.text,
          time: "Ahora",
        }
      })
    )
    setMessageText("")
  }, [messageText, selectedId])

  const filtered = conversations.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header with unread badge */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <MessageSquare className="h-7 w-7 text-fb-purple" />
            Mensajes
            {totalUnread > 0 && (
              <Badge className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full animate-pulse">
                {totalUnread} sin leer
              </Badge>
            )}
          </h1>
          <p className="text-muted-foreground mt-1">Conversaciones con empresas y candidatos</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-0 border-2 rounded-2xl overflow-hidden bg-background" style={{ height: "calc(100vh - 240px)", minHeight: "500px" }}>
        {/* Conversations List */}
        <div className={`border-r ${selectedConvo ? "hidden lg:block" : ""} w-full flex flex-col`}>
          <div className="p-3 border-b shrink-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Buscar conversación..." className="pl-9" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
            </div>
          </div>
          <div className="overflow-y-auto flex-1">
            {filtered.map(c => (
              <button key={c.id} onClick={() => setSelectedId(c.id)}
                className={`w-full text-left p-4 border-b hover:bg-muted/50 transition-colors ${
                  selectedId === c.id ? "bg-fb-blue/5 border-l-2 border-l-fb-blue" : ""
                }`}>
                <div className="flex items-center gap-3">
                  <div className="relative shrink-0">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold ${
                      c.type === "empresa" ? "bg-gradient-to-br from-blue-500 to-blue-700" : "bg-gradient-to-br from-fb-blue to-fb-purple"
                    }`}>
                      {c.avatar}
                    </div>
                    {/* Unread dot */}
                    {c.unread > 0 && (
                      <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-red-500 rounded-full border-2 border-background" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`text-sm truncate ${c.unread > 0 ? "font-bold" : "font-medium"}`}>{c.name}</span>
                        {c.type === "empresa" ? <Building2 className="h-3 w-3 text-blue-500 shrink-0" /> : <Users className="h-3 w-3 text-fb-purple shrink-0" />}
                      </div>
                      <span className={`text-xs shrink-0 ${c.unread > 0 ? "text-fb-blue font-medium" : "text-muted-foreground"}`}>{c.time}</span>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <p className={`text-xs truncate ${c.unread > 0 ? "text-foreground font-medium" : "text-muted-foreground"}`}>{c.lastMessage}</p>
                      {c.unread > 0 && (
                        <Badge className="ml-2 bg-fb-blue text-white text-xs min-w-[20px] h-5 flex items-center justify-center rounded-full shrink-0">
                          {c.unread}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        {selectedConvo ? (
          <div className="lg:col-span-2 flex flex-col">
            {/* Chat Header */}
            <div className="p-4 border-b flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <button className="lg:hidden p-1" onClick={() => setSelectedId(null)}>
                  <ArrowLeft className="h-5 w-5" />
                </button>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold ${
                  selectedConvo.type === "empresa" ? "bg-gradient-to-br from-blue-500 to-blue-700" : "bg-gradient-to-br from-fb-blue to-fb-purple"
                }`}>
                  {selectedConvo.avatar}
                </div>
                <div>
                  <div className="font-medium text-sm flex items-center gap-2">
                    {selectedConvo.name}
                    {selectedConvo.type === "empresa" ? <Badge className="bg-blue-100 text-blue-700 text-xs">Empresa</Badge> : <Badge className="bg-purple-100 text-purple-700 text-xs">Candidato</Badge>}
                  </div>
                  <div className="text-xs text-muted-foreground">Última conexión: {selectedConvo.time}</div>
                </div>
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" className="h-9 w-9" title="WhatsApp" onClick={() => window.open(`https://wa.me/${selectedConvo.whatsapp}`, "_blank")}>
                  <Phone className="h-4 w-4 text-emerald-600" />
                </Button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {selectedConvo.messages.map(msg => (
                <div key={msg.id} className={`flex ${msg.from === "admin" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[75%] p-3 rounded-2xl ${
                    msg.from === "admin"
                      ? "bg-fb-blue text-white rounded-br-md"
                      : "bg-muted rounded-bl-md"
                  }`}>
                    <p className="text-sm">{msg.text}</p>
                    <div className={`text-xs mt-1 flex items-center gap-1 ${msg.from === "admin" ? "text-white/70" : "text-muted-foreground"}`}>
                      {msg.time}
                      {msg.from === "admin" && (
                        msg.read ? <CheckCheck className="h-3 w-3" /> : <Check className="h-3 w-3" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="p-4 border-t shrink-0">
              <div className="flex gap-2">
                <Button variant="ghost" size="icon" className="h-10 w-10 shrink-0">
                  <Paperclip className="h-5 w-5 text-muted-foreground" />
                </Button>
                <Input
                  placeholder="Escribe un mensaje..."
                  className="flex-1"
                  value={messageText}
                  onChange={e => setMessageText(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend() } }}
                />
                <Button variant="fb" size="icon" className="h-10 w-10 shrink-0" disabled={!messageText.trim()} onClick={handleSend}>
                  <Send className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="lg:col-span-2 flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p>Selecciona una conversación</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
