// Prueba del motor de matching con el usuario real
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
const { generateMatchesForCandidate } = require('../src/lib/matching/engine.ts')

async function main() {
  const userId = process.argv[2]
  if (!userId) {
    console.error('Uso: node scripts/test-matching.js <userId>')
    process.exit(1)
  }
  try {
    const n = await generateMatchesForCandidate(userId)
    console.log('Matches generados:', n)
    process.exit(0)
  } catch (e) {
    console.error('ERROR:', e.message)
    console.error(e.stack)
    process.exit(1)
  }
}

main()
