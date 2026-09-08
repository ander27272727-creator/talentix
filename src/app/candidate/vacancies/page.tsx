"use client"

import { Briefcase, MapPin, DollarSign, Clock, ArrowRight, Sparkles, Globe, Building2, Map } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { useState } from "react"

const typeConfig: Record<string, { label: string; icon: any; color: string }> = {
  REMOTE: { label: "Remoto", icon: Globe, color: "bg-emerald-100 text-emerald-800" },
  HYBRID: { label: "Híbrido", icon: Building2, color: "bg-amber-100 text-amber-800" },
  ONSITE: { label: "Presencial", icon: Map, color: "bg-blue-100 text-blue-800" },
}

const vacancies = [
  { id: "1", company: "TechCorp Solutions", title: "Senior Full Stack Developer", location: "Global", type: "REMOTE", salary: "$80,000 - $120,000", match: 95, posted: "Hace 2 días", applicants: 12, country: "Global" },
  { id: "2", company: "InnovateLab", title: "Full Stack Engineer", location: "Madrid", type: "HYBRID", salary: "$70,000 - $95,000", match: 88, posted: "Hace 5 días", applicants: 18, country: "España" },
  { id: "3", company: "DataPro Analytics", title: "Backend Developer", location: "LATAM", type: "REMOTE", salary: "$75,000 - $100,000", match: 82, posted: "Hace 1 semana", applicants: 24, country: "LATAM" },
  { id: "4", company: "StartupXYZ", title: "CTO / Technical Lead", location: "Global", type: "REMOTE", salary: "$120,000 - $160,000", match: 78, posted: "Hace 3 días", applicants: 8, country: "Global" },
  { id: "5", company: "GlobalTech Corp", title: "Software Engineer", location: "Barcelona", type: "ONSITE", salary: "$65,000 - $85,000", match: 72, posted: "Hace 1 semana", applicants: 32, country: "España" },
]

export default function CandidateVacanciesPage() {
  const [filterType, setFilterType] = useState<string>("all")

  const filtered = filterType === "all" ? vacancies : vacancies.filter(v => v.type === filterType)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Briefcase className="h-8 w-8 text-primary" />
          Vacantes Disponibles
        </h1>
        <p className="text-muted-foreground mt-1">Oportunidades que coinciden con tu perfil según nuestra IA.</p>
      </div>

      <Card className="border-2 border-fb-purple/20 bg-gradient-to-r from-fb-purple/5 to-fb-blue/5">
        <CardContent className="p-4 flex items-center gap-3">
          <Sparkles className="h-5 w-5 text-fb-purple shrink-0" />
          <p className="text-sm">Estas vacantes fueron seleccionadas automáticamente según tus preferencias de trabajo y evaluaciones.</p>
        </CardContent>
      </Card>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {[
          { value: "all", label: "Todas" },
          { value: "REMOTE", label: "🌍 Remoto" },
          { value: "HYBRID", label: "🏢 Híbrido" },
          { value: "ONSITE", label: "📍 Presencial" },
        ].map((f) => (
          <button
            key={f.value}
            onClick={() => setFilterType(f.value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              filterType === f.value
                ? "gradient-bg text-white shadow-md"
                : "bg-muted hover:bg-muted/80"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filtered.map((vacancy) => {
          const tc = typeConfig[vacancy.type]
          const TypeIcon = tc.icon
          return (
            <Card key={vacancy.id} className="hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-fb-blue to-fb-purple flex items-center justify-center text-white font-bold shrink-0">
                    {vacancy.company.split(" ").map(n => n[0]).join("").substring(0, 2)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-lg">{vacancy.company}</h3>
                      <Badge className={tc.color}>
                        <TypeIcon className="h-3 w-3 mr-1" />
                        {tc.label}
                      </Badge>
                      <Badge variant="outline">{vacancy.country}</Badge>
                    </div>
                    <div className="text-muted-foreground">{vacancy.title}</div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                      <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {vacancy.location}</span>
                      <span className="flex items-center gap-1"><DollarSign className="h-3 w-3" /> {vacancy.salary}</span>
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {vacancy.posted}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold gradient-text">{vacancy.match}%</div>
                      <div className="text-xs text-muted-foreground">Match</div>
                    </div>
                    <Button variant="fb">
                      Ver Detalles
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
