import { roleAssessmentWeights } from "@/lib/assessments/questions"

// ==================== TYPES ====================

export interface CandidateProfile {
  id: string
  skills: string[]
  experience: Experience[]
  education: Education[]
  assessmentScores: Record<string, number>
  location: string
  expectedSalary?: { min: number; max: number }
  workPreference: "REMOTE" | "HYBRID" | "ONSITE"
  age?: number
  languages?: string[]
  gender?: string
  educationLevel?: string
  criminalRecord?: boolean
  drugTestResult?: boolean
  hasDriverLicense?: boolean
  willingToRelocate?: boolean
  availableForTravel?: boolean
}

export interface Experience {
  company: string
  position: string
  years: number
  skills: string[]
}

export interface Education {
  degree: string
  field: string
  level: number // 1=High School, 2=Associate, 3=Bachelor, 4=Master, 5=PhD
}

export interface Vacancy {
  id: string
  title: string
  category: string
  requiredSkills: string[]
  preferredSkills: string[]
  minExperience: number
  minEducation: number
  salaryRange: { min: number; max: number }
  location: string
  type: "REMOTE" | "HYBRID" | "ONSITE"
  assessmentWeights: Record<string, number>
  companyId: string
  // Age and profile requirements
  ageMin?: number
  ageMax?: number
  educationLevel?: string
  experienceLevel?: string
  requiredLanguages?: string[]
  // Limitations
  requireCriminalRecord?: boolean
  requireDrugTest?: boolean
  requireDriverLicense?: boolean
  requireRelocation?: boolean
  requireTravel?: boolean
}

export interface CompanyProfile {
  id: string
  name: string
  industry: string
  culture: string[]
  size: string
  benefits: string[]
  growthRate: number // 0-100, company growth indicator
}

export interface MatchResult {
  candidateId: string
  vacancyId: string
  companyId: string
  
  // Company Fit Score
  companyFitScore: number
  companyFitBreakdown: {
    skillsMatch: number
    assessmentMatch: number
    experienceMatch: number
    culturalFit: number
    ageMatch: number
    languageMatch: number
    limitationsMatch: number
  }
  
  // Candidate Fit Score
  candidateFitScore: number
  candidateFitBreakdown: {
    careerGrowth: number
    salaryFit: number
    cultureMatch: number
    locationFit: number
  }
  
  // Overall
  overallMatch: number
  recommendation: "highly_recommended" | "recommended" | "possible" | "low_fit"
}

// ==================== SKILL NORMALIZATION ====================

const skillSynonyms: Record<string, string[]> = {
  "javascript": ["js", "ecmascript", "es6", "es2015", "es2020"],
  "typescript": ["ts"],
  "react": ["reactjs", "react.js"],
  "vue": ["vuejs", "vue.js", "vue3"],
  "angular": ["angularjs", "angular.js"],
  "node": ["nodejs", "node.js", "node.js"],
  "python": ["py"],
  "postgresql": ["postgres", "psql"],
  "mongodb": ["mongo"],
  "amazon web services": ["aws"],
  "google cloud platform": ["gcp", "google cloud"],
  "microsoft azure": ["azure"],
  "machine learning": ["ml", "aprendizaje automático"],
  "artificial intelligence": ["ai", "inteligencia artificial"],
  "natural language processing": ["nlp", "procesamiento de lenguaje natural"],
  "project management": ["gestión de proyectos", "pm"],
  "agile": ["scrum", "kanban"],
  "ux": ["user experience", "experiencia de usuario"],
  "ui": ["user interface", "interfaz de usuario"],
  "devops": ["dev ops", "operations"],
  "kubernetes": ["k8s"],
  "docker": ["containers", "contenedores"],
  "git": ["github", "gitlab", "bitbucket"],
  "sql": ["mysql", "mssql", "sql server"],
  "nosql": ["no sql"],
}

function normalizeSkill(skill: string): string {
  const lower = skill.toLowerCase().trim()
  
  // Check direct synonyms
  for (const [canonical, synonyms] of Object.entries(skillSynonyms)) {
    if (synonyms.includes(lower) || lower === canonical) {
      return canonical
    }
  }
  
  return lower
}

function skillsOverlap(candidateSkills: string[], requiredSkills: string[]): {
  matched: number
  total: number
  percentage: number
} {
  const normalizedCandidate = new Set(candidateSkills.map(normalizeSkill))
  const normalizedRequired = requiredSkills.map(normalizeSkill)
  
  let matched = 0
  for (const skill of normalizedRequired) {
    if (normalizedCandidate.has(skill)) {
      matched++
    }
  }
  
  return {
    matched,
    total: normalizedRequired.length,
    percentage: normalizedRequired.length > 0 ? (matched / normalizedRequired.length) * 100 : 100,
  }
}

