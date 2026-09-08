"use client"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import {
  LayoutDashboard, Building2, Briefcase, Users, Brain, Settings,
  LogOut, Menu, X, ChevronRight, Sparkles, Bell, Search,
  FileText, BarChart3, HelpCircle, CreditCard, Shield, Zap, Target,
  MessageSquare, Share2, Calendar, BarChart, DollarSign
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { useStore } from "@/store/useStore"
import { Separator } from "@/components/ui/separator"

const navigation = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Empresas", href: "/admin/companies", icon: Building2 },
  { name: "Vacantes", href: "/admin/vacancies", icon: Briefcase },
  { name: "Candidatos", href: "/admin/candidates", icon: Users },
  { name: "Evaluaciones", href: "/admin/assessments", icon: Brain },
  { name: "Matching", href: "/admin/matching", icon: Target },
  { name: "Derivaciones", href: "/admin/referrals", icon: Zap },
  { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { name: "Mensajes", href: "/admin/messages", icon: MessageSquare },
  { name: "Precios", href: "/admin/pricing", icon: DollarSign },
  { name: "divider", href: "#", icon: Zap },
  { name: "Quiz Viral", href: "/admin/quiz", icon: MessageSquare },
  { name: "Referidos", href: "/admin/referral-program", icon: Share2 },
  { name: "Contenido", href: "/admin/content", icon: Calendar },
  { name: "Marketing", href: "/admin/marketing", icon: BarChart },
]

const bottomNav = [
  { name: "Configuración", href: "/admin/settings", icon: Settings },
  { name: "Ayuda", href: "/admin/help", icon: HelpCircle },
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const { user, logout, hasHydrated, unreadMessages } = useStore()

  useEffect(() => {
    if (hasHydrated && !user) {
      router.push("/login")
    }
  }, [user, router, hasHydrated])

  if (!hasHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const isActive = (href: string) => {
    if (href === "/admin") {
      return pathname === "/admin"
    }
    return pathname.startsWith(href)
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-background border-b z-50 flex items-center px-4">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-lg hover:bg-muted"
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
        <Link href="/admin" className="flex items-center gap-2 ml-4">
          <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <span className="font-bold gradient-text">Talentix</span>
        </Link>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full bg-background border-r z-40 transition-all duration-300 ${
          sidebarOpen ? "w-64" : "w-20"
        } ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="h-16 flex items-center px-4 border-b">
            <Link href="/admin" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              {sidebarOpen && (
                <span className="text-xl font-bold gradient-text">Talentix</span>
              )}
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              if (item.name === "divider") {
                return sidebarOpen ? (
                  <div key="divider" className="my-2">
                    <Separator />
                    <div className="text-xs text-muted-foreground font-medium mt-2 mb-1 px-3">CRECIMIENTO</div>
                  </div>
                ) : (
                  <div key="divider" className="my-2"><Separator /></div>
                )
              }
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                    isActive(item.href)
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <item.icon className="h-5 w-5 shrink-0" />
                  {sidebarOpen && <span>{item.name}</span>}
                  {item.name === "Mensajes" && unreadMessages > 0 && (
                    <Badge className="ml-auto bg-red-500 text-white text-xs min-w-[18px] h-[18px] flex items-center justify-center rounded-full px-1">{unreadMessages}</Badge>
                  )}
                </Link>
              )
            })}
          </nav>

          {/* Bottom Navigation */}
          <div className="p-4 border-t space-y-1">
            {bottomNav.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-all duration-200"
                onClick={() => setMobileMenuOpen(false)}
              >
                <item.icon className="h-5 w-5 shrink-0" />
                {sidebarOpen && <span>{item.name}</span>}
              </Link>
            ))}
            
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:bg-red-50 hover:text-red-600 transition-all duration-200 w-full"
            >
              <LogOut className="h-5 w-5 shrink-0" />
              {sidebarOpen && <span>Cerrar Sesión</span>}
            </button>
          </div>

          {/* Collapse button */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="hidden lg:flex items-center justify-center h-12 border-t hover:bg-muted transition-colors"
          >
            <ChevronRight
              className={`h-5 w-5 text-muted-foreground transition-transform duration-300 ${
                sidebarOpen ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Main content */}
      <main
        className={`transition-all duration-300 ${
          sidebarOpen ? "lg:ml-64" : "lg:ml-20"
        } pt-16 lg:pt-0`}
      >
        {/* Top bar */}
        <div className="h-16 bg-background border-b flex items-center justify-between px-6 sticky top-0 z-30">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative max-w-md w-full hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar empresas, candidatos, vacantes..."
                className="pl-10"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </Button>

            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white">
                  <Shield className="h-5 w-5" />
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:block">
                <div className="font-medium text-sm">Admin Talentix</div>
                <div className="text-xs text-muted-foreground">Administrador</div>
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  )
}
