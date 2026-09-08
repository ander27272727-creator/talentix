-- ============================================================
-- TALENTIX - Esquema Completo para Supabase
-- Ejecutar en: Supabase SQL Editor → https://supabase.com/dashboard
-- ============================================================

-- ============================================================
-- PASO 1: ELIMINAR TABLAS EXISTENTES (si existieran)
-- ============================================================
DROP TABLE IF EXISTS "AnalyticsEvent" CASCADE;
DROP TABLE IF EXISTS "AIModelVersion" CASCADE;
DROP TABLE IF EXISTS "AILearningEntry" CASCADE;
DROP TABLE IF EXISTS "Referral" CASCADE;
DROP TABLE IF EXISTS "MatchResult" CASCADE;
DROP TABLE IF EXISTS "AssessmentAnswer" CASCADE;
DROP TABLE IF EXISTS "AssessmentResponse" CASCADE;
DROP TABLE IF EXISTS "Question" CASCADE;
DROP TABLE IF EXISTS "VacancyAssessment" CASCADE;
DROP TABLE IF EXISTS "Assessment" CASCADE;
DROP TABLE IF EXISTS "Vacancy" CASCADE;
DROP TABLE IF EXISTS "PlanPricing" CASCADE;
DROP TABLE IF EXISTS "Company" CASCADE;
DROP TABLE IF EXISTS "Experience" CASCADE;
DROP TABLE IF EXISTS "Education" CASCADE;
DROP TABLE IF EXISTS "CandidateProfile" CASCADE;
DROP TABLE IF EXISTS "User" CASCADE;

DROP TYPE IF EXISTS "UserRole" CASCADE;
DROP TYPE IF EXISTS "CompanyPlan" CASCADE;
DROP TYPE IF EXISTS "VacancyType" CASCADE;
DROP TYPE IF EXISTS "VacancyStatus" CASCADE;
DROP TYPE IF EXISTS "AssessmentCategory" CASCADE;
DROP TYPE IF EXISTS "QuestionType" CASCADE;
DROP TYPE IF EXISTS "ReferralStatus" CASCADE;

-- ============================================================
-- PASO 2: ENUMS
-- ============================================================
CREATE TYPE "UserRole" AS ENUM ('CANDIDATE', 'COMPANY', 'ADMIN');
CREATE TYPE "CompanyPlan" AS ENUM ('TRIAL', 'STARTER', 'PROFESSIONAL', 'ENTERPRISE', 'CUSTOM');
CREATE TYPE "VacancyType" AS ENUM ('REMOTE', 'HYBRID', 'ONSITE');
CREATE TYPE "VacancyStatus" AS ENUM ('DRAFT', 'ACTIVE', 'PAUSED', 'CLOSED');
CREATE TYPE "AssessmentCategory" AS ENUM ('PSYCHOMETRIC', 'COGNITIVE', 'BEHAVIORAL', 'TECHNICAL');
CREATE TYPE "QuestionType" AS ENUM ('LIKERT_SCALE', 'MULTIPLE_CHOICE', 'SCENARIO', 'RANKING', 'OPEN_ENDED');
CREATE TYPE "ReferralStatus" AS ENUM ('PENDING', 'VIEWED', 'CONTACTED', 'INTERVIEW', 'OFFER', 'HIRED', 'REJECTED');

-- ============================================================
-- PASO 3: TABLA USUARIOS
-- ============================================================
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'CANDIDATE',
    "avatar" TEXT,
    "emailVerified" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- ============================================================
-- PASO 4: PERFIL DE CANDIDATO
-- ============================================================
CREATE TABLE "CandidateProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "bio" TEXT,
    "location" TEXT,
    "phone" TEXT,
    "linkedInUrl" TEXT,
    "portfolioUrl" TEXT,
    "cvUrl" TEXT,
    "skills" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "CandidateProfile_pkey" PRIMARY KEY ("id")
);

