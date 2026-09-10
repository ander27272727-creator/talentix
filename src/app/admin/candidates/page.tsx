"use client"

import { useState, useEffect, useCallback } from "react"
import {
  Users, Search, Eye, X, Loader2, Inbox, Brain, Target, Briefcase,
  GraduationCap, MapPin, Mail, Phone, FileText, Send, Award
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { useStore } from "@/store/useStore"

interface CandidateRow {
  id: string
  userId: string
  name: string
  email: string
  phone: string | null
  location: string | null
  skills: string[]
  allSkillsCount: number
  bio: string | null
  cvFileName: string | null
  education: { degree: string; field: string; institution: string }[]
  experience: { position: string; company: string; current: boolean }[]
  yearsExperience: number
  assessmentsCompleted: number
  assessmentsTotal: number
  scoresByCategory: Record<string, number>
  avgScore: number | null
  matches: number
  referrals: number
  derived: boolean
  profileCompletion: number
  registeredAt: string
}

interface CompanyOption {
  id: string
  name: string
}

const CATEGORY_LABELS: Record<string, { label: string; color: string }> = {
  COGNITIVE: { label: "Cognitiva", color: "text-blue-600" },
  PSYCHOMETRIC: { label: "Psicométrica", color: "text-purple-600" },
  BEHAVIORAL: { label: "Comportamental", color: "text-emerald-600" },
  TECHNICAL: { label: "Técnica", color: "text-orange-600" },
}

export default function AdminCandidatesPage() {
  const { user } = useStore()
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)
  const [candidates, setCandidates] = useState<CandidateRow[]>([])
  const [selected, setSelected] = useState<CandidateRow | null>(null)
  const [companies, setCompanies] = useState<CompanyOption[]>([])
  const [referring, setReferring] = useState(false)
  const [referralMsg, setReferralMsg] = useState<string | null>(null)

  const load = useCallback((q?: string) => {
    setLoading(true)
    fetch(`/api/admin/candidates${q ? `?search=${encodeURIComponent(q)}` : ""}`)
      .then(r => r.json())
      .then(data => { if (data.success) setCandidates(data.candidates) })
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { load() }, [load])

  useEffect(() => {
    const t = setTimeout(() => load(search || undefined), search ? 400 : 0)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search])

  // Al abrir el detalle: cargar empresas activas para derivar
  async function openDetail(c: CandidateRow) {
    setSelected(c)
    setReferralMsg(null)
    if (companies.length === 0) {
      const res = await fetch("/api/admin/companies")
      const data = await res.json()
      if (data.success) setCompanies(data.companies)
    }
  }

  async function deriveToCompany(companyId: string, companyName: string) {
    if (!selected) return
    if (selected.matches === 0) {
      setReferralMsg("Este candidato aún no tiene matches con evaluaciones. Debe completar evaluaciones primero.")
      return
    }
    setReferring(true)
    setReferralMsg(null)
    try {
      const res = await fetch("/api/admin/derive", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ candidateId: selected.id, companyId }),
      })
      const data = await res.json()
      setReferralMsg(data.success
        ? `✅ Candidato derivado a ${companyName} (${data.created} vacante${data.created !== 1 ? "s" : ""} compatible${data.created !== 1 ? "s" : ""})`
        : data.error || "No se pudo derivar")
      if (data.success) load(search || undefined)
    } catch {
      setReferralMsg("Error de conexión al derivar")
    } finally {
      setReferring(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Users className="h-8 w-8 text-primary" />
            Candidatos
          </h1>
          <p className="text-muted-foreground mt-1">Todos los candidatos registrados con su progreso real.</p>
        </div>
        <Badge variant="info" className="px-3 py-1 text-sm w-fit">
          {candidates.length} candidato{candidates.length !== 1 ? "s" : ""}
        </Badge>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Buscar por nombre..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-40"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
      ) : candidates.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Inbox className="h-12 w-12 mx-auto mb-3 text-muted-foreground/50" />
            <p className="text-muted-foreground">
              {search ? "No se encontraron candidatos con esa búsqueda." : "Aún no hay candidatos registrados en la plataforma."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {candidates.map((c) => (
            <Card key={c.id} className="hover:shadow-md transition-all duration-200">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-fb-blue to-fb-purple flex items-center justify-center text-white font-bold text-lg shrink-0">
                    {c.name.split(" ").map(n => n[0]).slice(0, 2).join("")}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold">{c.name}</h3>
                      {c.derived ? (
                        <Badge className="bg-purple-100 text-purple-800">Derivado</Badge>
                      ) : (
                        <Badge className="bg-blue-100 text-blue-800">Disponible</Badge>
                      )}
                      {c.cvFileName && <Badge variant="outline" className="text-xs"><FileText className="h-3 w-3 mr-1" />CV</Badge>}
                    </div>
                    <div className="text-sm text-muted-foreground mt-0.5 flex items-center gap-2 flex-wrap">
                      {c.location && <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{c.location}</span>}
                      <span>{c.yearsExperience > 0 ? `${c.yearsExperience} años exp.` : "Sin experiencia registrada"}</span>
                      <span>· {c.assessmentsCompleted}/{c.assessmentsTotal} evaluaciones</span>
                    </div>
                    <div className="flex gap-2 mt-2 flex-wrap">
                      {c.skills.slice(0, 5).map((s, i) => (
                        <Badge key={i} variant="outline" className="text-xs">{s}</Badge>
                      ))}
                      {c.allSkillsCount > 5 && <Badge variant="outline" className="text-xs">+{c.allSkillsCount - 5}</Badge>}
                    </div>
                  </div>
                  <div className="flex items-center gap-6 shrink-0">
                    <div className="text-center">
                      <div className={`text-2xl font-bold ${c.avgScore != null ? "gradient-text" : "text-muted-foreground"}`}>
                        {c.avgScore != null ? `${c.avgScore}%` : "—"}
                      </div>
                      <div className="text-xs text-muted-foreground">Score</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-primary">{c.matches}</div>
                      <div className="text-xs text-muted-foreground">Matches</div>
                    </div>
                    <Button variant="ghost" size="icon" title="Ver perfil completo" onClick={() => openDetail(c)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Modal de detalle completo */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto" onClick={() => setSelected(null)}>
          <Card className="w-full max-w-2xl my-8" onClick={e => e.stopPropagation()}>
            <CardContent className="p-6 space-y-5 max-h-[85vh] overflow-y-auto">
              {/* Header */}
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-fb-blue to-fb-purple flex items-center justify-center text-white font-bold text-xl shrink-0">
                  {selected.name.split(" ").map(n => n[0]).slice(0, 2).join("")}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-xl">{selected.name}</h3>
                  <div className="text-sm text-muted-foreground flex flex-wrap gap-x-3 gap-y-1 mt-1">
                    {selected.email && <span className="flex items-center gap-1"><Mail className="h-3 w-3" />{selected.email}</span>}
                    {selected.phone && <span className="flex items-center gap-1"><Phone className="h-3 w-3" />{selected.phone}</span>}
                    {selected.location && <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{selected.location}</span>}
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setSelected(null)}><X className="h-4 w-4" /></Button>
              </div>

              {/* Scores */}
              <div>
                <p className="text-sm font-medium mb-2 flex items-center gap-2"><Brain className="h-4 w-4" /> Evaluaciones ({selected.assessmentsCompleted}/{selected.assessmentsTotal})</p>
                {Object.keys(selected.scoresByCategory).length === 0 ? (
                  <p className="text-sm text-muted-foreground">Aún no ha completado evaluaciones.</p>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {Object.entries(selected.scoresByCategory).map(([cat, score]) => (
                      <div key={cat} className="p-3 rounded-lg bg-muted/50">
                        <div className={`text-lg font-bold ${CATEGORY_LABELS[cat.toUpperCase()]?.color || ""}`}>
                          {score}%
                        </div>
                        <div className="text-xs text-muted-foreground">{CATEGORY_LABELS[cat.toUpperCase()]?.label || cat}</div>
                        <Progress value={score} className="h-1.5 mt-1" />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Bio */}
              {selected.bio && (
                <div>
                  <p className="text-sm font-medium mb-1">Sobre el candidato</p>
                  <p className="text-sm text-muted-foreground">{selected.bio}</p>
                </div>
              )}

              {/* Skills */}
              <div>
                <p className="text-sm font-medium mb-2">Habilidades ({selected.allSkillsCount})</p>
                <div className="flex gap-2 flex-wrap">
                  {selected.skills.length > 0 ? selected.skills.map((s, i) => (
                    <Badge key={i} variant="outline">{s}</Badge>
                  )) : <span className="text-sm text-muted-foreground">Sin skills registradas</span>}
                </div>
              </div>

              {/* Educación y experiencia */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium mb-2 flex items-center gap-2"><GraduationCap className="h-4 w-4" /> Educación</p>
                  {selected.education.length === 0 ? (
                    <p className="text-sm text-muted-foreground">Sin registrar</p>
                  ) : (
                    selected.education.map((e, i) => (
                      <div key={i} className="text-sm text-muted-foreground mb-1">
                        <span className="text-foreground font-medium">{e.degree}</span> · {e.institution}
                      </div>
                    ))
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium mb-2 flex items-center gap-2"><Briefcase className="h-4 w-4" /> Experiencia</p>
                  {selected.experience.length === 0 ? (
                    <p className="text-sm text-muted-foreground">Sin registrar</p>
                  ) : (
                    selected.experience.map((e, i) => (
                      <div key={i} className="text-sm text-muted-foreground mb-1">
                        <span className="text-foreground font-medium">{e.position}</span> · {e.company}{e.current ? " (actual)" : ""}
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* CV */}
              {selected.cvFileName && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
                  <FileText className="h-5 w-5 text-fb-blue" />
                  <span className="text-sm font-medium flex-1 truncate">{selected.cvFileName}</span>
                  <a href={`/api/candidate/cv?userId=${selected.userId}&download=1`} download>
                    <Button variant="outline" size="sm">Descargar CV</Button>
                  </a>
                </div>
              )}

              {/* Referido/derivar */}
              <div className="border-t pt-4 space-y-3">
                <p className="text-sm font-medium flex items-center gap-2"><Send className="h-4 w-4" /> Estado de derivación</p>
                {referralMsg && <p className="text-sm p-3 rounded-lg bg-muted">{referralMsg}</p>}
                {selected.derived ? (
                  <p className="text-sm text-muted-foreground">
                    Este candidato ya fue derivado a {selected.referrals} empresa{selected.referrals !== 1 ? "s" : ""}.
                  </p>
                ) : companies.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No hay empresas registradas todavía para derivar.</p>
                ) : (
                  <div>
                    <p className="text-xs text-muted-foreground mb-2">Derivar a una empresa (enviará sus matches compatibles):</p>
                    <div className="flex gap-2 flex-wrap">
                      {companies.map((comp) => (
                        <Button
                          key={comp.id}
                          variant="fb-outline"
                          size="sm"
                          disabled={referring}
                          onClick={() => deriveToCompany(comp.id, comp.name)}
                        >
                          {referring ? <Loader2 className="h-3 w-3 mr-1 animate-spin" /> : <Send className="h-3 w-3 mr-1" />}
                          {comp.name}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
