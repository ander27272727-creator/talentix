"use client"

import { useState, useEffect } from "react"
import { Users, Search, Eye, Inbox } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react"
import { useStore } from "@/store/useStore"

interface ReferralCandidate {
  id: string
  name: string
  role: string
  lastPosition: string | null
  score: number
  recommendation: string
  status: string
  statusLabel: string
  referredAt: string
  skills: string[]
}

const statusColors: Record<string, string> = {
  "PENDING": "bg-blue-100 text-blue-800",
  "VIEWED": "bg-gray-100 text-gray-800",
  "CONTACTED": "bg-amber-100 text-amber-800",
  "INTERVIEW": "bg-purple-100 text-purple-800",
  "HIRED": "bg-emerald-100 text-emerald-800",
  "REJECTED": "bg-red-100 text-red-800",
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const hours = Math.floor(diff / (1000 * 60 * 60))
  if (hours < 1) return "Hace unos minutos"
  if (hours < 24) return `Hace ${hours} hora${hours !== 1 ? "s" : ""}`
  const days = Math.floor(hours / 24)
  if (days === 1) return "Ayer"
  return `Hace ${days} días`
}

export default function CompanyCandidatesPage() {
  const { user } = useStore()
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)
  const [candidates, setCandidates] = useState<ReferralCandidate[]>([])
  const [selected, setSelected] = useState<ReferralCandidate | null>(null)

  useEffect(() => {
    if (!user?.id) return
    fetch(`/api/company/referrals?userId=${user.id}`)
      .then(r => r.json())
      .then(data => {
        if (data.success) setCandidates(data.candidates)
      })
      .finally(() => setLoading(false))
  }, [user?.id])

  const filtered = candidates.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.role.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Users className="h-8 w-8 text-primary" />
            Candidatos
          </h1>
          <p className="text-muted-foreground mt-1">
            Candidatos derivados a tu empresa por Talentix.
          </p>
        </div>
        <Badge variant="info" className="px-3 py-1 text-sm w-fit">
          {candidates.length} candidato{candidates.length !== 1 ? "s" : ""} total{candidates.length !== 1 ? "es" : ""}
        </Badge>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por nombre o cargo..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {filtered.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Inbox className="h-12 w-12 mx-auto mb-3 text-muted-foreground/50" />
            <p className="text-muted-foreground">
              {search
                ? "No se encontraron candidatos con esa búsqueda."
                : "Aún no tienes candidatos derivados. Publica vacantes para recibir perfiles evaluados por nuestra IA."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filtered.map((candidate) => (
            <Card key={candidate.id} className="hover:shadow-md transition-all duration-200">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-fb-blue to-fb-purple flex items-center justify-center text-white font-bold text-lg shrink-0">
                    {candidate.name.split(" ").map(n => n[0]).slice(0, 2).join("")}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold">{candidate.name}</h3>
                      <Badge className={statusColors[candidate.status] || "bg-gray-100 text-gray-800"}>
                        {candidate.statusLabel}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {candidate.lastPosition
                        ? `${candidate.lastPosition} · postuló a ${candidate.role}`
                        : `Postuló a ${candidate.role}`}
                      {" · "}{timeAgo(candidate.referredAt)}
                    </div>
                    <div className="flex gap-2 mt-2 flex-wrap">
                      {candidate.skills.map((skill, i) => (
                        <Badge key={i} variant="outline" className="text-xs">{skill}</Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold gradient-text">{candidate.score}%</div>
                      <div className="text-xs text-muted-foreground">{candidate.recommendation}</div>
                    </div>

                    <Button variant="ghost" size="icon" title="Ver perfil" onClick={() => setSelected(candidate)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Modal simple de detalle */}
      {selected && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setSelected(null)}
        >
          <Card className="w-full max-w-lg" onClick={e => e.stopPropagation()}>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-fb-blue to-fb-purple flex items-center justify-center text-white font-bold text-lg">
                  {selected.name.split(" ").map(n => n[0]).slice(0, 2).join("")}
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{selected.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {selected.lastPosition || "Sin experiencia registrada"}
                  </p>
                </div>
                <div className="ml-auto text-center">
                  <div className="text-3xl font-bold gradient-text">{selected.score}%</div>
                  <div className="text-xs text-muted-foreground">Match</div>
                </div>
              </div>
              <div className="pt-2">
                <p className="text-sm font-medium mb-2">Habilidades</p>
                <div className="flex gap-2 flex-wrap">
                  {selected.skills.length > 0 ? selected.skills.map((s, i) => (
                    <Badge key={i} variant="outline">{s}</Badge>
                  )) : <span className="text-sm text-muted-foreground">Sin skills registradas</span>}
                </div>
              </div>
              <div className="flex gap-2 justify-end pt-2">
                <Button variant="outline" onClick={() => setSelected(null)}>Cerrar</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
