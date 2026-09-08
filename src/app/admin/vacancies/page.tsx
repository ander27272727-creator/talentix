"use client"

import { Briefcase, Search } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"

const vacancies = [
  { company: "TechCorp Solutions", title: "Senior Full Stack Developer", status: "ACTIVE", applicants: 24, score: 95 },
  { company: "InnovateLab", title: "Product Manager", status: "ACTIVE", applicants: 18, score: 88 },
  { company: "DataPro Analytics", title: "Backend Developer", status: "ACTIVE", applicants: 24, score: 82 },
  { company: "StartupXYZ", title: "CTO / Technical Lead", status: "PAUSED", applicants: 8, score: 78 },
  { company: "GlobalTech Corp", title: "Software Engineer", status: "ACTIVE", applicants: 32, score: 72 },
]

const statusColors: Record<string, string> = { ACTIVE: "bg-emerald-100 text-emerald-800", PAUSED: "bg-amber-100 text-amber-800" }

export default function AdminVacanciesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Briefcase className="h-8 w-8 text-primary" />
          Vacantes
        </h1>
        <p className="text-muted-foreground mt-1">Vista general de todas las vacantes de la plataforma.</p>
      </div>
      <div className="space-y-4">
        {vacancies.map((v, i) => (
          <Card key={i} className="hover:shadow-md transition-all duration-200">
            <CardContent className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">{v.title}</h3>
                  <Badge className={statusColors[v.status]}>{v.status === "ACTIVE" ? "Activa" : "Pausada"}</Badge>
                </div>
                <div className="text-sm text-muted-foreground">{v.company} · {v.applicants} postulantes</div>
              </div>
              <div className="text-xl font-bold gradient-text">{v.score}% avg match</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
