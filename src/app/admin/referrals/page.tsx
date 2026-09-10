"use client"

import { useState, useEffect } from "react"
import { Zap, Search, Loader2, Inbox } from "lucide-react"
import { apiFetch } from "@/lib/api"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

interface ReferralRow {
  id: string
  candidate: string
  company: string
  vacancy: string
  score: number
  status: string
  referredAt: string
}

const statusConfig: Record<string, { label: string; color: string }> = {
  PENDING: { label: "Pendiente", color: "bg-blue-100 text-blue-800" },
  VIEWED: { label: "Visto", color: "bg-gray-100 text-gray-800" },
  CONTACTED: { label: "Contactado", color: "bg-amber-100 text-amber-800" },
  INTERVIEW: { label: "Entrevista", color: "bg-purple-100 text-purple-800" },
  HIRED: { label: "Contratado", color: "bg-emerald-100 text-emerald-800" },
  REJECTED: { label: "Rechazado", color: "bg-red-100 text-red-800" },
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

export default function AdminReferralsPage() {
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)
  const [referrals, setReferrals] = useState<ReferralRow[]>([])
  const [stats, setStats] = useState({ total: 0, pending: 0, inProcess: 0, hired: 0 })

  useEffect(() => {
    const t = setTimeout(() => {
      fetch(`/api/admin/referrals${search ? `?search=${encodeURIComponent(search)}` : ""}`)
        .then(r => r.json())
        .then(data => {
          if (data.success) {
            setReferrals(data.referrals)
            setStats(data.stats)
          }
        })
        .finally(() => setLoading(false))
    }, search ? 400 : 0)
    return () => clearTimeout(t)
  }, [search])

  if (loading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
  }

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
        <Card><CardContent className="p-4 text-center"><div className="text-2xl font-bold">{stats.total}</div><div className="text-xs text-muted-foreground">Total Derivaciones</div></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><div className="text-2xl font-bold text-blue-600">{stats.pending}</div><div className="text-xs text-muted-foreground">Pendientes</div></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><div className="text-2xl font-bold text-amber-600">{stats.inProcess}</div><div className="text-xs text-muted-foreground">En Proceso</div></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><div className="text-2xl font-bold text-emerald-600">{stats.hired}</div><div className="text-xs text-muted-foreground">Contratados</div></CardContent></Card>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Buscar por candidato, empresa o vacante..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
      </div>

      {referrals.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Inbox className="h-12 w-12 mx-auto mb-3 text-muted-foreground/50" />
            <p className="text-muted-foreground">
              {search ? "No se encontraron derivaciones con esa búsqueda." : "Aún no hay derivaciones registradas. Deriva candidatos desde la gestión de matching."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {referrals.map((referral) => {
            const config = statusConfig[referral.status] || { label: referral.status, color: "bg-gray-100 text-gray-800" }
            return (
              <Card key={referral.id} className="hover:shadow-md transition-all duration-200">
                <CardContent className="p-6 flex flex-col md:flex-row md:items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-fb-blue to-fb-purple flex items-center justify-center text-white text-sm font-medium shrink-0">
                    {referral.candidate.split(" ").map(n => n[0]).slice(0, 2).join("")}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold">{referral.candidate}</span>
                      <span className="text-muted-foreground">→</span>
                      <span className="font-medium">{referral.company}</span>
                      <Badge className={config.color}>{config.label}</Badge>
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">{referral.vacancy} · {timeAgo(referral.referredAt)}</div>
                  </div>
                  <div className="text-xl font-bold gradient-text">{referral.score}%</div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
