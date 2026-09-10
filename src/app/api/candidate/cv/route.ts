import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const MAX_SIZE = 2.5 * 1024 * 1024 // 2.5 MB

// GET /api/candidate/cv?userId=...            -> metadatos del CV
// GET /api/candidate/cv?userId=...&download=1 -> descarga el archivo
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const download = searchParams.get('download')

    if (!userId) {
      return NextResponse.json({ success: false, error: 'Falta el ID de usuario' }, { status: 400 })
    }

    const profile = await prisma.candidateProfile.findUnique({
      where: { userId },
      select: {
        cvFileName: true,
        cvFileSize: true,
        cvUploadedAt: true,
        cvData: download === '1',
      },
    })

    if (!profile) {
      return NextResponse.json({ success: false, error: 'Perfil no encontrado' }, { status: 404 })
    }

    if (download === '1') {
      if (!profile.cvData) {
        return NextResponse.json({ success: false, error: 'No hay CV subido' }, { status: 404 })
      }
      const buffer = Buffer.from(profile.cvData, 'base64')
      return new NextResponse(buffer, {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="${profile.cvFileName || 'cv.pdf'}"`,
        },
      })
    }

    return NextResponse.json({
      success: true,
      cv: {
        fileName: profile.cvFileName,
        fileSize: profile.cvFileSize,
        uploadedAt: profile.cvUploadedAt,
        hasFile: Boolean(profile.cvFileName),
      },
    })
  } catch (error) {
    console.error('Error GET /api/candidate/cv:', error)
    return NextResponse.json({ success: false, error: 'Error interno' }, { status: 500 })
  }
}

// POST /api/candidate/cv — sube o reemplaza el CV
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, fileName, fileSize, fileData } = body as {
      userId: string
      fileName: string
      fileSize: number
      fileData: string
    }

    if (!userId || !fileName || !fileData) {
      return NextResponse.json({ success: false, error: 'Datos incompletos' }, { status: 400 })
    }

    if (fileSize > MAX_SIZE) {
      return NextResponse.json({ success: false, error: 'El archivo supera el máximo de 2.5 MB' }, { status: 400 })
    }

    const profile = await prisma.candidateProfile.findUnique({ where: { userId }, select: { id: true } })
    if (!profile) {
      return NextResponse.json({ success: false, error: 'Perfil de candidato no encontrado' }, { status: 404 })
    }

    await prisma.candidateProfile.update({
      where: { userId },
      data: {
        cvFileName: fileName,
        cvFileSize: fileSize,
        cvUploadedAt: new Date(),
        cvData: fileData,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error POST /api/candidate/cv:', error)
    return NextResponse.json({ success: false, error: 'Error interno al guardar el CV' }, { status: 500 })
  }
}

// DELETE /api/candidate/cv — elimina el CV
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId } = body as { userId: string }

    if (!userId) {
      return NextResponse.json({ success: false, error: 'Falta el ID de usuario' }, { status: 400 })
    }

    await prisma.candidateProfile.update({
      where: { userId },
      data: { cvFileName: null, cvFileSize: null, cvUploadedAt: null, cvData: null },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error DELETE /api/candidate/cv:', error)
    return NextResponse.json({ success: false, error: 'Error interno al eliminar el CV' }, { status: 500 })
  }
}
