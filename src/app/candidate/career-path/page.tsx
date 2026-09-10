"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { BarChart3, TrendingUp, Target, Sparkles, Brain, Loader2, CheckCircle2, Circle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { useStore } from "@/store/useStore"

interface ProfileData {
  skills: string[]
  education: { degree: string; field: string }[]
  experience: { position: string; company: string; startDate: string; endDate: string | null; current: boolean }[]
}

interface AssessmentData {
  id: string
  name: string
  category: string
  completed: boolean
  score: number | null
}

interface CareerStep {
  role: string
  timeline: string
  fit: number
  skills: string[]
  description: string
}

// Rutas profesionales por categoría de skill dominante
const CAREER_PATHS: Record<string, { roles: CareerStep[] }> = {
  technology: {
    roles: [
      { role: "Senior Developer", timeline: "6-18 meses", fit: 90, skills: ["Arquitectura de software", "Code review", "CI/CD"], description: "Consolida tu experiencia técnica construyendo sistemas completos y guiando a desarrolladores juniors." },
      { role: "Tech Lead", timeline: "1-2 años", fit: 75, skills: ["Liderazgo de equipo", "Decisiones técnicas", "Mentoría"], description: "Lidera técnicamente un equipo, define estándares de código y participa en decisiones de arquitectura." },
      { role: "Engineering Manager", timeline: "2-4 años", fit: 60, skills: ["Gestión de personas", "Planificación", "Contratación"], description: "Transición a gestión: lideras personas y procesos, no solo código." },
    ],
  },
  sales: {
    roles: [
      { role: "Ejecutivo Senior de Ventas", timeline: "6-12 meses", fit: 90, skills: ["Negociación avanzada", "Cuentas clave", "Forecasting"], description: "Maneja cuentas más grandes y complejas con ciclos de venta más largos." },
      { role: "Gerente de Ventas", timeline: "1-2 años", fit: 70, skills: ["Liderazgo de equipo", "Estrategia comercial", "Coaching"], description: "Lidera y motiva un equipo de vendedores hacia sus cuotas." },
      { role: "Director Comercial", timeline: "3-5 años", fit: 55, skills: ["Visión de negocio", "Go-to-market", "P&L"], description: "Define la estrategia comercial completa de la empresa." },
    ],
  },
  marketing: {
    roles: [
      { role: "Especialista de Marketing", timeline: "6-12 meses", fit: 90, skills: ["Analytics", "SEO/SEM", "Email marketing"], description: "Profundiza en canales específicos y mide el impacto de cada campaña." },
      { role: "Jefe de Marketing", timeline: "1-2 años", fit: 70, skills: ["Estrategia de marca", "Gestión de presupuesto", "Liderazgo"], description: "Dirige la estrategia y al equipo que la ejecuta." },
      { role: "Director de Marketing", timeline: "3-5 años", fit: 55, skills: ["Visión de mercado", "Growth", "P&L"], description: "Define cómo la marca compite y crece en el mercado." },
    ],
  },
  finance: {
    roles: [
      { role: "Analista Senior", timeline: "6-18 meses", fit: 90, skills: ["Modelos financieros", "Reporting", "Excel avanzado"], description: "Toma ownership del análisis financiero y reporting a gerencia." },
      { role: "Jefe de Finanzas", timeline: "2-3 años", fit: 70, skills: ["Presupuestos", "Tesorería", "Liderazgo"], description: "Administra las finanzas operativas del negocio." },
      { role: "CFO", timeline: "4-6 años", fit: 50, skills: ["Estrategia financiera", "Funding", "Gobernanza"], description: "Lidera la estrategia financiera global de la compañía." },
    ],
  },
  general: {
    roles: [
      { role: "Analista / Especialista", timeline: "6-12 meses", fit: 90, skills: ["Dominio técnico del área", "Comunicación", "Análisis"], description: "Conviértete en la referencia de tu área actual." },
      { role: "Coordinador / Supervisor", timeline: "1-2 años", fit: 70, skills: ["Liderazgo", "Gestión de proyectos", "Procesos"], description: "Coordina procesos y personas dentro de tu área." },
      { role: "Gerente", timeline: "3-5 años", fit: 55, skills: ["Estrategia", "Presupuesto", "Gestión de equipos"], description: "Lidera un área completa con objetivos de negocio." },
    ],
  },
}

