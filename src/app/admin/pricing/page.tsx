"use client"

import { useState } from "react"
import {
  DollarSign, Edit3, Save, Check, Clock, Users, Briefcase,
  CreditCard, Calendar, AlertTriangle, TrendingUp, Sparkles,
  Building2, Shield, Zap, Star, ChevronDown, ChevronUp,
  MessageSquare, Phone, Mail, Globe, Award, Target, Info
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"

const defaultPlans = [
  {
    id: "starter",
    name: "Starter",
    description: "Para empresas pequeñas que empiezan",
    monthlyPrice: 199,
    vacanciesIncluded: 3,
    candidatesVisible: 30,
    evaluations: "Básico con IA",
    analytics: "Dashboard básico",
    support: "Email",
    referrralFee: 50,
    hireFee: 150,
    color: "from-blue-500 to-blue-600",
    popular: false,
  },
  {
    id: "professional",
    name: "Professional",
    description: "Para empresas en crecimiento",
    monthlyPrice: 599,
    vacanciesIncluded: 10,
    candidatesVisible: 100,
    evaluations: "Custom (2 tipos)",
    analytics: "Completos",
    support: "Chat",
    referrralFee: 40,
    hireFee: 120,
    color: "from-fb-purple to-blue-600",
    popular: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description: "Para grandes organizaciones",
    monthlyPrice: 1499,
    vacanciesIncluded: 30,
    candidatesVisible: 500,
    evaluations: "Custom ilimitadas",
    analytics: "Avanzados + API",
    support: "CSM dedicado",
    referrralFee: 30,
    hireFee: 100,
    color: "from-emerald-500 to-teal-600",
    popular: false,
  },
]

const activeContracts = [
  { company: "TechCorp Solutions", plan: "Professional", startDate: "2026-08-15", expiresAt: "2026-09-15", status: "active", candidatesUsed: 24, candidatesMax: 100, vacanciesUsed: 5, vacanciesMax: 10 },
  { company: "InnovateLab", plan: "Starter", startDate: "2026-08-20", expiresAt: "2026-09-20", status: "active", candidatesUsed: 12, candidatesMax: 30, vacanciesUsed: 3, vacanciesMax: 3 },
  { company: "DataPro Analytics", plan: "Professional", startDate: "2026-07-01", expiresAt: "2026-08-01", status: "expired", candidatesUsed: 18, candidatesMax: 100, vacanciesUsed: 4, vacanciesMax: 10 },
  { company: "GlobalTech Corp", plan: "Enterprise", startDate: "2026-08-01", expiresAt: "2026-09-01", status: "active", candidatesUsed: 120, candidatesMax: 500, vacanciesUsed: 15, vacanciesMax: 30 },
  { company: "StartupXYZ", plan: "Trial", startDate: "2026-08-25", expiresAt: "2026-09-08", status: "trial", candidatesUsed: 5, candidatesMax: 5, vacanciesUsed: 1, vacanciesMax: 1 },
]

const feeHistory = [
  { company: "TechCorp Solutions", type: "referido", candidate: "María García", amount: 40, date: "Hace 3 días", status: "pagado" },
  { company: "TechCorp Solutions", type: "contratado", candidate: "Carlos Ruiz", amount: 120, date: "Hace 1 semana", status: "pagado" },
  { company: "GlobalTech Corp", type: "referido", candidate: "Ana Martínez", amount: 30, date: "Hace 5 días", status: "pendiente" },
  { company: "InnovateLab", type: "contratado", candidate: "Pedro López", amount: 150, date: "Hace 2 semanas", status: "pagado" },
]

export default function PricingPage() {
  const [editingPlan, setEditingPlan] = useState<string | null>(null)
  const [plans, setPlans] = useState(defaultPlans)

  const handlePriceChange = (planId: string, field: string, value: number) => {
    setPlans(plans.map(p => p.id === planId ? { ...p, [field]: value } : p))
  }

  const getDaysRemaining = (expiresAt: string) => {
    const exp = new Date(expiresAt)
    const now = new Date()
    const diff = Math.ceil((exp.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    return diff
  }

  const getStatusBadge = (status: string, days: number) => {
    if (status === "expired") return <Badge className="bg-red-100 text-red-700">Vencido</Badge>
    if (status === "trial") return <Badge className="bg-purple-100 text-purple-700">Prueba</Badge>
    if (days <= 7) return <Badge className="bg-amber-100 text-amber-700">Vence en {days} días</Badge>
    return <Badge className="bg-emerald-100 text-emerald-700">Activo ({days} días)</Badge>
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <DollarSign className="h-7 w-7 text-emerald-600" />
          Precios, Planes y Acuerdos Empresariales
        </h1>
        <p className="text-muted-foreground mt-1">
          Gestiona los precios de los planes, vigencia de contratos y cobro por candidatos referidos/contratados
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <Card key={plan.id} className={`border-2 relative ${plan.popular ? "border-fb-purple shadow-lg" : ""}`}>
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge className="bg-fb-purple text-white px-3">Más Popular</Badge>
              </div>
            )}
            <CardContent className="p-6">
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold">{plan.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">{plan.description}</p>
              </div>

              {/* Price */}
              <div className="text-center mb-6">
                <div className="flex items-center justify-center gap-1">
                  {editingPlan === plan.id ? (
                    <div className="flex items-center gap-2">
                      <span className="text-lg">$</span>
                      <Input
                        type="number"
                        value={plan.monthlyPrice}
                        onChange={(e) => handlePriceChange(plan.id, "monthlyPrice", Number(e.target.value))}
                        className="w-24 text-center text-2xl font-bold"
                      />
                    </div>
                  ) : (
                    <span className="text-4xl font-bold">${plan.monthlyPrice}</span>
                  )}
                  <span className="text-muted-foreground">/mes</span>
                </div>
              </div>

              {/* Contract details */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2"><Briefcase className="h-4 w-4 text-muted-foreground" /> Vacantes</span>
                  <span className="font-semibold">{plan.vacanciesIncluded} activas</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2"><Users className="h-4 w-4 text-muted-foreground" /> Candidatos</span>
                  <span className="font-semibold">{plan.candidatesVisible}/mes</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2"><Target className="h-4 w-4 text-muted-foreground" /> Evaluaciones</span>
                  <span className="font-semibold">{plan.evaluations}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2"><TrendingUp className="h-4 w-4 text-muted-foreground" /> Analytics</span>
                  <span className="font-semibold">{plan.analytics}</span>
                </div>
              </div>

              <Separator className="my-4" />

              {/* Fee structure */}
              <div className="space-y-3 mb-6">
                <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Cobro por Candidato</div>
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2"><Zap className="h-4 w-4 text-blue-500" /> Referido (visto)</span>
                  {editingPlan === plan.id ? (
                    <div className="flex items-center gap-1">
                      <span className="text-muted-foreground">$</span>
                      <Input
                        type="number"
                        value={plan.referrralFee}
                        onChange={(e) => handlePriceChange(plan.id, "referrralFee", Number(e.target.value))}
                        className="w-20 text-center text-sm"
                      />
                    </div>
                  ) : (
                    <span className="font-semibold text-blue-600">${plan.referrralFee}</span>
                  )}
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2"><Award className="h-4 w-4 text-emerald-500" /> Contratado</span>
                  {editingPlan === plan.id ? (
                    <div className="flex items-center gap-1">
                      <span className="text-muted-foreground">$</span>
                      <Input
                        type="number"
                        value={plan.hireFee}
                        onChange={(e) => handlePriceChange(plan.id, "hireFee", Number(e.target.value))}
                        className="w-20 text-center text-sm"
                      />
                    </div>
                  ) : (
                    <span className="font-semibold text-emerald-600">${plan.hireFee}</span>
                  )}
                </div>
              </div>

              <Separator className="my-4" />

              {/* Vigencia */}
              <div className="p-3 rounded-xl bg-muted/50 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-fb-blue" />
                  <span className="font-medium">Vigencia:</span>
                  <span className="text-muted-foreground">1 mes desde validación de pago</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                {editingPlan === plan.id ? (
                  <Button variant="fb" className="flex-1" onClick={() => setEditingPlan(null)}>
                    <Save className="h-4 w-4 mr-2" />
                    Guardar Cambios
                  </Button>
                ) : (
                  <Button variant="fb-outline" className="flex-1" onClick={() => setEditingPlan(plan.id)}>
                    <Edit3 className="h-4 w-4 mr-2" />
                    Editar Precios
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Active Contracts */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-amber-500" />
            Contratos Activos — Vigencia 1 Mes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {activeContracts.map((contract, i) => {
              const days = getDaysRemaining(contract.expiresAt)
              return (
                <div key={i} className="p-4 rounded-xl border hover:shadow-sm transition-shadow">
                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-fb-blue/10 flex items-center justify-center">
                        <Building2 className="h-5 w-5 text-fb-blue" />
                      </div>
                      <div>
                        <div className="font-semibold text-sm">{contract.company}</div>
                        <div className="text-xs text-muted-foreground">
                          Plan {contract.plan} · Inicio: {contract.startDate}
                        </div>
                      </div>
                    </div>
                    {getStatusBadge(contract.status, days)}
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
                    <div className="text-xs">
                      <span className="text-muted-foreground">Vacantes:</span>
                      <span className="font-semibold ml-1">{contract.vacanciesUsed}/{contract.vacanciesMax}</span>
                    </div>
                    <div className="text-xs">
                      <span className="text-muted-foreground">Candidatos:</span>
                      <span className="font-semibold ml-1">{contract.candidatesUsed}/{contract.candidatesMax}</span>
                    </div>
                    <div className="text-xs">
                      <span className="text-muted-foreground">Vence:</span>
                      <span className="font-semibold ml-1">{contract.expiresAt}</span>
                    </div>
                    <div className="text-xs">
                      <span className="text-muted-foreground">Uso:</span>
                      <span className="font-semibold ml-1">{Math.round((contract.candidatesUsed / contract.candidatesMax) * 100)}%</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Fee History */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-emerald-500" />
            Historial de Cobros por Candidatos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {feeHistory.map((fee, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl hover:bg-muted/30 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    fee.type === "referido" ? "bg-blue-100" : "bg-emerald-100"
                  }`}>
                    {fee.type === "referido" ? <Zap className="h-4 w-4 text-blue-600" /> : <Award className="h-4 w-4 text-emerald-600" />}
                  </div>
                  <div>
                    <div className="text-sm font-medium">{fee.company}</div>
                    <div className="text-xs text-muted-foreground">
                      {fee.type === "referido" ? "Referido" : "Contratado"}: {fee.candidate} · {fee.date}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-sm">${fee.amount}</div>
                  <Badge className={`text-xs ${fee.status === "pagado" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                    {fee.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Info */}
      <Card className="border-2 border-amber-200 bg-amber-50">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-sm">
              <div className="font-semibold text-amber-800 mb-1">Política de Vigencia</div>
              <p className="text-amber-700">
                Todos los planes tienen una vigencia de <strong>1 mes (30 días)</strong> desde la fecha de validación del pago. 
                El sistema notificará automáticamente a la empresa 7 días antes de la expiración. 
                Los cobros por candidatos referidos y contratados se facturan al cierre de cada mes.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
