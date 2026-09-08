"use client"

import Link from "next/link"
import {
  Users, Briefcase, Target, TrendingUp, ArrowRight, Clock,
  CheckCircle2, Building2, Star, Sparkles, BarChart3, Zap,
  ChevronRight, Plus, Eye, MessageSquare
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { useStore } from "@/store/useStore"

// Mock data
const stats = [
  {
    label: "Candidatos Derivados",
    value: "24",
    change: "+8 esta semana",
    icon: Users,
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    label: "Vacantes Activas",
    value: "5",
    change: "+2 nuevas",
    icon: Briefcase,
    color: "text-purple-600",
    bg: "bg-purple-50",
  },
  {
    label: "En Pipeline",
    value: "12",
    change: "+3 hoy",
    icon: Target,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  {
    label: "Contratados",
    value: "3",
    change: "este mes",
    icon: TrendingUp,
    color: "text-orange-600",
    bg: "bg-orange-50",
  },
]

const recentCandidates = [
  {
    id: "1",
    name: "María García",
    position: "Senior Developer",
    score: 95,
    status: "Altamente Recomendado",
    logo: "MG",
    assessedAt: "Hace 2 horas",
  },
  {
    id: "2",
    name: "Carlos Ruiz",
    position: "Product Manager",
    score: 88,
    status: "Recomendado",
    logo: "CR",
    assessedAt: "Hace 5 horas",
  },
  {
    id: "3",
    name: "Ana Martínez",
    position: "UX Designer",
    score: 82,
    status: "Recomendado",
    logo: "AM",
    assessedAt: "Ayer",
  },
  {
    id: "4",
    name: "Pedro López",
    position: "Data Analyst",
    score: 78,
    status: "Posible",
    logo: "PL",
    assessedAt: "Hace 2 días",
  },
]

const activeVacancies = [
  {
    id: "1",
    title: "Senior Full Stack Developer",
    applicants: 12,
    status: "ACTIVE",
    location: "Remoto",
    postedAt: "Hace 3 días",
  },
  {
    id: "2",
    title: "Product Manager",
    applicants: 8,
    status: "ACTIVE",
    location: "Híbrido - Madrid",
    postedAt: "Hace 1 semana",
  },
  {
    id: "3",
    title: "UX Designer",
    applicants: 15,
    status: "ACTIVE",
    location: "Remoto",
    postedAt: "Hace 2 semanas",
  },
]

export default function CompanyDashboard() {
  const { user } = useStore()
  const companyName = user?.name || "Tu Empresa"

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">
            Dashboard de <span className="gradient-text">{companyName}</span> 🏢
          </h1>
          <p className="text-muted-foreground mt-1">
            Gestiona tus vacantes y candidatos derivados.
          </p>
        </div>
        <Link href="/company/vacancies/new">
          <Button variant="fb">
            <Plus className="mr-2 h-4 w-4" />
            Nueva Vacante
          </Button>
        </Link>
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
        {/* Recent Candidates */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Candidatos Recientes
                </CardTitle>
                <CardDescription>
                  Últimos candidatos derivados a tu empresa
                </CardDescription>
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
            {recentCandidates.map((candidate) => (
              <div
                key={candidate.id}
                className="flex items-center gap-4 p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors cursor-pointer"
              >
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-gradient-to-br from-fb-blue to-fb-purple text-white font-bold">
                    {candidate.logo}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="font-medium">{candidate.name}</div>
                  <div className="text-sm text-muted-foreground">{candidate.position}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Evaluado {candidate.assessedAt}
                  </div>
                </div>
                <div className="text-right">
                  <Badge 
                    variant={candidate.score >= 90 ? "highly-recommended" : candidate.score >= 75 ? "recommended" : "possible"}
                    className="mb-1"
                  >
                    {candidate.score}%
                  </Badge>
                  <div className="text-xs text-muted-foreground">
                    {candidate.status}
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MessageSquare className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Active Vacancies */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-purple-600" />
              Vacantes Activas
            </CardTitle>
            <CardDescription>
              Tus vacantes publicadas actualmente
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {activeVacancies.map((vacancy) => (
              <div
                key={vacancy.id}
                className="p-4 rounded-xl border hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <Badge variant="success" className="text-xs">
                    Activa
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {vacancy.postedAt}
                  </span>
                </div>
                <h4 className="font-medium text-sm mb-1">{vacancy.title}</h4>
                <div className="text-xs text-muted-foreground mb-2">
                  📍 {vacancy.location}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    {vacancy.applicants} postulantes
                  </span>
                  <Button variant="ghost" size="sm" className="h-7 text-xs">
                    Ver
                    <ChevronRight className="ml-1 h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}

            <Link href="/company/vacancies">
              <Button variant="fb-outline" className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                Crear Nueva Vacante
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* AI Insights */}
      <Card className="border-2 border-fb-purple/20 bg-gradient-to-r from-fb-purple/5 to-fb-blue/5">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-fb-purple to-fb-blue flex items-center justify-center">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold flex items-center gap-2">
                Insights de IA
                <Badge variant="purple" className="text-xs">Nuevo</Badge>
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                El sistema ha identificado 5 candidatos con match &gt;85% para tu vacante de 
                "Senior Developer". Estos candidatos completaron evaluaciones técnicas y psicométricas 
                que alignan con tu perfil de empresa. Recomendamos contactar a los 3 primeros esta semana.
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

      {/* Quick Actions */}
      <div className="grid sm:grid-cols-3 gap-4">
        <Link href="/company/vacancies">
          <Card className="hover:shadow-md transition-all duration-200 hover:-translate-y-1 cursor-pointer h-full">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center mx-auto mb-3">
                <Briefcase className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-medium mb-1">Gestionar Vacantes</h3>
              <p className="text-xs text-muted-foreground">
                Crear, editar y pausar vacantes
              </p>
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
              <p className="text-xs text-muted-foreground">
                Evaluar perfiles derivados
              </p>
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
              <p className="text-xs text-muted-foreground">
                Seguimiento del proceso de hiring
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  )
}
