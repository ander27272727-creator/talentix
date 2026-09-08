"use client"

import { BarChart3, TrendingUp, ArrowRight, Target, Sparkles } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

export default function CareerPathPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <BarChart3 className="h-8 w-8 text-primary" />
          Career Path
        </h1>
        <p className="text-muted-foreground mt-1">Tu camino profesional recomendado por nuestra IA.</p>
      </div>

      <Card className="border-2 border-fb-purple/20 bg-gradient-to-r from-fb-purple/5 to-fb-blue/5">
        <CardContent className="p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl gradient-bg flex items-center justify-center">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold">Recomendación de IA</h3>
            <p className="text-sm text-muted-foreground">Basado en tus evaluaciones y el mercado actual, tu mejor camino es hacia roles de Tech Lead o Staff Engineer en los próximos 2-3 años.</p>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {[
          { role: "Staff Engineer", timeline: "2-3 años", fit: 85, skills: ["Liderazgo técnico", "Arquitectura", "Mentoría"] },
          { role: "Tech Lead", timeline: "1-2 años", fit: 92, skills: ["Gestión de equipo", "Code review", "Decisiones técnicas"] },
          { role: "Senior Developer", timeline: "Actual", fit: 95, skills: ["Full stack", "DevOps", "CI/CD"] },
        ].map((step, i) => (
          <Card key={i} className="hover:shadow-md transition-all duration-200">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-fb-blue to-fb-purple flex items-center justify-center text-white font-bold">
                {i + 1}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">{step.role}</h3>
                  <Badge variant="info">{step.timeline}</Badge>
                </div>
                <div className="flex gap-2 mt-2">
                  {step.skills.map((s, j) => (
                    <Badge key={j} variant="outline" className="text-xs">{s}</Badge>
                  ))}
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold gradient-text">{step.fit}%</div>
                <div className="text-xs text-muted-foreground">Fit</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
