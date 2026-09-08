"use client"

import { Settings, Bell, Shield, Eye, Trash2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function CandidateSettingsPage() {
  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Settings className="h-8 w-8 text-primary" />
          Configuración
        </h1>
        <p className="text-muted-foreground mt-1">Administra tu cuenta y preferencias.</p>
      </div>

      <Card>
        <CardHeader><CardTitle>Notificaciones</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {[
            { label: "Nuevos matches", desc: "Recibe notificación cuando una empresa coincida contigo" },
            { label: "Mensajes de empresas", desc: "Cuando una empresa te contacte" },
            { label: "Evaluaciones recordatorios", desc: "Recordatorio para completar evaluaciones pendientes" },
            { label: "Newsletter", desc: "Consejos de carrera y novedades de Talentix" },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between">
              <div>
                <div className="font-medium text-sm">{item.label}</div>
                <div className="text-xs text-muted-foreground">{item.desc}</div>
              </div>
              <Switch defaultChecked={i < 3} />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Privacidad</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-sm">Perfil visible para empresas</div>
              <div className="text-xs text-muted-foreground">Las empresas pueden ver tu perfil básico</div>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-sm">Mostrar salario esperado</div>
              <div className="text-xs text-muted-foreground">Incluir rango salarial en tu perfil</div>
            </div>
            <Switch />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Contraseña</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Contraseña actual</Label>
            <Input type="password" placeholder="••••••••" />
          </div>
          <div className="space-y-2">
            <Label>Nueva contraseña</Label>
            <Input type="password" placeholder="••••••••" />
          </div>
          <Button variant="fb">Actualizar Contraseña</Button>
        </CardContent>
      </Card>

      <Card className="border-red-200">
        <CardHeader><CardTitle className="text-red-600">Zona de Peligro</CardTitle></CardHeader>
        <CardContent>
          <Button variant="destructive">
            <Trash2 className="mr-2 h-4 w-4" />
            Eliminar Cuenta
          </Button>
          <p className="text-xs text-muted-foreground mt-2">Esta acción es irreversible. Se eliminarán todos tus datos.</p>
        </CardContent>
      </Card>
    </div>
  )
}
