import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireRole } from '@/lib/auth'

// GET /api/messages — conversaciones del usuario actual con último mensaje y no leídos
export async function GET(request: NextRequest) {
  try {
    const auth = await requireRole(request, 'CANDIDATE', 'COMPANY', 'ADMIN')
    if ('error' in auth) return auth.error
    const me = auth.user

    const conversations = await prisma.conversation.findMany({
      where: { OR: [{ userAId: me.id }, { userBId: me.id }] },
      include: {
        userA: { select: { id: true, name: true, role: true } },
        userB: { select: { id: true, name: true, role: true } },
        messages: { orderBy: { createdAt: 'desc' }, take: 1 },
      },
      orderBy: { updatedAt: 'desc' },
    })

    // No leídos por conversación
    const unreadCounts = await prisma.message.groupBy({
      by: ['conversationId'],
      where: {
        conversationId: { in: conversations.map((c) => c.id) },
        senderId: { not: me.id },
        readAt: null,
      },
      _count: true,
    })
    const unreadBy = new Map(unreadCounts.map((u) => [u.conversationId, u._count]))

    const totalUnread = unreadCounts.reduce((s, u) => s + u._count, 0)

    return NextResponse.json({
      success: true,
      totalUnread,
      conversations: conversations.map((c) => {
        const other = c.userAId === me.id ? c.userB : c.userA
        return {
          id: c.id,
          other: { id: other.id, name: other.name, role: other.role },
          lastMessage: c.messages[0]
            ? {
                body: c.messages[0].body,
                senderId: c.messages[0].senderId,
                createdAt: c.messages[0].createdAt,
                isMine: c.messages[0].senderId === me.id,
              }
            : null,
          unread: unreadBy.get(c.id) || 0,
          updatedAt: c.updatedAt,
        }
      }),
    })
  } catch (error) {
    console.error('Error GET /api/messages:', error)
    return NextResponse.json({ success: false, error: 'Error interno' }, { status: 500 })
  }
}
