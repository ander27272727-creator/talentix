"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Brain, Target, FileText, TrendingUp, ArrowRight, Clock,
  CheckCircle2, AlertCircle, Building2, Star, Sparkles,
  BarChart3, Users, Zap, ChevronRight
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { useStore } from "@/store/useStore"

// Mock data
const profileCompletion = 65

const recentMatches = [
  {
    id: "1",
    company: "TechCorp Solutions",
    position: "Senior Developer",
    score: 95,
    recommendation: "highly_recommended",
    logo: "TC",
  },
  {
    id: "2",
    company: "InnovateLab",
    position: "Full Stack Engineer",
    score: 88,
    recommendation: "recommended",
    logo: "IL",
  },
  {
    id: "3",
    company: "DataPro",
    position: "Backend Developer",
    score: 82,
    recommendation: "recommended",
    logo: "DP",
  },
]

const pendingAssessments = [
  {
    id: "1",
    name: "Evaluación Cognitiva - Razonamiento Lógico",
    category: "COGNITIVE",
    timeLimit: 15,
    questions: 20,
  },
  {
    id: "2",
    name: "Perfil de Personalidad - Big Five",
    category: "PSYCHOMETRIC",
    timeLimit: 12,
    questions: 30,
  },
]

const stats = [
  {
    label: "Match Promedio",
    value: "88%",
    change: "+5%",
    icon: Target,
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    label: "Evaluaciones Completadas",
    value: "4/7",
    change: "+2",
    icon: Brain,
    color: "text-purple-600",
    bg: "bg-purple-50",
  },
  {
    label: "Empresas Interesadas",
    value: "3",
    change: "+1",
    icon: Building2,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  {
    label: "Visitas al Perfil",
    value: "24",
    change: "+8",
    icon: Users,
    color: "text-orange-600",
    bg: "bg-orange-50",
  },
]

export default function CandidateDashboard() {
  const { user } = useStore()
  const firstName = user?.name?.split(" ")[0] || "Candidato"

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">
            Hola, <span className="gradient-text">{firstName}</span> 👋
          </h1>
          <p className="text-muted-foreground mt-1">
            Bienvenido a tu dashboard de reclutamiento inteligente.
          </p>
        </div>
        <Link href="/candidate/assessments">
          <Button variant="fb">
            <Brain className="mr-2 h-4 w-4" />
            Continuar Evaluaciones
          </Button>
        </Link>
      </div>

      {/* Profile Completion Banner */}
      {profileCompletion < 100 && (
        <Card className="border-2 border-fb-blue/20 bg-gradient-to-r from-fb-blue/5 to-fb-purple/5">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl gradient-bg flex items-center justify-center">
                  <AlertCircle className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold">Completa tu Perfil</h3>
                  <p className="text-sm text-muted-foreground">
                    Un perfil completo aumenta tus posibilidades de match en un 40%.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary">{profileCompletion}%</div>
                  <div className="text-xs text-muted-foreground">completado</div>
                </div>
                <Link href="/candidate/profile">
                  <Button variant="fb-outline">
                    Completar
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
            <Progress value={profileCompletion} className="mt-4" />
          </CardContent>
        </Card>
      )}

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
        {/* Top Matches */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  Top Matches
                </CardTitle>
                <CardDescription>
                  Empresas donde más encajas según tu perfil
                </CardDescription>
              </div>
              <Link href="/candidate/matches">
                <Button variant="ghost" size="sm">
                  Ver todos
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentMatches.map((match) => (
              <div
                key={match.id}
                className="flex items-center gap-4 p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors cursor-pointer"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-fb-blue to-fb-purple flex items-center justify-center text-white font-bold">
                  {match.logo}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium">{match.company}</div>
                  <div className="text-sm text-muted-foreground">{match.position}</div>
                </div>
                <div className="text-right">
                  <Badge 
                    variant={match.recommendation === "highly_recommended" ? "highly-recommended" : "recommended"}
                    className="mb-1"
                  >
                    {match.score}%
                  </Badge>
                  <div className="text-xs text-muted-foreground">
                    {match.recommendation === "highly_recommended" ? "Altamente Recomendado" : "Recomendado"}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Pending Assessments */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-purple-600" />
              Evaluaciones Pendientes
            </CardTitle>
            <CardDescription>
              Completa estas evaluaciones para mejorar tus matches
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {pendingAssessments.map((assessment) => (
              <div
                key={assessment.id}
                className="p-4 rounded-xl border hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <Badge variant={assessment.category === "COGNITIVE" ? "info" : "purple"} className="text-xs">
                    {assessment.category === "COGNITIVE" ? "Cognitiva" : "Psicométrica"}
                  </Badge>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {assessment.timeLimit} min
                  </div>
                </div>
                <h4 className="font-medium text-sm mb-1">{assessment.name}</h4>
                <p className="text-xs text-muted-foreground mb-3">
                  {assessment.questions} preguntas
                </p>
                <Button variant="fb-outline" size="sm" className="w-full">
                  Comenzar
                  <ArrowRight className="ml-2 h-3 w-3" />
                </Button>
              </div>
            ))}

            <Link href="/candidate/assessments">
              <Button variant="ghost" className="w-full">
                Ver Todas las Evaluaciones
                <ChevronRight className="ml-2 h-4 w-4" />
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
                Insight de IA
                <Badge variant="purple" className="text-xs">Nuevo</Badge>
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                Basado en tus evaluaciones y el mercado actual, tu perfil es altamente demandado 
                en empresas de tecnología remote-first. Las empresas con mejor fit para ti están 
                buscando activamente tu perfil. Considera completar la evaluación de liderazgo 
                para desbloquear匹配 más directivos.
              </p>
              <div className="flex gap-2 mt-4">
                <Link href="/candidate/career-path">
                  <Button variant="fb" size="sm">
                    <BarChart3 className="mr-2 h-4 w-4" />
                    Ver Career Path
                  </Button>
                </Link>
                <Link href="/candidate/assessments">
                  <Button variant="fb-outline" size="sm">
                    <Brain className="mr-2 h-4 w-4" />
                    Completar Evaluaciones
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid sm:grid-cols-3 gap-4">
        <Link href="/candidate/profile">
          <Card className="hover:shadow-md transition-all duration-200 hover:-translate-y-1 cursor-pointer h-full">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center mx-auto mb-3">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-medium mb-1">Actualizar CV</h3>
              <p className="text-xs text-muted-foreground">
                Mantén tu perfil actualizado para mejores matches
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/candidate/vacancies">
          <Card className="hover:shadow-md transition-all duration-200 hover:-translate-y-1 cursor-pointer h-full">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center mx-auto mb-3">
                <Zap className="h-6 w-6 text-emerald-600" />
              </div>
              <h3 className="font-medium mb-1">Explorar Vacantes</h3>
              <p className="text-xs text-muted-foreground">
                Descubre oportunidades que coinciden con tu perfil
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/candidate/career-path">
          <Card className="hover:shadow-md transition-all duration-200 hover:-translate-y-1 cursor-pointer h-full">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-medium mb-1">Career Path</h3>
              <p className="text-xs text-muted-foreground">
                Descubre tu mejor camino profesional
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  )
}
