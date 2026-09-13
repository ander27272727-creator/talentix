import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireRole } from '@/lib/auth'

// GET /api/candidate/achievements?userId=... — recorrido gamificado del candidato
export async function GET(request: NextRequest) {
  try {
    const auth = await requireRole(request, 'CANDIDATE', 'ADMIN')
    if ('error' in auth) return auth.error
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    if (!userId) {
      return NextResponse.json({ success: false, error: 'Falta el ID de usuario' }, { status: 400 })
    }

    const profile = await prisma.candidateProfile.findUnique({
      where: { userId },
      include: {
        education: true,
        experience: true,
        _count: { select: { assessments: true } },
      },
    })
    if (!profile) {
      return NextResponse.json({ success: false, error: 'Perfil no encontrado' }, { status: 404 })
    }

    const completedAssessments = profile._count.assessments
    const completed = await prisma.assessmentResponse.count({
      where: { candidateId: profile.id, completedAt: { not: null } },
    })

    // ---- Completitud del perfil ----
    const checks = [
      { key: 'personal', label: 'Datos personales', done: !!(profile.phone && profile.location) },
      { key: 'education', label: 'Educación', done: profile.education.length > 0 },
      { key: 'experience', label: 'Experiencia', done: profile.experience.length > 0 },
      { key: 'skills', label: 'Skills', done: (profile.skills?.length || 0) >= 3 },
      { key: 'cv', label: 'CV subido', done: !!profile.cvUrl || !!profile.cvData },
      { key: 'track', label: 'Track de Carrera completado', done: completed > 0 },
    ]
    const doneCount = checks.filter((c) => c.done).length
    const completeness = Math.round((doneCount / checks.length) * 100)

    // ---- Insignias ----
    const referralsMade = await prisma.referral.count({ where: { candidateId: profile.id } })
    const badges: { key: string; label: string; earned: boolean; description: string }[] = [
      { key: 'profile_100', label: 'Perfil Completo', earned: completeness === 100, description: 'Completa el 100% de tu perfil' },
      { key: 'first_assessment', label: 'Primer Paso', earned: completed >= 1, description: 'Completa tu primera evaluación' },
      { key: 'assessed_5', label: 'Evaluated Pro', earned: completed >= 5, description: 'Completa 5 evaluaciones' },
      { key: 'referred', label: 'Talent Scout', earned: false, description: 'Refiere a un amigo que se registre' },
    ]

    return NextResponse.json({
      success: true,
      completeness,
      checks,
      badges,
      stats: {
        completedAssessments: completed,
        referralsMade,
      },
    })
  } catch (error) {
    console.error('Error en /api/candidate/achievements:', error)
    return NextResponse.json({ success: false, error: 'Error al cargar logros' }, { status: 500 })
  }
}