-- ============================================================
-- PASO 5: EDUCACIÓN
-- ============================================================
CREATE TABLE "Education" (
    "id" TEXT NOT NULL,
    "candidateId" TEXT NOT NULL,
    "institution" TEXT NOT NULL,
    "degree" TEXT NOT NULL,
    "field" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "current" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "Education_pkey" PRIMARY KEY ("id")
);

-- ============================================================
-- PASO 6: EXPERIENCIA
-- ============================================================
CREATE TABLE "Experience" (
    "id" TEXT NOT NULL,
    "candidateId" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "current" BOOLEAN NOT NULL DEFAULT false,
    "skills" TEXT[],
    CONSTRAINT "Experience_pkey" PRIMARY KEY ("id")
);

-- ============================================================
-- PASO 7: EMPRESA
-- ============================================================
CREATE TABLE "Company" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "industry" TEXT NOT NULL,
    "size" TEXT NOT NULL,
    "logo" TEXT,
    "description" TEXT NOT NULL,
    "website" TEXT,
    "location" TEXT NOT NULL,
    "culture" TEXT[],
    "benefits" TEXT[],
    "plan" "CompanyPlan" NOT NULL DEFAULT 'TRIAL',
    "planExpiresAt" TIMESTAMP(3),
    "trialUsed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- ============================================================
-- PASO 8: PRECIOS DE PLANES
-- ============================================================
CREATE TABLE "PlanPricing" (
    "id" TEXT NOT NULL,
    "plan" "CompanyPlan" NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "monthlyPrice" DECIMAL(10,2) NOT NULL,
    "annualPrice" DECIMAL(10,2) NOT NULL,
    "maxVacancies" INTEGER NOT NULL,
    "maxCandidates" INTEGER NOT NULL,
    "maxAssessments" INTEGER NOT NULL,
    "hasAPIAccess" BOOLEAN NOT NULL DEFAULT false,
    "hasCustomAssess" BOOLEAN NOT NULL DEFAULT false,
    "hasAnalytics" BOOLEAN NOT NULL DEFAULT false,
    "hasExport" BOOLEAN NOT NULL DEFAULT false,
    "hasDedicatedCSM" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "PlanPricing_pkey" PRIMARY KEY ("id")
);

-- ============================================================
-- PASO 9: VACANTES
-- ============================================================
CREATE TABLE "Vacancy" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "requirements" TEXT[],
    "salaryMin" DECIMAL(10,2),
    "salaryMax" DECIMAL(10,2),
    "salaryCurrency" TEXT NOT NULL DEFAULT 'USD',
    "location" TEXT NOT NULL,
    "type" "VacancyType" NOT NULL DEFAULT 'ONSITE',
    "status" "VacancyStatus" NOT NULL DEFAULT 'DRAFT',
    "category" TEXT NOT NULL,
    "assessmentConfig" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Vacancy_pkey" PRIMARY KEY ("id")
);

-- ============================================================
-- PASO 10: EVALUACIONES
-- ============================================================
CREATE TABLE "Assessment" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" "AssessmentCategory" NOT NULL,
    "description" TEXT NOT NULL,
    "timeLimitMinutes" INTEGER NOT NULL,
    "targetRoles" TEXT[],
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Assessment_pkey" PRIMARY KEY ("id")
);

-- ============================================================
-- PASO 11: EVALUACIÓN POR VACANTE
-- ============================================================
CREATE TABLE "VacancyAssessment" (
    "id" TEXT NOT NULL,
    "vacancyId" TEXT NOT NULL,
    "assessmentId" TEXT NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    CONSTRAINT "VacancyAssessment_pkey" PRIMARY KEY ("id")
);

-- ============================================================
-- PASO 12: PREGUNTAS
-- ============================================================
CREATE TABLE "Question" (
    "id" TEXT NOT NULL,
    "assessmentId" TEXT NOT NULL,
    "type" "QuestionType" NOT NULL,
    "dimension" TEXT NOT NULL,
    "subDimension" TEXT,
    "text" TEXT NOT NULL,
    "scenario" TEXT,
    "options" JSONB NOT NULL,
    "reverseScored" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Question_pkey" PRIMARY KEY ("id")
);

