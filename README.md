# 🚀 Freebuff — Plataforma de Reclutamiento Inteligente

Conectamos el talento con las mejores empresas mediante evaluaciones psicométricas, IA y matching bidireccional.

## 📋 Características Principales

### Para Candidatos (Gratis)
- Registro y perfil profesional
- Subida de CV con parsing automático
- Evaluaciones científicas (psicométricas, cognitivas, comportamentales, técnicas)
- Matching inteligente con IA
- Career Path personalizado
- Descubrir empresas compatibles

### Para Empresas (De pago)
- Publicación de vacantes
- Candidatos pre-evaluados y rankeados
- Matching bidireccional
- Pipeline de hiring
- Analytics avanzados
- Planes flexibles según acuerdo empresarial

### Para Admin
- Gestión de empresas y planes
- Configuración de evaluaciones
- Supervisión de matching automático
- Derivación de candidatos
- Analytics de plataforma

## 🛠️ Stack Tecnológico

- **Frontend:** Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend:** Next.js API Routes, tRPC, Prisma ORM
- **Base de datos:** PostgreSQL, Redis
- **IA:** OpenAI API, LangChain, pgvector
- **Pagos:** Stripe
- **Auth:** NextAuth.js / Clerk
- **Deploy:** Vercel, Railway

## 🚀 Inicio Rápido

### 1. Clonar el repositorio
```bash
git clone https://github.com/your-org/freebuff.git
cd freebuff
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar variables de entorno
```bash
cp .env.example .env
# Editar .env con tus credenciales
```

### 4. Configurar la base de datos
```bash
npx prisma db push
npx prisma generate
npm run db:seed
```

### 5. Ejecutar el desarrollo
```bash
npm run dev
```

### 6. Abrir en el navegador
```
http://localhost:3000
```

## 📁 Estructura del Proyecto

```
freebuff/
├── prisma/
│   ├── schema.prisma          # Esquema de base de datos
│   └── seed.ts                # Datos iniciales
├── src/
│   ├── app/
│   │   ├── page.tsx           # Landing page
│   │   ├── login/             # Login
│   │   ├── register/          # Registro
│   │   ├── candidate/         # Portal de candidatos
│   │   ├── company/           # Portal de empresas
│   │   └── admin/             # Portal de administración
│   ├── components/
│   │   └── ui/                # Componentes UI reutilizables
│   ├── lib/
│   │   ├── assessments/       # Evaluaciones y preguntas
│   │   ├── matching/          # Algoritmo de matching
│   │   └── utils.ts           # Utilidades
│   └── store/
│       └── useStore.ts        # Estado global
└── package.json
```

## 🧠 Sistema de Evaluaciones

### Tipos de Evaluación
1. **Psicométricas:** Personalidad (Big Five), Inteligencia Emocional, Motivación
2. **Cognitivas:** Razonamiento Lógico, Verbal, Numérico
3. **Comportamentales:** Situacionales (SJT), Liderazgo, Trabajo en Equipo
4. **Técnicas:** Por categoría de cargo

### Personalización por Vacante
Cada vacante tiene un "perfil de evaluación" con pesos personalizados:
- Directores: Más énfasis en liderazgo y experiencia
- Desarrolladores: Más énfasis en skills técnicas
- Ventas: Más énfasis en comportamiento y personalidad

## 🎯 Algoritmo de Matching

### Matching Bidireccional
1. **Fit para la Empresa:** Skills, evaluaciones, experiencia, cultura
2. **Fit para el Candidato:** Crecimiento profesional, salario, cultura, ubicación

### Pipeline
```
Extracción → Normalización → Scoring → Ranking
```

### Explicabilidad
El candidato y la empresa ven POR QUÉ se recomienda cada match.

## 💰 Modelo de Negocio

### Candidatos
- 100% Gratis

### Empresas (Precios referenciales)
| Plan | Precio | Vacantes | Candidatos |
|------|--------|----------|------------|
| Trial | Gratis (demo) | 1 | 5 |
| Starter | Desde $199/mes | 3 | 30 |
| Professional | Desde $599/mes | 10 | 100 |
| Enterprise | Personalizado | 30+ | 500+ |

*Los precios se ajustan según cada acuerdo empresarial.*

## 🔄 Sistema de Aprendizaje IA

El algoritmo aprende constantemente:
1. Cada contratación exitosa refuerza los pesos correctos
2. Cada rechazo ajusta el modelo
3. Feedback loop continuo
4. Explicabilidad total

## 🌍 Estrategia de Mercado

1. **Fase 1:** LATAM (México, Colombia, Perú, Chile, Argentina)
2. **Fase 2:** España
3. **Fase 3:** USA Hispanic
4. **Fase 4:** Global

## 📝 Licencia

Propietario - Todos los derechos reservados.

---

*Desarrollado con ❤️ por Freebuff*
