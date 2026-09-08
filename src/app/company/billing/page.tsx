"use client"

import { CreditCard, CheckCircle2, Clock, ArrowRight, Shield } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

const invoices = [
  { id: "INV-2026-001", date: "1 Sep 2026", amount: "$599", status: "Pagado" },
  { id: "INV-2026-002", date: "1 Ago 2026", amount: "$599", status: "Pagado" },
  { id: "INV-2026-003", date: "1 Jul 2026", amount: "$599", status: "Pagado" },
]

export default function CompanyBillingPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <CreditCard className="h-8 w-8 text-primary" />
          Facturación
        </h1>
        <p className="text-muted-foreground mt-1">
          Gestiona tu plan, facturas y métodos de pago.
        </p>
      </div>

      {/* Current Plan */}
      <Card className="border-2 border-fb-purple/20 bg-gradient-to-r from-fb-purple/5 to-fb-blue/5">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl gradient-bg flex items-center justify-center">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Plan Professional</h3>
                <p className="text-muted-foreground">$599/mes · Próxima facturación: 1 Oct 2026</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="fb-outline">Cambiar Plan</Button>
              <Button variant="ghost" className="text-red-500">Cancelar</Button>
            </div>
          </div>

          <Separator className="my-6" />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <div className="text-sm text-muted-foreground">Vacantes</div>
              <div className="font-semibold">5 / 10</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Candidatos</div>
              <div className="font-semibold">67 / 100</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Evaluaciones Custom</div>
              <div className="font-semibold">1 / 2</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">API Access</div>
              <div className="font-semibold text-red-500">No incluido</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Invoices */}
      <Card>
        <CardHeader>
          <CardTitle>Facturas Recientes</CardTitle>
          <CardDescription>Historial de facturación de tu cuenta</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {invoices.map((invoice, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors">
                <div className="flex items-center gap-4">
                  <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                  <div>
                    <div className="font-medium">{invoice.id}</div>
                    <div className="text-sm text-muted-foreground">{invoice.date}</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-semibold">{invoice.amount}</span>
                  <Badge variant="success">{invoice.status}</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
