"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import {
  Users, Building2, Briefcase, Brain, Target,
  Sparkles, BarChart3, ChevronRight, Plus, Eye, Zap, Loader2, Inbox
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useStore } from "@/store/useStore"
import { apiFetch } from "@/lib/api"

interface AdminStats {
  stats: {
    companies: number
    candidates: number
    activeVacancies: number
    matches: number
    referrals: number
    hired: number
    successRate: number
    completedAssessments: number
    totalAnswers: number
  }
  recentReferrals: {
    id: string
    candidate: string
    company: string
    vacancy: string
    score: number
    status: string
    referredAt: string
  }[]
}

const STATUS_LABELS: Record<string, string> = {
  PENDING: "Pendiente",
  VIEWED: "Visto",
  CONTACTED: "Contactado",
  INTERVIEW: "Entrevista",
  HIRED: "Contratado",
  REJECTED: "Rechazado",
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

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<AdminStats | null>(null)

  useEffect(() => {
    apiFetch("/api/admin/stats")
      .then(r => r.json())
      .then(d => { if (d.success) setData(d) })
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
  }

  const s = data?.stats
  const stats = [
    { label: "Empresas Registradas", value: s?.companies ?? 0, icon: Building2, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Candidatos Registrados", value: s?.candidates ?? 0, icon: Users, color: "text-purple-600", bg: "bg-purple-50" },
    { label: "Vacantes Activas", value: s?.activeVacancies ?? 0, icon: Briefcase, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Matches Generados", value: s?.matches ?? 0, icon: Target, color: "text-orange-600", bg: "bg-orange-50" },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">
            Panel de <span className="gradient-text">Administración</span> 🛡️
          </h1>
          <p className="text-muted-foreground mt-1">
            Vista general de la plataforma Talentix.
          </p>
        </div>
        <Link href="/admin/companies/new">
          <Button variant="fb">
            <Plus className="mr-2 h-4 w-4" />
            Nueva Empresa
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
                <div className="text-2xl font-bold">{stat.value.toLocaleString("es")}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Derivaciones recientes */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-primary" />
                  Derivaciones Recientes
                </CardTitle>
                <CardDescription>
                  Últimas derivaciones de candidatos a empresas
                </CardDescription>
              </div>
              <Link href="/admin/referrals">
                <Button variant="ghost" size="sm">
                  Ver todas
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {!data || data.recentReferrals.length === 0 ? (
              <div className="text-center py-10">
                <Inbox className="h-10 w-10 mx-auto mb-3 text-muted-foreground/40" />
                <p className="text-muted-foreground">Aún no hay derivaciones registradas en la plataforma.</p>
              </div>
            ) : (
              data.recentReferrals.map((referral) => (
                <div
                  key={referral.id}
                  className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 rounded-xl bg-muted/50"
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-fb-blue to-fb-purple flex items-center justify-center text-white font-bold text-sm shrink-0">
                    {referral.candidate.split(" ").map(n => n[0]).slice(0, 2).join("")}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm">{referral.candidate}</div>
                    <div className="text-xs text-muted-foreground truncate">
                      → {referral.company} · {referral.vacancy}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {timeAgo(referral.referredAt)}
                    </div>
                  </div>
                  <div className="flex sm:flex-col items-center sm:text-right gap-2 sm:gap-1">
                    <Badge
                      variant={
                        referral.score >= 90 ? "success" :
                        referral.score >= 75 ? "info" : "secondary"
                      }
                    >
                      {referral.score}%
                    </Badge>
                    <div className="text-xs text-muted-foreground">
                      {STATUS_LABELS[referral.status] || referral.status}
                    </div>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Salud de la plataforma (métricas reales) */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-emerald-600" />
              Actividad Real
            </CardTitle>
            <CardDescription>Datos registrados en la base</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm">Tasa de Contratación</span>
                <span className="text-sm font-medium text-emerald-600">{s?.successRate ?? 0}%</span>
              </div>
              <p className="text-xs text-muted-foreground">
                {s?.hired ?? 0} contratado{s?.hired !== 1 ? "s" : ""} de {s?.referrals ?? 0} derivacion{s?.referrals !== 1 ? "es" : ""}
              </p>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm">Evaluaciones Completadas</span>
                <span className="text-sm font-medium text-blue-600">{s?.completedAssessments ?? 0}</span>
              </div>
              <p className="text-xs text-muted-foreground">{s?.totalAnswers ?? 0} respuestas registradas</p>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm">Matches con IA</span>
                <span className="text-sm font-medium text-purple-600">{s?.matches ?? 0}</span>
              </div>
              <p className="text-xs text-muted-foreground">Generados automáticamente por el motor</p>
            </div>
            <div className="pt-3 border-t">
              <p className="text-xs text-muted-foreground">
                💡 Las métricas crecen con el uso real de la plataforma. Conecta más empresas y candidatos para ver tendencias.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Estado del sistema de IA (basado en datos reales) */}
      <Card className="border-2 border-fb-purple/20 bg-gradient-to-r from-fb-purple/5 to-fb-blue/5">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-fb-purple to-fb-blue flex items-center justify-center shrink-0">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold flex items-center gap-2">
                Estado del Sistema de IA
                <Badge variant="success" className="text-xs">Activo</Badge>
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                {(s?.totalAnswers ?? 0) > 0
                  ? `El motor ha procesado ${s!.totalAnswers.toLocaleString("es")} respuestas de evaluación y generado ${s!.matches.toLocaleString("es")} matches bidireccionales. Cada contratación y rechazo afina el algoritmo.`
                  : "El motor de IA está listo. Comenzará a aprender cuando los candidatos completen evaluaciones y las empresas den feedback de contratación."}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                <div className="text-center p-3 rounded-lg bg-white/50">
                  <div className="text-lg font-bold text-purple-600">{s?.totalAnswers ?? 0}</div>
                  <div className="text-xs text-muted-foreground">Respuestas procesadas</div>
                </div>
                <div className="text-center p-3 rounded-lg bg-white/50">
                  <div className="text-lg font-bold text-blue-600">{s?.matches ?? 0}</div>
                  <div className="text-xs text-muted-foreground">Matches generados</div>
                </div>
                <div className="text-center p-3 rounded-lg bg-white/50">
                  <div className="text-lg font-bold text-emerald-600">{s?.hired ?? 0}</div>
                  <div className="text-xs text-muted-foreground">Contrataciones</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Acciones rápidas */}
      <div className="grid sm:grid-cols-4 gap-4">
        <Link href="/admin/companies">
          <Card className="hover:shadow-md transition-all duration-200 hover:-translate-y-1 cursor-pointer h-full">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center mx-auto mb-3">
                <Building2 className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-medium mb-1">Gestionar Empresas</h3>
              <p className="text-xs text-muted-foreground">Registrar y administrar empresas</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/admin/assessments">
          <Card className="hover:shadow-md transition-all duration-200 hover:-translate-y-1 cursor-pointer h-full">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center mx-auto mb-3">
                <Brain className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-medium mb-1">Evaluaciones</h3>
              <p className="text-xs text-muted-foreground">Crear y administrar evaluaciones</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/admin/matching">
          <Card className="hover:shadow-md transition-all duration-200 hover:-translate-y-1 cursor-pointer h-full">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center mx-auto mb-3">
                <Target className="h-6 w-6 text-emerald-600" />
              </div>
              <h3 className="font-medium mb-1">Matching IA</h3>
              <p className="text-xs text-muted-foreground">Supervisar matching automático</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/admin/referrals">
          <Card className="hover:shadow-md transition-all duration-200 hover:-translate-y-1 cursor-pointer h-full">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center mx-auto mb-3">
                <Zap className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="font-medium mb-1">Derivaciones</h3>
              <p className="text-xs text-muted-foreground">Enviar candidatos a empresas</p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  )
}
