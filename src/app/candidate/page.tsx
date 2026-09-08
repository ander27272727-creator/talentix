"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  Brain, Target, FileText, TrendingUp, ArrowRight, Clock,
  CheckCircle2, AlertCircle, Building2, Star, Sparkles,
  Users, Loader2
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useStore } from "@/store/useStore"

interface MatchData {
  id: string
  overallMatch: number
  recommendation: string
  vacancy: {
    title: string
    company: { name: string; logo?: string }
  }
}

interface AssessmentData {
  id: string
  name: string
  category: string
  completed: boolean
  score: number | null
  questionCount: number
}

interface ProfileData {
  user: { name: string; email: string }
  skills: string[]
  education: { institution: string; degree: string }[]
  experience: { company: string; position: string }[]
  location?: string
}

export default function CandidateDashboard() {
  const { user } = useStore()
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [matches, setMatches] = useState<MatchData[]>([])
  const [assessments, setAssessments] = useState<AssessmentData[]>([])
  const firstName = user?.name?.split(" ")[0] || "Candidato"

  useEffect(() => {
    if (!user?.id) return
    loadData()
  }, [user?.id])

  async function loadData() {
    setLoading(true)
    try {
      const [profileRes, matchesRes, assessmentsRes] = await Promise.all([
        fetch(`/api/candidate/profile?userId=${user!.id}`),
        fetch(`/api/candidate/matches?userId=${user!.id}`),
        fetch(`/api/candidate/assessments?userId=${user!.id}`),
      ])

      const profileData = await profileRes.json()
      const matchesData = await matchesRes.json()
      const assessmentsData = await assessmentsRes.json()

      if (profileData.success) setProfile(profileData.profile)
      if (matchesData.success) setMatches(matchesData.matches)
      if (assessmentsData.success) setAssessments(assessmentsData.assessments)
    } catch (err) {
      console.error("Error cargando datos:", err)
    } finally {
      setLoading(false)
    }
  }

  // Calcular completitud del perfil
  const profileFields = profile ? [
    profile.user?.name,
    profile.location,
    profile.skills?.length > 0,
    profile.education?.length > 0,
    profile.experience?.length > 0,
  ].filter(Boolean).length : 0
  const profileCompletion = Math.round((profileFields / 5) * 100)

  // Evaluaciones completadas
  const completedAssessments = assessments.filter(a => a.completed).length
  const totalAssessments = assessments.length
  const pendingAssessments = assessments.filter(a => !a.completed).slice(0, 3)

  // Stats
  const avgMatch = matches.length > 0
    ? Math.round(matches.reduce((sum, m) => sum + m.overallMatch, 0) / matches.length)
    : 0
  const highMatches = matches.filter(m => m.overallMatch >= 85).length

  const stats = [
    {
      label: "Match Promedio",
      value: `${avgMatch}%`,
      icon: Target,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Evaluaciones",
      value: `${completedAssessments}/${totalAssessments}`,
      icon: Brain,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      label: "Matches Altos",
      value: `${highMatches}`,
      icon: Sparkles,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      label: "Empresas Disponibles",
      value: `${matches.length}`,
      icon: Building2,
      color: "text-orange-600",
      bg: "bg-orange-50",
    },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

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
      {profile && profileCompletion < 100 && (
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
              </div>
              <div className="mt-3">
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Matches */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Tus Mejores Matches</span>
              <Link href="/candidate/matches" className="text-sm text-primary hover:underline">
                Ver todos
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {matches.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                Aún no tienes matches. Completa tus evaluaciones para obtener resultados.
              </p>
            ) : (
              matches.slice(0, 4).map((match) => (
                <div key={match.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="gradient-bg text-white text-sm">
                      {match.vacancy.company.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{match.vacancy.title}</p>
                    <p className="text-xs text-muted-foreground">{match.vacancy.company.name}</p>
                  </div>
                  <Badge variant={match.overallMatch >= 85 ? "success" : match.overallMatch >= 70 ? "info" : "secondary"}>
                    {Math.round(match.overallMatch)}%
                  </Badge>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Pending Assessments */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Evaluaciones Pendientes</span>
              <Link href="/candidate/assessments" className="text-sm text-primary hover:underline">
                Ver todas
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {pendingAssessments.length === 0 ? (
              <div className="text-center py-4">
                <CheckCircle2 className="h-12 w-12 text-emerald-500 mx-auto mb-2" />
                <p className="text-muted-foreground">¡Completaste todas las evaluaciones!</p>
              </div>
            ) : (
              pendingAssessments.map((assess) => (
                <div key={assess.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    assess.category === "COGNITIVE" ? "bg-blue-50" :
                    assess.category === "PSYCHOMETRIC" ? "bg-purple-50" :
                    assess.category === "BEHAVIORAL" ? "bg-emerald-50" : "bg-orange-50"
                  }`}>
                    <Brain className={`h-5 w-5 ${
                      assess.category === "COGNITIVE" ? "text-blue-600" :
                      assess.category === "PSYCHOMETRIC" ? "text-purple-600" :
                      assess.category === "BEHAVIORAL" ? "text-emerald-600" : "text-orange-600"
                    }`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{assess.name}</p>
                    <p className="text-xs text-muted-foreground">{assess.questionCount} preguntas</p>
                  </div>
                  <Link href={`/candidate/assessments/${assess.id}`}>
                    <Button size="sm" variant="fb-outline">Iniciar</Button>
                  </Link>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {/* AI Insight */}
      <Card className="bg-gradient-to-r from-fb-blue/5 to-fb-purple/5 border-fb-blue/20">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center shrink-0">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold mb-1">💡 Insight de IA</h3>
              <p className="text-sm text-muted-foreground">
                {matches.length > 0
                  ? `Tienes ${highMatches} matches de alta compatibilidad. Tus habilidades en ${profile?.skills?.slice(0, 3).join(", ") || "tu perfil"} están en alta demanda. Completar más evaluaciones mejorará la precisión de tus matches.`
                  : `Comienza completando tu perfil y evaluaciones para que nuestra IA pueda encontrar las mejores oportunidades para ti.`
                }
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
