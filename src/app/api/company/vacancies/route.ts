import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

interface ScreeningConfig {
  ageMin: number
  ageMax: number
  gender: string
  educationLevel: string
  experienceLevel: string
  requiredLanguages: string[]
  limitations: {
    criminalRecord: boolean
    drugTest: boolean
    validDriverLicense: boolean
    willingToRelocate: boolean
    availableForTravel: boolean
  }
  hybridDays?: number
}

interface VacancyConfig {
  weights?: Record<string, number>
  screening?: ScreeningConfig
}

// GET /api/company/vacancies?userId=... — vacantes reales de la empresa
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ success: false, error: 'Falta el ID de usuario' }, { status: 400 })
    }

    const company = await prisma.company.findUnique({ where: { userId }, select: { id: true } })
    if (!company) {
      return NextResponse.json({ success: false, error: 'Empresa no encontrada' }, { status: 404 })
    }

    const vacancies = await prisma.vacancy.findMany({
      where: { companyId: company.id },
      orderBy: { createdAt: 'desc' },
      include: { _count: { select: { referrals: true, matches: true } } },
    })

    return NextResponse.json({
      success: true,
      vacancies: vacancies.map((v) => {
        const config = (v.assessmentConfig || {}) as VacancyConfig
        return {
          id: v.id,
          title: v.title,
          description: v.description,
          category: v.category,
          status: v.status,
          location: v.location,
          type: v.type,
          salaryMin: v.salaryMin ? Number(v.salaryMin) : null,
          salaryMax: v.salaryMax ? Number(v.salaryMax) : null,
          salaryCurrency: v.salaryCurrency,
          requirements: v.requirements,
          screening: config.screening || null,
          weights: config.weights || null,
          candidates: v._count.referrals,
          matches: v._count.matches,
          createdAt: v.createdAt,
        }
      }),
    })
  } catch (error) {
    console.error('Error GET /api/company/vacancies:', error)
    return NextResponse.json({ success: false, error: 'Error interno' }, { status: 500 })
  }
}

// PATCH /api/company/vacancies — pausar/activar/cerrar una vacante
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, vacancyId, status } = body as { userId: string; vacancyId: string; status: string }

    if (!userId || !vacancyId || !['ACTIVE', 'PAUSED', 'CLOSED'].includes(status)) {
      return NextResponse.json({ success: false, error: 'Datos inválidos' }, { status: 400 })
    }

    const company = await prisma.company.findUnique({ where: { userId }, select: { id: true } })
    if (!company) {
      return NextResponse.json({ success: false, error: 'Empresa no encontrada' }, { status: 404 })
    }

    // Verificar que la vacante pertenece a la empresa
    const vacancy = await prisma.vacancy.findFirst({
      where: { id: vacancyId, companyId: company.id },
      select: { id: true },
    })
    if (!vacancy) {
      return NextResponse.json({ success: false, error: 'Vacante no encontrada' }, { status: 404 })
    }

    await prisma.vacancy.update({ where: { id: vacancyId }, data: { status: status as 'ACTIVE' | 'PAUSED' | 'CLOSED' } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error PATCH /api/company/vacancies:', error)
    return NextResponse.json({ success: false, error: 'Error interno' }, { status: 500 })
  }
}
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, title, description, category, requirements, salaryMin, salaryMax, salaryCurrency, location, locationType, hybridDays, ageMin, ageMax, gender, educationLevel, experienceLevel, requiredLanguages, criminalRecord, drugTest, validDriverLicense, willingToRelocate, availableForTravel, assessmentWeights } = body

    if (!userId || !title?.trim() || !description?.trim() || !category || !location?.trim()) {
      return NextResponse.json(
        { success: false, error: 'Faltan campos obligatorios: título, descripción, categoría y ubicación' },
        { status: 400 }
      )
    }

    const company = await prisma.company.findUnique({ where: { userId }, select: { id: true, plan: true } })
    if (!company) {
      return NextResponse.json({ success: false, error: 'Empresa no encontrada' }, { status: 404 })
    }

    // Límite de vacantes según plan
    const planLimits: Record<string, number> = { TRIAL: 1, STARTER: 3, PROFESSIONAL: 10, ENTERPRISE: 30, CUSTOM: 100 }
    const limit = planLimits[company.plan] ?? 1
    const activeCount = await prisma.vacancy.count({ where: { companyId: company.id, status: 'ACTIVE' } })
    if (activeCount >= limit) {
      return NextResponse.json(
        { success: false, error: `Tu plan ${company.plan} permite ${limit} vacante${limit !== 1 ? 's' : ''} activa${limit !== 1 ? 's' : ''}. Actualiza tu plan para publicar más.` },
        { status: 403 }
      )
    }

    const screening: ScreeningConfig = {
      ageMin: ageMin ?? 18,
      ageMax: ageMax ?? 65,
      gender: gender || 'any',
      educationLevel: educationLevel || '',
      experienceLevel: experienceLevel || '',
      requiredLanguages: requiredLanguages || [],
      limitations: {
        criminalRecord: !!criminalRecord,
        drugTest: !!drugTest,
        validDriverLicense: !!validDriverLicense,
        willingToRelocate: !!willingToRelocate,
        availableForTravel: !!availableForTravel,
      },
      hybridDays: locationType === 'HYBRID' ? hybridDays : undefined,
    }

    const vacancy = await prisma.vacancy.create({
      data: {
        companyId: company.id,
        title: title.trim(),
        description: description.trim(),
        category,
        requirements: Array.isArray(requirements) ? requirements : [],
        salaryMin: salaryMin ? Number(salaryMin) : null,
        salaryMax: salaryMax ? Number(salaryMax) : null,
        salaryCurrency: salaryCurrency || 'USD',
        location: location.trim(),
        type: locationType || 'ONSITE',
        status: 'ACTIVE',
        assessmentConfig: {
          weights: assessmentWeights || { cognitive: 25, psychometric: 25, behavioral: 20, technical: 30 },
          screening,
        } as unknown as import('@prisma/client').Prisma.InputJsonValue,
      },
    })

    return NextResponse.json({ success: true, vacancyId: vacancy.id })
  } catch (error) {
    console.error('Error POST /api/company/vacancies:', error)
    return NextResponse.json({ success: false, error: 'Error interno al publicar la vacante' }, { status: 500 })
  }
}