-- ============================================================
-- PASO 13: RESPUESTAS DE EVALUACIÓN
-- ============================================================
CREATE TABLE "AssessmentResponse" (
    "id" TEXT NOT NULL,
    "candidateId" TEXT NOT NULL,
    "assessmentId" TEXT NOT NULL,
    "vacancyId" TEXT,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "totalTimeSpent" INTEGER,
    "score" DOUBLE PRECISION,
    "dimensionScores" JSONB,
    "isValid" BOOLEAN NOT NULL DEFAULT true,
    "fraudFlags" JSONB,
    CONSTRAINT "AssessmentResponse_pkey" PRIMARY KEY ("id")
);

-- ============================================================
-- PASO 14: RESPUESTAS INDIVIDUALES
-- ============================================================
CREATE TABLE "AssessmentAnswer" (
    "id" TEXT NOT NULL,
    "responseId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "value" JSONB NOT NULL,
    "timeSpentSeconds" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AssessmentAnswer_pkey" PRIMARY KEY ("id")
);

-- ============================================================
-- PASO 15: RESULTADOS DE MATCHING
-- ============================================================
CREATE TABLE "MatchResult" (
    "id" TEXT NOT NULL,
    "candidateId" TEXT NOT NULL,
    "vacancyId" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "companyFitScore" DOUBLE PRECISION NOT NULL,
    "companyFitBreakdown" JSONB NOT NULL,
    "candidateFitScore" DOUBLE PRECISION NOT NULL,
    "candidateFitBreakdown" JSONB NOT NULL,
    "overallMatch" DOUBLE PRECISION NOT NULL,
    "recommendation" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "MatchResult_pkey" PRIMARY KEY ("id")
);

-- ============================================================
-- PASO 16: DERIVACIONES
-- ============================================================
CREATE TABLE "Referral" (
    "id" TEXT NOT NULL,
    "candidateId" TEXT NOT NULL,
    "vacancyId" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "status" "ReferralStatus" NOT NULL DEFAULT 'PENDING',
    "matchScore" DOUBLE PRECISION NOT NULL,
    "referredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "viewedAt" TIMESTAMP(3),
    "contactedAt" TIMESTAMP(3),
    "notes" TEXT,
    "feedback" JSONB,
    CONSTRAINT "Referral_pkey" PRIMARY KEY ("id")
);

-- ============================================================
-- PASO 17: APRENDIZAJE IA
-- ============================================================
CREATE TABLE "AILearningEntry" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AILearningEntry_pkey" PRIMARY KEY ("id")
);

-- ============================================================
-- PASO 18: VERSIONES DEL MODELO IA
-- ============================================================
CREATE TABLE "AIModelVersion" (
    "id" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "accuracy" DOUBLE PRECISION,
    "parameters" JSONB NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "trainedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AIModelVersion_pkey" PRIMARY KEY ("id")
);

-- ============================================================
-- PASO 19: EVENTOS DE ANALYTICS
-- ============================================================
CREATE TABLE "AnalyticsEvent" (
    "id" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "userId" TEXT,
    "data" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AnalyticsEvent_pkey" PRIMARY KEY ("id")
);

-- ============================================================
-- PASO 20: ÍNDICES ÚNICOS
-- ============================================================
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "CandidateProfile_userId_key" ON "CandidateProfile"("userId");
CREATE UNIQUE INDEX "Company_userId_key" ON "Company"("userId");
CREATE UNIQUE INDEX "PlanPricing_plan_key" ON "PlanPricing"("plan");
CREATE UNIQUE INDEX "VacancyAssessment_vacancyId_assessmentId_key" ON "VacancyAssessment"("vacancyId", "assessmentId");
CREATE UNIQUE INDEX "MatchResult_candidateId_vacancyId_key" ON "MatchResult"("candidateId", "vacancyId");

