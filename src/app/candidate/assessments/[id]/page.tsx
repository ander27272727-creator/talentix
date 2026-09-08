"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  ArrowRight, ArrowLeft, Clock, CheckCircle2, Brain,
  Target, Sparkles, AlertCircle, ChevronRight, Loader2
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { useStore } from "@/store/useStore"

// Assessment questions database (fallback local)
const assessmentDB: Record<string, {
  name: string
  category: string
  description: string
  timeLimitMinutes: number
  dimensions: string[]
  questions: Array<{
    id: string
    type: string
    dimension: string
    text: string
    scenario?: string
    options: Array<{ text: string; value: number; dimension: string }>
    weights: Record<string, number>
  }>
}> = {
  // (same as before)
}

interface Answer {
  questionId: string
  value: number
  timeSpentSeconds: number
}

export default function AssessmentPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const { addAssessmentResponse, addNotification } = useStore()
  const [assessmentId, setAssessmentId] = useState("")
  const [assessment, setAssessment] = useState<typeof assessmentDB[string] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Answer[]>([])
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [timeLeft, setTimeLeft] = useState(0)
  const [totalTimeSpent, setTotalTimeSpent] = useState(0)
  const [questionStartTime, setQuestionStartTime] = useState(Date.now())
  const [isCompleted, setIsCompleted] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [scores, setScores] = useState<Record<string, number>>({})

  useEffect(() => {
    params.then(p => {
      setAssessmentId(p.id)
      console.log("[Assessment] Cargando evaluación:", p.id)
      fetch(`/api/assessments/${p.id}`)
        .then(r => {
          console.log("[Assessment] Response status:", r.status)
          return r.json()
        })
        .then(data => {
          console.log("[Assessment] Data:", data)
          if (data.success && data.assessment) {
            const a = data.assessment
            const questions = (a.questions || []).map((q: Record<string, unknown>, i: number) => {
              // Las opciones pueden llegar como string JSON (de Supabase) o como array
              let opts: Array<{text: string; value: number}> = []
              if (typeof q.options === 'string') {
                try { opts = JSON.parse(q.options) } catch { opts = [] }
              } else if (Array.isArray(q.options)) {
                opts = q.options as Array<{text: string; value: number}>
              }
              return {
                id: q.id as string || `q${i}`,
                type: (q.type as string)?.toLowerCase().replace(/_/g, '_') || 'MULTIPLE_CHOICE',
                dimension: q.dimension as string || 'general',
                text: q.text as string,
                scenario: q.scenario as string || undefined,
                options: opts.map((o, j: number) => ({
                  text: o.text,
                  value: j,
                  dimension: q.dimension as string || 'general',
                })),
                weights: { [q.dimension as string || 'general']: 1.0 },
              }
            })
            setAssessment({
              name: a.name,
              category: a.category,
              description: a.description,
              timeLimitMinutes: a.timeLimitMinutes,
              dimensions: [...new Set(a.questions?.map((q: Record<string, unknown>) => q.dimension as string) || [])] as string[],
              questions,
            })
            setTimeLeft((a.timeLimitMinutes || 15) * 60)
            setLoading(false)
            console.log("[Assessment] Evaluación cargada:", a.name, "con", questions.length, "preguntas")
          } else {
            console.log("[Assessment] Data sin éxito o sin evaluación:", data)
            setError("No se pudieron cargar los datos de la evaluación")
            setLoading(false)
            // Fallback al DB local
            const found = assessmentDB[p.id]
            if (found) {
              setAssessment(found)
              setTimeLeft(found.timeLimitMinutes * 60)
              setLoading(false)
              console.log("[Assessment] Evaluación cargada desde DB local:", found.name)
            } else {
              console.log("[Assessment] Evaluación NO encontrada ni en API ni en DB local")
              setLoading(false)
            }
          }
        })
        .catch(err => {
          console.error("[Assessment] Error cargando evaluación:", err)
          setError("Error cargando la evaluación: " + err.message)
          setLoading(false)
          // Fallback al DB local
          const found = assessmentDB[p.id]
          if (found) {
            setAssessment(found)
            setTimeLeft(found.timeLimitMinutes * 60)
            setLoading(false)
          }
        })
    })
  }, [params])

  const answersRef = useRef<Answer[]>([])
  answersRef.current = answers

  // Timer
  useEffect(() => {
    if (isCompleted || !assessment) return
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          setIsCompleted(true)
          calculateScores(answersRef.current)
          return 0
        }
        return prev - 1
      })
      setTotalTimeSpent((prev) => prev + 1)
    }, 1000)
    return () => clearInterval(interval)
  }, [isCompleted, assessment])

  const handleSelectOption = (optionIndex: number) => {
    setSelectedOption(optionIndex)
  }

  const calculateScores = useCallback((finalAnswers: Answer[]) => {
    const store = useStore.getState()
    if (!assessment) return

    const dimensionScores: Record<string, { total: number; count: number }> = {}

    finalAnswers.forEach((answer) => {
      const question = assessment.questions.find((q) => q.id === answer.questionId)
      if (!question) return

      Object.entries(question.weights).forEach(([dimension, weight]) => {
        if (!dimensionScores[dimension]) {
          dimensionScores[dimension] = { total: 0, count: 0 }
        }
        dimensionScores[dimension].total += (answer.value / 5) * 100 * weight
        dimensionScores[dimension].count += weight
      })
    })

    const finalScores: Record<string, number> = {}
    Object.entries(dimensionScores).forEach(([dim, data]) => {
      finalScores[dim] = Math.round(data.total / data.count)
    })

    const overallScore = Math.round(
      Object.values(finalScores).reduce((a, b) => a + b, 0) / Object.values(finalScores).length
    )
    finalScores["overall"] = overallScore
    setScores(finalScores)
    setIsCompleted(true)
    setShowResults(true)

    // Save to Supabase API
    const user = useStore.getState().user
    if (user?.id) {
      fetch(`/api/assessments/${assessmentId}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          answers: finalAnswers.map(a => ({
            questionId: a.questionId,
            value: a.value,
            timeSpentSeconds: a.timeSpentSeconds,
          })),
          score: overallScore,
          dimensionScores: finalScores,
          totalTimeSpent,
        }),
      }).then(r => r.json())
      .then(data => {
        if (data.success) {
          addAssessmentResponse({
            id: data.response.id,
            candidateId: user.id,
            assessmentId,
            answers: finalAnswers,
            startedAt: new Date(Date.now() - totalTimeSpent * 1000).toISOString(),
            completedAt: new Date().toISOString(),
            score: overallScore,
            dimensionScores: finalScores,
          })
        }
      })
      .catch(err => console.error('Error guardando respuesta:', err))
    }

    addNotification({
      id: `notif-${Date.now()}`,
      type: "success",
      title: "¡Evaluación Completada!",
      message: `Has obtenido ${overallScore}% en ${assessment.name}`,
      createdAt: new Date().toISOString(),
    })
  }, [assessment, assessmentId, totalTimeSpent, addAssessmentResponse, addNotification])

  if (!assessment) {
    if (loading) {
      return (
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-fb-blue mx-auto mb-4" />
            <p className="text-muted-foreground">Cargando evaluación...</p>
          </div>
        </div>
      )
    }
    if (error) {
      return (
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 mx-auto mb-4 text-red-500" />
            <h2 className="text-xl font-semibold mb-2 text-red-600">Error al cargar</h2>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Link href="/candidate/assessments">
              <Button variant="fb">Volver a Evaluaciones</Button>
            </Link>
          </div>
        </div>
      )
    }
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-xl font-semibold mb-2">Evaluación no encontrada</h2>
          <p className="text-muted-foreground mb-4">Esta evaluación no existe o no está disponible.</p>
          <Link href="/candidate/assessments">
            <Button variant="fb">Volver a Evaluaciones</Button>
          </Link>
        </div>
      </div>
    )
  }

  // Resto del componente...
}