// ==================== COMPANY FIT SCORING ====================

function calculateSkillsMatch(
  candidate: CandidateProfile,
  vacancy: Vacancy
): number {
  // Required skills - hard penalty if missing
  const requiredMatch = skillsOverlap(candidate.skills, vacancy.requiredSkills)
  const requiredScore = requiredMatch.percentage
  
  // Preferred skills - soft bonus
  const preferredMatch = skillsOverlap(candidate.skills, vacancy.preferredSkills)
  const preferredScore = preferredMatch.percentage * 0.3 // Weight preferred at 30%
  
  // If missing required skills, apply heavy penalty
  if (requiredScore < 50) {
    return Math.max(0, requiredScore * 0.5 + preferredScore)
  }
  
  // Weighted combination
  return Math.min(100, requiredScore * 0.7 + preferredScore + (requiredScore >= 100 ? 10 : 0))
}

function calculateAssessmentMatch(
  candidate: CandidateProfile,
  vacancy: Vacancy
): number {
  const weights = vacancy.assessmentWeights || roleAssessmentWeights.default
  let totalScore = 0
  let totalWeight = 0
  
  for (const [dimension, weight] of Object.entries(weights)) {
    const score = candidate.assessmentScores[dimension] || 50 // Default to 50 if no score
    totalScore += score * weight
    totalWeight += weight
  }
  
  return totalWeight > 0 ? totalScore / totalWeight : 50
}

function calculateExperienceMatch(
  candidate: CandidateProfile,
  vacancy: Vacancy
): number {
  const totalYears = candidate.experience.reduce((sum, exp) => sum + exp.years, 0)
  
  if (totalYears >= vacancy.minExperience) {
    // Bonus for exceeding requirements, up to a point
    const excess = Math.min(totalYears - vacancy.minExperience, 5)
    return Math.min(100, 80 + excess * 4)
  }
  
  // Penalty for insufficient experience
  const ratio = totalYears / vacancy.minExperience
  return Math.max(20, ratio * 80)
}

function calculateCulturalFit(
  candidate: CandidateProfile,
  company: CompanyProfile
): number {
  let score = 50
  return Math.min(100, Math.max(0, score))
}

// ==================== AGE & PROFILE MATCHING ====================

function calculateAgeMatch(
  candidate: CandidateProfile,
  vacancy: Vacancy
): number {
  if (!candidate.age || (!vacancy.ageMin && !vacancy.ageMax)) return 100 // No constraint
  if (!candidate.age) return 80 // Age unknown, neutral score

  const min = vacancy.ageMin || 16
  const max = vacancy.ageMax || 80

  if (candidate.age >= min && candidate.age <= max) return 100

  // Distance outside range
  const distance = candidate.age < min ? min - candidate.age : candidate.age - max
  return Math.max(0, 100 - distance * 10)
}

function calculateLanguageMatch(
  candidate: CandidateProfile,
  vacancy: Vacancy
): number {
  if (!vacancy.requiredLanguages || vacancy.requiredLanguages.length === 0) return 100
  if (!candidate.languages || candidate.languages.length === 0) return 20

  const candidateLangs = candidate.languages.map(l => l.toLowerCase())
  const matched = vacancy.requiredLanguages.filter(l => candidateLangs.includes(l.toLowerCase()))

  return (matched.length / vacancy.requiredLanguages.length) * 100
}

function calculateLimitationsMatch(
  candidate: CandidateProfile,
  vacancy: Vacancy
): number {
  let score = 100
  let checks = 0
  let passed = 0

  if (vacancy.requireCriminalRecord) {
    checks++
    if (candidate.criminalRecord === false) passed++
    else score -= 40 // Hard disqualification zone
  }
  if (vacancy.requireDrugTest) {
    checks++
    if (candidate.drugTestResult !== false) passed++
    else score -= 40
  }
  if (vacancy.requireDriverLicense) {
    checks++
    if (candidate.hasDriverLicense) passed++
    else score -= 30
  }
  if (vacancy.requireRelocation) {
    checks++
    if (candidate.willingToRelocate) passed++
    else score -= 20
  }
  if (vacancy.requireTravel) {
    checks++
    if (candidate.availableForTravel) passed++
    else score -= 15
  }

  if (checks === 0) return 100
  return Math.max(0, Math.round((passed / checks) * 100))
}

// ==================== CANDIDATE FIT SCORING ====================

function calculateCareerGrowth(
  candidate: CandidateProfile,
  company: CompanyProfile,
  vacancy: Vacancy
): number {
  let score = 50
  
  // Company growth rate
  if (company.growthRate > 70) score += 20
  else if (company.growthRate > 40) score += 10
  
  // Career progression potential (startup vs enterprise)
  if (company.size === "11-50" || company.size === "51-200") {
    score += 15 // Startups offer more growth
  } else if (company.size === "500+") {
    score += 5 // Large companies offer stability
  }
  
  return Math.min(100, score)
}

