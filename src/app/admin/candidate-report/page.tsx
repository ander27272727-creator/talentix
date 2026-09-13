"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Loader2, AlertTriangle, CheckCircle2, ArrowLeft, Printer } from "lucide-react"
import { apiFetch } from "@/lib/api"

interface ReportData {
  success: boolean
  candidate?: {
    id: string
    name: string
    email: string
    phone: string | null
    location: string | null
    bio: string | null
    skills: string[]
    languages: string[]
    education: { degree: string; field: string; institution: string; startDate?: string; endDate?: string | null }[]
    experience: { position: string; company: string; startDate?: string; endDate?: string | null; current?: boolean }[]
    yearsExperience: number
    profileCompletion: number
    registeredAt: string
  }
  assessments?: {
    name: string
    category: string
    score: number | null
    completedAt: string | null
    dimensionScores: Record<string, number> | null
    fraudFlags: string[] | null
    isValid: boolean
  }[]
  matches?: {
    score: number
    vacancy: string
    company: string
    reasons: string[]
  }[]
  referrals?: { status: string; vacancy: string; company: string; referredAt: string }[]
  error?: string
}

const CATEGORY_LABELS: Record<string, string> = {
  COGNITIVE: "Cognitiva",
  PSYCHOMETRIC: "Psicométrica",
  BEHAVIORAL: "Comportamental",
  TECHNICAL: "Técnica",
  KNOWLEDGE: "Conocimientos",
}