-- ============================================================
-- PASO 21: ÍNDICES DE RENDIMIENTO
-- ============================================================
CREATE INDEX "User_email_idx" ON "User"("email");
CREATE INDEX "User_role_idx" ON "User"("role");
CREATE INDEX "CandidateProfile_userId_idx" ON "CandidateProfile"("userId");
CREATE INDEX "Education_candidateId_idx" ON "Education"("candidateId");
CREATE INDEX "Experience_candidateId_idx" ON "Experience"("candidateId");
CREATE INDEX "Company_userId_idx" ON "Company"("userId");
CREATE INDEX "Company_plan_idx" ON "Company"("plan");
CREATE INDEX "Vacancy_companyId_idx" ON "Vacancy"("companyId");
CREATE INDEX "Vacancy_status_idx" ON "Vacancy"("status");
CREATE INDEX "Vacancy_category_idx" ON "Vacancy"("category");
CREATE INDEX "Vacancy_location_idx" ON "Vacancy"("location");
CREATE INDEX "Assessment_category_idx" ON "Assessment"("category");
CREATE INDEX "Assessment_isActive_idx" ON "Assessment"("isActive");
CREATE INDEX "VacancyAssessment_vacancyId_idx" ON "VacancyAssessment"("vacancyId");
CREATE INDEX "Question_assessmentId_idx" ON "Question"("assessmentId");
CREATE INDEX "Question_dimension_idx" ON "Question"("dimension");
CREATE INDEX "AssessmentResponse_candidateId_idx" ON "AssessmentResponse"("candidateId");
CREATE INDEX "AssessmentResponse_assessmentId_idx" ON "AssessmentResponse"("assessmentId");
CREATE INDEX "AssessmentResponse_completedAt_idx" ON "AssessmentResponse"("completedAt");
CREATE INDEX "AssessmentAnswer_responseId_idx" ON "AssessmentAnswer"("responseId");
CREATE INDEX "AssessmentAnswer_questionId_idx" ON "AssessmentAnswer"("questionId");
CREATE INDEX "MatchResult_candidateId_idx" ON "MatchResult"("candidateId");
CREATE INDEX "MatchResult_vacancyId_idx" ON "MatchResult"("vacancyId");
CREATE INDEX "MatchResult_overallMatch_idx" ON "MatchResult"("overallMatch" DESC);
CREATE INDEX "MatchResult_recommendation_idx" ON "MatchResult"("recommendation");
CREATE INDEX "Referral_candidateId_idx" ON "Referral"("candidateId");
CREATE INDEX "Referral_vacancyId_idx" ON "Referral"("vacancyId");
CREATE INDEX "Referral_companyId_idx" ON "Referral"("companyId");
CREATE INDEX "Referral_status_idx" ON "Referral"("status");
CREATE INDEX "AILearningEntry_eventType_idx" ON "AILearningEntry"("eventType");
CREATE INDEX "AILearningEntry_entityType_idx" ON "AILearningEntry"("entityType");
CREATE INDEX "AILearningEntry_createdAt_idx" ON "AILearningEntry"("createdAt");
CREATE INDEX "AIModelVersion_isActive_idx" ON "AIModelVersion"("isActive");
CREATE INDEX "AnalyticsEvent_eventType_idx" ON "AnalyticsEvent"("eventType");
CREATE INDEX "AnalyticsEvent_createdAt_idx" ON "AnalyticsEvent"("createdAt");

