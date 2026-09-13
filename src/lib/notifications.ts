import { prisma } from '@/lib/prisma'

/**
 * Sistema central de notificaciones:
 * 1. Guarda la notificación in-app (campana de los portales)
 * 2. Envía email si hay RESEND_API_KEY (Resend) — opcional
 * 3. Envía WhatsApp si hay TWILIO_* — opcional; si no, no falla (no-op)
 *
 * Todo es fail-safe: si falla el email/WhatsApp, la notificación in-app queda igual.
 */

export type NotificationType =
  | 'MATCH_HIGH'
  | 'REFERRAL_VIEWED'
  | 'ASSESSMENT_ASSIGNED'
  | 'CONTRACT_EXPIRING'
  | 'INTERVIEW_SCHEDULED'

interface NotifyInput {
  userId: string
  type: NotificationType
  title: string
  body: string
  link?: string
}

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://freebuff-beta.vercel.app'

async function sendEmail(to: string, subject: string, text: string): Promise<void> {
  const key = process.env.RESEND_API_KEY
  if (!key || !to) return
  try {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: process.env.RESEND_FROM || 'Talentix <onboarding@resend.dev>',
        to: [to],
        subject,
        text,
      }),
    })
  } catch (e) {
    console.error('Error enviando email:', e)
  }
}

function normalizePhone(phone: string): string | null {
  const digits = phone.replace(/[^0-9]/g, '')
  return digits.length >= 8 ? digits : null
}

async function sendWhatsApp(phone: string, text: string): Promise<void> {
  const sid = process.env.TWILIO_ACCOUNT_SID
  const token = process.env.TWILIO_AUTH_TOKEN
  const from = process.env.TWILIO_WHATSAPP_FROM
  if (!sid || !token || !from || !phone) return
  try {
    const body = new URLSearchParams({ From: from, To: `whatsapp:+${phone}`, Body: text })
    const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`, {
      method: 'POST',
      headers: {
        Authorization: 'Basic ' + Buffer.from(`${sid}:${token}`).toString('base64'),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body,
    })
    if (!res.ok) console.error('Twilio error:', await res.text())
  } catch (e) {
    console.error('Error enviando WhatsApp:', e)
  }
}

/**
 * Crea la notificación in-app y dispara los canales opcionales (email/WhatsApp).
 * No lanza errores: la UI nunca se rompe por un fallo de envío.
 */
export async function notify(input: NotifyInput): Promise<void> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: input.userId },
      select: { email: true, name: true, candidateProfile: { select: { phone: true } } },
    })
    if (!user) return

    await prisma.notification.create({
      data: {
        userId: input.userId,
        type: input.type,
        title: input.title,
        body: input.body,
        link: input.link || null,
      },
    })

    const text = `${input.title}\n\n${input.body}\n\n— Talentix\n${input.link ? APP_URL + input.link : APP_URL}`
    // Email + WhatsApp en paralelo, sin bloquear por errores
    await Promise.all([sendEmail(user.email, input.title, text)])

    const phone = user.candidateProfile?.phone ? normalizePhone(user.candidateProfile.phone) : null
    if (phone) await sendWhatsApp(phone, text)
  } catch (e) {
    console.error('Error en notify():', e)
  }
}

/** Cuenta notificaciones no leídas de un usuario */
export async function unreadCount(userId: string): Promise<number> {
  return prisma.notification.count({ where: { userId, readAt: null } })
}
