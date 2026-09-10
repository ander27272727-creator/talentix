import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireRole } from '@/lib/auth'

async function getOrCreateConversation(userAId: string, userBId: string) {
  // Orden canónico para respetar la unique [userAId, userBId]
  const [a, b] = [userAId, userBId].sort()
  const existing = await prisma.conversation.findUnique({
    where: { userAId_userBId: { userAId: a, userBId: b } },
  })
  if (existing) return existing
  return prisma.conversation.create({ data: { userAId: a, userBId: b } })
}

// GET /api/messages/[userId] — mensajes con un usuario específico (marca leídos)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const auth = await requireRole(request, 'CANDIDATE', 'COMPANY', 'ADMIN')
    if ('error' in auth) return auth.error
    const me = auth.user

    const { userId: otherId } = await params
    const other = await prisma.user.findUnique({
      where: { id: otherId },
      select: { id: true, name: true, role: true, email: true },
    })
    if (!other) {
      return NextResponse.json({ success: false, error: 'Usuario no encontrado' }, { status: 404 })
    }

    const conversation = await getOrCreateConversation(me.id, otherId)

    const messages = await prisma.message.findMany({
      where: { conversationId: conversation.id },
      orderBy: { createdAt: 'asc' },
      take: 200,
    })

    // Marcar como leídos los que me enviaron
    await prisma.message.updateMany({
      where: { conversationId: conversation.id, senderId: { not: me.id }, readAt: null },
      data: { readAt: new Date() },
    })

    return NextResponse.json({
      success: true,
      conversationId: conversation.id,
      other,
      messages: messages.map((m) => ({
        id: m.id,
        body: m.body,
        createdAt: m.createdAt,
        isMine: m.senderId === me.id,
        readAt: m.readAt,
      })),
    })
  } catch (error) {
    console.error('Error GET /api/messages/[userId]:', error)
    return NextResponse.json({ success: false, error: 'Error interno' }, { status: 500 })
  }
}

// POST /api/messages/[userId] — enviar mensaje a un usuario
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const auth = await requireRole(request, 'CANDIDATE', 'COMPANY', 'ADMIN')
    if ('error' in auth) return auth.error
    const me = auth.user

    const { userId: otherId } = await params
    const { body } = await request.json()
    if (!body?.trim()) {
      return NextResponse.json({ success: false, error: 'El mensaje está vacío' }, { status: 400 })
    }

    const other = await prisma.user.findUnique({ where: { id: otherId }, select: { id: true } })
    if (!other) {
      return NextResponse.json({ success: false, error: 'Usuario no encontrado' }, { status: 404 })
    }
    if (other.id === me.id) {
      return NextResponse.json({ success: false, error: 'No puedes enviarte mensajes a ti mismo' }, { status: 400 })
    }

    const conversation = await getOrCreateConversation(me.id, otherId)
    const message = await prisma.message.create({
      data: { conversationId: conversation.id, senderId: me.id, body: body.trim().slice(0, 4000) },
    })

    await prisma.conversation.update({
      where: { id: conversation.id },
      data: { updatedAt: new Date() },
    })

    return NextResponse.json({ success: true, message: { id: message.id, createdAt: message.createdAt } })
  } catch (error) {
    console.error('Error POST /api/messages/[userId]:', error)
    return NextResponse.json({ success: false, error: 'Error interno' }, { status: 500 })
  }
}
