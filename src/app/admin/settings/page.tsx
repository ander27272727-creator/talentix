"use client"

import { Settings, Globe, Bell, Shield, Database } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Settings className="h-8 w-8 text-primary" />
          Configuración del Sistema
        </h1>
        <p className="text-muted-foreground mt-1">Configuración general de la plataforma Talentix.</p>
      </div>

      <Card>
        <CardHeader><CardTitle>General</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Nombre de la Plataforma</Label>
            <Input defaultValue="Talentix" />
          </div>
          <div className="space-y-2">
            <Label>Email de Soporte</Label>
            <Input defaultValue="soporte@talentix.com" />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-sm">Modo Mantenimiento</div>
              <div className="text-xs text-muted-foreground">Bloquear acceso a la plataforma</div>
            </div>
            <Switch />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>IA y Matching</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-sm">Matching Automático</div>
              <div className="text-xs text-muted-foreground">Generar matches automáticamente cada 24h</div>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-sm">Feedback Loop Activo</div>
              <div className="text-xs text-muted-foreground">Mejorar el algoritmo con cada contratación/rechazo</div>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="space-y-2">
            <Label>Umbral Mínimo de Match (%)</Label>
            <Input type="number" defaultValue="60" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Integraciones</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>API Key OpenAI</Label>
            <Input type="password" placeholder="sk-..." />
          </div>
          <div className="space-y-2">
            <Label>Webhook URL</Label>
            <Input placeholder="https://..." />
          </div>
          <Button variant="fb">Guardar Configuración</Button>
        </CardContent>
      </Card>
    </div>
  )
}
