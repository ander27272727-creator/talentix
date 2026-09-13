"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Trophy, Award, Share2, ChevronRight, Loader2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { apiFetch } from "@/lib/api"

interface AchievementData {
  success: boolean
  completeness: number
  checks: { key: string; label: string; done: boolean }[]
  badges: { key: string; label: string; earned: boolean; description: string }[]
  stats: { completedAssessments: number; referralsMade: number }
}

export function AchievementsCard({ userId }: { userId: string }) {
  const [data, setData] = useState<AchievementData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    apiFetch(`/api/candidate/achievements?userId=${userId}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => setData(d))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [userId])

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    )
  }
  if (!data?.success) return null

  const nextTask = data.checks.find((c) => !c.done)

  return (
    <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <Trophy className="h-5 w-5 text-emerald-600" />
            Tu recorrido
          </CardTitle>
          <span className="text-2xl font-bold text-emerald-700">{data.completeness}%</span>
        </div>
        <Progress value={data.completeness} className="h-2" />
      </CardHeader>
      <CardContent className="space-y-3">
        {nextTask && (
          <p className="text-sm text-emerald-900">
            Siguiente paso: <span className="font-semibold">{nextTask.label}</span>
          </p>
        )}
        <div className="flex flex-wrap gap-2">
          {data.badges.map((b) => (
            <Badge
              key={b.key}
              variant={b.earned ? "default" : "outline"}
              className={b.earned ? "bg-emerald-600 text-white" : "text-muted-foreground"}
            >
              <Award className="h-3 w-3 mr-1" />
              {b.label}
            </Badge>
          ))}
        </div>
        <div className="flex items-center justify-between pt-1">
          <span className="text-xs text-muted-foreground">
            {data.stats.completedAssessments} evaluaciones · {data.stats.referralsMade} referidos
          </span>
          <Link href="/candidate/referrals" className="text-xs font-medium text-emerald-700 hover:underline flex items-center">
            <Share2 className="h-3 w-3 mr-1" /> Invita y gana <ChevronRight className="h-3 w-3" />
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