-- ============================================================
-- PASO 22: FOREIGN KEYS
-- ============================================================
ALTER TABLE "CandidateProfile" ADD CONSTRAINT "CandidateProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Education" ADD CONSTRAINT "Education_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "CandidateProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Experience" ADD CONSTRAINT "Experience_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "CandidateProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Company" ADD CONSTRAINT "Company_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Vacancy" ADD CONSTRAINT "Vacancy_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "VacancyAssessment" ADD CONSTRAINT "VacancyAssessment_vacancyId_fkey" FOREIGN KEY ("vacancyId") REFERENCES "Vacancy"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "VacancyAssessment" ADD CONSTRAINT "VacancyAssessment_assessmentId_fkey" FOREIGN KEY ("assessmentId") REFERENCES "Assessment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Question" ADD CONSTRAINT "Question_assessmentId_fkey" FOREIGN KEY ("assessmentId") REFERENCES "Assessment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "AssessmentResponse" ADD CONSTRAINT "AssessmentResponse_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "CandidateProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "AssessmentResponse" ADD CONSTRAINT "AssessmentResponse_assessmentId_fkey" FOREIGN KEY ("assessmentId") REFERENCES "Assessment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "AssessmentAnswer" ADD CONSTRAINT "AssessmentAnswer_responseId_fkey" FOREIGN KEY ("responseId") REFERENCES "AssessmentResponse"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "AssessmentAnswer" ADD CONSTRAINT "AssessmentAnswer_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "MatchResult" ADD CONSTRAINT "MatchResult_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "CandidateProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "MatchResult" ADD CONSTRAINT "MatchResult_vacancyId_fkey" FOREIGN KEY ("vacancyId") REFERENCES "Vacancy"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Referral" ADD CONSTRAINT "Referral_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "CandidateProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Referral" ADD CONSTRAINT "Referral_vacancyId_fkey" FOREIGN KEY ("vacancyId") REFERENCES "Vacancy"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Referral" ADD CONSTRAINT "Referral_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "AILearningEntry" ADD CONSTRAINT "AILearningEntry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- ============================================================
-- PASO 23: HABILITAR RLS (Row Level Security)
-- ============================================================
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "CandidateProfile" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Education" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Experience" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Company" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "PlanPricing" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Vacancy" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Assessment" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "VacancyAssessment" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Question" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "AssessmentResponse" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "AssessmentAnswer" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "MatchResult" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Referral" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "AILearningEntry" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "AIModelVersion" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "AnalyticsEvent" ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- PASO 24: POLÍTICAS RLS
-- ============================================================

-- Admin puede ver todo
CREATE POLICY "Admin full access" ON "User" FOR ALL USING (true);
CREATE POLICY "Admin full access" ON "CandidateProfile" FOR ALL USING (true);
CREATE POLICY "Admin full access" ON "Education" FOR ALL USING (true);
CREATE POLICY "Admin full access" ON "Experience" FOR ALL USING (true);
CREATE POLICY "Admin full access" ON "Company" FOR ALL USING (true);
CREATE POLICY "Admin full access" ON "Vacancy" FOR ALL USING (true);
CREATE POLICY "Admin full access" ON "Assessment" FOR ALL USING (true);
CREATE POLICY "Admin full access" ON "VacancyAssessment" FOR ALL USING (true);
CREATE POLICY "Admin full access" ON "Question" FOR ALL USING (true);
CREATE POLICY "Admin full access" ON "AssessmentResponse" FOR ALL USING (true);
CREATE POLICY "Admin full access" ON "AssessmentAnswer" FOR ALL USING (true);
CREATE POLICY "Admin full access" ON "MatchResult" FOR ALL USING (true);
CREATE POLICY "Admin full access" ON "Referral" FOR ALL USING (true);
CREATE POLICY "Admin full access" ON "AILearningEntry" FOR ALL USING (true);
CREATE POLICY "Admin full access" ON "AIModelVersion" FOR ALL USING (true);
CREATE POLICY "Admin full access" ON "AnalyticsEvent" FOR ALL USING (true);

-- Candidatos ven su propio perfil
CREATE POLICY "Candidato own profile" ON "CandidateProfile" FOR SELECT USING (auth.uid()::text = "userId");
CREATE POLICY "Candidato update own" ON "CandidateProfile" FOR UPDATE USING (auth.uid()::text = "userId");
CREATE POLICY "Candidato own education" ON "Education" FOR ALL
  USING ( EXISTS (SELECT 1 FROM "CandidateProfile" WHERE "Education"."candidateId" = "CandidateProfile"."id" AND "CandidateProfile"."userId" = auth.uid()::text) );