function calculateSalaryFit(
  candidate: CandidateProfile,
  vacancy: Vacancy
): number {
  if (!candidate.expectedSalary) return 70 // Neutral if not specified
  
  const overlap = Math.min(vacancy.salaryRange.max, candidate.expectedSalary.max) -
                  Math.max(vacancy.salaryRange.min, candidate.expectedSalary.min)
  
  if (overlap > 0) {
    return 90 // Good overlap
  }
  
  if (candidate.expectedSalary.min <= vacancy.salaryRange.max) {
    return 70 // Partial overlap
  }
  
  return 30 // No overlap
}

function calculateLocationFit(
  candidate: CandidateProfile,
  vacancy: Vacancy
): number {
  const pref = candidate.workPreference
  const isFlexible = pref === 'REMOTE' || pref === 'HYBRID' || pref === 'ONSITE' || (pref as string) === 'ANY'

  // Candidate accepts any modality
  if ((pref as string) === 'ANY') {
    if (vacancy.type === 'ONSITE') {
      return candidate.location === vacancy.location ? 95 : 50
    }
    return 85
  }

  // Perfect remote match
  if (vacancy.type === 'REMOTE' && pref === 'REMOTE') return 100
  if (vacancy.type === 'REMOTE' && pref === 'ONSITE') return 40
  if (vacancy.type === 'REMOTE') return 80

  // Onsite vacancy
  if (vacancy.type === 'ONSITE') {
    if (pref === 'REMOTE') return 20
    if (pref === 'ONSITE') {
      return candidate.location === vacancy.location ? 95 : 40
    }
    return 60
  }

  // Hybrid vacancy
  if (vacancy.type === 'HYBRID') {
    if (pref === 'REMOTE') return 50
    if (pref === 'ONSITE') return 70
    if (candidate.location === vacancy.location) return 90
    return 55
  }

  return 50
}

// ==================== MAIN MATCHING ALGORITHM ====================

export function calculateMatch(
  candidate: CandidateProfile,
  vacancy: Vacancy,
  company: CompanyProfile,
  roleWeights?: Record<string, number>
): MatchResult {
  const weights = roleWeights || roleAssessmentWeights[vacancy.category] || roleAssessmentWeights.default
  
  // Company Fit Score
  const skillsMatch = calculateSkillsMatch(candidate, vacancy)
  const assessmentMatch = calculateAssessmentMatch(candidate, vacancy)
  const experienceMatch = calculateExperienceMatch(candidate, vacancy)
  const culturalFit = calculateCulturalFit(candidate, company)
  const ageMatch = calculateAgeMatch(candidate, vacancy)
  const languageMatch = calculateLanguageMatch(candidate, vacancy)
  const limitationsMatch = calculateLimitationsMatch(candidate, vacancy)

  // Hard filter: if limitations don't match, heavy penalty
  const limitationPenalty = limitationsMatch < 50 ? 0.5 : 1.0

  const companyFitScore = (
    skillsMatch * (weights.skills || 15) +
    assessmentMatch * (weights.behavioral || 15) +
    experienceMatch * (weights.experience || 25) +
    culturalFit * 10 +
    ageMatch * 10 +
    languageMatch * 10 +
    limitationsMatch * 10
  ) / 100 * limitationPenalty
  
  // Candidate Fit Score
  const careerGrowth = calculateCareerGrowth(candidate, company, vacancy)
  const salaryFit = calculateSalaryFit(candidate, vacancy)
  const cultureMatch = culturalFit
  const locationFit = calculateLocationFit(candidate, vacancy)

  const candidateFitScore = (
    careerGrowth * 25 +
    salaryFit * 25 +
    cultureMatch * 20 +
    locationFit * 15 +
    languageMatch * 15
  ) / 100
  
  // Overall Match (weighted average)
  const overallMatch = Math.round(
    companyFitScore * 0.6 + candidateFitScore * 0.4
  )
  
  // Recommendation
  let recommendation: MatchResult["recommendation"]
  if (overallMatch >= 85) recommendation = "highly_recommended"
  else if (overallMatch >= 70) recommendation = "recommended"
  else if (overallMatch >= 50) recommendation = "possible"
  else recommendation = "low_fit"
  
  return {
    candidateId: candidate.id,
    vacancyId: vacancy.id,
    companyId: vacancy.companyId,
    
    companyFitScore: Math.round(companyFitScore),
    companyFitBreakdown: {
      skillsMatch: Math.round(skillsMatch),
      assessmentMatch: Math.round(assessmentMatch),
      experienceMatch: Math.round(experienceMatch),
      culturalFit: Math.round(culturalFit),
      ageMatch: Math.round(ageMatch),
      languageMatch: Math.round(languageMatch),
      limitationsMatch: Math.round(limitationsMatch),
    },

    candidateFitScore: Math.round(candidateFitScore),
    candidateFitBreakdown: {
      careerGrowth: Math.round(careerGrowth),
      salaryFit: Math.round(salaryFit),
      cultureMatch: Math.round(cultureMatch),
      locationFit: Math.round(locationFit),
    },
    
    overallMatch,
    recommendation,
  }
}

