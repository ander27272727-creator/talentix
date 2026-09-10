import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
// Acepta la clave legacy (service_role JWT) o la nueva (sb_secret_...)
const supabaseServiceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_SECRET_KEY ||
  ''

/**
 * Cliente admin (service role / secret key) — SOLO servidor, para gestionar
 * usuarios de Auth sin estar logueado (crear, verificar credenciales).
 * Nunca exponer al cliente.
 */
export function getSupabaseAdmin() {
  if (!supabaseServiceKey) {
    throw new Error(
      'SUPABASE_SERVICE_ROLE_KEY no está configurada. Agrégala en Vercel (Settings → Environment Variables) o en .env.local. Cópiala desde Supabase Dashboard → Settings → API Keys.'
    )
  }
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
}

export { supabaseUrl, supabaseAnonKey }