function detectCategory(skills: string[], experience: { position: string }[]): string {
  const text = [...skills, ...experience.map(e => e.position)].join(" ").toLowerCase()
  if (/dev|software|program|javascript|python|java|react|node|sql|frontend|backend|full.?stack|data|qa|devops/.test(text)) return "technology"
  if (/sales|venta|comercial|business|account/.test(text)) return "sales"
  if (/marketing|publicidad|brand|seo|community|contenido/.test(text)) return "marketing"
  if (/finanz|contab|financ|contador|auditor|tesor/.test(text)) return "finance"
  return "general"
}

export default function CareerPathPage() {
  const { user } = useStore()
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [assessments, setAssessments] = useState<AssessmentData[]>([])

  useEffect(() => {
    if (!user?.id) return
    Promise.all([
      fetch(`/api/candidate/profile?userId=${user!.id}`).then(r => r.json()),
      fetch(`/api/candidate/assessments?userId=${user!.id}`).then(r => r.json()),
    ]).then(([profileData, assessmentsData]) => {
      if (profileData.success) setProfile(profileData.profile)
      if (assessmentsData.success) setAssessments(assessmentsData.assessments)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [user?.id])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  const skills = profile?.skills || []
  const completedAssessments = assessments.filter(a => a.completed)
  const avgScore = completedAssessments.length > 0
    ? Math.round(completedAssessments.reduce((s, a) => s + (a.score || 0), 0) / completedAssessments.length)
    : 0
  const yearsExp = (profile?.experience?.length ?? 0) > 0
    ? profile!.experience.reduce((total, exp) => {
        const start = new Date(exp.startDate).getTime()
        const end = exp.current || !exp.endDate ? Date.now() : new Date(exp.endDate).getTime()
        return total + Math.max(0, (end - start) / (1000 * 60 * 60 * 24 * 365))
      }, 0)
    : 0

  const hasEnoughData = skills.length > 0 || yearsExp > 0

  // Sin datos: estado vacío constructivo
  if (!hasEnoughData) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <BarChart3 className="h-8 w-8 text-primary" />
            Career Path
          </h1>
          <p className="text-muted-foreground mt-1">Tu camino profesional recomendado por nuestra IA.</p>
        </div>

        <Card className="border-2 border-fb-purple/20 bg-gradient-to-r from-fb-purple/5 to-fb-blue/5">
          <CardContent className="py-12 text-center">
            <Sparkles className="h-12 w-12 mx-auto mb-4 text-primary/60" />
            <h3 className="font-semibold text-lg mb-2">Tu ruta profesional se construye con tu perfil</h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto mb-6">
              Agrega tus habilidades, experiencia y completa al menos una evaluación para que la IA
              pueda recomendarte el mejor camino profesional según tu perfil real.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/candidate/profile">
                <Button variant="fb">Completar mi perfil</Button>
              </Link>
              <Link href="/candidate/assessments">
                <Button variant="fb-outline">Hacer evaluaciones</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Generar ruta según el perfil real
  const category = detectCategory(skills, profile?.experience || [])
  const baseRoles = CAREER_PATHS[category].roles

  // Ajustar fit según datos reales: evaluaciones suben el fit, perfil incompleto lo baja
  const dataBonus = Math.min(15, completedAssessments.length * 4) + Math.min(10, Math.floor(yearsExp) * 2)
  const steps: CareerStep[] = baseRoles.map((r, i) => ({
    ...r,
    fit: Math.min(97, r.fit - 15 + dataBonus + (i === 0 && avgScore >= 70 ? 8 : 0)),
  }))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <BarChart3 className="h-8 w-8 text-primary" />
          Career Path
        </h1>
        <p className="text-muted-foreground mt-1">Tu camino profesional recomendado según tu perfil real.</p>
      </div>

      {/* Resumen que fundamenta la recomendación */}
      <Card className="border-2 border-fb-purple/20 bg-gradient-to-r from-fb-purple/5 to-fb-blue/5">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl gradient-bg flex items-center justify-center shrink-0">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold mb-1">Análisis de IA sobre tu perfil</h3>
              <p className="text-sm text-muted-foreground">
                Detectamos un perfil de <strong>{category === "general" ? "negocios general" : category}</strong> con{" "}
                <strong>{yearsExp >= 1 ? `${Math.floor(yearsExp)} año${Math.floor(yearsExp) !== 1 ? "s" : ""} de experiencia` : "experiencia inicial"}</strong>,{" "}
                <strong>{skills.length} habilidades</strong> y{" "}
                <strong>{completedAssessments.length}/{assessments.length} evaluaciones completadas</strong>
                {avgScore > 0 && <> con score promedio de <strong>{avgScore}%</strong></>}.
                {completedAssessments.length < 2 && " Completa más evaluaciones para afinar esta proyección."}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Métricas reales */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Años de experiencia", value: yearsExp >= 1 ? Math.floor(yearsExp).toString() : "< 1", icon: TrendingUp },
          { label: "Habilidades", value: skills.length.toString(), icon: Target },
          { label: "Evaluaciones", value: `${completedAssessments.length}/${assessments.length}`, icon: Brain },
          { label: "Score promedio", value: avgScore ? `${avgScore}%` : "—", icon: Sparkles },
        ].map((m, i) => (
          <Card key={i}>
            <CardContent className="p-5">
              <m.icon className="h-5 w-5 text-primary mb-2" />
              <div className="text-2xl font-bold">{m.value}</div>
              <div className="text-xs text-muted-foreground">{m.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Ruta profesional */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Tu ruta recomendada</h2>
        {steps.map((step, i) => (
          <Card key={i} className="hover:shadow-md transition-all duration-200">
            <CardContent className="p-6 flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-fb-blue to-fb-purple flex items-center justify-center text-white font-bold shrink-0">
                {i + 1}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-semibold">{step.role}</h3>
                  <Badge variant="info">{step.timeline}</Badge>
                  {i === 0 && <Badge variant="success">Próximo paso</Badge>}
                </div>
                <p className="text-sm text-muted-foreground mt-1">{step.description}</p>
                <div className="flex gap-2 mt-2 flex-wrap">
                  {step.skills.map((s, j) => (
                    <Badge key={j} variant="outline" className="text-xs">{s}</Badge>
                  ))}
                </div>
              </div>
              <div className="text-right shrink-0 sm:w-24">
                <div className="text-2xl font-bold gradient-text">{step.fit}%</div>
                <div className="text-xs text-muted-foreground mb-1">Preparación</div>
                <Progress value={step.fit} className="h-1.5" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Qué te acerca a tu próximo paso */}
      <Card>
        <CardHeader>
          <CardTitle>Checklist para tu próximo paso: {steps[0].role}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            { done: skills.length >= 5, label: `Lista al menos 5 habilidades (tienes ${skills.length})` },
            { done: completedAssessments.length >= 2, label: `Completa 2+ evaluaciones (tienes ${completedAssessments.length})` },
            { done: avgScore >= 70, label: `Alcanza score promedio de 70% (tienes ${avgScore || 0}%)` },
            { done: yearsExp >= 1, label: `Acumula 1+ año de experiencia registrada` },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              {item.done ? (
                <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
              ) : (
                <Circle className="h-5 w-5 text-muted-foreground/40 shrink-0" />
              )}
              <span className={`text-sm ${item.done ? "text-foreground" : "text-muted-foreground"}`}>{item.label}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
