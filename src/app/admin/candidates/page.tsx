"use client"

import { useState } from "react"
import {
  Users, Search, Eye, Phone, Mail, MessageSquare, ExternalLink,
  CheckCircle2, Clock, Brain, Target, Award, Briefcase, GraduationCap,
  Globe, MapPin, Send, X, ChevronRight, Sparkles, AlertCircle,
  FileText, Star, Building2, ArrowRight
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"

const candidates = [
  {
    id: "1", name: "María García", email: "maria@email.com", phone: "+57 310 123 4567", whatsapp: "+573101234567",
    location: "Bogotá, Colombia", country: "Colombia", workType: "Remoto",
    age: 28, education: "Ingeniería de Sistemas", university: "Universidad Nacional",
    experience: "5 años", languages: ["Español", "Inglés", "Portugués"],
    skills: ["React", "TypeScript", "Node.js", "Python", "AWS", "Docker", "PostgreSQL", "GraphQL", "Next.js", "Tailwind", "Git", "CI/CD"],
    assessments: { cognitive: 92, psychometric: 87, behavioral: 85, technical: 88 },
    overallScore: 89, profileCompletion: 85,
    matches: 8, referredTo: 2, status: "disponible",
    registeredAt: "2026-06-15", lastActive: "Hace 2 horas",
    bio: "Desarrolladora Full Stack con 5 años de experiencia en startups de tecnología. Apasionada por crear productos escalables.",
  },
  {
    id: "2", name: "Carlos Ruiz", email: "carlos@email.com", phone: "+52 55 987 6543", whatsapp: "+52559876543",
    location: "Ciudad de México, México", country: "México", workType: "Híbrido",
    age: 32, education: "Maestría en Ciencia de Datos", university: "Tec de Monterrey",
    experience: "8 años", languages: ["Español", "Inglés"],
    skills: ["Python", "Machine Learning", "TensorFlow", "SQL", "Pandas", "Spark", "Tableau", "Power BI", "Azure", "R"],
    assessments: { cognitive: 88, psychometric: 91, behavioral: 82, technical: 90 },
    overallScore: 88, profileCompletion: 92,
    matches: 5, referredTo: 1, status: "en_proceso",
    registeredAt: "2026-07-01", lastActive: "Ayer",
    bio: "Científico de datos con experiencia en modelos de ML para fintech. Buscando liderar equipo de datos.",
  },
  {
    id: "3", name: "Ana Martínez", email: "ana@email.com", phone: "+34 612 345 678", whatsapp: "+34612345678",
    location: "Madrid, España", country: "España", workType: "Remoto",
    age: 26, education: "Diseño UX/UI", university: "IED Madrid",
    experience: "3 años", languages: ["Español", "Inglés", "Francés"],
    skills: ["Figma", "Sketch", "Adobe XD", "Prototyping", "User Research", "HTML/CSS", "JavaScript", "React"],
    assessments: { cognitive: 85, psychometric: 89, behavioral: 90, technical: 82 },
    overallScore: 87, profileCompletion: 78,
    matches: 6, referredTo: 0, status: "disponible",
    registeredAt: "2026-07-15", lastActive: "Hace 5 horas",
    bio: "Diseñadora UX/UI especializada en productos SaaS. Enfoque en accesibilidad y design systems.",
  },
  {
    id: "4", name: "Pedro Sánchez", email: "pedro@email.com", phone: "+56 9 8765 4321", whatsapp: "+56987654321",
    location: "Santiago, Chile", country: "Chile", workType: "Presencial",
    age: 35, education: "Ingeniería Civil Industrial", university: "PUC Chile",
    experience: "10 años", languages: ["Español", "Inglés"],
    skills: ["Gestión de Proyectos", "Scrum", "PMP", "Excel avanzado", "Power BI", "Lean Six Sigma", "Liderazgo"],
    assessments: { cognitive: 80, psychometric: 93, behavioral: 91, technical: 78 },
    overallScore: 86, profileCompletion: 95,
    matches: 4, referredTo: 1, status: "contratado",
    registeredAt: "2026-06-01", lastActive: "Hace 3 días",
    bio: "Project Manager certificado PMP con 10 años liderando equipos de hasta 25 personas en retail y logística.",
  },
  {
    id: "5", name: "Laura López", email: "laura@email.com", phone: "+54 11 5555 1234", whatsapp: "+541155551234",
    location: "Buenos Aires, Argentina", country: "Argentina", workType: "Remoto",
    age: 24, education: "Lic. en Marketing Digital", university: "UBA",
    experience: "2 años", languages: ["Español", "Inglés", "Italiano"],
    skills: ["SEO", "Google Ads", "Meta Ads", "Analytics", "HubSpot", "Copywriting", "Social Media", "Email Marketing"],
    assessments: { cognitive: 78, psychometric: 85, behavioral: 88, technical: 75 },
    overallScore: 82, profileCompletion: 70,
    matches: 3, referredTo: 0, status: "disponible",
    registeredAt: "2026-08-01", lastActive: "Hace 1 semana",
    bio: "Especialista en marketing digital con enfoque en growth hacking y automatización.",
  },
]

const companies = [
  { id: "1", name: "TechCorp Solutions" },
  { id: "2", name: "InnovateLab" },
  { id: "3", name: "DataPro Analytics" },
  { id: "4", name: "GlobalTech Corp" },
  { id: "5", name: "StartupXYZ" },
]

export default function AdminCandidatesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCandidate, setSelectedCandidate] = useState<typeof candidates[0] | null>(null)
  const [showReferralModal, setShowReferralModal] = useState(false)
  const [showMessageModal, setShowMessageModal] = useState(false)
  const [messageText, setMessageText] = useState("")
  const [referralCompany, setReferralCompany] = useState("")

  const filtered = candidates.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "disponible": return <Badge className="bg-emerald-100 text-emerald-700">Disponible</Badge>
      case "en_proceso": return <Badge className="bg-amber-100 text-amber-700">En Proceso</Badge>
      case "contratado": return <Badge className="bg-blue-100 text-blue-700">Contratado</Badge>
      default: return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Users className="h-7 w-7 text-fb-blue" />
            Candidatos
          </h1>
          <p className="text-muted-foreground mt-1">Gestión de todos los candidatos registrados.</p>
        </div>
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Buscar por nombre, email o skill..." className="pl-10" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
        </div>
      </div>

      {/* Candidate List */}
      <div className="space-y-3">
        {filtered.map((c) => (
          <Card key={c.id} className="hover:shadow-md transition-all duration-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-fb-blue to-fb-purple flex items-center justify-center text-white font-medium shrink-0">
                  {c.name.split(" ").map(n => n[0]).join("")}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold">{c.name}</span>
                    {getStatusBadge(c.status)}
                    <span className="text-xs text-muted-foreground">{c.lastActive}</span>
                  </div>
                  <div className="text-sm text-muted-foreground truncate">
                    {c.email} · {c.location} · {c.workType}
                  </div>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {c.skills.slice(0, 5).map(s => (
                      <Badge key={s} variant="outline" className="text-xs">{s}</Badge>
                    ))}
                    {c.skills.length > 5 && <Badge variant="outline" className="text-xs">+{c.skills.length - 5}</Badge>}
                  </div>
                </div>
                <div className="flex gap-2 text-center text-sm shrink-0">
                  <div className="w-14"><div className="font-bold text-fb-blue">{c.overallScore}%</div><div className="text-xs text-muted-foreground">Score</div></div>
                  <div className="w-14"><div className="font-bold">{Object.keys(c.assessments).length}</div><div className="text-xs text-muted-foreground">Evals</div></div>
                  <div className="w-14"><div className="font-bold text-emerald-600">{c.matches}</div><div className="text-xs text-muted-foreground">Matches</div></div>
                </div>
                <div className="flex gap-1 shrink-0">
                  <Button variant="ghost" size="icon" className="h-9 w-9" title="Ver perfil completo" onClick={() => setSelectedCandidate(c)}>
                    <Eye className="h-4 w-4 text-fb-blue" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-9 w-9" title="Enviar WhatsApp" onClick={() => window.open(`https://wa.me/${c.whatsapp}`, "_blank")}>
                    <Phone className="h-4 w-4 text-emerald-600" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-9 w-9" title="Enviar mensaje" onClick={() => { setSelectedCandidate(c); setShowMessageModal(true) }}>
                    <MessageSquare className="h-4 w-4 text-fb-purple" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Candidate Detail Modal */}
      {selectedCandidate && !showMessageModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedCandidate(null)}>
          <div className="bg-background rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
            {/* Header */}
            <div className="p-6 border-b bg-gradient-to-r from-fb-blue/5 to-fb-purple/5 rounded-t-2xl">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-fb-blue to-fb-purple flex items-center justify-center text-white text-xl font-bold">
                    {selectedCandidate.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">{selectedCandidate.name}</h2>
                    <p className="text-muted-foreground">{selectedCandidate.email}</p>
                    <div className="flex gap-2 mt-2">
                      {getStatusBadge(selectedCandidate.status)}
                      <Badge className="bg-fb-blue/10 text-fb-blue">{selectedCandidate.overallScore}% match</Badge>
                    </div>
                  </div>
                </div>
                <button onClick={() => setSelectedCandidate(null)} className="p-2 hover:bg-muted rounded-lg"><X className="h-5 w-5" /></button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Bio */}
              <p className="text-sm text-muted-foreground">{selectedCandidate.bio}</p>

              {/* Info Grid */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: MapPin, label: "Ubicación", value: selectedCandidate.location },
                  { icon: Globe, label: "Trabajo", value: selectedCandidate.workType },
                  { icon: GraduationCap, label: "Educación", value: `${selectedCandidate.education} - ${selectedCandidate.university}` },
                  { icon: Briefcase, label: "Experiencia", value: selectedCandidate.experience },
                  { icon: Globe, label: "Idiomas", value: selectedCandidate.languages.join(", ") },
                  { icon: Clock, label: "Última conexión", value: selectedCandidate.lastActive },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-2 p-2 rounded-lg bg-muted/30">
                    <item.icon className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                    <div>
                      <div className="text-xs text-muted-foreground">{item.label}</div>
                      <div className="text-sm font-medium">{item.value}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Evaluations */}
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2"><Brain className="h-4 w-4" /> Evaluaciones</h3>
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(selectedCandidate.assessments).map(([dim, score]) => (
                    <div key={dim} className="p-3 rounded-xl bg-muted/30">
                      <div className="flex justify-between mb-1">
                        <span className="text-xs font-medium capitalize">{dim === "cognitive" ? "Cognitiva" : dim === "psychometric" ? "Psicométrica" : dim === "behavioral" ? "Comportamental" : "Técnica"}</span>
                        <span className="text-sm font-bold">{score}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div className="h-2 rounded-full bg-fb-blue" style={{ width: `${score}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Skills */}
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2"><Star className="h-4 w-4" /> Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedCandidate.skills.map(s => (
                    <Badge key={s} variant="outline">{s}</Badge>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Actions */}
              <div className="flex flex-wrap gap-2">
                <Button variant="fb" onClick={() => setShowReferralModal(true)}>
                  <Building2 className="h-4 w-4 mr-2" />
                  Derivar a Empresa
                </Button>
                <Button variant="fb-outline" onClick={() => window.open(`https://wa.me/${selectedCandidate.whatsapp}`, "_blank")}>
                  <Phone className="h-4 w-4 mr-2" />
                  WhatsApp
                </Button>
                <Button variant="fb-outline" onClick={() => setShowMessageModal(true)}>
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Mensaje
                </Button>
                <Button variant="fb-outline">
                  <FileText className="h-4 w-4 mr-2" />
                  Ver CV
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Referral Modal */}
      {showReferralModal && selectedCandidate && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowReferralModal(false)}>
          <div className="bg-background rounded-2xl max-w-md w-full shadow-2xl p-6" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Building2 className="h-5 w-5 text-fb-blue" />
              Derivar a Empresa
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Selecciona la empresa para derivar a <strong>{selectedCandidate.name}</strong>
            </p>
            <div className="space-y-2 mb-4">
              {companies.map(co => (
                <button key={co.id} onClick={() => setReferralCompany(co.name)}
                  className={`w-full text-left p-3 rounded-xl border-2 transition-all ${
                    referralCompany === co.name ? "border-fb-blue bg-fb-blue/5" : "border-border hover:border-fb-blue/30"
                  }`}>
                  <span className="font-medium text-sm">{co.name}</span>
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => setShowReferralModal(false)}>Cancelar</Button>
              <Button variant="fb" className="flex-1" disabled={!referralCompany} onClick={() => { setShowReferralModal(false); setSelectedCandidate(null) }}>
                <Send className="h-4 w-4 mr-2" />
                Derivar
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Message Modal */}
      {showMessageModal && selectedCandidate && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowMessageModal(false)}>
          <div className="bg-background rounded-2xl max-w-md w-full shadow-2xl p-6" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-fb-purple" />
              Mensaje a {selectedCandidate.name}
            </h3>
            <div className="flex items-center gap-2 p-3 rounded-xl bg-muted/50 mb-4">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-fb-blue to-fb-purple flex items-center justify-center text-white text-xs font-bold">
                {selectedCandidate.name.split(" ").map(n => n[0]).join("")}
              </div>
              <div>
                <div className="text-sm font-medium">{selectedCandidate.name}</div>
                <div className="text-xs text-muted-foreground">{selectedCandidate.email}</div>
              </div>
            </div>
            <Textarea
              placeholder="Escribe tu mensaje..."
              className="min-h-[120px] mb-4"
              value={messageText}
              onChange={e => setMessageText(e.target.value)}
            />
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => setShowMessageModal(false)}>Cancelar</Button>
              <Button variant="fb" className="flex-1" disabled={!messageText} onClick={() => { setShowMessageModal(false); setMessageText(""); setSelectedCandidate(null) }}>
                <Send className="h-4 w-4 mr-2" />
                Enviar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
