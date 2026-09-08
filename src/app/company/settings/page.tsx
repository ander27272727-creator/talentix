"use client"

import { Settings, Bell, Users, Shield } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function CompanySettingsPage() {
  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Settings className="h-8 w-8 text-primary" />
          Configuración
        </h1>
        <p className="text-muted-foreground mt-1">Administra tu cuenta de empresa.</p>
      </div>

      <Card>
        <CardHeader><CardTitle>Notificaciones</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {[
            { label: "Nuevos candidatos derivados", desc: "Cuando Talentix derive un candidato a tus vacantes" },
            { label: "Actualizaciones de pipeline", desc: "Cuando un candidato cambie de etapa" },
            { label: "Alertas de facturación", desc: "Recordatorios de pago y renovación" },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between">
              <div>
                <div className="font-medium text-sm">{item.label}</div>
                <div className="text-xs text-muted-foreground">{item.desc}</div>
              </div>
              <Switch defaultChecked />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Equipo</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">Invita miembros de tu equipo para gestionar vacantes.</p>
          <div className="flex gap-2">
            <Input placeholder="email@empresa.com" className="flex-1" />
            <Button variant="fb">Invitar</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
