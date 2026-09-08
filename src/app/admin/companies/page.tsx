"use client"

import { useState } from "react"
import { Building2, Plus, Search, Users, Briefcase, Shield, ExternalLink } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"

const companies = [
  { id: "1", name: "TechCorp Solutions", industry: "Tecnología", size: "201-500", plan: "Professional", vacancies: 5, candidates: 24, status: "Activa" },
  { id: "2", name: "InnovateLab", industry: "Fintech", size: "51-200", plan: "Starter", vacancies: 3, candidates: 12, status: "Activa" },
  { id: "3", name: "DataPro Analytics", industry: "Data & Analytics", size: "51-200", plan: "Professional", vacancies: 4, candidates: 18, status: "Activa" },
  { id: "4", name: "StartupXYZ", industry: "Startup", size: "11-50", plan: "Trial", vacancies: 1, candidates: 5, status: "Trial" },
  { id: "5", name: "GlobalTech Corp", industry: "Tecnología", size: "500+", plan: "Enterprise", vacancies: 15, candidates: 120, status: "Activa" },
]

const planColors: Record<string, string> = {
  Trial: "bg-gray-100 text-gray-800",
  Starter: "bg-blue-100 text-blue-800",
  Professional: "bg-purple-100 text-purple-800",
  Enterprise: "bg-amber-100 text-amber-800",
}

export default function AdminCompaniesPage() {
  const [search, setSearch] = useState("")

  const filtered = companies.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  )

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

      <div className="space-y-4">
        {filtered.map((company) => (
          <Card key={company.id} className="hover:shadow-md transition-all duration-200">
            <CardContent className="p-6 flex flex-col md:flex-row md:items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-fb-blue to-fb-purple flex items-center justify-center text-white font-bold shrink-0">
                {company.name.split(" ").map(n => n[0]).join("").substring(0, 2)}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-semibold">{company.name}</h3>
                  <Badge className={planColors[company.plan]}>{company.plan}</Badge>
                </div>
                <div className="text-sm text-muted-foreground">{company.industry} · {company.size} empleados</div>
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
                <Button variant="ghost" size="icon">
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
