"use client"

import Link from "next/link"
import {
  Users, Building2, Briefcase, Brain, TrendingUp, ArrowRight,
  Clock, CheckCircle2, Star, Sparkles, BarChart3, Zap,
  ChevronRight, Plus, Eye, AlertTriangle, Target
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"

// Mock data
const stats = [
  {
    label: "Empresas Activas",
    value: "156",
    change: "+23 este mes",
    icon: Building2,
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    label: "Candidatos Registrados",
    value: "2,847",
    change: "+342 este mes",
    icon: Users,
    color: "text-purple-600",
    bg: "bg-purple-50",
  },
  {
    label: "Vacantes Activas",
    value: "89",
    change: "+12 esta semana",
    icon: Briefcase,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  {
    label: "Matches Exitosos",
    value: "342",
    change: "+45 este mes",
    icon: Target,
    color: "text-orange-600",
    bg: "bg-orange-50",
  },
]

const recentReferrals = [
  {
    id: "1",
    candidate: "María García",
    company: "TechCorp Solutions",
    vacancy: "Senior Developer",
    score: 95,
    status: "PENDING",
    referredAt: "Hace 2 horas",
  },
  {
    id: "2",
    candidate: "Carlos Ruiz",
    company: "InnovateLab",
    vacancy: "Product Manager",
    score: 88,
    status: "VIEWED",
    referredAt: "Hace 5 horas",
  },
  {
    id: "3",
    candidate: "Ana Martínez",
    company: "DataPro",
    vacancy: "UX Designer",
    score: 82,
    status: "CONTACTED",
    referredAt: "Ayer",
  },
  {
    id: "4",
    candidate: "Pedro López",
    company: "StartupXYZ",
    vacancy: "Data Analyst",
    score: 78,
    status: "INTERVIEW",
    referredAt: "Hace 2 días",
  },
]

const platformHealth = [
  {
    label: "Tasa de Match Exitoso",
    value: 78,
    target: 85,
    color: "text-emerald-600",
  },
  {
    label: "Satisfacción de Empresas",
    value: 92,
    target: 90,
    color: "text-blue-600",
  },
  {
    label: "Retención de Candidatos",
    value: 85,
    target: 80,
    color: "text-purple-600",
  },
  {
    label: "Tiempo Promedio de Contratación",
    value: 68,
    target: 75,
    color: "text-orange-600",
  },
]

export default function AdminDashboard() {
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
        <div className="flex items-center gap-2">
          <Link href="/admin/companies/new">
            <Button variant="fb">
              <Plus className="mr-2 h-4 w-4" />
              Nueva Empresa
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <Card key={i} className="hover:shadow-md transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <Badge variant="success" className="text-xs">
                  {stat.change}
                </Badge>
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
        {/* Recent Referrals */}
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
            {recentReferrals.map((referral) => (
              <div
                key={referral.id}
                className="flex items-center gap-4 p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors cursor-pointer"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-fb-blue to-fb-purple flex items-center justify-center text-white font-bold text-sm">
                  {referral.candidate.split(" ").map(n => n[0]).join("")}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm">{referral.candidate}</div>
                  <div className="text-xs text-muted-foreground">
                    → {referral.company} · {referral.vacancy}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {referral.referredAt}
                  </div>
                </div>
                <div className="text-right">
                  <Badge 
                    variant={
                      referral.score >= 90 ? "highly-recommended" :
                      referral.score >= 75 ? "recommended" : "possible"
                    }
                    className="mb-1"
                  >
                    {referral.score}%
                  </Badge>
                  <div className="text-xs text-muted-foreground">
                    {referral.status}
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Eye className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Platform Health */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-emerald-600" />
              Salud de la Plataforma
            </CardTitle>
            <CardDescription>
              Métricas clave de rendimiento
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {platformHealth.map((metric, i) => (
              <div key={i}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm">{metric.label}</span>
                  <span className={`text-sm font-medium ${metric.color}`}>
                    {metric.value}%
                  </span>
                </div>
                <div className="relative">
                  <Progress value={metric.value} className="h-2" />
                  <div 
                    className="absolute top-0 left-0 h-2 w-0.5 bg-foreground/50"
                    style={{ left: `${metric.target}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>Actual: {metric.value}%</span>
                  <span>Meta: {metric.target}%</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* AI Learning Status */}
      <Card className="border-2 border-fb-purple/20 bg-gradient-to-r from-fb-purple/5 to-fb-blue/5">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-fb-purple to-fb-blue flex items-center justify-center">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold flex items-center gap-2">
                Estado del Sistema de IA
                <Badge variant="success" className="text-xs">Activo</Badge>
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                El algoritmo de matching ha procesado 1,247 interacciones este mes. 
                Precisión actual: 89.2% (+2.3% vs mes anterior). 
                El sistema está aprendiendo de 342 feedbacks de contratación/rechazo.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                <div className="text-center p-3 rounded-lg bg-white/50">
                  <div className="text-lg font-bold text-purple-600">89.2%</div>
                  <div className="text-xs text-muted-foreground">Precisión</div>
                </div>
                <div className="text-center p-3 rounded-lg bg-white/50">
                  <div className="text-lg font-bold text-blue-600">1,247</div>
                  <div className="text-xs text-muted-foreground">Interacciones</div>
                </div>
                <div className="text-center p-3 rounded-lg bg-white/50">
                  <div className="text-lg font-bold text-emerald-600">342</div>
                  <div className="text-xs text-muted-foreground">Feedbacks</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid sm:grid-cols-4 gap-4">
        <Link href="/admin/companies">
          <Card className="hover:shadow-md transition-all duration-200 hover:-translate-y-1 cursor-pointer h-full">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center mx-auto mb-3">
                <Building2 className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-medium mb-1">Gestionar Empresas</h3>
              <p className="text-xs text-muted-foreground">
                Registrar y administrar empresas
              </p>
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
              <p className="text-xs text-muted-foreground">
                Crear y administrar evaluaciones
              </p>
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
              <p className="text-xs text-muted-foreground">
                Supervisar matching automático
              </p>
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
              <p className="text-xs text-muted-foreground">
                Enviar candidatos a empresas
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  )
}
