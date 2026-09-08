"use client"

import { Zap, Search, Eye, MessageCircle, CheckCircle2, Clock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"

const referrals = [
  { id: "1", candidate: "María García", company: "TechCorp Solutions", vacancy: "Senior Developer", score: 95, status: "PENDING", referredAt: "Hace 2 horas" },
  { id: "2", candidate: "Carlos Ruiz", company: "InnovateLab", vacancy: "Product Manager", score: 88, status: "VIEWED", referredAt: "Hace 5 horas" },
  { id: "3", candidate: "Ana Martínez", company: "DataPro Analytics", vacancy: "UX Designer", score: 82, status: "CONTACTED", referredAt: "Hace 1 día" },
  { id: "4", candidate: "Pedro Sánchez", company: "TechCorp Solutions", vacancy: "DevOps Engineer", score: 78, status: "INTERVIEW", referredAt: "Hace 2 días" },
  { id: "5", candidate: "Laura López", company: "StartupXYZ", vacancy: "Data Analyst", score: 75, status: "OFFER", referredAt: "Hace 3 días" },
  { id: "6", candidate: "Roberto Díaz", company: "GlobalTech Corp", vacancy: "Backend Developer", score: 80, status: "HIRED", referredAt: "Hace 1 semana" },
  { id: "7", candidate: "Sofía Torres", company: "InnovateLab", vacancy: "Frontend Developer", score: 70, status: "REJECTED", referredAt: "Hace 1 semana" },
]

const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
  PENDING: { label: "Pendiente", color: "bg-blue-100 text-blue-800", icon: Clock },
  VIEWED: { label: "Visto", color: "bg-gray-100 text-gray-800", icon: Eye },
  CONTACTED: { label: "Contactado", color: "bg-amber-100 text-amber-800", icon: MessageCircle },
  INTERVIEW: { label: "Entrevista", color: "bg-purple-100 text-purple-800", icon: MessageCircle },
  OFFER: { label: "Oferta", color: "bg-orange-100 text-orange-800", icon: CheckCircle2 },
  HIRED: { label: "Contratado", color: "bg-emerald-100 text-emerald-800", icon: CheckCircle2 },
  REJECTED: { label: "Rechazado", color: "bg-red-100 text-red-800", icon: Eye },
}

export default function AdminReferralsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Zap className="h-8 w-8 text-primary" />
          Derivaciones
        </h1>
        <p className="text-muted-foreground mt-1">Seguimiento de todas las derivaciones de candidatos a empresas.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card><CardContent className="p-4 text-center"><div className="text-2xl font-bold">156</div><div className="text-xs text-muted-foreground">Total Derivaciones</div></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><div className="text-2xl font-bold text-blue-600">23</div><div className="text-xs text-muted-foreground">Pendientes</div></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><div className="text-2xl font-bold text-amber-600">12</div><div className="text-xs text-muted-foreground">En Proceso</div></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><div className="text-2xl font-bold text-emerald-600">34</div><div className="text-xs text-muted-foreground">Contratados</div></CardContent></Card>
      </div>

      <div className="space-y-4">
        {referrals.map((referral) => {
          const config = statusConfig[referral.status]
          return (
            <Card key={referral.id} className="hover:shadow-md transition-all duration-200">
              <CardContent className="p-6 flex flex-col md:flex-row md:items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-fb-blue to-fb-purple flex items-center justify-center text-white text-sm font-medium shrink-0">
                  {referral.candidate.split(" ").map(n => n[0]).join("")}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold">{referral.candidate}</span>
                    <span className="text-muted-foreground">→</span>
                    <span className="font-medium">{referral.company}</span>
                    <Badge className={config.color}>{config.label}</Badge>
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">{referral.vacancy} · {referral.referredAt}</div>
                </div>
                <div className="text-xl font-bold gradient-text">{referral.score}%</div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