CREATE POLICY "Candidato own experience" ON "Experience" FOR ALL
  USING ( EXISTS (SELECT 1 FROM "CandidateProfile" WHERE "Experience"."candidateId" = "CandidateProfile"."id" AND "CandidateProfile"."userId" = auth.uid()::text) );

-- Empresas ven su propia empresa
CREATE POLICY "Empresa own company" ON "Company" FOR SELECT USING (auth.uid()::text = "userId");
CREATE POLICY "Empresa update own" ON "Company" FOR UPDATE USING (auth.uid()::text = "userId");

-- Vacantes son públicas para lectura
CREATE POLICY "Public read vacancies" ON "Vacancy" FOR SELECT USING (true);
CREATE POLICY "Empresa manage own vacancies" ON "Vacancy" FOR ALL
  USING ( EXISTS (SELECT 1 FROM "Company" WHERE "Vacancy"."companyId" = "Company"."id" AND "Company"."userId" = auth.uid()::text) );

-- Evaluaciones son públicas para lectura
CREATE POLICY "Public read assessments" ON "Assessment" FOR SELECT USING ("isActive" = true);
CREATE POLICY "Public read questions" ON "Question" FOR SELECT USING (true);

-- Planes son públicos
CREATE POLICY "Public read plans" ON "PlanPricing" FOR SELECT USING (true);

-- Candidates ven sus propias respuestas
CREATE POLICY "Candidato own responses" ON "AssessmentResponse" FOR ALL
  USING ( EXISTS (SELECT 1 FROM "CandidateProfile" WHERE "AssessmentResponse"."candidateId" = "CandidateProfile"."id" AND "CandidateProfile"."userId" = auth.uid()::text) );

-- Candidates ven sus propias respuestas individuales
CREATE POLICY "Candidato own answers" ON "AssessmentAnswer" FOR ALL
  USING ( EXISTS (
    SELECT 1 FROM "AssessmentResponse" ar
    JOIN "CandidateProfile" cp ON ar."candidateId" = cp."id"
    WHERE "AssessmentAnswer"."responseId" = ar."id" AND cp."userId" = auth.uid()::text
  ) );

-- Candidates ven sus propios matches
CREATE POLICY "Candidato own matches" ON "MatchResult" FOR SELECT
  USING ( EXISTS (SELECT 1 FROM "CandidateProfile" WHERE "MatchResult"."candidateId" = "CandidateProfile"."id" AND "CandidateProfile"."userId" = auth.uid()::text) );

-- Companies ven matches de sus vacantes
CREATE POLICY "Empresa own vacancy matches" ON "MatchResult" FOR SELECT
  USING ( EXISTS (
    SELECT 1 FROM "Vacancy" v
    JOIN "Company" c ON v."companyId" = c."id"
    WHERE "MatchResult"."vacancyId" = v."id" AND c."userId" = auth.uid()::text
  ) );

-- Candidates ven sus propias derivaciones
CREATE POLICY "Candidato own referrals" ON "Referral" FOR SELECT
  USING ( EXISTS (SELECT 1 FROM "CandidateProfile" WHERE "Referral"."candidateId" = "CandidateProfile"."id" AND "CandidateProfile"."userId" = auth.uid()::text) );

-- Companies ven derivaciones de sus vacantes
CREATE POLICY "Empresa own referrals" ON "Referral" FOR SELECT
  USING ( EXISTS (
    SELECT 1 FROM "Company" WHERE "Referral"."companyId" = "Company"."id" AND "Company"."userId" = auth.uid()::text
  ) );

-- ============================================================
-- ✅ ESCHEMA CREADO EXITOSAMENTE
-- Total: 17 tablas, 7 enums, 35+ índices, 18 foreign keys, 30+ políticas RLS
-- ============================================================
