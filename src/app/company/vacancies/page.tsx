"use client"

import { useState } from "react"
import { Briefcase, Plus, MapPin, DollarSign, Clock, Users, Edit, Trash2, Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const vacancies = [
  {
    id: "1",
    title: "Senior Full Stack Developer",
    location: "Remoto",
    type: "REMOTE",
    salary: "$80,000 - $120,000",
    status: "ACTIVE",
    applicants: 24,
    matches: 8,
    category: "Tecnología",
    postedAt: "Hace 3 días",
  },
  {
    id: "2",
    title: "Product Manager",
    location: "Híbrido - Madrid",
    type: "HYBRID",
    salary: "$70,000 - $95,000",
    status: "ACTIVE",
    applicants: 18,
    matches: 5,
    category: "Producto",
    postedAt: "Hace 1 semana",
  },
  {
    id: "3",
    title: "UX Designer Senior",
    location: "Remoto",
    type: "REMOTE",
    salary: "$60,000 - $85,000",
    status: "ACTIVE",
    applicants: 32,
    matches: 12,
    category: "Diseño",
    postedAt: "Hace 2 semanas",
  },
  {
    id: "4",
    title: "DevOps Engineer",
    location: "Presencial - Barcelona",
    type: "ONSITE",
    salary: "$75,000 - $100,000",
    status: "PAUSED",
    applicants: 8,
    matches: 3,
    category: "Tecnología",
    postedAt: "Hace 1 mes",
  },
  {
    id: "5",
    title: "Junior React Developer",
    location: "Remoto",
    type: "REMOTE",
    salary: "$40,000 - $55,000",
    status: "DRAFT",
    applicants: 0,
    matches: 0,
    category: "Tecnología",
    postedAt: "Borrador",
  },
]

const statusColors: Record<string, string> = {
  ACTIVE: "bg-emerald-100 text-emerald-800",
  PAUSED: "bg-amber-100 text-amber-800",
  DRAFT: "bg-gray-100 text-gray-800",
  CLOSED: "bg-red-100 text-red-800",
}

export default function CompanyVacanciesPage() {
  const [search, setSearch] = useState("")

  const filtered = vacancies.filter(v =>
    v.title.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Briefcase className="h-8 w-8 text-primary" />
            Vacantes
          </h1>
          <p className="text-muted-foreground mt-1">
            Gestiona las ofertas laborales de tu empresa.
          </p>
        </div>
        <Link href="/company/vacancies/new">
          <Button variant="fb">
            <Plus className="mr-2 h-4 w-4" />
            Nueva Vacante
          </Button>
        </Link>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Input
            placeholder="Buscar vacantes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">Todas ({vacancies.length})</TabsTrigger>
          <TabsTrigger value="active">Activas ({vacancies.filter(v => v.status === "ACTIVE").length})</TabsTrigger>
          <TabsTrigger value="paused">Pausadas ({vacancies.filter(v => v.status === "PAUSED").length})</TabsTrigger>
          <TabsTrigger value="draft">Borradores ({vacancies.filter(v => v.status === "DRAFT").length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <div className="space-y-4">
            {filtered.map((vacancy) => (
              <VacancyCard key={vacancy.id} vacancy={vacancy} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="active" className="mt-6">
          <div className="space-y-4">
            {filtered.filter(v => v.status === "ACTIVE").map((vacancy) => (
              <VacancyCard key={vacancy.id} vacancy={vacancy} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="paused" className="mt-6">
          <div className="space-y-4">
            {filtered.filter(v => v.status === "PAUSED").map((vacancy) => (
              <VacancyCard key={vacancy.id} vacancy={vacancy} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="draft" className="mt-6">
          <div className="space-y-4">
            {filtered.filter(v => v.status === "DRAFT").map((vacancy) => (
              <VacancyCard key={vacancy.id} vacancy={vacancy} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function VacancyCard({ vacancy }: { vacancy: typeof vacancies[0] }) {
  return (
    <Card className="hover:shadow-md transition-all duration-200">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h3 className="font-semibold text-lg">{vacancy.title}</h3>
              <Badge className={statusColors[vacancy.status]}>
                {vacancy.status === "ACTIVE" ? "Activa" : vacancy.status === "PAUSED" ? "Pausada" : "Borrador"}
              </Badge>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3" /> {vacancy.location}
              </span>
              <span className="flex items-center gap-1">
                <DollarSign className="h-3 w-3" /> {vacancy.salary}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" /> {vacancy.postedAt}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold">{vacancy.applicants}</div>
              <div className="text-xs text-muted-foreground">Postulantes</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{vacancy.matches}</div>
              <div className="text-xs text-muted-foreground">Matches</div>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon">
                <Edit className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
