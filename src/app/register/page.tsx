"use client"

import { useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Sparkles, Eye, EyeOff, ArrowRight, Users, Building2, CheckCircle2, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { useStore } from "@/store/useStore"

function RegisterContent() {
  const searchParams = useSearchParams()
  const initialRole = searchParams.get("role") === "company" ? "COMPANY" : "CANDIDATE"
  
  const [step, setStep] = useState(1)
  const [role, setRole] = useState<"CANDIDATE" | "COMPANY">(initialRole as "CANDIDATE" | "COMPANY")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    companyName: "",
    industry: "",
    companySize: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const { login } = useStore()

  const handleRoleSelect = (selectedRole: "CANDIDATE" | "COMPANY") => {
    setRole(selectedRole)
    setStep(2)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden")
      return
    }
    if (formData.password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres")
      return
    }

    setIsLoading(true)
    try {
      // Registro real con Supabase Auth + BD
      await login(formData.email, formData.password, formData.name, role)
      const user = useStore.getState().user
      if (user?.role === "CANDIDATE") {
        router.push("/candidate")
      } else {
        router.push("/company")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al crear la cuenta. Intenta de nuevo.")
    } finally {
      setIsLoading(false)
    }
  }

  const benefits = {
    CANDIDATE: [
      "Registro 100% gratis",
      "Evaluaciones científicas ilimitadas",
      "Matching inteligente con IA",
      "Descubre empresas compatibles",
      "Career Path personalizado",
    ],
    COMPANY: [
      "Demo gratuita de 14 días",
      "Candidatos pre-evaluados y rankeados",
      "Matching bidireccional avanzado",
      "Analytics de hiring completos",
      "Sin compromiso a largo plazo",
    ],
  }

  return (
    <div className="min-h-screen flex">
      {/* Left side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 mb-8">
            <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold gradient-text">Talentix</span>
          </Link>

          {step === 1 ? (
            <>
              <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Crea tu Cuenta</h1>
                <p className="text-muted-foreground">
                  Selecciona cómo quieres usar Talentix.
                </p>
              </div>

              <div className="space-y-4">
                <button
                  onClick={() => handleRoleSelect("CANDIDATE")}
                  className="w-full"
                >
                  <Card className={`text-left hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer border-2 ${
                    initialRole === "CANDIDATE" ? "border-fb-blue" : "hover:border-fb-blue/50"
                  }`}>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-xl bg-blue-50 flex items-center justify-center">
                          <Users className="h-7 w-7 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">Soy Candidato</h3>
                          <p className="text-sm text-muted-foreground">
                            Quiero encontrar mi mejor oportunidad laboral
                          </p>
                        </div>
                        <ArrowRight className="ml-auto h-5 w-5 text-muted-foreground" />
                      </div>
                    </CardContent>
                  </Card>
                </button>

                <button
                  onClick={() => handleRoleSelect("COMPANY")}
                  className="w-full"
                >
                  <Card className={`text-left hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer border-2 ${
                    initialRole === "COMPANY" ? "border-fb-blue" : "hover:border-fb-blue/50"
                  }`}>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-xl bg-purple-50 flex items-center justify-center">
                          <Building2 className="h-7 w-7 text-purple-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">Soy Empresa</h3>
                          <p className="text-sm text-muted-foreground">
                            Quiero contratar el mejor talento pre-evaluado
                          </p>
                        </div>
                        <ArrowRight className="ml-auto h-5 w-5 text-muted-foreground" />
                      </div>
                    </CardContent>
                  </Card>
                </button>
              </div>
            </>
          ) : (
            <>
              <button
                onClick={() => setStep(1)}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4"
              >
                <ArrowLeft className="h-4 w-4" />
                Cambiar tipo de cuenta
              </button>

              <div className="mb-8">
                <Badge variant={role === "CANDIDATE" ? "info" : "purple"} className="mb-4">
                  {role === "CANDIDATE" ? "Candidato" : "Empresa"}
                </Badge>
                <h1 className="text-3xl font-bold mb-2">
                  {role === "CANDIDATE" ? "Tu Perfil Profesional" : "Datos de tu Empresa"}
                </h1>
                <p className="text-muted-foreground">
                  {role === "CANDIDATE" 
                    ? "Cuéntanos sobre ti para encontrar las mejores oportunidades."
                    : "Cuéntanos sobre tu empresa para recibir el talento más compatible."
                  }
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                    {error}
                  </div>
                )}
                {role === "COMPANY" && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="companyName">Nombre de la Empresa</Label>
                      <Input
                        id="companyName"
                        placeholder="TechCorp Solutions"
                        value={formData.companyName}
                        onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                        required
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="industry">Industria</Label>
                        <Input
                          id="industry"
                          placeholder="Tecnología"
                          value={formData.industry}
                          onChange={(e) => setFormData({...formData, industry: e.target.value})}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="companySize">Tamaño</Label>
                        <Input
                          id="companySize"
                          placeholder="51-200"
                          value={formData.companySize}
                          onChange={(e) => setFormData({...formData, companySize: e.target.value})}
                          required
                        />
                      </div>
                    </div>
                  </>
                )}

                <div className="space-y-2">
                  <Label htmlFor="name">{role === "CANDIDATE" ? "Nombre Completo" : "Tu Nombre"}</Label>
                  <Input
                    id="name"
                    placeholder={role === "CANDIDATE" ? "María García" : "Tu nombre"}
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="tu@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Contraseña</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                    required
                  />
                </div>

                <Button type="submit" variant="fb" className="w-full" disabled={isLoading}>
                  {isLoading ? "Creando cuenta..." : "Crear Cuenta"}
                  {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
                </Button>
              </form>
            </>
          )}

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              ¿Ya tienes cuenta?{" "}
              <Link href="/login" className="text-primary hover:underline font-medium">
                Iniciar Sesión
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right side - Benefits */}
      <div className="hidden lg:flex flex-1 gradient-bg items-center justify-center p-12">
        <div className="max-w-md text-white">
          <h2 className="text-3xl font-bold mb-6">
            {role === "CANDIDATE" 
              ? "Tu Talento Merece ser Descubierto"
              : "Encuentra al Talento Perfecto"
            }
          </h2>
          <p className="text-lg text-white/80 mb-8">
            {role === "CANDIDATE"
              ? "Regístrate gratis y deja que nuestra IA te posicione en la empresa ideal."
              : "Recibe candidatos pre-evaluados y rankeados por fit. Sin filtrar CVs manualmente."
            }
          </p>
          
          <div className="space-y-4">
            {benefits[role].map((benefit, i) => (
              <div key={i} className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5" />
                <span>{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    }>
      <RegisterContent />
    </Suspense>
  )
}