function ReportContent() {
  const params = useSearchParams()
  const candidateId = params.get("candidateId")
  const [data, setData] = useState<ReportData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!candidateId) return
    apiFetch(`/api/admin/candidate-report?candidateId=${candidateId}`)
      .then((r) => (r.ok ? r.json() : { success: false, error: "No autorizado" }))
      .then((d) => setData(d))
      .catch(() => setData({ success: false, error: "Error de conexión" }))
      .finally(() => setLoading(false))
  }, [candidateId])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!data?.success || !data.candidate) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-6">
        <AlertTriangle className="h-10 w-10 text-red-500" />
        <p className="text-muted-foreground">{data?.error || "No se pudo cargar el reporte"}</p>
        <Link href="/admin/candidates" className="text-primary hover:underline flex items-center gap-1">
          <ArrowLeft className="h-4 w-4" /> Volver a candidatos
        </Link>
      </div>
    )
  }

  const c = data.candidate
  const completed = (data.assessments || []).filter((a) => a.score != null)
  const fraudAlerts = (data.assessments || []).filter((a) => a.fraudFlags && a.fraudFlags.length > 0)
  const avg = completed.length > 0 ? Math.round(completed.reduce((s, a) => s + (a.score || 0), 0) / completed.length) : null

  return (
    <div className="min-h-screen bg-white text-gray-900 print:bg-white">
      {/* Barra de acciones (no se imprime) */}
      <div className="print:hidden sticky top-0 z-10 bg-gray-50 border-b px-6 py-3 flex items-center justify-between">
        <Link href="/admin/candidates" className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1">
          <ArrowLeft className="h-4 w-4" /> Volver
        </Link>
        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
        >
          <Printer className="h-4 w-4" /> Imprimir / Guardar PDF
        </button>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-8 space-y-6">
        {/* Encabezado */}
        <header className="border-b-2 border-gray-900 pb-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-xs uppercase tracking-widest text-gray-500 mb-1">Talentix · Reporte de Candidato</div>
              <h1 className="text-3xl font-bold">{c.name}</h1>
              <p className="text-sm text-gray-600 mt-1">
                {[c.email, c.phone, c.location].filter(Boolean).join(" · ")}
              </p>
            </div>
            <div className="text-right shrink-0">
              {avg != null && (
                <>
                  <div className="text-4xl font-bold text-gray-900">{avg}%</div>
                  <div className="text-xs uppercase tracking-wide text-gray-500">Score promedio</div>
                </>
              )}
            </div>
          </div>
          <div className="mt-3 flex flex-wrap gap-2 text-xs">
            <span className="rounded-full bg-gray-100 px-2.5 py-1">Perfil: {c.profileCompletion}% completo</span>
            <span className="rounded-full bg-gray-100 px-2.5 py-1">{c.yearsExperience > 0 ? `${c.yearsExperience} años de experiencia` : "Sin experiencia registrada"}</span>
            <span className="rounded-full bg-gray-100 px-2.5 py-1">Registrado: {new Date(c.registeredAt).toLocaleDateString("es-ES")}</span>
          </div>
        </header>

        {/* Alertas de consistencia */}
        {fraudAlerts.length > 0 && (
          <section className="rounded-lg border-2 border-amber-300 bg-amber-50 p-4">
            <h2 className="font-semibold text-amber-800 flex items-center gap-2 text-sm">
              <AlertTriangle className="h-4 w-4" /> Alertas de consistencia detectadas
            </h2>
            <ul className="mt-2 space-y-1.5 text-sm text-amber-900">
              {fraudAlerts.map((a, i) => (
                <li key={i}>
                  <span className="font-medium">{a.name}:</span>{" "}
                  {(a.fraudFlags || []).join(" · ")}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Resumen profesional */}
        {c.bio && (
          <section>
            <h2 className="text-sm font-bold uppercase tracking-wide text-gray-500 mb-2">Resumen profesional</h2>
            <p className="text-sm leading-relaxed">{c.bio}</p>
          </section>
        )}

        {/* Evaluaciones */}
        <section>
          <h2 className="text-sm font-bold uppercase tracking-wide text-gray-500 mb-2">
            Evaluaciones ({completed.length})
          </h2>
          {completed.length === 0 ? (
            <p className="text-sm text-gray-500">El candidato aún no ha completado evaluaciones.</p>
          ) : (
            <div className="space-y-3">
              {completed.map((a, i) => (
                <div key={i} className="rounded-lg border border-gray-200 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-sm">{a.name}</p>
                      <p className="text-xs text-gray-500">
                        {CATEGORY_LABELS[a.category] || a.category}
                        {a.completedAt && ` · ${new Date(a.completedAt).toLocaleDateString("es-ES")}`}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {a.isValid ? (
                        <span className="inline-flex items-center gap-1 text-xs text-emerald-700"><CheckCircle2 className="h-3.5 w-3.5" /> Válido</span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs text-amber-700"><AlertTriangle className="h-3.5 w-3.5" /> Revisar</span>
                      )}
                      <span className="text-2xl font-bold">{Math.round(a.score || 0)}%</span>
                    </div>
                  </div>
                  {a.dimensionScores && Object.keys(a.dimensionScores).length > 0 && (
                    <div className="mt-3 space-y-1.5">
                      {Object.entries(a.dimensionScores).map(([dim, val]) => (
                        <div key={dim} className="flex items-center gap-2">
                          <span className="text-xs text-gray-600 w-40 shrink-0 capitalize">{dim.replace(/([A-Z])/g, " $1").trim()}</span>
                          <div className="flex-1 h-2 rounded-full bg-gray-100 overflow-hidden">
                            <div
                              className={`h-full rounded-full ${val >= 70 ? "bg-emerald-500" : val >= 50 ? "bg-amber-500" : "bg-red-400"}`}
                              style={{ width: `${Math.min(100, val)}%` }}
                            />
                          </div>
                          <span className="text-xs font-medium w-8 text-right">{Math.round(val)}%</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Matches */}
        {data.matches && data.matches.length > 0 && (
          <section>
            <h2 className="text-sm font-bold uppercase tracking-wide text-gray-500 mb-2">
              Matches con vacantes ({data.matches.length})
            </h2>
            <div className="space-y-2">
              {data.matches.map((m, i) => (
                <div key={i} className="flex items-center justify-between rounded-lg border border-gray-200 p-3">
                  <div>
                    <p className="font-medium text-sm">{m.vacancy}</p>
                    <p className="text-xs text-gray-500">{m.company}</p>
                    {m.reasons.length > 0 && (
                      <p className="text-xs text-gray-600 mt-1">{m.reasons.slice(0, 3).join(" · ")}</p>
                    )}
                  </div>
                  <span className={`text-lg font-bold ${m.score >= 85 ? "text-emerald-700" : "text-gray-900"}`}>{m.score}%</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Experiencia y educación */}
        <section className="grid md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wide text-gray-500 mb-2">Experiencia</h2>
            {c.experience.length === 0 ? (
              <p className="text-sm text-gray-500">Sin experiencia registrada.</p>
            ) : (
              <div className="space-y-3">
                {c.experience.map((e, i) => (
                  <div key={i}>
                    <p className="text-sm font-medium">{e.position}</p>
                    <p className="text-xs text-gray-500">
                      {e.company}
                      {e.startDate && ` · ${new Date(e.startDate).getFullYear()} – ${e.current ? "actualidad" : e.endDate ? new Date(e.endDate).getFullYear() : "?"}`}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wide text-gray-500 mb-2">Educación</h2>
            {c.education.length === 0 ? (
              <p className="text-sm text-gray-500">Sin educación registrada.</p>
            ) : (
              <div className="space-y-3">
                {c.education.map((e, i) => (
                  <div key={i}>
                    <p className="text-sm font-medium">{e.degree} — {e.field}</p>
                    <p className="text-xs text-gray-500">{e.institution}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Skills e idiomas */}
        <section>
          <h2 className="text-sm font-bold uppercase tracking-wide text-gray-500 mb-2">Habilidades</h2>
          <div className="flex flex-wrap gap-1.5">
            {c.skills.length === 0 && <p className="text-sm text-gray-500">Sin habilidades registradas.</p>}
            {c.skills.map((s, i) => (
              <span key={i} className="rounded-full bg-gray-100 px-2.5 py-1 text-xs">{s}</span>
            ))}
          </div>
          {c.languages.length > 0 && (
            <p className="text-xs text-gray-600 mt-2">Idiomas: {c.languages.join(", ")}</p>
          )}
        </section>

        {/* Pie */}
        <footer className="border-t pt-4 text-xs text-gray-400 flex items-center justify-between">
          <span>Generado por Talentix · {new Date().toLocaleDateString("es-ES")}</span>
          <span>Documento confidencial — uso interno de reclutamiento</span>
        </footer>
      </div>
    </div>
  )
}

export default function CandidateReportPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>}>
      <ReportContent />
    </Suspense>
  )
}
