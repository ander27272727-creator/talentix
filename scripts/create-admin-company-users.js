process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
const fs = require('fs')
const path = require('path')
const { createClient } = require('@supabase/supabase-js')
const { PrismaClient } = require('@prisma/client')

// ── Cargar .env.local manualmente ──────────────────────────────────────────
const envFile = fs.readFileSync(path.join(__dirname, '..', '.env.local'), 'utf8')
for (const line of envFile.split(/\r?\n/)) {
  const m = line.match(/^([A-Z_][A-Z0-9_]*)="?([^"\r\n]*)"?$/)
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2]
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const prisma = new PrismaClient()

const USERS = [
  {
    email: 'admin@talentix.app',
    password: 'Talentix2026!',
    name: 'Administrador Talentix',
    role: 'ADMIN',
  },
  {
    email: 'empresa@talentix.app',
    password: 'Empresa2026!',
    name: 'Recursos Humanos Demo',
    role: 'COMPANY',
    company: {
      name: 'Talentix Demo Corp',
      industry: 'Tecnología y Servicios',
      size: '51-200',
      description: 'Empresa demo registrada para probar el flujo completo de reclutamiento en Talentix.',
      location: 'Panamá',
    },
  },
]

const q = (strings, ...vals) => prisma.$queryRawUnsafe(strings.join('?'), ...vals)

async function ensurePasswordAndConfirm(email, password) {
  // Confirmar email (por si el proyecto exige confirmación)
  await prisma.$executeRawUnsafe(
    `UPDATE auth.users SET email_confirmed_at = COALESCE(email_confirmed_at, now()), updated_at = now() WHERE email = $1`,
    email
  )
  // Resetear contraseña con bcrypt (pgcrypto)
  try {
    await prisma.$executeRawUnsafe(
      `UPDATE auth.users SET encrypted_password = crypt($1, gen_salt('bf', 10)), updated_at = now() WHERE email = $2`,
      password, email
    )
  } catch {
    await prisma.$executeRawUnsafe(
      `UPDATE auth.users SET encrypted_password = extensions.crypt($1, extensions.gen_salt('bf', 10)), updated_at = now() WHERE email = $2`,
      password, email
    )
  }
}

async function getUserId(email) {
  const rows = await prisma.$queryRawUnsafe(
    `SELECT id FROM auth.users WHERE email = $1 LIMIT 1`, email
  )
  return rows.length ? rows[0].id : null
}

async function main() {
  console.log('⏳ Creando usuarios admin y empresa en Supabase Auth...')
  const supabase = createClient(SUPABASE_URL, ANON_KEY, { auth: { persistSession: false } })

  for (const u of USERS) {
    let authId = null

    const { data, error } = await supabase.auth.signUp({
      email: u.email,
      password: u.password,
      options: { data: { name: u.name, role: u.role } },
    })

    if (error) {
      if (/already|registered|exists/i.test(error.message)) {
        authId = await getUserId(u.email)
        if (!authId) throw new Error(`Usuario ${u.email} ya existe pero no se encontró en auth.users`)
        await ensurePasswordAndConfirm(u.email, u.password)
        console.log(`♻️  ${u.email} ya existía en Auth — contraseña restablecida`)
      } else {
        throw new Error(`Auth (${u.email}): ${error.message}`)
      }
    } else {
      authId = data.user?.id
      if (!authId) throw new Error(`Auth no devolvió ID para ${u.email}`)
      await ensurePasswordAndConfirm(u.email, u.password)
      console.log(`✅ ${u.email} creado en Supabase Auth`)
    }

    // ── Usuario en la BD de la aplicación ──
    const dbUser = await prisma.user.upsert({
      where: { email: u.email },
      update: { name: u.name, role: u.role, passwordHash: `supabase:${authId}` },
      create: {
        email: u.email,
        passwordHash: `supabase:${authId}`,
        name: u.name,
        role: u.role,
      },
    })
    console.log(`✅ Usuario BD: ${dbUser.email} → rol ${dbUser.role}`)

    // ── Perfil de empresa si aplica ──
    if (u.role === 'COMPANY' && u.company) {
      const company = await prisma.company.upsert({
        where: { userId: dbUser.id },
        update: { name: u.company.name, industry: u.company.industry, size: u.company.size },
        create: {
          userId: dbUser.id,
          name: u.company.name,
          industry: u.company.industry,
          size: u.company.size,
          description: u.company.description,
          location: u.company.location,
          culture: [],
          benefits: [],
          plan: 'TRIAL',
        },
      })
      console.log(`✅ Empresa vinculada: ${company.name}`)
    }
  }

  console.log('\n🎉 Listo. Credenciales:')
  for (const u of USERS) {
    console.log(`   ${u.role === 'ADMIN' ? 'ADMIN  ' : 'EMPRESA'} → ${u.email} | ${u.password}`)
  }
}

main()
  .catch((e) => {
    console.error('❌ Error:', e.message || e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
