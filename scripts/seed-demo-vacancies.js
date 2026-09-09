process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  // Empresa demo
  const company = await prisma.company.upsert({
    where: { userId: 'demo-company-user' },
    create: {
      id: 'company_demo',
      userId: 'demo-company-user',
      name: 'TechCorp Solutions (Demo)',
      industry: 'technology',
      size: '51-200',
      description: 'Empresa demo para probar el motor de matching.',
      location: 'Remoto',
      culture: ['innovacion', 'colaboracion'],
      benefits: ['seguro medico', 'trabajo remoto'],
      plan: 'PROFESSIONAL',
    },
    update: {},
  })

  // Vacante demo 1: desarrollador
  const vac1 = await prisma.vacancy.upsert({
    where: { id: 'vacancy_demo_dev' },
    create: {
      id: 'vacancy_demo_dev',
      companyId: company.id,
      title: 'Desarrollador Full Stack',
      description: 'Desarrollo de aplicaciones web con React y Node.js.',
      requirements: ['react', 'node', 'typescript'],
      category: 'technology',
      location: 'Remoto',
      type: 'REMOTE',
      status: 'ACTIVE',
      salaryMin: 2000,
      salaryMax: 4000,
      assessmentConfig: {
        requiredSkills: ['react', 'node', 'typescript'],
        preferredSkills: ['docker', 'aws'],
        minExperience: 1,
        minEducation: 2,
        weights: { psychometric: 15, cognitive: 15, behavioral: 10, technical: 30, experience: 20, skills: 10 },
      },
    },
    update: { status: 'ACTIVE' },
  })

  // Vacante demo 2: ventas
  const vac2 = await prisma.vacancy.upsert({
    where: { id: 'vacancy_demo_sales' },
    create: {
      id: 'vacancy_demo_sales',
      companyId: company.id,
      title: 'Ejecutivo de Ventas',
      description: 'Ventas B2B y atención a clientes corporativos.',
      requirements: ['ventas', 'comunicacion'],
      category: 'sales',
      location: 'Ciudad de Panamá',
      type: 'ONSITE',
      status: 'ACTIVE',
      salaryMin: 1200,
      salaryMax: 2500,
      assessmentConfig: {
        requiredSkills: ['ventas', 'comunicacion'],
        preferredSkills: ['crm'],
        minExperience: 1,
        minEducation: 2,
        weights: { psychometric: 20, cognitive: 10, behavioral: 30, technical: 5, experience: 25, skills: 10 },
      },
    },
    update: { status: 'ACTIVE' },
  })

  console.log('Empresa demo:', company.id)
  console.log('Vacante dev:', vac1.id)
  console.log('Vacante ventas:', vac2.id)
  await prisma.$disconnect()
}

main().catch(e => { console.error('ERR:', e.message); process.exit(1) })
