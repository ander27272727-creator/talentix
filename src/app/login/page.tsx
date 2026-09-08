"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Sparkles, Eye, EyeOff, ArrowRight, Users, Building2, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { useStore } from "@/store/useStore"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const { login } = useStore()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      await login(email, password)
      const user = useStore.getState().user
      if (user?.role === "CANDIDATE") {
        router.push("/candidate")
      } else if (user?.role === "COMPANY") {
        router.push("/company")
      } else if (user?.role === "ADMIN") {
        router.push("/admin")
      }
    } catch {
      setError("Credenciales inválidas. Intenta con: candidato@talentix.com, empresa@talentix.com, o admin@talentix.com")
    } finally {
      setIsLoading(false)
    }
  }

  const demoLogins = [
    {
      role: "Candidato",
      email: "candidato@talentix.com",
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      role: "Empresa",
      email: "empresa@talentix.com",
      icon: Building2,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      role: "Admin",
      email: "admin@talentix.com",
      icon: Shield,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
  ]

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

          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Bienvenido de Nuevo</h1>
            <p className="text-muted-foreground">
              Inicia sesión para continuar en la plataforma de reclutamiento inteligente.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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

            {error && (
              <div className="text-sm text-red-500 bg-red-50 p-3 rounded-lg">
                {error}
              </div>
            )}

            <Button type="submit" variant="fb" className="w-full" disabled={isLoading}>
              {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
              {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              ¿No tienes cuenta?{" "}
              <Link href="/register" className="text-primary hover:underline font-medium">
                Registrarse Gratis
              </Link>
            </p>
          </div>

          <Separator className="my-8" />

          {/* Demo Logins */}
          <div>
            <p className="text-sm text-muted-foreground text-center mb-4">
              Accesos de demostración
            </p>
            <div className="grid grid-cols-3 gap-3">
              {demoLogins.map((demo) => (
                <button
                  key={demo.role}
                  type="button"
                  onClick={() => {
                    setEmail(demo.email)
                    setPassword("demo123")
                  }}
                  className="flex flex-col items-center gap-2 p-3 rounded-xl border hover:bg-muted transition-colors"
                >
                  <div className={`w-10 h-10 rounded-lg ${demo.bg} flex items-center justify-center`}>
                    <demo.icon className={`h-5 w-5 ${demo.color}`} />
                  </div>
                  <span className="text-xs font-medium">{demo.role}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Visual */}
      <div className="hidden lg:flex flex-1 gradient-bg items-center justify-center p-12">
        <div className="max-w-md text-white">
          <Badge className="bg-white/20 text-white mb-6">
            Plataforma #1 en Reclutamiento
          </Badge>
          <h2 className="text-4xl font-bold mb-6">
            Conectamos el Talento con las Mejores Empresas
          </h2>
          <p className="text-lg text-white/80 mb-8">
            Evaluaciones científicas + IA + Matching bidireccional = 
            El futuro del reclutamiento.
          </p>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <Users className="h-4 w-4" />
              </div>
              <span>50,000+ candidatos activos</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <Building2 className="h-4 w-4" />
              </div>
              <span>2,500+ empresas registradas</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <Shield className="h-4 w-4" />
              </div>
              <span>95% tasa de satisfacción</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function Separator({ className }: { className?: string }) {
  return (
    <div className={`relative ${className}`}>
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-border" />
      </div>
      <div className="relative flex justify-center text-xs uppercase">
        <span className="bg-background px-2 text-muted-foreground">o</span>
      </div>
    </div>
  )
}
