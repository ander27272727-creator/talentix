"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Users, Building2, Brain, Target, Shield, Zap, Globe,
  ArrowRight, CheckCircle2, Star, ChevronRight, Sparkles,
  LineChart, Heart, Award, TrendingUp, Menu, X, Play
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

// Stats data
const stats = [
  { number: "50K+", label: "Candidatos Activos" },
  { number: "2,500+", label: "Empresas Registradas" },
  { number: "95%", label: "Tasa de Satisfacción" },
  { number: "40%", label: "Reducción Time-to-Hire" },
]

// Features for candidates
const candidateFeatures = [
  {
    icon: Brain,
    title: "Evaluaciones Científicas",
    description: "Tests psicométricos, cognitivos y comportamentales basados en la ciencia, no en trivia.",
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    icon: Target,
    title: "Matching Inteligente",
    description: "Nuestra IA analiza tu perfil y te posiciona donde encajas mejor. Tú no buscas, nosotros te encontramos.",
    color: "text-purple-600",
    bg: "bg-purple-50",
  },
  {
    icon: TrendingUp,
    title: "Career Path AI",
    description: "Descubre tu mejor camino profesional y recibe recomendaciones para crecer.",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
]

// Features for companies
const companyFeatures = [
  {
    icon: Users,
    title: "Talento Pre-Evaluado",
    description: "Recibe candidatos rankeados por fit, no por keywords. Ahorra horas de screening.",
    color: "text-orange-600",
    bg: "bg-orange-50",
  },
  {
    icon: LineChart,
    title: "Analytics Avanzados",
    description: "Métricas de hiring, funnel de conversión, y benchmarking salarial por sector.",
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    icon: Shield,
    title: "Matching Bidireccional",
    description: "No solo evaluamos si el candidato te sirve, sino si tu empresa es buena para él. Más retención, menos rotación.",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
]

// How it works steps
const howItWorks = [
  {
    step: "1",
    title: "El Candidato se Evalúa",
    description: "Registro gratis → Sube CV → Completa evaluaciones personalizadas por cargo",
    icon: Users,
  },
  {
    step: "2",
    title: "La IA Analiza y Matchea",
    description: "Nuestro algoritmo evalúa skills, personalidad, cognitivo y comportamental contra cada vacante",
    icon: Brain,
  },
  {
    step: "3",
    title: "Derivamos a la Empresa",
    description: "Enviamos el perfil completo y evaludado del candidato a la empresa más compatible",
    icon: Building2,
  },
  {
    step: "4",
    title: "La Empresa Contrata",
    description: "Contacta al candidato, gestiona el pipeline y da feedback que mejora el sistema",
    icon: Award,
  },
]

// Testimonials
const testimonials = [
  {
    name: "Laura Méndez",
    role: "HR Director, TechCorp",
    quote: "Reducimos nuestro time-to-hire de 45 a 18 días. Los candidatos llegan pre-evaluados y el matching es increíblemente preciso.",
    rating: 5,
  },
  {
    name: "Carlos Ruiz",
    role: "Software Engineer",
    quote: "Encontré mi trabajo ideal sin buscar. Talentix me posicionó en una empresa que encaja perfecto con mi perfil y mis valores.",
    rating: 5,
  },
  {
    name: "María López",
    role: "CEO, StartupXYZ",
    quote: "Como startup, no teníamos tiempo para filtrar cientos de CVs. Talentix nos envía 5 candidatos perfectos por vacante.",
    rating: 5,
  },
]

// Pricing plans
const plans = [
  {
    name: "Starter",
    price: "Desde $199",
    period: "/mes",
    description: "Para empresas pequeñas que empiezan",
    features: [
      "Hasta 3 vacantes activas",
      "Hasta 30 candidatos visibles/mes",
      "Matching básico con IA",
      "Dashboard de analytics básico",
      "Soporte por email",
    ],
    popular: false,
    cta: "Empezar Ahora",
  },
  {
    name: "Professional",
    price: "Desde $599",
    period: "/mes",
    description: "Para empresas en crecimiento",
    features: [
      "Hasta 10 vacantes activas",
      "Hasta 100 candidatos visibles/mes",
      "Matching avanzado con IA",
      "Evaluaciones custom (2)",
      "Analytics completos",
      "Soporte por chat",
    ],
    popular: true,
    cta: "Solicitar Demo",
  },
  {
    name: "Enterprise",
    price: "Personalizado",
    period: "",
    description: "Para grandes organizaciones",
    features: [
      "Vacantes ilimitadas",
      "Candidatos ilimitados",
      "Matching prioritario",
      "Evaluaciones custom ilimitadas",
      "API access",
      "Integración ATS completa",
      "CSM dedicado",
    ],
    popular: false,
    cta: "Contactar Ventas",
  },
]

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const router = useRouter()

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold gradient-text">Talentix</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <Link href="#como-funciona" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Cómo Funciona
              </Link>
              <Link href="#para-candidatos" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Candidatos
              </Link>
              <Link href="#para-empresas" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Empresas
              </Link>
              <Link href="#precios" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Precios
              </Link>
            </div>

            {/* CTA Buttons */}
            <div className="hidden md:flex items-center gap-3">
              <Button variant="ghost" onClick={() => router.push("/login")}>
                Iniciar Sesión
              </Button>
              <Button variant="fb" onClick={() => router.push("/register")}>
                Registrarse Gratis
              </Button>
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-muted"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t bg-background">
            <div className="px-4 py-4 space-y-3">
              <Link href="#como-funciona" className="block py-2 text-sm font-medium">
                Cómo Funciona
              </Link>
              <Link href="#para-candidatos" className="block py-2 text-sm font-medium">
                Candidatos
              </Link>
              <Link href="#para-empresas" className="block py-2 text-sm font-medium">
                Empresas
              </Link>
              <Link href="#precios" className="block py-2 text-sm font-medium">
                Precios
              </Link>
              <Separator />
              <Button variant="outline" className="w-full" onClick={() => router.push("/login")}>
                Iniciar Sesión
              </Button>
              <Button variant="fb" className="w-full" onClick={() => router.push("/register")}>
                Registrarse Gratis
              </Button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-fb-blue/10 rounded-full blur-3xl" />
          <div className="absolute top-40 right-10 w-96 h-96 bg-fb-purple/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-32 bg-gradient-to-t from-background to-transparent" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <Badge variant="info" className="mb-6 px-4 py-2 text-sm">
              🚀 Plataforma #1 en Reclutamiento Inteligente
            </Badge>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              El Talento Merece{" "}
              <span className="gradient-text">Reclutamiento Científico</span>
            </h1>
            
            <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Talentix conecta candidatos con empresas mediante evaluaciones psicométricas, 
              IA y matching bidireccional. El candidato se evalúa gratis, la empresa recibe 
              talento pre-evaluado y rankeado.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <Button size="xl" variant="fb" onClick={() => router.push("/register")}>
                Soy Candidato — Registrarse Gratis
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="xl" variant="fb-outline" onClick={() => router.push("/register?role=company")}>
                Soy Empresa — Solicitar Demo
                <Play className="ml-2 h-5 w-5" />
              </Button>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <span>100% Gratis para Candidatos</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <span>Datos Científicos, no Trivia</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <span>IA Explicable</span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl sm:text-4xl font-bold gradient-text mb-2">
                  {stat.number}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="como-funciona" className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">
              Cómo Funciona
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              De Candidato a Contratado en{" "}
              <span className="gradient-text">4 Pasos</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Un proceso simple y cientifico que beneficia tanto a candidatos como a empresas.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {howItWorks.map((step, i) => (
              <div key={i} className="relative">
                {i < howItWorks.length - 1 && (
                  <div className="hidden md:block absolute top-12 left-[calc(50%+40px)] right-[calc(-50%+40px)] h-[2px] bg-gradient-to-r from-fb-blue to-fb-purple" />
                )}
                <Card className="relative z-10 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <CardContent className="pt-8 pb-6 px-6">
                    <div className="w-16 h-16 rounded-2xl gradient-bg flex items-center justify-center mx-auto mb-4 animate-float" style={{ animationDelay: `${i * 0.2}s` }}>
                      <step.icon className="h-8 w-8 text-white" />
                    </div>
                    <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-fb-blue text-white flex items-center justify-center text-sm font-bold">
                      {step.step}
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* For Candidates */}
      <section id="para-candidatos" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <Badge variant="info" className="mb-4">
                Para Candidatos
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                Tu Talento Merece ser{" "}
                <span className="gradient-text">Descubierto</span>
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Regístrate gratis, completa evaluaciones científicas y deja que nuestra IA 
                te posicione en la empresa perfecta para ti. Sin buscar, sin postular.
              </p>

              <div className="space-y-6">
                {candidateFeatures.map((feature, i) => (
                  <div key={i} className="flex gap-4">
                    <div className={`w-12 h-12 rounded-xl ${feature.bg} flex items-center justify-center shrink-0`}>
                      <feature.icon className={`h-6 w-6 ${feature.color}`} />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Button size="lg" variant="fb" className="mt-8" onClick={() => router.push("/register")}>
                Registrarse Gratis
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>

            {/* Visual representation */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-fb-blue/20 to-fb-purple/20 rounded-3xl blur-3xl" />
              <Card className="relative z-10 p-8 border-2 border-fb-blue/20">
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-fb-blue to-fb-purple flex items-center justify-center text-white font-bold text-xl">
                      MG
                    </div>
                    <div>
                      <h4 className="font-semibold">María García</h4>
                      <p className="text-sm text-muted-foreground">Ingeniera de Software</p>
                    </div>
                    <Badge variant="highly-recommended" className="ml-auto">
                      95% Match
                    </Badge>
                  </div>
                  
                  <Separator />

                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Skills Técnicos</span>
                        <span className="font-medium">92/100</span>
                      </div>
                      <div className="h-2 bg-secondary rounded-full overflow-hidden">
                        <div className="h-full w-[92%] bg-gradient-to-r from-fb-blue to-fb-purple rounded-full" />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Fit Cultural</span>
                        <span className="font-medium">88/100</span>
                      </div>
                      <div className="h-2 bg-secondary rounded-full overflow-hidden">
                        <div className="h-full w-[88%] bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full" />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Liderazgo</span>
                        <span className="font-medium">85/100</span>
                      </div>
                      <div className="h-2 bg-secondary rounded-full overflow-hidden">
                        <div className="h-full w-[85%] bg-gradient-to-r from-orange-500 to-amber-400 rounded-full" />
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Badge variant="info">Python</Badge>
                    <Badge variant="info">React</Badge>
                    <Badge variant="info">Node.js</Badge>
                    <Badge variant="purple">+5</Badge>
                  </div>

                  <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-emerald-700 font-medium mb-1">
                      <Target className="h-4 w-4" />
                      Top Match: TechCorp Solutions
                    </div>
                    <p className="text-sm text-emerald-600">
                      95% de compatibilidad · Buscan tu perfil · Remoto disponible
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* For Companies */}
      <section id="para-empresas" className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Visual representation */}
            <div className="order-2 lg:order-1">
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h4 className="font-semibold">Candidatos Derivados</h4>
                  <Badge variant="info">5 nuevos hoy</Badge>
                </div>
                
                <div className="space-y-4">
                  {[
                    { name: "María García", score: 95, role: "Senior Developer", status: "Altamente Recomendado" },
                    { name: "Carlos Ruiz", score: 88, role: "Product Manager", status: "Recomendado" },
                    { name: "Ana Martínez", score: 82, role: "UX Designer", status: "Recomendado" },
                  ].map((candidate, i) => (
                    <div key={i} className="flex items-center gap-4 p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-fb-blue to-fb-purple flex items-center justify-center text-white font-medium text-sm">
                        {candidate.name.split(" ").map(n => n[0]).join("")}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm">{candidate.name}</div>
                        <div className="text-xs text-muted-foreground">{candidate.role}</div>
                      </div>
                      <Badge 
                        variant={candidate.score >= 90 ? "highly-recommended" : "recommended"}
                        className="shrink-0"
                      >
                        {candidate.score}%
                      </Badge>
                    </div>
                  ))}
                </div>

                <Button variant="outline" className="w-full mt-4">
                  Ver Todos los Candidatos
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </Card>
            </div>

            <div className="order-1 lg:order-2">
              <Badge variant="warning" className="mb-4">
                Para Empresas
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                Contrata Mejor,{" "}
                <span className="gradient-text">Más Rápido</span>
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Deja de filtrar cientos de CVs. Recibe candidatos pre-evaluados, rankeados 
                por fit y listos para entrevistar. Nuestra IA aprende de cada contratación.
              </p>

              <div className="space-y-6">
                {companyFeatures.map((feature, i) => (
                  <div key={i} className="flex gap-4">
                    <div className={`w-12 h-12 rounded-xl ${feature.bg} flex items-center justify-center shrink-0`}>
                      <feature.icon className={`h-6 w-6 ${feature.color}`} />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Button size="lg" variant="fb" className="mt-8" onClick={() => router.push("/register?role=company")}>
                Solicitar Demo Gratuita
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* AI Learning Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="purple" className="mb-4">
              <Sparkles className="h-3 w-3 mr-1" />
              IA que Aprende
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Un Sistema que{" "}
              <span className="gradient-text">Mejora con el Tiempo</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Cada contratación, cada rechazo, cada feedback alimenta nuestro algoritmo. 
              Mientras más se usa, más preciso se vuelve.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center p-8 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardContent className="pt-0">
                <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mx-auto mb-4">
                  <Brain className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Aprendizaje Continuo</h3>
                <p className="text-sm text-muted-foreground">
                  El algoritmo analiza patrones de contratación exitosa y ajusta los pesos de matching automáticamente.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-8 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardContent className="pt-0">
                <div className="w-16 h-16 rounded-2xl bg-purple-50 flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Feedback Loop</h3>
                <p className="text-sm text-muted-foreground">
                  Cuando la empresa contrata o rechaza, el sistema aprende qué funcionó y qué no para mejorar.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-8 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardContent className="pt-0">
                <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-emerald-600" />
                </div>
                <h3 className="font-semibold text-lg mb-2">IA Explicable</h3>
                <p className="text-sm text-muted-foreground">
                  Transparencia total: candidatos y empresas ven por qué se recomienda cada match, con desglose por dimensión.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="precios" className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">
              Precios
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Planes{" "}
              <span className="gradient-text">Flexibles para tu Empresa</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Los precios se ajustan según el acuerdo empresarial. 
              La demo de prueba es solo una muestra de cómo funciona, no acceso total gratuito.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {plans.map((plan, i) => (
              <Card 
                key={i} 
                className={`relative hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${
                  plan.popular ? "border-2 border-fb-blue shadow-lg scale-105" : ""
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <Badge variant="default" className="px-4 py-1">
                      Más Popular
                    </Badge>
                  </div>
                )}
                <CardContent className="p-8">
                  <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{plan.description}</p>
                  
                  <div className="mb-6">
                    <span className="text-3xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </div>

                  <Button 
                    variant={plan.popular ? "fb" : "fb-outline"} 
                    className="w-full mb-6"
                    onClick={() => router.push("/register?role=company")}
                  >
                    {plan.cta}
                  </Button>

                  <ul className="space-y-3">
                    {plan.features.map((feature, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>

          <p className="text-center text-sm text-muted-foreground mt-8">
            * Los precios son referenciales y se ajustan según cada acuerdo empresarial. 
            La demo de prueba es solo una demostración del sistema, no acceso completo.
          </p>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">
              Testimonios
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Lo que Dicen{" "}
              <span className="gradient-text">Nuestros Usuarios</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, i) => (
              <Card key={i} className="hover:shadow-lg transition-all duration-300">
                <CardContent className="p-8">
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: testimonial.rating }).map((_, j) => (
                      <Star key={j} className="h-4 w-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-6 italic">
                    &ldquo;{testimonial.quote}&rdquo;
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-fb-blue to-fb-purple flex items-center justify-center text-white font-medium text-sm">
                      {testimonial.name.split(" ").map(n => n[0]).join("")}
                    </div>
                    <div>
                      <div className="font-medium text-sm">{testimonial.name}</div>
                      <div className="text-xs text-muted-foreground">{testimonial.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 gradient-bg">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            ¿Listo para Revolucionar tu Reclutamiento?
          </h2>
          <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
            Únete a miles de empresas y candidatos que ya confían en Talentix 
            para encontrar el match perfecto.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button 
              size="xl" 
              className="bg-white text-fb-blue hover:bg-white/90"
              onClick={() => router.push("/register")}
            >
              Soy Candidato — Registrarse Gratis
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              size="xl" 
              variant="outline" 
              className="border-white text-white hover:bg-white/10"
              onClick={() => router.push("/register?role=company")}
            >
              Soy Empresa — Solicitar Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <Link href="/" className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold gradient-text">Talentix</span>
              </Link>
              <p className="text-sm text-muted-foreground">
                La plataforma de reclutamiento inteligente que conecta talento con oportunidades mediante ciencia e IA.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Plataforma</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#para-candidatos" className="hover:text-foreground transition-colors">Para Candidatos</Link></li>
                <li><Link href="#para-empresas" className="hover:text-foreground transition-colors">Para Empresas</Link></li>
                <li><Link href="#precios" className="hover:text-foreground transition-colors">Precios</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">API</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Empresa</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-foreground transition-colors">Sobre Nosotros</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Blog</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Carreras</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Contacto</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-foreground transition-colors">Privacidad</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Términos</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Cookies</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">GDPR</Link></li>
              </ul>
            </div>
          </div>

          <Separator className="my-8" />

          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              © 2026 Talentix. Todos los derechos reservados.
            </p>
            <div className="flex items-center gap-4">
              <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Globe className="h-5 w-5" />
              </Link>
              <span className="text-sm text-muted-foreground">ES | EN | PT</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
