"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Briefcase, Plus, Search, MapPin, Users, Loader2, Inbox, Eye, Pause, Play } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { useStore } from "@/store/useStore"
import { apiFetch } from "@/lib/api"

interface VacancyRow {
  id: string
  title: string
  description: string
  category: string
  status: string
  location: string
  type: string
  salaryMin: number | null
  salaryMax: number | null
  salaryCurrency: string
  requirements: string[]
  candidates: number
  matches: number
  createdAt: string
}

const STATUS_LABELS: Record<string, { label: string; className: string }> = {
  ACTIVE: { label: "Activa", className: "bg-emerald-100 text-emerald-800" },
  PAUSED: { label: "Pausada", className: "bg-amber-100 text-amber-800" },
  DRAFT: { label: "Borrador", className: "bg-gray-100 text-gray-800" },
  CLOSED: { label: "Cerrada", className: "bg-red-100 text-red-800" },
}

const TYPE_LABELS: Record<string, string> = {
  REMOTE: "Remoto",
  HYBRID: "Híbrido",
  ONSITE: "Presencial",
}

export default function CompanyVacanciesPage() {
  const { user } = useStore()
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)
  const [vacancies, setVacancies] = useState<VacancyRow[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user?.id) return
    fetch(`/api/company/vacancies?userId=${user.id}`)
      .then(r => r.json())
      .then(data => {
        if (data.success) setVacancies(data.vacancies)
        else setError(data.error || "Error al cargar vacantes")
      })
      .catch(() => setError("Error de conexión"))
      .finally(() => setLoading(false))
  }, [user?.id])

  async function toggleStatus(v: VacancyRow) {
    const next = v.status === "ACTIVE" ? "PAUSED" : "ACTIVE"
    try {
      const res = await apiFetch("/api/company/vacancies", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user!.id, vacancyId: v.id, status: next }),
      })
      const data = await res.json()
      if (data.success) {
        setVacancies(prev => prev.map(x => x.id === v.id ? { ...x, status: next } : x))
      }
    } catch { /* silencioso */ }
  }

  const filtered = vacancies.filter(v =>
    v.title.toLowerCase().includes(search.toLowerCase()) ||
    v.location.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Briefcase className="h-8 w-8 text-primary" />
            Mis Vacantes
          </h1>
          <p className="text-muted-foreground mt-1">Administra tus vacantes publicadas.</p>
        </div>
        <Link href="/company/vacancies/new">
          <Button variant="fb">
            <Plus className="mr-2 h-4 w-4" />
            Nueva Vacante
          </Button>
        </Link>
      </div>

      {error && (
        <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>
      )}

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Buscar vacantes..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
      </div>

      {filtered.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Inbox className="h-12 w-12 mx-auto mb-3 text-muted-foreground/50" />
            <p className="text-muted-foreground mb-4">
              {search
                ? "No se encontraron vacantes con esa búsqueda."
                : vacancies.length === 0
                  ? "Aún no has publicado vacantes. Crea tu primera vacante para que la IA comience a derivarte candidatos."
                  : "Sin resultados."}
            </p>
            {vacancies.length === 0 && (
              <Link href="/company/vacancies/new">
                <Button variant="fb">
                  <Plus className="mr-2 h-4 w-4" />
                  Crear primera vacante
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filtered.map((v) => {
            const st = STATUS_LABELS[v.status] || STATUS_LABELS.DRAFT
            return (
              <Card key={v.id} className="hover:shadow-md transition-all duration-200">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-lg">{v.title}</h3>
                        <Badge className={st.className}>{st.label}</Badge>
                        <Badge variant="outline" className="text-xs">{TYPE_LABELS[v.type] || v.type}</Badge>
                      </div>
                      <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {v.location}</span>
                        {v.salaryMin != null && v.salaryMax != null && (
                          <span>
                            ${v.salaryMin.toLocaleString()} - ${v.salaryMax.toLocaleString()} {v.salaryCurrency}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{v.description}</p>
                      {v.requirements.length > 0 && (
                        <div className="flex gap-2 mt-2 flex-wrap">
                          {v.requirements.slice(0, 4).map((req, i) => (
                            <Badge key={i} variant="outline" className="text-xs">{req}</Badge>
                          ))}
                          {v.requirements.length > 4 && (
                            <Badge variant="outline" className="text-xs">+{v.requirements.length - 4} más</Badge>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="flex lg:flex-col items-center lg:text-right gap-4 lg:gap-2 shrink-0">
                      <div className="text-center lg:w-20">
                        <div className="text-xl font-bold text-primary flex items-center gap-1 justify-center lg:justify-end">
                          <Users className="h-4 w-4" /> {v.candidates}
                        </div>
                        <div className="text-xs text-muted-foreground">Candidatos</div>
                      </div>
                      <div className="flex gap-1">
                        {v.status === "ACTIVE" && (
                          <Button variant="ghost" size="icon" title="Pausar" onClick={() => toggleStatus(v)}>
                            <Pause className="h-4 w-4" />
                          </Button>
                        )}
                        {v.status === "PAUSED" && (
                          <Button variant="ghost" size="icon" title="Activar" onClick={() => toggleStatus(v)}>
                            <Play className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
