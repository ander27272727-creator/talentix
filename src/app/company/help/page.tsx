"use client"

import { HelpCircle, MessageCircle, BookOpen, Mail, ExternalLink } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function CompanyHelpPage() {
  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <HelpCircle className="h-8 w-8 text-primary" />
          Ayuda
        </h1>
        <p className="text-muted-foreground mt-1">Soporte para empresas.</p>
      </div>

      <Card className="border-2 border-fb-purple/20 bg-gradient-to-r from-fb-purple/5 to-fb-blue/5">
        <CardContent className="p-6 text-center">
          <MessageCircle className="h-12 w-12 mx-auto mb-4 text-fb-purple" />
          <h3 className="font-semibold text-lg mb-2">Soporte Prioritario</h3>
          <p className="text-sm text-muted-foreground mb-4">Como plan Professional, tienes soporte prioritario por chat.</p>
          <Button variant="fb">Contactar Soporte</Button>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-4">
        {[
          { icon: BookOpen, title: "Guía para Empresas", desc: "Cómo maximizar Talentix" },
          { icon: Mail, title: "Email Soporte", desc: "empresas@talentix.com" },
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
