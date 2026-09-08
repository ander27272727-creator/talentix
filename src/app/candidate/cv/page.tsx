"use client"

import { FileText, Upload, Download, Trash2, CheckCircle2, Clock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default function CandidateCVPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <FileText className="h-8 w-8 text-primary" />
          Mi CV
        </h1>
        <p className="text-muted-foreground mt-1">Gestiona tu currículum vitae.</p>
      </div>

      <Card className="border-2 border-dashed border-fb-blue/30 hover:border-fb-blue/60 transition-colors cursor-pointer">
        <CardContent className="p-12 text-center">
          <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="font-semibold text-lg mb-2">Sube tu CV</h3>
          <p className="text-sm text-muted-foreground mb-4">Arrastra tu archivo PDF aquí o haz clic para seleccionar</p>
          <Button variant="fb">
            <Upload className="mr-2 h-4 w-4" />
            Seleccionar Archivo
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>CVs Subidos</CardTitle>
          <CardDescription>Tus currículums en la plataforma</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-4 rounded-xl bg-muted/50 flex items-center gap-4">
            <FileText className="h-8 w-8 text-fb-blue" />
            <div className="flex-1">
              <div className="font-medium">CV_Maria_Garcia_2026.pdf</div>
              <div className="text-sm text-muted-foreground">Subido el 1 Sep 2026 · 245 KB</div>
            </div>
            <Badge variant="success"><CheckCircle2 className="h-3 w-3 mr-1" /> Activo</Badge>
            <Button variant="ghost" size="icon"><Download className="h-4 w-4" /></Button>
            <Button variant="ghost" size="icon" className="text-red-500"><Trash2 className="h-4 w-4" /></Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
