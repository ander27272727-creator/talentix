"use client"

import { useState } from "react"
import {
  Users, Gift, Share2, Copy, Check, TrendingUp, Award, Star,
  ExternalLink, Search, Filter, ChevronRight, Zap, Target,
  BarChart3, Crown, Heart, UserPlus, Link2, ArrowUpRight,
  MessageCircle, Send, Smartphone
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"

const referralStats = {
  totalReferrals: 1847,
  successfulRegistrations: 1203,
  pendingReferrals: 412,
  conversionRate: 65.1,
  topReferrer: "Ana Martínez",
  topReferrerCount: 47,
  avgReferralsPerUser: 2.3,
  badgesAwarded: 312,
  premiumUnlocks: 891,
}

const rewardTiers = [
  { tier: "Perfil 100%", reward: "+5 matches visibles", icon: Star, color: "text-blue-500", bgColor: "bg-blue-50", requirement: "Completar perfil al 100%", achieved: 2847 },
  { tier: "1 Referido", reward: "Evaluación premium desbloqueada", icon: Gift, color: "text-purple-500", bgColor: "bg-purple-50", requirement: "Referir 1 amigo que se registre", achieved: 1203 },
  { tier: "3 Referidos", reward: "Badge \"Reclutador Talent Scout\"", icon: Award, color: "text-amber-500", bgColor: "bg-amber-50", requirement: "Referir 3 amigos", achieved: 312 },
  { tier: "Referido contratado", reward: "Talentix Talent Club + mentoría", icon: Crown, color: "text-emerald-500", bgColor: "bg-emerald-50", requirement: "Tu referido es contratado", achieved: 47 },
]

const recentReferrals = [
  { id: "1", referrer: "María García", referee: "Carlos López", status: "registered", date: "Hace 2 horas", channel: "WhatsApp" },
  { id: "2", referrer: "Ana Martínez", referee: "Pedro Sánchez", status: "completed_quiz", date: "Hace 5 horas", channel: "LinkedIn" },
  { id: "3", referrer: "Juan Rodríguez", referee: "Laura Hernández", status: "pending", date: "Hace 8 horas", channel: "Instagram" },
  { id: "4", referrer: "Sofía Torres", referee: "Miguel Díaz", status: "registered", date: "Hace 12 horas", channel: "Twitter" },
  { id: "5", referrer: "Diego Morales", referee: "Elena Ruiz", status: "hired", date: "Hace 1 día", channel: "WhatsApp" },
  { id: "6", referrer: "Ana Martínez", referee: "Roberto Vega", status: "registered", date: "Hace 1 día", channel: "Email" },
  { id: "7", referrer: "Lucía Fernández", referee: "Andrés Castro", status: "completed_quiz", date: "Hace 2 días", channel: "LinkedIn" },
  { id: "8", referrer: "María García", referee: "Carmen Silva", status: "pending", date: "Hace 2 días", channel: "TikTok" },
]

const topReferrers = [
  { name: "Ana Martínez", referrals: 47, badge: "Talent Scout", avatar: "AM", level: "oro" },
  { name: "María García", referrals: 38, badge: "Talent Scout", avatar: "MG", level: "oro" },
  { name: "Juan Rodríguez", referrals: 29, badge: "Talent Scout", avatar: "JR", level: "plata" },
  { name: "Sofía Torres", referrals: 22, badge: "Reclutador", avatar: "ST", level: "plata" },
  { name: "Diego Morales", referrals: 18, badge: "Reclutador", avatar: "DM", level: "bronce" },
]

const channels = [
  { name: "WhatsApp", icon: MessageCircle, count: 723, pct: 39.1, color: "text-emerald-600" },
  { name: "LinkedIn", icon: ExternalLink, count: 412, pct: 22.3, color: "text-blue-600" },
  { name: "Instagram", icon: Share2, count: 334, pct: 18.1, color: "text-purple-600" },
  { name: "Twitter/X", icon: Send, count: 218, pct: 11.8, color: "text-gray-800" },
  { name: "Email", icon: Link2, count: 102, pct: 5.5, color: "text-amber-600" },
  { name: "Otros", icon: Smartphone, count: 58, pct: 3.1, color: "text-gray-500" },
]

export default function ReferralProgramPage() {
  const [copiedLink, setCopiedLink] = useState(false)

  const handleCopyLink = (code: string) => {
    navigator.clipboard.writeText(`https://talentix.com/r/${code}`)
    setCopiedLink(true)
    setTimeout(() => setCopiedLink(false), 2000)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "registered":
        return <Badge className="bg-emerald-100 text-emerald-700">Registrado</Badge>
      case "completed_quiz":
        return <Badge className="bg-blue-100 text-blue-700">Quiz Completado</Badge>
      case "pending":
        return <Badge className="bg-amber-100 text-amber-700">Pendiente</Badge>
      case "hired":
        return <Badge className="bg-purple-100 text-purple-700">¡Contratado!</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Users className="h-7 w-7 text-fb-blue" />
            Programa de Referidos — Bucle Viral
          </h1>
          <p className="text-muted-foreground mt-1">
            Gestiona el sistema de referidos, recompensas y el bucle viral de crecimiento
          </p>
        </div>
        <Button variant="fb">
          <Share2 className="h-4 w-4 mr-2" />
          Compartir Configuración
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-2">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{referralStats.totalReferrals.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground">Referidos totales</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-2">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                <UserPlus className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{referralStats.successfulRegistrations.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground">Registros exitosos</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-2">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                <Award className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{referralStats.badgesAwarded}</div>
                <div className="text-xs text-muted-foreground">Badges otorgados</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-2">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{referralStats.conversionRate}%</div>
                <div className="text-xs text-muted-foreground">Tasa de conversión</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reward Tiers */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="h-5 w-5 text-purple-500" />
            Niveles de Recompensas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {rewardTiers.map((tier, i) => {
              const Icon = tier.icon
              return (
                <div key={i} className={`p-4 rounded-xl ${tier.bgColor} border`}>
                  <div className="flex items-start gap-3">
                    <div className={`w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow-sm`}>
                      <Icon className={`h-6 w-6 ${tier.color}`} />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold">{tier.tier}</div>
                      <div className="text-sm text-muted-foreground mt-1">{tier.reward}</div>
                      <div className="text-xs text-muted-foreground mt-2">Requisito: {tier.requirement}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold">{tier.achieved.toLocaleString()}</div>
                      <div className="text-xs text-muted-foreground">alcanzados</div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Top Referrers */}
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-amber-500" />
              Top Referidores
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topReferrers.map((user, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors">
                  <div className="text-lg font-bold text-muted-foreground w-6 text-center">#{i + 1}</div>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-medium text-sm ${
                    user.level === "oro" ? "bg-gradient-to-br from-amber-400 to-amber-600" :
                    user.level === "plata" ? "bg-gradient-to-br from-gray-400 to-gray-600" :
                    "bg-gradient-to-br from-orange-400 to-orange-600"
                  }`}>
                    {user.avatar}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-sm">{user.name}</div>
                    <div className="text-xs text-muted-foreground">{user.badge}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">{user.referrals}</div>
                    <div className="text-xs text-muted-foreground">referidos</div>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleCopyLink(user.name.toLowerCase().replace(" ", "") + Math.floor(Math.random() * 999))}>
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Channels */}
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Share2 className="h-5 w-5 text-blue-500" />
              Canales de Referido
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {channels.map((ch, i) => {
                const Icon = ch.icon
                return (
                  <div key={i}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <Icon className={`h-4 w-4 ${ch.color}`} />
                        <span className="text-sm font-medium">{ch.name}</span>
                      </div>
                      <div className="text-sm">
                        <span className="font-semibold">{ch.count}</span>
                        <span className="text-muted-foreground ml-1">({ch.pct}%)</span>
                      </div>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="h-2 rounded-full bg-fb-blue transition-all" style={{ width: `${ch.pct}%` }} />
                    </div>
                  </div>
                )
              })}
            </div>

            <Separator className="my-4" />

            <div className="p-4 rounded-xl bg-fb-blue/5 border border-fb-blue/20">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="h-4 w-4 text-fb-blue" />
                <span className="font-medium text-sm">Insight de IA</span>
              </div>
              <p className="text-sm text-muted-foreground">
                WhatsApp es el canal dominante (39.1%). Considera agregar botones de share directo a WhatsApp en el flujo de referidos para maximizar el bucle viral.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Referrals */}
      <Card className="border-2">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-emerald-500" />
              Referidos Recientes
            </CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Buscar referidos..." className="pl-9 w-64" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {recentReferrals.map((ref) => (
              <div key={ref.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-muted/30 transition-colors">
                <div className="w-8 h-8 rounded-full bg-fb-blue/10 flex items-center justify-center">
                  <Link2 className="h-4 w-4 text-fb-blue" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm truncate">{ref.referrer}</span>
                    <ArrowUpRight className="h-3 w-3 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground truncate">{ref.referee}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">{ref.date} · {ref.channel}</div>
                </div>
                {getStatusBadge(ref.status)}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
