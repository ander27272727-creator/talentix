"use client"

import { Building2, Globe, MapPin, Users, Edit, Shield, Calendar, ExternalLink } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useStore } from "@/store/useStore"

const defaultCulture = ["Innovación", "Trabajo en equipo", "Flexibilidad", "Aprendizaje continuo", "Diversidad"]
const defaultBenefits = ["Home office", "Seguro médico", "Capacitación anual", "Vacaciones flexibles", "Stock options", "Gym"]

export default function CompanyProfilePage() {
  const { user } = useStore()
  const companyName = user?.name || "Tu Empresa"

  const companyData = {
    name: companyName,
    industry: "Tecnología",
    size: "201-500",
    location: "No especificada",
    website: "",
    description: "Completa el perfil de tu empresa para recibir el mejor talento.",
    plan: "Trial",
    culture: defaultCulture,
    benefits: defaultBenefits,
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Building2 className="h-8 w-8 text-primary" />
            Mi Empresa
          </h1>
          <p className="text-muted-foreground mt-1">
            Gestiona la información de tu empresa en la plataforma.
          </p>
        </div>
        <Button variant="fb">
          <Edit className="mr-2 h-4 w-4" />
          Editar Perfil
        </Button>
      </div>

      {/* Plan Info */}
      <Card className="border-2 border-fb-purple/20 bg-gradient-to-r from-fb-purple/5 to-fb-blue/5">
        <CardContent className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl gradient-bg flex items-center justify-center">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold">Plan Professional</h3>
              <p className="text-sm text-muted-foreground">10 vacantes · 100 candidatos · Analytics completos</p>
            </div>
          </div>
          <Button variant="fb-outline">
            <Calendar className="mr-2 h-4 w-4" />
            Cambiar Plan
          </Button>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle>Información General</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Building2 className="h-5 w-5 text-muted-foreground" />
              <div>
                <div className="text-sm text-muted-foreground">Nombre</div>
                <div className="font-medium">{companyData.name}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Globe className="h-5 w-5 text-muted-foreground" />
              <div>
                <div className="text-sm text-muted-foreground">Industria</div>
                <div className="font-medium">{companyData.industry}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Users className="h-5 w-5 text-muted-foreground" />
              <div>
                <div className="text-sm text-muted-foreground">Tamaño</div>
                <div className="font-medium">{companyData.size} empleados</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-muted-foreground" />
              <div>
                <div className="text-sm text-muted-foreground">Ubicación</div>
                <div className="font-medium">{companyData.location}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Globe className="h-5 w-5 text-muted-foreground" />
              <div>
                <div className="text-sm text-muted-foreground">Sitio Web</div>
                <a href={companyData.website} className="font-medium text-primary hover:underline flex items-center gap-1">
                  {companyData.website} <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
            <Separator />
            <p className="text-sm text-muted-foreground">{companyData.description}</p>
          </CardContent>
        </Card>

        {/* Culture & Benefits */}
        <Card>
          <CardHeader>
            <CardTitle>Cultura y Beneficios</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h4 className="font-medium mb-3">Valores de la Empresa</h4>
              <div className="flex flex-wrap gap-2">
                {companyData.culture.map((value, i) => (
                  <Badge key={i} variant="info">{value}</Badge>
                ))}
              </div>
            </div>
            <Separator />
            <div>
              <h4 className="font-medium mb-3">Beneficios</h4>
              <div className="flex flex-wrap gap-2">
                {companyData.benefits.map((benefit, i) => (
                  <Badge key={i} variant="success">{benefit}</Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
