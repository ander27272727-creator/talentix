"use client"

import { useState, useEffect } from "react"
import {
  User, Save, Plus, Trash2, Edit2, MapPin,
  Linkedin, Globe, GraduationCap, Briefcase, Star, X, Laptop,
  Building2, Map, Plane, Clock, Loader2, Search, ChevronDown
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { useStore } from "@/store/useStore"

// ==========================================
// LISTAS DE SKILLS POPULARES POR CATEGORÍA
// ==========================================
const SKILL_CATEGORIES: Record<string, string[]> = {
  "Desarrollo Frontend": ["React", "Vue.js", "Angular", "Next.js", "TypeScript", "JavaScript", "HTML5", "CSS3", "Tailwind CSS", "Sass", "Redux", "GraphQL", "Storybook", "Svelte", "Flutter"],
  "Desarrollo Backend": ["Node.js", "Python", "Java", "Go", "Rust", "PHP", "Ruby on Rails", "Django", "Express.js", "NestJS", "Spring Boot", "ASP.NET", "Laravel"],
  "Bases de Datos": ["PostgreSQL", "MySQL", "MongoDB", "Redis", "Elasticsearch", "DynamoDB", "Cassandra", "SQLite", "Supabase", "Firebase"],
  "Cloud & DevOps": ["AWS", "Azure", "GCP", "Docker", "Kubernetes", "Terraform", "CI/CD", "Jenkins", "GitHub Actions", "Vercel", "Netlify", "Linux"],
  "Diseño": ["Figma", "Sketch", "Adobe XD", "Photoshop", "Illustrator", "InVision", "Miro", "Design Systems", "Prototyping"],
  "Datos & IA": ["Machine Learning", "TensorFlow", "PyTorch", "Pandas", "NumPy", "SQL", "Power BI", "Tableau", "Data Analytics", "NLP"],
  "Marketing": ["SEO", "SEM", "Google Ads", "Facebook Ads", "LinkedIn Ads", "HubSpot", "Mailchimp", "Content Marketing", "Copywriting", "Social Media"],
  "Business": ["Excel", "PowerPoint", "Project Management", "Agile", "Scrum", "Jira", "Notion", "Slack", "Salesforce", "CRM"],
  "Idiomas": ["Inglés", "Español", "Portugués", "Francés", "Alemán", "Chino", "Japonés", "Italiano"],
}

const ALL_SKILLS = Object.values(SKILL_CATEGORIES).flat()

const YEARS = Array.from({ length: 40 }, (_, i) => 2026 - i)

const DEGREE_TYPES = [
  "Técnico", "Tecnólogo", "Licenciatura", "Ingeniería", "Maestría", "Doctorado", "MBA", "Postgrado", "Diplomado", "Certificación"
]

// ==========================================
// COMPONENTE PRINCIPAL
// ==========================================
export default function CandidateProfilePage() {
  const { user } = useStore()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [isEditing, setIsEditing] = useState(false)

  // Skill picker
  const [showSkillPicker, setShowSkillPicker] = useState(false)
  const [skillSearch, setSkillSearch] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")

  // Education form
  const [showEduForm, setShowEduForm] = useState(false)
  const [eduForm, setEduForm] = useState({ institution: "", degree: "", field: "", startYear: "", endYear: "" })

  // Experience form
  const [showExpForm, setShowExpForm] = useState(false)
  const [expForm, setExpForm] = useState({ company: "", position: "", description: "", startYear: "", endYear: "", skills: [] as string[] })

  // Profile state
  const [profile, setProfile] = useState({
    name: "", email: "", phone: "", location: "", bio: "",
    linkedIn: "", portfolio: "",
    workPreference: "ANY" as "REMOTE" | "HYBRID" | "ONSITE" | "ANY",
    preferredCountries: [] as string[],
    openToRelocation: false,
    skills: [] as string[],
    education: [] as { institution: string; degree: string; field: string; startDate: string; endDate: string }[],
    experience: [] as { company: string; position: string; description: string; startDate: string; endDate: string; skills: string[] }[],
  })

  // Stats dinámicas
  const [stats, setStats] = useState({ matches: 0, assessmentsDone: 0, assessmentsTotal: 0, avgScore: 0 })

  useEffect(() => {
    if (!user?.id) return
    loadProfile()
    loadStats()
  }, [user?.id])

  async function loadProfile() {
    setLoading(true)
    try {
      const res = await fetch(`/api/candidate/profile?userId=${user!.id}`)
      const data = await res.json()
      if (data.success && data.profile) {
        const p = data.profile
        setProfile({
          name: p.user?.name || "",
          email: p.user?.email || "",
          phone: p.phone || "",
          location: p.location || "",
          bio: p.bio || "",
          linkedIn: p.linkedInUrl || "",
          portfolio: p.portfolioUrl || "",
          workPreference: "ANY",
          preferredCountries: [],
          openToRelocation: false,
          skills: p.skills || [],
          education: (p.education || []).map((e: Record<string, unknown>) => ({
            institution: e.institution as string,
            degree: e.degree as string,
            field: e.field as string,
            startDate: e.startDate ? new Date(e.startDate as string).getFullYear().toString() : "",
            endDate: e.endDate ? new Date(e.endDate as string).getFullYear().toString() : "",
          })),
          experience: (p.experience || []).map((e: Record<string, unknown>) => ({
            company: e.company as string,
            position: e.position as string,
            description: e.description as string,
            startDate: e.startDate ? new Date(e.startDate as string).getFullYear().toString() : "",
            endDate: e.endDate ? new Date(e.endDate as string).getFullYear().toString() : "",
            skills: (e.skills as string[]) || [],
          })),
        })
      }
    } catch (err) { console.error("Error:", err) }
    finally { setLoading(false) }
  }

  async function loadStats() {
    try {
      const [matchesRes, assessRes] = await Promise.all([
        fetch(`/api/candidate/matches?userId=${user!.id}`),
        fetch(`/api/candidate/assessments?userId=${user!.id}`),
      ])
      const matchesData = await matchesRes.json()
      const assessData = await assessRes.json()
      if (matchesData.success) {
        const m = matchesData.matches
        setStats(prev => ({
          ...prev,
          matches: m.length,
          avgScore: m.length > 0 ? Math.round(m.reduce((s: number, x: { overallMatch: number }) => s + x.overallMatch, 0) / m.length) : 0,
        }))
      }
      if (assessData.success) {
        const a = assessData.assessments
        setStats(prev => ({
          ...prev,
          assessmentsDone: a.filter((x: { completed: boolean }) => x.completed).length,
          assessmentsTotal: a.length,
        }))
      }
    } catch (err) { console.error("Error stats:", err) }
  }

  async function handleSave() {
    if (!user?.id) return
    setSaving(true)
    try {
      await fetch("/api/candidate/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          bio: profile.bio,
          location: profile.location,
          phone: profile.phone,
          skills: profile.skills,
          linkedInUrl: profile.linkedIn,
          portfolioUrl: profile.portfolio,
        }),
      })
      setIsEditing(false)
    } finally { setSaving(false) }
  }

  // Completitud del perfil
  const completionItems = [
    { label: "Datos personales", completed: !!(profile.name && profile.email) },
    { label: "Educación", completed: profile.education.length > 0 },
    { label: "Experiencia", completed: profile.experience.length > 0 },
    { label: "Skills", completed: profile.skills.length > 0 },
    { label: "CV subido", completed: false },
    { label: "Video introducción", completed: false },
  ]
  const profileCompletion = Math.round((completionItems.filter(c => c.completed).length / completionItems.length) * 100)

  // Skills filtradas
  const filteredSkills = skillSearch
    ? ALL_SKILLS.filter(s => s.toLowerCase().includes(skillSearch.toLowerCase()) && !profile.skills.includes(s))
    : selectedCategory
      ? SKILL_CATEGORIES[selectedCategory].filter(s => !profile.skills.includes(s))
      : []

  if (loading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <User className="h-8 w-8 text-primary" />
            Mi Perfil
          </h1>
          <p className="text-muted-foreground mt-1">Mantén tu perfil actualizado para obtener mejores matches.</p>
        </div>
        <Button
          variant={isEditing ? "fb" : "fb-outline"}
          onClick={() => { if (isEditing) handleSave(); else setIsEditing(true) }}
          disabled={saving}
        >
          {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : isEditing ? <Save className="mr-2 h-4 w-4" /> : <Edit2 className="mr-2 h-4 w-4" />}
          {saving ? "Guardando..." : isEditing ? "Guardar Cambios" : "Editar Perfil"}
        </Button>
      </div>

      {/* Completitud */}
      <Card className="border-2 border-fb-blue/20 bg-gradient-to-r from-fb-blue/5 to-fb-purple/5">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold">Completitud del Perfil</h3>
            <span className="text-2xl font-bold text-primary">{profileCompletion}%</span>
          </div>
          <Progress value={profileCompletion} className="mb-4" />
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {completionItems.map((item) => (
              <div key={item.label} className="flex items-center gap-2 text-sm">
                {item.completed ? "✅" : "⬜"} {item.label}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Datos Personales */}
          <Card>
            <CardHeader>
              <CardTitle>Datos Personales</CardTitle>
              <CardDescription>Información básica de contacto</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nombre Completo</Label>
                  <Input value={profile.name} onChange={e => setProfile({...profile, name: e.target.value})} disabled={!isEditing} />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input type="email" value={profile.email} disabled />
                </div>
                <div className="space-y-2">
                  <Label>Teléfono</Label>
                  <Input value={profile.phone} onChange={e => setProfile({...profile, phone: e.target.value})} disabled={!isEditing} placeholder="+52 55 1234 5678" />
                </div>
                <div className="space-y-2">
                  <Label>Ubicación</Label>
                  <Input value={profile.location} onChange={e => setProfile({...profile, location: e.target.value})} disabled={!isEditing} placeholder="Ciudad, País" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Bio Profesional</Label>
                <Textarea value={profile.bio} onChange={e => setProfile({...profile, bio: e.target.value})} disabled={!isEditing} rows={3} placeholder="Cuéntanos sobre ti..." />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>LinkedIn</Label>
                  <Input value={profile.linkedIn} onChange={e => setProfile({...profile, linkedIn: e.target.value})} disabled={!isEditing} placeholder="linkedin.com/in/tu-perfil" />
                </div>
                <div className="space-y-2">
                  <Label>Portfolio / Website</Label>
                  <Input value={profile.portfolio} onChange={e => setProfile({...profile, portfolio: e.target.value})} disabled={!isEditing} placeholder="tusitio.com" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Preferencias de Trabajo */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Laptop className="h-5 w-5 text-primary" /> Preferencias de Trabajo</CardTitle>
              <CardDescription>Indica dónde y cómo prefieres trabajar</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="text-base font-medium mb-3 block">¿Cómo prefieres trabajar?</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { value: "REMOTE", label: "Remoto", icon: Globe, desc: "Desde cualquier lugar" },
                    { value: "HYBRID", label: "Híbrido", icon: Building2, desc: "Presencial + remoto" },
                    { value: "ONSITE", label: "Presencial", icon: Map, desc: "En oficina" },
                    { value: "ANY", label: "Cualquiera", icon: Clock, desc: "Flexible" },
                  ].map(pref => (
                    <button key={pref.value} disabled={!isEditing}
                      onClick={() => setProfile({...profile, workPreference: pref.value as typeof profile.workPreference})}
                      className={`p-4 rounded-xl border-2 text-center transition-all ${profile.workPreference === pref.value ? "border-fb-blue bg-fb-blue/5" : "border-border hover:border-fb-blue/30"} ${!isEditing ? "opacity-70" : "cursor-pointer"}`}>
                      <pref.icon className={`h-6 w-6 mx-auto mb-2 ${profile.workPreference === pref.value ? "text-fb-blue" : "text-muted-foreground"}`} />
                      <div className="font-medium text-sm">{pref.label}</div>
                      <div className="text-xs text-muted-foreground mt-1">{pref.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
              <Separator />
              <div>
                <Label className="text-base font-medium mb-3 block">¿Dispuesto a reubicarte?</Label>
                <button disabled={!isEditing}
                  onClick={() => setProfile({...profile, openToRelocation: !profile.openToRelocation})}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${profile.openToRelocation ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"} ${!isEditing ? "opacity-70" : "cursor-pointer"}`}>
                  {profile.openToRelocation ? "Sí, dispuesto/a" : "No, solo local"}
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Educación CON FORMULARIO */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2"><GraduationCap className="h-5 w-5" /> Educación</CardTitle>
                  <CardDescription>Tu formación académica</CardDescription>
                </div>
                {isEditing && (
                  <Button variant="outline" size="sm" onClick={() => setShowEduForm(!showEduForm)}>
                    <Plus className="mr-2 h-4 w-4" /> Agregar
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Formulario de educación */}
              {showEduForm && (
                <div className="p-4 rounded-xl border-2 border-dashed border-fb-blue/30 bg-fb-blue/5 space-y-3">
                  <h4 className="font-medium text-sm">Nueva Educación</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label className="text-xs">Institución</Label>
                      <Input placeholder="Ej: Universidad Nacional" value={eduForm.institution} onChange={e => setEduForm({...eduForm, institution: e.target.value})} />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Tipo de Título</Label>
                      <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={eduForm.degree} onChange={e => setEduForm({...eduForm, degree: e.target.value})}>
                        <option value="">Seleccionar...</option>
                        {DEGREE_TYPES.map(d => <option key={d} value={d}>{d}</option>)}
                      </select>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Campo de Estudio</Label>
                      <Input placeholder="Ej: Ingeniería Informática" value={eduForm.field} onChange={e => setEduForm({...eduForm, field: e.target.value})} />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <Label className="text-xs">Año Inicio</Label>
                        <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={eduForm.startYear} onChange={e => setEduForm({...eduForm, startYear: e.target.value})}>
                          <option value="">Año</option>
                          {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                        </select>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Año Fin</Label>
                        <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={eduForm.endYear} onChange={e => setEduForm({...eduForm, endYear: e.target.value})}>
                          <option value="">Año</option>
                          {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                          <option value="Presente">Presente</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="fb" onClick={() => {
                      if (eduForm.institution && eduForm.degree) {
                        setProfile({...profile, education: [...profile.education, { institution: eduForm.institution, degree: eduForm.degree, field: eduForm.field, startDate: eduForm.startYear, endDate: eduForm.endYear }]})
                        setEduForm({ institution: "", degree: "", field: "", startYear: "", endYear: "" })
                        setShowEduForm(false)
                      }
                    }}>Guardar</Button>
                    <Button size="sm" variant="outline" onClick={() => setShowEduForm(false)}>Cancelar</Button>
                  </div>
                </div>
              )}

              {/* Lista de educación */}
              {profile.education.length === 0 && !showEduForm ? (
                <p className="text-center text-muted-foreground py-4">Agrega tu formación académica para completar tu perfil.</p>
              ) : (
                profile.education.map((edu, i) => (
                  <div key={i} className="p-4 rounded-xl bg-muted/50">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium">{edu.degree} {edu.field && `- ${edu.field}`}</h4>
                        <p className="text-sm text-muted-foreground">{edu.institution}</p>
                        <p className="text-xs text-muted-foreground mt-1">{edu.startDate} - {edu.endDate || "Presente"}</p>
                      </div>
                      {isEditing && (
                        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-red-500"
                          onClick={() => setProfile({...profile, education: profile.education.filter((_, j) => j !== i)})}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Experiencia CON FORMULARIO */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2"><Briefcase className="h-5 w-5" /> Experiencia</CardTitle>
                  <CardDescription>Tu trayectoria profesional</CardDescription>
                </div>
                {isEditing && (
                  <Button variant="outline" size="sm" onClick={() => setShowExpForm(!showExpForm)}>
                    <Plus className="mr-2 h-4 w-4" /> Agregar
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Formulario de experiencia */}
              {showExpForm && (
                <div className="p-4 rounded-xl border-2 border-dashed border-fb-blue/30 bg-fb-blue/5 space-y-3">
                  <h4 className="font-medium text-sm">Nueva Experiencia</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label className="text-xs">Empresa</Label>
                      <Input placeholder="Ej: TechCorp Solutions" value={expForm.company} onChange={e => setExpForm({...expForm, company: e.target.value})} />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Cargo / Posición</Label>
                      <Input placeholder="Ej: Desarrollador Full Stack" value={expForm.position} onChange={e => setExpForm({...expForm, position: e.target.value})} />
                    </div>
                    <div className="col-span-full space-y-1">
                      <Label className="text-xs">Descripción</Label>
                      <Textarea placeholder="Describe tus responsabilidades y logros..." value={expForm.description} onChange={e => setExpForm({...expForm, description: e.target.value})} rows={2} />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <Label className="text-xs">Año Inicio</Label>
                        <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={expForm.startYear} onChange={e => setExpForm({...expForm, startYear: e.target.value})}>
                          <option value="">Año</option>
                          {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                        </select>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Año Fin</Label>
                        <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={expForm.endYear} onChange={e => setExpForm({...expForm, endYear: e.target.value})}>
                          <option value="">Año</option>
                          {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                          <option value="Presente">Presente</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="fb" onClick={() => {
                      if (expForm.company && expForm.position) {
                        setProfile({...profile, experience: [...profile.experience, { company: expForm.company, position: expForm.position, description: expForm.description, startDate: expForm.startYear, endDate: expForm.endYear, skills: expForm.skills }]})
                        setExpForm({ company: "", position: "", description: "", startYear: "", endYear: "", skills: [] })
                        setShowExpForm(false)
                      }
                    }}>Guardar</Button>
                    <Button size="sm" variant="outline" onClick={() => setShowExpForm(false)}>Cancelar</Button>
                  </div>
                </div>
              )}

              {/* Lista de experiencia */}
              {profile.experience.length === 0 && !showExpForm ? (
                <p className="text-center text-muted-foreground py-4">Agrega tu experiencia laboral para completar tu perfil.</p>
              ) : (
                profile.experience.map((exp, i) => (
                  <div key={i} className="p-4 rounded-xl bg-muted/50">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium">{exp.position}</h4>
                        <p className="text-sm text-muted-foreground">{exp.company}</p>
                        {exp.description && <p className="text-sm text-muted-foreground mt-1">{exp.description}</p>}
                        <p className="text-xs text-muted-foreground mt-1">{exp.startDate} - {exp.endDate || "Presente"}</p>
                        {exp.skills.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {exp.skills.map(s => <Badge key={s} variant="secondary" className="text-xs">{s}</Badge>)}
                          </div>
                        )}
                      </div>
                      {isEditing && (
                        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-red-500"
                          onClick={() => setProfile({...profile, experience: profile.experience.filter((_, j) => j !== i)})}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Avatar */}
          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-fb-blue to-fb-purple flex items-center justify-center text-white font-bold text-3xl mx-auto mb-4">
                {profile.name ? profile.name.charAt(0).toUpperCase() : "U"}
              </div>
              <h3 className="font-semibold text-lg">{profile.name || "Sin nombre"}</h3>
              <p className="text-sm text-muted-foreground">{profile.location || "Sin ubicación"}</p>
            </CardContent>
          </Card>

          {/* Skills CON PICKER */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Star className="h-5 w-5 text-amber-500" /> Skills</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {profile.skills.length === 0 ? (
                  <p className="text-sm text-muted-foreground">{isEditing ? "Agrega tus skills para mejorar tus matches" : "Sin skills definidos"}</p>
                ) : (
                  profile.skills.map(skill => (
                    <Badge key={skill} variant="secondary" className="text-sm">
                      {skill}
                      {isEditing && (
                        <button className="ml-1 hover:text-red-500" onClick={() => setProfile({...profile, skills: profile.skills.filter(s => s !== skill)})}>
                          <X className="h-3 w-3" />
                        </button>
                      )}
                    </Badge>
                  ))
                )}
              </div>

              {isEditing && (
                <>
                  {!showSkillPicker ? (
                    <Button variant="outline" size="sm" className="w-full mt-4" onClick={() => setShowSkillPicker(true)}>
                      <Plus className="mr-2 h-4 w-4" /> Agregar Skill
                    </Button>
                  ) : (
                    <div className="mt-3 p-3 rounded-xl border-2 border-dashed border-fb-blue/30 bg-fb-blue/5 space-y-3">
                      <div className="flex items-center gap-2">
                        <Search className="h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Buscar skill..." value={skillSearch} onChange={e => { setSkillSearch(e.target.value); setSelectedCategory("") }} className="text-sm" />
                        <Button variant="ghost" size="icon" onClick={() => { setShowSkillPicker(false); setSkillSearch(""); setSelectedCategory("") }}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>

                      {/* Categorías */}
                      <div className="flex flex-wrap gap-1">
                        {Object.keys(SKILL_CATEGORIES).map(cat => (
                          <button key={cat} onClick={() => { setSelectedCategory(selectedCategory === cat ? "" : cat); setSkillSearch("") }}
                            className={`px-2 py-1 rounded text-xs transition-all ${selectedCategory === cat ? "bg-fb-blue text-white" : "bg-muted hover:bg-muted/80"}`}>
                            {cat}
                          </button>
                        ))}
                      </div>

                      {/* Resultados */}
                      <div className="flex flex-wrap gap-1 max-h-40 overflow-y-auto">
                        {filteredSkills.map(skill => (
                          <button key={skill} onClick={() => setProfile({...profile, skills: [...profile.skills, skill]})}
                            className="px-2 py-1 rounded bg-background border text-xs hover:bg-fb-blue hover:text-white transition-all">
                            + {skill}
                          </button>
                        ))}
                        {filteredSkills.length === 0 && (skillSearch || selectedCategory) && (
                          <p className="text-xs text-muted-foreground">No se encontraron skills</p>
                        )}
                      </div>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>

          {/* Stats DINÁMICAS */}
          <Card>
            <CardHeader><CardTitle>Estadísticas del Perfil</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Matches activos</span>
                <span className="font-medium">{stats.matches}</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Evaluaciones</span>
                <span className="font-medium">{stats.assessmentsDone}/{stats.assessmentsTotal}</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Score promedio</span>
                <span className="font-medium text-primary">{stats.avgScore}%</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