// ==================== BATCH MATCHING ====================

export function findTopMatches(
  candidate: CandidateProfile,
  vacancies: (Vacancy & { company: CompanyProfile })[],
  topN: number = 10
): MatchResult[] {
  const matches = vacancies.map(v => 
    calculateMatch(candidate, v, v.company)
  )
  
  return matches
    .sort((a, b) => b.overallMatch - a.overallMatch)
    .slice(0, topN)
}

export function findTopCandidates(
  vacancy: Vacancy,
  company: CompanyProfile,
  candidates: CandidateProfile[],
  topN: number = 10
): MatchResult[] {
  const matches = candidates.map(c => 
    calculateMatch(c, vacancy, company)
  )
  
  return matches
    .sort((a, b) => b.overallMatch - a.overallMatch)
    .slice(0, topN)
}

// ==================== FEEDBACK LEARNING ====================

interface FeedbackEntry {
  matchResult: MatchResult
  outcome: "hired" | "rejected" | "interviewed" | "no_response"
  feedback?: {
    rating?: number // 1-5
    comments?: string
    hiredForDifferentRole?: boolean
  }
}

// Weight adjustments based on feedback
const feedbackAdjustments: Record<string, number> = {
  hired: 1.0,
  interviewed: 0.5,
  rejected: -0.5,
  no_response: -0.2,
}

export function processFeedback(feedback: FeedbackEntry): Record<string, number> {
  const { matchResult, outcome } = feedback
  const weight = feedbackAdjustments[outcome] || 0
  
  // Calculate which dimensions were most predictive
  const adjustments: Record<string, number> = {}
  
  if (outcome === "hired") {
    // Reinforce the weights that contributed to this successful match
    for (const [key, value] of Object.entries(matchResult.companyFitBreakdown)) {
      adjustments[key] = (adjustments[key] || 0) + (value / 100) * weight
    }
  } else if (outcome === "rejected") {
    // Reduce weights for dimensions that scored high but match failed
    for (const [key, value] of Object.entries(matchResult.companyFitBreakdown)) {
      if (value > 70) {
        adjustments[key] = (adjustments[key] || 0) - 0.1
      }
    }
  }
  
  return adjustments
}

// ==================== EXPLAINABILITY ====================

export function explainMatch(match: MatchResult): string[] {
  const explanations: string[] = []
  
  // Skills
  if (match.companyFitBreakdown.skillsMatch >= 90) {
    explanations.push("✅ Tus skills coinciden casi perfectamente con los requeridos por la vacante.")
  } else if (match.companyFitBreakdown.skillsMatch >= 70) {
    explanations.push("✅ Tienes la mayoría de los skills requeridos.")
  } else if (match.companyFitBreakdown.skillsMatch < 50) {
    explanations.push("⚠️ Te faltan algunos skills importantes para esta vacante.")
  }
  
  // Experience
  if (match.companyFitBreakdown.experienceMatch >= 80) {
    explanations.push("✅ Tu experiencia es muy relevante para este cargo.")
  } else if (match.companyFitBreakdown.experienceMatch < 50) {
    explanations.push("⚠️ Esta vacante requiere más experiencia de la que tienes actualmente.")
  }
  
  // Assessments
  if (match.companyFitBreakdown.assessmentMatch >= 85) {
    explanations.push("✅ Tus evaluaciones muestran un perfil altamente compatible.")
  }
  
  // Career Growth
  if (match.candidateFitBreakdown.careerGrowth >= 80) {
    explanations.push("🚀 Esta empresa ofrece excelente potencial de crecimiento para ti.")
  }
  
  // Salary
  if (match.candidateFitBreakdown.salaryFit >= 80) {
    explanations.push("💰 El rango salarial se alinea con tus expectativas.")
  } else if (match.candidateFitBreakdown.salaryFit < 50) {
    explanations.push("⚠️ El rango salarial podría no coincidir con tus expectativas.")
  }
  
  // Location
  if (match.candidateFitBreakdown.locationFit >= 90) {
    explanations.push("📍 La ubicación/tipo de trabajo es ideal para ti.")
  }
  
  return explanations
}
