"use client"

import { HelpCircle, BookOpen, Code, Server, ExternalLink } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function AdminHelpPage() {
  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <HelpCircle className="h-8 w-8 text-primary" />
          Ayuda del Admin
        </h1>
        <p className="text-muted-foreground mt-1">Documentación y soporte para administradores.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {[
          { icon: BookOpen, title: "Guía del Admin", desc: "Manual completo de administración" },
          { icon: Code, title: "Documentación API", desc: "Endpoints y referencias" },
          { icon: Server, title: "Estado del Sistema", desc: "Uptime y métricas de infraestructura" },
        ].map((item, i) => (
          <Card key={i} className="hover:shadow-md transition-all cursor-pointer">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-fb-blue/10 flex items-center justify-center">
                <item.icon className="h-6 w-6 text-fb-blue" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
              <ExternalLink className="h-4 w-4 text-muted-foreground" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
