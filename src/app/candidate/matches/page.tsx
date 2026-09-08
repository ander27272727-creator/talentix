"use client"

import { useState } from "react"
import {
  Target, Filter, Search, Building2, MapPin, Clock, ArrowRight,
  Star, TrendingUp, Briefcase, DollarSign, ChevronDown, Sparkles,
  CheckCircle2, Info
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Mock matches data
const matches = [
  {
    id: "1",
    company: "TechCorp Solutions",
    position: "Senior Full Stack Developer",
    location: "Remoto",
    salary: "$80,000 - $120,000",
    overallMatch: 95,
    recommendation: "highly_recommended",
    breakdown: {
      skillsMatch: 98,
      assessmentMatch: 92,
      experienceMatch: 94,
      culturalFit: 96,
    },
    candidateBreakdown: {
      careerGrowth: 95,
      salaryFit: 90,
      cultureMatch: 98,
      locationFit: 100,
    },
    postedAt: "Hace 2 días",
    applicants: 12,
    logo: "TC",
    industry: "Tecnología",
    size: "201-500",
  },
  {
    id: "2",
    company: "InnovateLab",
    position: "Full Stack Engineer",
    location: "Híbrido - Madrid",
    salary: "$70,000 - $95,000",
    overallMatch: 88,
    recommendation: "recommended",
    breakdown: {
      skillsMatch: 92,
      assessmentMatch: 85,
      experienceMatch: 88,
      culturalFit: 87,
    },
    candidateBreakdown: {
      careerGrowth: 88,
      salaryFit: 85,
      cultureMatch: 90,
      locationFit: 80,
    },
    postedAt: "Hace 5 días",
    applicants: 18,
    logo: "IL",
    industry: "Fintech",
    size: "51-200",
  },
  {
    id: "3",
    company: "DataPro Analytics",
    position: "Backend Developer",
    location: "Remoto",
    salary: "$75,000 - $100,000",
    overallMatch: 82,
    recommendation: "recommended",
    breakdown: {
      skillsMatch: 88,
      assessmentMatch: 80,
      experienceMatch: 82,
      culturalFit: 78,
    },
    candidateBreakdown: {
      careerGrowth: 80,
      salaryFit: 82,
      cultureMatch: 75,
      locationFit: 100,
    },
    postedAt: "Hace 1 semana",
    applicants: 24,
    logo: "DP",
    industry: "Data & Analytics",
    size: "51-200",
  },
  {
    id: "4",
    company: "StartupXYZ",
    position: "CTO / Technical Lead",
    location: "Remoto",
    salary: "$120,000 - $160,000",
    overallMatch: 78,
    recommendation: "possible",
    breakdown: {
      skillsMatch: 85,
      assessmentMatch: 75,
      experienceMatch: 72,
      culturalFit: 80,
    },
    candidateBreakdown: {
      careerGrowth: 92,
      salaryFit: 88,
      cultureMatch: 85,
      locationFit: 100,
    },
    postedAt: "Hace 3 días",
    applicants: 8,
    logo: "SX",
    industry: "Startup",
    size: "11-50",
  },
  {
    id: "5",
    company: "GlobalTech Corp",
    position: "Software Engineer",
    location: "Presencial - Barcelona",
    salary: "$65,000 - $85,000",
    overallMatch: 72,
    recommendation: "possible",
    breakdown: {
      skillsMatch: 80,
      assessmentMatch: 70,
      experienceMatch: 68,
      culturalFit: 70,
    },
    candidateBreakdown: {
      careerGrowth: 75,
      salaryFit: 72,
      cultureMatch: 68,
      locationFit: 65,
    },
    postedAt: "Hace 1 semana",
    applicants: 32,
    logo: "GT",
    industry: "Tecnología",
    size: "500+",
  },
]

function getRecommendationLabel(rec: string) {
  const labels: Record<string, string> = {
    highly_recommended: "Altamente Recomendado",
    recommended: "Recomendado",
    possible: "Posible",
    low_fit: "Bajo Ajuste",
  }
  return labels[rec] || rec
}

export default function CandidateMatchesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedMatch, setSelectedMatch] = useState<string | null>(null)

  const filteredMatches = matches.filter(
    (match) =>
      match.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      match.position.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Target className="h-8 w-8 text-primary" />
            Mis Matches
          </h1>
          <p className="text-muted-foreground mt-1">
            Empresas donde más encajas según tu perfil y evaluaciones.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="info" className="px-3 py-1">
            {matches.length} matches encontrados
          </Badge>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por empresa o posición..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* AI Insight */}
      <Card className="border-2 border-fb-purple/20 bg-gradient-to-r from-fb-purple/5 to-fb-blue/5">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-fb-purple to-fb-blue flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium">
                Tu perfil es altamente demandado 🎯
              </p>
              <p className="text-xs text-muted-foreground">
                3 empresas con match &gt;85% están buscando activamente tu perfil. 
                Las empresas remote-first tienen el mejor fit para ti.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">
            Todos ({matches.length})
          </TabsTrigger>
          <TabsTrigger value="excellent">
            Excelentes ({matches.filter(m => m.overallMatch >= 90).length})
          </TabsTrigger>
          <TabsTrigger value="good">
            Buenos ({matches.filter(m => m.overallMatch >= 75 && m.overallMatch < 90).length})
          </TabsTrigger>
          <TabsTrigger value="possible">
            Posibles ({matches.filter(m => m.overallMatch < 75).length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <div className="space-y-4">
            {filteredMatches.map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="excellent" className="mt-6">
          <div className="space-y-4">
            {filteredMatches.filter(m => m.overallMatch >= 90).map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="good" className="mt-6">
          <div className="space-y-4">
            {filteredMatches.filter(m => m.overallMatch >= 75 && m.overallMatch < 90).map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="possible" className="mt-6">
          <div className="space-y-4">
            {filteredMatches.filter(m => m.overallMatch < 75).map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function MatchCard({ match }: { match: typeof matches[0] }) {
  const [expanded, setExpanded] = useState(false)

  const getRecommendationColor = (rec: string) => {
    const colors: Record<string, string> = {
      highly_recommended: "highly-recommended",
      recommended: "recommended",
      possible: "possible",
      low_fit: "low-fit",
    }
    return colors[rec] || "secondary"
  }

  return (
    <Card className="hover:shadow-lg transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          {/* Company Info */}
          <div className="flex items-center gap-4 flex-1">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-fb-blue to-fb-purple flex items-center justify-center text-white font-bold text-lg shrink-0">
              {match.logo}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-semibold text-lg">{match.company}</h3>
                <Badge variant={getRecommendationColor(match.recommendation) as any}>
                  {getRecommendationLabel(match.recommendation)}
                </Badge>
              </div>
              <div className="text-muted-foreground">{match.position}</div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {match.location}
                </span>
                <span className="flex items-center gap-1">
                  <DollarSign className="h-3 w-3" />
                  {match.salary}
                </span>
                <span className="flex items-center gap-1">
                  <Building2 className="h-3 w-3" />
                  {match.industry}
                </span>
              </div>
            </div>
          </div>

          {/* Match Score */}
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold gradient-text">{match.overallMatch}%</div>
              <div className="text-xs text-muted-foreground">Match</div>
            </div>

            <div className="text-right">
              <div className="text-sm text-muted-foreground flex items-center gap-1 justify-end">
                <Clock className="h-3 w-3" />
                {match.postedAt}
              </div>
              <div className="text-sm text-muted-foreground">
                {match.applicants} postulantes
              </div>
            </div>

            <Button variant="fb" size="lg">
              Ver Detalles
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Expandable Details */}
        <div className="mt-4">
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronDown className={`h-4 w-4 transition-transform ${expanded ? "rotate-180" : ""}`} />
            {expanded ? "Ocultar detalles" : "Ver desglose de match"}
          </button>

          {expanded && (
            <div className="mt-4 grid md:grid-cols-2 gap-6">
              {/* Company Fit */}
              <div className="space-y-3">
                <h4 className="font-medium flex items-center gap-2">
                  <Target className="h-4 w-4 text-primary" />
                  Fit para la Empresa
                </h4>
                {Object.entries(match.breakdown).map(([key, value]) => (
                  <div key={key}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted-foreground capitalize">
                        {key.replace(/([A-Z])/g, " $1").trim()}
                      </span>
                      <span className="font-medium">{value}%</span>
                    </div>
                    <Progress value={value} className="h-2" />
                  </div>
                ))}
              </div>

              {/* Candidate Fit */}
              <div className="space-y-3">
                <h4 className="font-medium flex items-center gap-2">
                  <Star className="h-4 w-4 text-amber-500" />
                  Fit para Ti
                </h4>
                {Object.entries(match.candidateBreakdown).map(([key, value]) => (
                  <div key={key}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted-foreground capitalize">
                        {key.replace(/([A-Z])/g, " $1").trim()}
                      </span>
                      <span className="font-medium">{value}%</span>
                    </div>
                    <Progress value={value} className="h-2" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
