"use client"

import { useState, useEffect } from "react"
import { Building2, Plus, Search, ExternalLink, Loader2, Inbox } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"

interface CompanyRow {
  id: string
  name: string
  industry: string
  size: string
  plan: string
  planRaw: string
  vacancies: number
  candidates: number
  location: string
  createdAt: string
}

const planColors: Record<string, string> = {
  TRIAL: "bg-gray-100 text-gray-800",
  STARTER: "bg-blue-100 text-blue-800",
  PROFESSIONAL: "bg-purple-100 text-purple-800",
  ENTERPRISE: "bg-amber-100 text-amber-800",
  CUSTOM: "bg-emerald-100 text-emerald-800",
}

export default function AdminCompaniesPage() {
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)
  const [companies, setCompanies] = useState<CompanyRow[]>([])

  useEffect(() => {
    fetch("/api/admin/companies")
      .then(r => r.json())
      .then(data => { if (data.success) setCompanies(data.companies) })
      .finally(() => setLoading(false))
  }, [])

  const filtered = companies.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.industry.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Building2 className="h-8 w-8 text-primary" />
            Empresas
          </h1>
          <p className="text-muted-foreground mt-1">Gestión de todas las empresas registradas.</p>
        </div>
        <Button variant="fb">
          <Plus className="mr-2 h-4 w-4" />
          Nueva Empresa
        </Button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Buscar empresas..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
      </div>

      {filtered.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Inbox className="h-12 w-12 mx-auto mb-3 text-muted-foreground/50" />
            <p className="text-muted-foreground">
              {search
                ? "No se encontraron empresas con esa búsqueda."
                : "Aún no hay empresas registradas. Registra la primera empresa desde el panel o espera a que se registren desde la plataforma."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filtered.map((company) => (
            <Card key={company.id} className="hover:shadow-md transition-all duration-200">
              <CardContent className="p-6 flex flex-col md:flex-row md:items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-fb-blue to-fb-purple flex items-center justify-center text-white font-bold shrink-0">
                  {company.name.split(" ").map(n => n[0]).join("").substring(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold">{company.name}</h3>
                    <Badge className={planColors[company.planRaw] || "bg-gray-100 text-gray-800"}>
                      {company.plan}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {company.industry} · {company.size} empleados · 📍 {company.location}
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <div className="text-xl font-bold">{company.vacancies}</div>
                    <div className="text-xs text-muted-foreground">Vacantes</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-primary">{company.candidates}</div>
                    <div className="text-xs text-muted-foreground">Candidatos</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
