"use client"

import { HelpCircle, MessageCircle, Mail, BookOpen, ExternalLink } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function CandidateHelpPage() {
  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <HelpCircle className="h-8 w-8 text-primary" />
          Ayuda
        </h1>
        <p className="text-muted-foreground mt-1">¿Necesitas ayuda? Estamos aquí para ti.</p>
      </div>

      <Card className="border-2 border-fb-purple/20 bg-gradient-to-r from-fb-purple/5 to-fb-blue/5">
        <CardContent className="p-6 text-center">
          <MessageCircle className="h-12 w-12 mx-auto mb-4 text-fb-purple" />
          <h3 className="font-semibold text-lg mb-2">Chat en Vivo</h3>
          <p className="text-sm text-muted-foreground mb-4">Nuestro equipo está disponible Lun-Vie 9am-6pm</p>
          <Button variant="fb">Iniciar Chat</Button>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-4">
        {[
          { icon: BookOpen, title: "Centro de Ayuda", desc: "Artículos y guías paso a paso", url: "#" },
          { icon: Mail, title: "Email Soporte", desc: "soporte@talentix.com", url: "mailto:soporte@talentix.com" },
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

      <Card>
        <CardHeader><CardTitle>Preguntas Frecuentes</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {[
            { q: "¿Cómo funciona el matching?", a: "Nuestra IA analiza tus evaluaciones, habilidades y preferencias para encontrar las empresas donde mejor encajas." },
            { q: "¿Cuánto tarda en actualizarse mi perfil?", a: "Los cambios se reflejan inmediatamente en el sistema." },
            { q: "¿Mis evaluaciones son confidenciales?", a: "Sí. Solo las empresas a las que eres derivado pueden ver resultados agregados, nunca las respuestas individuales." },
          ].map((faq, i) => (
            <div key={i} className="p-4 rounded-xl bg-muted/50">
              <h4 className="font-medium mb-1">{faq.q}</h4>
              <p className="text-sm text-muted-foreground">{faq.a}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
