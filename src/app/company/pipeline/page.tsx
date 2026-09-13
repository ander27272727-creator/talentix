"use client"

import { useState, useEffect } from "react"
import { Target, ArrowRight, Loader2, Inbox, CalendarPlus, MessageCircle, X, Clock, Video, Phone, MapPin } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useStore } from "@/store/useStore"
import { apiFetch } from "@/lib/api"

interface PipelineStage {
  stage: string
  label: string
  color: string
  count: number
  candidates: { id: string; name: string; score: number; phone: string | null }[]
}

interface UpcomingInterview {
  id: string
  scheduledAt: string
  durationMin: number
  mode: string
  status: string
  candidate: string
  vacancy: string
}

export default function CompanyPipelinePage() {
  const { user } = useStore()
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const [pipeline, setPipeline] = useState<PipelineStage[]>([])
  const [interviews, setInterviews] = useState<UpcomingInterview[]>([])
  const [scheduleOpen, setScheduleOpen] = useState(false)
  const [toastMsg, setToastMsg] = useState<{ text: string; ok: boolean } | null>(null)
  const [saving, setSaving] = useState(false)
  const [selected, setSelected] = useState<{ id: string; name: string; vacancy?: string } | null>(null)
  const [when, setWhen] = useState("")
  const [mode, setMode] = useState("VIDEO")
  const [duration, setDuration] = useState("45")
  const [notes, setNotes] = useState("")

  const load = () => {
    if (!user?.id) return
    Promise.all([
      fetch(`/api/company/pipeline?userId=${user.id}`).then((r) => r.json()),
      apiFetch(`/api/company/interviews?userId=${user.id}`).then((r) => (r.ok ? r.json() : { success: false })),
    ])
      .then(([pData, iData]) => {
        if (pData.success) {
          setPipeline(pData.pipeline)
          setTotal(pData.total)
        }
        if (iData.success) setInterviews(iData.interviews)
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id])

  async function openSchedule(candidate: { id: string; name: string }, stage: string) {
    setSelected({ ...candidate, vacancy: stage })
    const now = new Date(Date.now() + 24 * 60 * 60 * 1000)
    now.setMinutes(0, 0, 0)
    setWhen(now.toISOString().slice(0, 16))
    setMode("VIDEO")
    setDuration("45")
    setNotes("")
    setScheduleOpen(true)
  }

  async function saveInterview() {
    if (!selected || !when || !user?.id) return
    setSaving(true)
    try {
      const res = await apiFetch("/api/company/interviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, referralId: selected.id, scheduledAt: when, mode, durationMin: Number(duration), notes }),
      })
      const data = await res.json()
      if (data.success) {
        setToastMsg({ text: `Entrevista agendada con ${selected.name}. El candidato fue notificado.`, ok: true })
        setTimeout(() => setToastMsg(null), 5000)
        setScheduleOpen(false)
        load()
      } else {
        setToastMsg({ text: data.error || "No se pudo agendar la entrevista", ok: false })
        setTimeout(() => setToastMsg(null), 5000)
      }
    } catch {
      setToastMsg({ text: "Error de conexión", ok: false })
      setTimeout(() => setToastMsg(null), 5000)
    } finally {
      setSaving(false)
    }
  }

  const modeIcon = (m: string) => (m === "PHONE" ? <Phone className="h-4 w-4" /> : m === "ONSITE" ? <MapPin className="h-4 w-4" /> : <Video className="h-4 w-4" />)
  const modeLabel = (m: string) => (m === "PHONE" ? "Teléfono" : m === "ONSITE" ? "Presencial" : "Videollamada")

  if (loading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
  }

  const activeStages = pipeline.filter((p) => p.stage !== "REJECTED")
  const maxCount = Math.max(1, ...activeStages.map((p) => p.count))
  const upcoming = interviews.filter((i) => i.status === "SCHEDULED" && new Date(i.scheduledAt) >= new Date(Date.now() - 3600_000))

  return (
    <div className="space-y-6">
      {toastMsg && (
        <div className={`fixed bottom-6 right-6 z-50 max-w-sm rounded-lg px-4 py-3 shadow-lg text-sm ${toastMsg.ok ? "bg-emerald-600 text-white" : "bg-red-600 text-white"}`}>
          {toastMsg.text}
        </div>
      )}
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Target className="h-8 w-8 text-primary" />
          Pipeline de Candidatos
        </h1>
        <p className="text-muted-foreground mt-1">
          Seguimiento del proceso de selección · {total} candidato{total !== 1 ? "s" : ""} en total.
        </p>
      </div>

      {/* Próximas entrevistas */}
      {upcoming.length > 0 && (
        <Card className="border-indigo-200 bg-indigo-50/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Clock className="h-5 w-5 text-indigo-600" /> Próximas entrevistas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {upcoming.map((i) => (
              <div key={i.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-lg bg-white border">
                <div>
                  <p className="font-medium text-sm">{i.candidate} · {i.vacancy}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
                    {modeIcon(i.mode)} {modeLabel(i.mode)} ·{" "}
                    {new Date(i.scheduledAt).toLocaleString("es-ES", { weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}{" "}
                    · {i.durationMin} min
                  </p>
                </div>
                <Badge className="bg-indigo-600">Agendada</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {total === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Inbox className="h-12 w-12 mx-auto mb-3 text-muted-foreground/50" />
            <p className="text-muted-foreground">
              Tu pipeline está vacío. Aparecerá actividad cuando recibas candidatos derivados por la IA.
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Funnel */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {activeStages.map((stage, i) => (
              <Card key={stage.stage} className="relative overflow-hidden">
                <div className={`absolute top-0 left-0 right-0 h-1 ${stage.color}`} />
                <CardContent className="p-4 text-center">
                  <div className="text-3xl font-bold mb-1">{stage.count}</div>
                  <div className="text-sm font-medium mb-2">{stage.label}</div>
                  <Progress value={(stage.count / maxCount) * 100} className="h-2" />
                  {i < activeStages.length - 1 && (
                    <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-10">
                      <ArrowRight className="h-5 w-5 text-muted-foreground" />
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Candidatos por etapa */}
          <div className="grid md:grid-cols-2 gap-6">
            {pipeline.filter((s) => s.candidates.length > 0).map((stage) => (
              <Card key={stage.stage}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center justify-between">
                    {stage.label}
                    <Badge variant="outline">{stage.count}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {stage.candidates.map((c) => (
                      <div key={c.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2 rounded-lg bg-muted/50">
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-fb-blue to-fb-purple flex items-center justify-center text-white text-xs font-medium shrink-0">
                            {c.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                          </div>
                          <div className="min-w-0">
                            <span className="text-sm font-medium block truncate">{c.name}</span>
                            {c.phone && (
                              <a
                                href={`https://wa.me/${c.phone.replace(/[^0-9]/g, "")}`}
                                target="_blank"
                                rel="noreferrer"
                                className="text-xs text-emerald-600 hover:underline flex items-center gap-1"
                              >
                                <MessageCircle className="h-3 w-3" /> WhatsApp
                              </a>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-sm font-bold gradient-text">{c.score}%</span>
                          {stage.stage !== "HIRED" && stage.stage !== "REJECTED" && (
                            <Button size="sm" variant="outline" onClick={() => openSchedule(c, stage.label)}>
                              <CalendarPlus className="h-3.5 w-3.5 mr-1" />
                              Entrevista
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}

      {/* Modal agendar entrevista */}
      <Dialog open={scheduleOpen} onOpenChange={setScheduleOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              Agendar entrevista{selected ? ` — ${selected.name}` : ""}
              <button onClick={() => setScheduleOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X className="h-4 w-4" />
              </button>
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="when">Fecha y hora</Label>
              <Input id="when" type="datetime-local" value={when} onChange={(e) => setWhen(e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Modalidad</Label>
                <Select value={mode} onValueChange={setMode}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="VIDEO">Videollamada</SelectItem>
                    <SelectItem value="PHONE">Teléfono</SelectItem>
                    <SelectItem value="ONSITE">Presencial</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Duración</Label>
                <Select value={duration} onValueChange={setDuration}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30 min</SelectItem>
                    <SelectItem value="45">45 min</SelectItem>
                    <SelectItem value="60">60 min</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="notes">Notas para el candidato</Label>
              <Textarea id="notes" placeholder="Ej: Traer CV impreso, pedir en recepción..." value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} />
            </div>
            <p className="text-xs text-muted-foreground">
              El candidato recibirá la confirmación en la app, por correo y por WhatsApp (si tiene teléfono registrado). El pipeline avanzará automáticamente a la etapa de Entrevista.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setScheduleOpen(false)}>Cancelar</Button>
            <Button onClick={saveInterview} disabled={saving || !when}>
              {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <CalendarPlus className="h-4 w-4 mr-2" />}
              Agendar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
