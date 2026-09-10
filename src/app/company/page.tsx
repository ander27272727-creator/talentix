"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import {
  Users, Briefcase, Target, TrendingUp, ChevronRight, Plus,
  Sparkles, BarChart3, Loader2, Building2
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useStore } from "@/store/useStore"
import { apiFetch } from "@/lib/api"

interface DashboardData {
  company: { id: string; name: string; plan: string; planExpiresAt: string | null }
  stats: { totalReferrals: number; activeVacancies: number; inPipeline: number; hired: number }
  recentCandidates: {
    id: string
    name: string
    vacancyTitle: string
    score: number
    status: string
    referredAt: string
  }[]
  activeVacancies: {
    id: string
    title: string
    location: string
    type: string
    applicants: number
    createdAt: string
  }[]
}

const STATUS_LABELS: Record<string, { label: string; variant: "success" | "info" | "secondary" | "warning" }> = {
  PENDING: { label: "Pendiente", variant: "secondary" },
  VIEWED: { label: "Visto", variant: "info" },
  CONTACTED: { label: "Contactado", variant: "info" },
  INTERVIEW: { label: "Entrevista", variant: "warning" },
  HIRED: { label: "Contratado", variant: "success" },
  REJECTED: { label: "Rechazado", variant: "secondary" },
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

export default function CompanyDashboard() {
  const { user } = useStore()
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<DashboardData | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user?.id) return
    fetch(`/api/company/dashboard?userId=${user.id}`)
      .then(r => r.json())
      .then(d => {
        if (d.success) setData(d)
        else setError(d.error || "Error al cargar datos")
      })
      .catch(() => setError("Error de conexión"))
      .finally(() => setLoading(false))
  }, [user?.id])

  if (loading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
  }

  if (error || !data) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Card>
          <CardContent className="py-12 text-center">
            <Building2 className="h-12 w-12 mx-auto mb-3 text-muted-foreground/50" />
            <p className="text-muted-foreground mb-4">{error || "No se encontró el perfil de tu empresa."}</p>
            <Link href="/company/profile">
              <Button variant="fb">Configurar mi empresa</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  const stats = [
    { label: "Candidatos Derivados", value: data.stats.totalReferrals, icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Vacantes Activas", value: data.stats.activeVacancies, icon: Briefcase, color: "text-purple-600", bg: "bg-purple-50" },
    { label: "En Pipeline", value: data.stats.inPipeline, icon: Target, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Contratados", value: data.stats.hired, icon: TrendingUp, color: "text-orange-600", bg: "bg-orange-50" },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">
            Dashboard de <span className="gradient-text">{data.company.name}</span> 🏢
          </h1>
          <p className="text-muted-foreground mt-1">Gestiona tus vacantes y candidatos derivados.</p>
        </div>
        <Link href="/company/vacancies/new">
          <Button variant="fb">
            <Plus className="mr-2 h-4 w-4" />
            Nueva Vacante
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <Card key={i} className="hover:shadow-md transition-all duration-200">
            <CardContent className="p-6">
              <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div className="mt-4">
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Candidatos derivados */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Candidatos Derivados
                </CardTitle>
                <CardDescription>Últimos candidatos que Talentix envió a tu empresa</CardDescription>
              </div>
              <Link href="/company/candidates">
                <Button variant="ghost" size="sm">
                  Ver todos
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.recentCandidates.length === 0 ? (
              <div className="text-center py-10">
                <Users className="h-10 w-10 mx-auto mb-3 text-muted-foreground/40" />
                <p className="text-muted-foreground mb-2">Aún no tienes candidatos derivados.</p>
                <p className="text-xs text-muted-foreground">
                  Publica vacantes y el sistema de IA te derivará candidatos compatibles automáticamente.
                </p>
              </div>
            ) : (
              data.recentCandidates.map((c) => {
                const st = STATUS_LABELS[c.status] || { label: c.status, variant: "secondary" as const }
                return (
                  <div key={c.id} className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 rounded-xl bg-muted/50">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-fb-blue to-fb-purple flex items-center justify-center text-white font-bold shrink-0">
                      {c.name.split(" ").map(n => n[0]).slice(0, 2).join("")}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{c.name}</div>
                      <div className="text-sm text-muted-foreground truncate">Postuló a: {c.vacancyTitle}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">Derivado {timeAgo(c.referredAt)}</div>
                    </div>
                    <div className="flex sm:flex-col items-center sm:text-right gap-2 sm:gap-1">
                      <Badge variant={c.score >= 85 ? "success" : c.score >= 70 ? "info" : "secondary"}>
                        {c.score}%
                      </Badge>
                      <span className="text-xs text-muted-foreground">{st.label}</span>
                    </div>
                  </div>
                )
              })
            )}
          </CardContent>
        </Card>

        {/* Vacantes activas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-purple-600" />
              Vacantes Activas
            </CardTitle>
            <CardDescription>Publicadas actualmente</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.activeVacancies.length === 0 ? (
              <div className="text-center py-8">
                <Briefcase className="h-10 w-10 mx-auto mb-3 text-muted-foreground/40" />
                <p className="text-muted-foreground text-sm mb-3">No tienes vacantes activas.</p>
                <Link href="/company/vacancies/new">
                  <Button variant="fb-outline" size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    Crear primera vacante
                  </Button>
                </Link>
              </div>
            ) : (
              <>
                {data.activeVacancies.map((v) => (
                  <div key={v.id} className="p-4 rounded-xl border">
                    <div className="flex items-start justify-between mb-2">
                      <Badge variant="success" className="text-xs">Activa</Badge>
                      <span className="text-xs text-muted-foreground">{timeAgo(v.createdAt)}</span>
                    </div>
                    <h4 className="font-medium text-sm mb-1">{v.title}</h4>
                    <div className="text-xs text-muted-foreground mb-2">
                      📍 {v.location} · {v.type === "REMOTE" ? "Remoto" : v.type === "HYBRID" ? "Híbrido" : "Presencial"}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">{v.applicants} candidato{v.applicants !== 1 ? "s" : ""}</span>
                      <Link href="/company/candidates">
                        <Button variant="ghost" size="sm" className="h-7 text-xs">
                          Ver
                          <ChevronRight className="ml-1 h-3 w-3" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
                <Link href="/company/vacancies">
                  <Button variant="fb-outline" className="w-full">
                    <Plus className="mr-2 h-4 w-4" />
                    Gestionar Vacantes
                  </Button>
                </Link>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Insights de IA (basados en datos reales) */}
      <Card className="border-2 border-fb-purple/20 bg-gradient-to-r from-fb-purple/5 to-fb-blue/5">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-fb-purple to-fb-blue flex items-center justify-center shrink-0">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold flex items-center gap-2">Insights de IA</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {data.stats.activeVacancies === 0
                  ? "Publica tu primera vacante para que nuestro motor de IA comience a evaluar y derivar candidatos compatibles con tu empresa."
                  : data.stats.totalReferrals === 0
                    ? `Tienes ${data.stats.activeVacancies} vacante${data.stats.activeVacancies !== 1 ? "s" : ""} activa${data.stats.activeVacancies !== 1 ? "s" : ""}. A medida que los candidatos completen sus evaluaciones, recibirás automáticamente los perfiles más compatibles.`
                    : `Has recibido ${data.stats.totalReferrals} candidato${data.stats.totalReferrals !== 1 ? "s" : ""} derivado${data.stats.totalReferrals !== 1 ? "s" : ""}. ${data.stats.inPipeline > 0 ? `${data.stats.inPipeline} en proceso de revisión. ` : ""}Completa evaluaciones a tus candidatos para acelerar el proceso de contratación.`}
              </p>
              <div className="flex gap-2 mt-4">
                <Link href="/company/candidates">
                  <Button variant="fb" size="sm">
                    <Users className="mr-2 h-4 w-4" />
                    Ver Candidatos
                  </Button>
                </Link>
                <Link href="/company/analytics">
                  <Button variant="fb-outline" size="sm">
                    <BarChart3 className="mr-2 h-4 w-4" />
                    Ver Analytics
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Acciones rápidas */}
      <div className="grid sm:grid-cols-3 gap-4">
        <Link href="/company/vacancies">
          <Card className="hover:shadow-md transition-all duration-200 hover:-translate-y-1 cursor-pointer h-full">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center mx-auto mb-3">
                <Briefcase className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-medium mb-1">Gestionar Vacantes</h3>
              <p className="text-xs text-muted-foreground">Crear, editar y pausar vacantes</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/company/candidates">
          <Card className="hover:shadow-md transition-all duration-200 hover:-translate-y-1 cursor-pointer h-full">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center mx-auto mb-3">
                <Users className="h-6 w-6 text-emerald-600" />
              </div>
              <h3 className="font-medium mb-1">Revisar Candidatos</h3>
              <p className="text-xs text-muted-foreground">Evaluar perfiles derivados</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/company/pipeline">
          <Card className="hover:shadow-md transition-all duration-200 hover:-translate-y-1 cursor-pointer h-full">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center mx-auto mb-3">
                <Target className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-medium mb-1">Ver Pipeline</h3>
              <p className="text-xs text-muted-foreground">Seguimiento del proceso de contratación</p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  )
}
