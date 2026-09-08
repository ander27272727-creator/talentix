"use client"

import { useState } from "react"
import {
  User, Save, Plus, Trash2, Edit2, MapPin, Mail, Phone,
  Linkedin, Globe, GraduationCap, Briefcase, Star, X, Laptop,
  Building2, Map, Plane, Clock
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"

export default function CandidateProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [profile, setProfile] = useState({
    name: "María García",
    email: "maria@example.com",
    phone: "+34 612 345 678",
    location: "Madrid, España",
    country: "España",
    age: 28,
    bio: "Ingeniera de software con 5 años de experiencia en desarrollo full stack. Apasionada por crear productos que impacten positivamente a los usuarios.",
    linkedIn: "linkedin.com/in/mariagarcia",
    portfolio: "mariagarcia.dev",
    // Work preferences
    workPreference: "REMOTE" as "REMOTE" | "HYBRID" | "ONSITE" | "ANY",
    preferredCountries: ["España", "México", "Colombia", "Estados Unidos"],
    openToRelocation: true,
    skills: ["React", "TypeScript", "Node.js", "Python", "PostgreSQL", "AWS", "Docker", "GraphQL"],
    education: [
      {
        institution: "Universidad Politécnica de Madrid",
        degree: "Grado en Ingeniería Informática",
        field: "Ingeniería del Software",
        startDate: "2015",
        endDate: "2019",
      },
    ],
    experience: [
      {
        company: "TechCorp Solutions",
        position: "Senior Full Stack Developer",
        description: "Desarrollo de aplicaciones web escalables usando React y Node.js. Liderazgo técnico de equipo de 5 desarrolladores.",
        startDate: "2022",
        endDate: "Presente",
        skills: ["React", "Node.js", "TypeScript", "AWS"],
      },
      {
        company: "StartupXYZ",
        position: "Full Stack Developer",
        description: "Desarrollo de MVP desde cero. Implementación de arquitectura de microservicios.",
        startDate: "2019",
        endDate: "2022",
        skills: ["React", "Python", "PostgreSQL", "Docker"],
      },
    ],
  })

  const completionItems = [
    { label: "Datos personales", completed: true },
    { label: "Educación", completed: true },
    { label: "Experiencia", completed: true },
    { label: "Skills", completed: true },
    { label: "CV subido", completed: false },
    { label: "Video introducción", completed: false },
  ]

  const completionPercentage = Math.round(
    (completionItems.filter((item) => item.completed).length / completionItems.length) * 100
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <User className="h-8 w-8 text-primary" />
            Mi Perfil
          </h1>
          <p className="text-muted-foreground mt-1">
            Mantén tu perfil actualizado para obtener mejores matches.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={isEditing ? "fb" : "fb-outline"}
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? (
              <>
                <Save className="mr-2 h-4 w-4" />
                Guardar Cambios
              </>
            ) : (
              <>
                <Edit2 className="mr-2 h-4 w-4" />
                Editar Perfil
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Completion Progress */}
      <Card className="border-2 border-primary/20 bg-primary/5">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold">Completitud del Perfil</h3>
              <p className="text-sm text-muted-foreground">
                Un perfil completo aumenta tus posibilidades de match
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-primary">{completionPercentage}%</div>
            </div>
          </div>
          <Progress value={completionPercentage} className="h-3 mb-4" />
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {completionItems.map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-sm">
                <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                  item.completed ? "bg-emerald-500" : "bg-muted"
                }`}>
                  {item.completed && (
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <span className={item.completed ? "text-foreground" : "text-muted-foreground"}>
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Info */}
          <Card>
            <CardHeader>
              <CardTitle>Datos Personales</CardTitle>
              <CardDescription>Información básica de contacto</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre Completo</Label>
                  <Input
                    id="name"
                    value={profile.name}
                    onChange={(e) => setProfile({...profile, name: e.target.value})}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({...profile, email: e.target.value})}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Teléfono</Label>
                  <Input
                    id="phone"
                    value={profile.phone}
                    onChange={(e) => setProfile({...profile, phone: e.target.value})}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Ubicación Actual</Label>
                  <Input
                    id="location"
                    value={profile.location}
                    onChange={(e) => setProfile({...profile, location: e.target.value})}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">País</Label>
                  <Input
                    id="country"
                    value={profile.country}
                    onChange={(e) => setProfile({...profile, country: e.target.value})}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="age">Edad</Label>
                  <Input
                    id="age"
                    type="number"
                    value={profile.age}
                    onChange={(e) => setProfile({...profile, age: parseInt(e.target.value) || 0})}
                    disabled={!isEditing}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">Bio Profesional</Label>
                <Textarea
                  id="bio"
                  value={profile.bio}
                  onChange={(e) => setProfile({...profile, bio: e.target.value})}
                  disabled={!isEditing}
                  rows={3}
                />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="linkedin">LinkedIn</Label>
                  <Input
                    id="linkedin"
                    value={profile.linkedIn}
                    onChange={(e) => setProfile({...profile, linkedIn: e.target.value})}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="portfolio">Portfolio / Website</Label>
                  <Input
                    id="portfolio"
                    value={profile.portfolio}
                    onChange={(e) => setProfile({...profile, portfolio: e.target.value})}
                    disabled={!isEditing}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Work Preferences */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Laptop className="h-5 w-5 text-primary" />
                Preferencias de Trabajo
              </CardTitle>
              <CardDescription>Indica dónde y cómo prefieres trabajar para mejores matches</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="text-base font-medium mb-3 block">¿Cómo prefieres trabajar?</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { value: "REMOTE", label: "Remoto", icon: Globe, desc: "Desde cualquier lugar del mundo" },
                    { value: "HYBRID", label: "Híbrido", icon: Building2, desc: "Presencial + remoto" },
                    { value: "ONSITE", label: "Presencial", icon: Map, desc: "En oficina de la empresa" },
                    { value: "ANY", label: "Cualquiera", icon: Clock, desc: "Flexible a cualquier modalidad" },
                  ].map((pref) => (
                    <button
                      key={pref.value}
                      disabled={!isEditing}
                      onClick={() => setProfile({...profile, workPreference: pref.value as any})}
                      className={`p-4 rounded-xl border-2 text-center transition-all ${
                        profile.workPreference === pref.value
                          ? "border-fb-blue bg-fb-blue/5 shadow-md"
                          : "border-border hover:border-fb-blue/30"
                      } ${!isEditing ? "opacity-70 cursor-not-allowed" : "cursor-pointer"}`}
                    >
                      <pref.icon className={`h-6 w-6 mx-auto mb-2 ${
                        profile.workPreference === pref.value ? "text-fb-blue" : "text-muted-foreground"
                      }`} />
                      <div className="font-medium text-sm">{pref.label}</div>
                      <div className="text-xs text-muted-foreground mt-1">{pref.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              <Separator />

              <div>
                <Label className="text-base font-medium mb-3 block">Países donde quieres trabajar</Label>
                <p className="text-xs text-muted-foreground mb-3">
                  Selecciona los países donde estarías interesado en trabajar.
                </p>
                <div className="flex flex-wrap gap-2">
                  {["España", "México", "Colombia", "Argentina", "Chile", "Perú",
                    "Estados Unidos", "Brasil", "Alemania", "Francia", "Reino Unido",
                    "Canadá", "Portugal", "Italia", "Japón", "Australia"].map((country) => (
                    <button
                      key={country}
                      disabled={!isEditing}
                      onClick={() => {
                        const current = profile.preferredCountries
                        const updated = current.includes(country)
                          ? current.filter(c => c !== country)
                          : [...current, country]
                        setProfile({...profile, preferredCountries: updated})
                      }}
                      className={`px-3 py-1.5 rounded-lg border text-sm transition-all ${
                        profile.preferredCountries.includes(country)
                          ? "border-fb-blue bg-fb-blue/5 text-fb-blue font-medium"
                          : "border-border hover:border-fb-blue/30"
                      } ${!isEditing ? "opacity-70 cursor-not-allowed" : "cursor-pointer"}`}
                    >
                      {country}
                    </button>
                  ))}
                </div>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-sm">¿Dispuesto a reubicarte?</div>
                  <div className="text-xs text-muted-foreground">Si la empresa lo requiere, ¿te mudarías?</div>
                </div>
                <button
                  disabled={!isEditing}
                  onClick={() => setProfile({...profile, openToRelocation: !profile.openToRelocation})}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    profile.openToRelocation
                      ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                      : "bg-red-100 text-red-700 border border-red-200"
                  } ${!isEditing ? "opacity-70 cursor-not-allowed" : "cursor-pointer"}`}
                >
                  {profile.openToRelocation ? "Sí, dispuesto/a" : "No, solo local"}
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Education */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="h-5 w-5" />
                    Educación
                  </CardTitle>
                  <CardDescription>Tu formación académica</CardDescription>
                </div>
                {isEditing && (
                  <Button variant="outline" size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    Agregar
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {profile.education.map((edu, i) => (
                <div key={i} className="p-4 rounded-xl bg-muted/50">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium">{edu.degree}</h4>
                      <p className="text-sm text-muted-foreground">{edu.institution}</p>
                      <p className="text-sm text-muted-foreground">{edu.field}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {edu.startDate} - {edu.endDate}
                      </p>
                    </div>
                    {isEditing && (
                      <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-red-500">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Experience */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="h-5 w-5" />
                    Experiencia
                  </CardTitle>
                  <CardDescription>Tu trayectoria profesional</CardDescription>
                </div>
                {isEditing && (
                  <Button variant="outline" size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    Agregar
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {profile.experience.map((exp, i) => (
                <div key={i} className="p-4 rounded-xl bg-muted/50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium">{exp.position}</h4>
                      <p className="text-sm text-muted-foreground">{exp.company}</p>
                      <p className="text-sm text-muted-foreground mt-2">{exp.description}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {exp.startDate} - {exp.endDate}
                      </p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {exp.skills.map((skill) => (
                          <Badge key={skill} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    {isEditing && (
                      <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-red-500">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Avatar */}
          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-fb-blue to-fb-purple flex items-center justify-center text-white font-bold text-3xl mx-auto mb-4">
                MG
              </div>
              <h3 className="font-semibold text-lg">{profile.name}</h3>
              <p className="text-sm text-muted-foreground">{profile.location}</p>
              <div className="flex justify-center gap-2 mt-3">
                <Badge variant="info">
                  <MapPin className="h-3 w-3 mr-1" />
                  {profile.location}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Skills */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5 text-amber-500" />
                Skills
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((skill) => (
                  <Badge key={skill} variant="secondary" className="text-sm">
                    {skill}
                    {isEditing && (
                      <button className="ml-1 hover:text-red-500">
                        <X className="h-3 w-3" />
                      </button>
                    )}
                  </Badge>
                ))}
              </div>
              {isEditing && (
                <Button variant="outline" size="sm" className="w-full mt-4">
                  <Plus className="mr-2 h-4 w-4" />
                  Agregar Skill
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Estadísticas del Perfil</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Visitas al perfil</span>
                <span className="font-medium">24</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Matches activos</span>
                <span className="font-medium">5</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Evaluaciones</span>
                <span className="font-medium">4/7</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Score promedio</span>
                <span className="font-medium text-primary">88%</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
