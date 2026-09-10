"use client"

import { useState, useEffect, useRef } from "react"
import { FileText, Upload, Download, Trash2, CheckCircle2, AlertCircle, Loader2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useStore } from "@/store/useStore"
import { apiFetch } from "@/lib/api"

interface CvData {
  fileName: string | null
  fileSize: number | null
  uploadedAt: string | null
  hasFile: boolean
}

export default function CandidateCVPage() {
  const { user } = useStore()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [cv, setCv] = useState<CvData | null>(null)
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [dragOver, setDragOver] = useState(false)

  useEffect(() => {
    if (!user?.id) return
    loadCv()
  }, [user?.id])

  async function loadCv() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/candidate/cv?userId=${user!.id}`)
      const data = await res.json()
      if (data.success) {
        setCv(data.cv)
      } else {
        setError(data.error || "No se pudo cargar el CV")
      }
    } catch {
      setError("Error de conexión al cargar el CV")
    } finally {
      setLoading(false)
    }
  }

  async function handleFile(file: File) {
    setError(null)
    setSuccess(null)

    // Validaciones
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ]
    if (!allowedTypes.includes(file.type)) {
      setError("Formato no válido. Solo se aceptan archivos PDF, DOC o DOCX.")
      return
    }
    if (file.size > 2.5 * 1024 * 1024) {
      setError("El archivo es demasiado grande. El máximo es 2.5 MB.")
      return
    }

    setUploading(true)
    try {
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve((reader.result as string).split(",")[1])
        reader.onerror = reject
        reader.readAsDataURL(file)
      })

      const res = await apiFetch("/api/candidate/cv", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user!.id,
          fileName: file.name,
          fileSize: file.size,
          fileData: base64,
        }),
      })
      const data = await res.json()
      if (data.success) {
        setSuccess("CV subido correctamente")
        await loadCv()
      } else {
        setError(data.error || "No se pudo subir el CV")
      }
    } catch {
      setError("Error de conexión al subir el CV")
    } finally {
      setUploading(false)
    }
  }

  async function handleDelete() {
    if (!confirm("¿Seguro que deseas eliminar tu CV?")) return
    setError(null)
    setSuccess(null)
    try {
      const res = await apiFetch("/api/candidate/cv", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user!.id }),
      })
      const data = await res.json()
      if (data.success) {
        setSuccess("CV eliminado")
        await loadCv()
      } else {
        setError(data.error || "No se pudo eliminar el CV")
      }
    } catch {
      setError("Error de conexión al eliminar el CV")
    }
  }

  function formatSize(bytes: number | null) {
    if (!bytes) return ""
    if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  function formatDate(iso: string | null) {
    if (!iso) return ""
    return new Date(iso).toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <FileText className="h-8 w-8 text-primary" />
          Mi CV
        </h1>
        <p className="text-muted-foreground mt-1">Gestiona tu currículum vitae. Las empresas lo verán al recibir tu perfil.</p>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}
      {success && (
        <div className="flex items-center gap-2 p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          {success}
        </div>
      )}

      {/* Zona de subida */}
      <div
        className={`border-2 border-dashed rounded-xl transition-colors cursor-pointer ${
          dragOver ? "border-fb-blue bg-fb-blue/5" : "border-fb-blue/30 hover:border-fb-blue/60"
        }`}
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault()
          setDragOver(true)
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault()
          setDragOver(false)
          const file = e.dataTransfer.files?.[0]
          if (file) handleFile(file)
        }}
      >
        <CardContent className="p-12 text-center">
          {uploading ? (
            <>
              <Loader2 className="h-12 w-12 mx-auto mb-4 text-primary animate-spin" />
              <h3 className="font-semibold text-lg mb-2">Subiendo CV...</h3>
            </>
          ) : (
            <>
              <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="font-semibold text-lg mb-2">
                {cv?.hasFile ? "Reemplazar mi CV" : "Sube tu CV"}
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Arrastra tu archivo aquí o haz clic para seleccionar · PDF, DOC o DOCX · Máximo 2.5 MB
              </p>
              <Button variant="fb" type="button">
                <Upload className="mr-2 h-4 w-4" />
                Seleccionar Archivo
              </Button>
            </>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.doc,.docx"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) handleFile(file)
              e.target.value = ""
            }}
          />
        </CardContent>
      </div>

      {/* CV actual */}
      <Card>
        <CardHeader>
          <CardTitle>Mi CV actual</CardTitle>
          <CardDescription>Último currículum subido a tu perfil</CardDescription>
        </CardHeader>
        <CardContent>
          {cv?.hasFile ? (
            <div className="p-4 rounded-xl bg-muted/50 flex flex-col sm:flex-row sm:items-center gap-4">
              <FileText className="h-8 w-8 text-fb-blue shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{cv.fileName}</div>
                <div className="text-sm text-muted-foreground">
                  Subido el {formatDate(cv.uploadedAt)} · {formatSize(cv.fileSize)}
                </div>
              </div>
              <Badge variant="success">
                <CheckCircle2 className="h-3 w-3 mr-1" /> Activo
              </Badge>
              <div className="flex gap-2">
                <a
                  href={`/api/candidate/cv?userId=${user!.id}&download=1`}
                  download={cv.fileName || "cv.pdf"}
                >
                  <Button variant="ghost" size="icon" title="Descargar">
                    <Download className="h-4 w-4" />
                  </Button>
                </a>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-red-500 hover:text-red-600"
                  title="Eliminar"
                  onClick={handleDelete}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <FileText className="h-10 w-10 mx-auto mb-3 text-muted-foreground/50" />
              <p className="text-muted-foreground">
                Aún no has subido ningún CV. Sube el tuyo para completar tu perfil.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
