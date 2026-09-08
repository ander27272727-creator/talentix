"use client"

import { useState } from "react"
import { Users, Search, MapPin, Brain, Target, Eye, MessageCircle, CheckCircle2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"

const candidates = [
  {
    id: "1",
    name: "María García",
    role: "Senior Developer",
    score: 95,
    recommendation: "Altamente Recomendado",
    location: "Madrid, España",
    skills: ["React", "Node.js", "TypeScript", "PostgreSQL"],
    assessed: true,
    status: "Derivado",
    derivedAt: "Hace 2 horas",
  },
  {
    id: "2",
    name: "Carlos Ruiz",
    role: "Product Manager",
    score: 88,
    recommendation: "Recomendado",
    location: "Barcelona, España",
    skills: ["Agile", "Scrum", "Jira", "SQL"],
    assessed: true,
    status: "Visto",
    derivedAt: "Hace 5 horas",
  },
  {
    id: "3",
    name: "Ana Martínez",
    role: "UX Designer",
    score: 82,
    recommendation: "Recomendado",
    location: "Remoto",
    skills: ["Figma", "Sketch", "CSS", "User Research"],
    assessed: true,
    status: "Contactado",
    derivedAt: "Hace 1 día",
  },
  {
    id: "4",
    name: "Pedro Sánchez",
    role: "DevOps Engineer",
    score: 78,
    recommendation: "Posible",
    location: "Valencia, España",
    skills: ["AWS", "Docker", "Kubernetes", "Terraform"],
    assessed: true,
    status: "Entrevista",
    derivedAt: "Hace 2 días",
  },
  {
    id: "5",
    name: "Laura López",
    role: "Data Analyst",
    score: 75,
    recommendation: "Posible",
    location: "Remoto",
    skills: ["Python", "SQL", "Tableau", "Excel"],
    assessed: false,
    status: "Derivado",
    derivedAt: "Hace 3 días",
  },
]

const statusColors: Record<string, string> = {
  "Derivado": "bg-blue-100 text-blue-800",
  "Visto": "bg-gray-100 text-gray-800",
  "Contactado": "bg-amber-100 text-amber-800",
  "Entrevista": "bg-purple-100 text-purple-800",
  "Contratado": "bg-emerald-100 text-emerald-800",
}

export default function CompanyCandidatesPage() {
  const [search, setSearch] = useState("")

  const filtered = candidates.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.role.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Users className="h-8 w-8 text-primary" />
            Candidatos
          </h1>
          <p className="text-muted-foreground mt-1">
            Candidatos derivados a tu empresa por Talentix.
          </p>
        </div>
        <Badge variant="info" className="px-3 py-1 text-sm">
          {candidates.length} candidatos totales
        </Badge>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por nombre o cargo..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="space-y-4">
        {filtered.map((candidate) => (
          <Card key={candidate.id} className="hover:shadow-md transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-fb-blue to-fb-purple flex items-center justify-center text-white font-bold text-lg shrink-0">
                  {candidate.name.split(" ").map(n => n[0]).join("")}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold">{candidate.name}</h3>
                    <Badge className={statusColors[candidate.status]}>{candidate.status}</Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">{candidate.role} · {candidate.location}</div>
                  <div className="flex gap-2 mt-2">
                    {candidate.skills.map((skill, i) => (
                      <Badge key={i} variant="outline" className="text-xs">{skill}</Badge>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold gradient-text">{candidate.score}%</div>
                    <div className="text-xs text-muted-foreground">{candidate.recommendation}</div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" title="Ver perfil">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" title="Contactar">
                      <MessageCircle className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" title="Aprobar" className="text-emerald-500">
                      <CheckCircle2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
