import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

// Types
export type UserRole = 'CANDIDATE' | 'COMPANY' | 'ADMIN'
export type VacancyStatus = 'DRAFT' | 'ACTIVE' | 'PAUSED' | 'CLOSED'
export type AssessmentCategory = 'PSYCHOMETRIC' | 'COGNITIVE' | 'BEHAVIORAL' | 'TECHNICAL'
export type ReferralStatus = 'PENDING' | 'VIEWED' | 'CONTACTED' | 'INTERVIEW' | 'OFFER' | 'HIRED' | 'REJECTED'
export type Recommendation = 'highly_recommended' | 'recommended' | 'possible' | 'low_fit'
export type CompanyPlan = 'TRIAL' | 'STARTER' | 'PROFESSIONAL' | 'ENTERPRISE' | 'CUSTOM'

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  avatar?: string
  createdAt: string
}

export interface CandidateProfile {
  userId: string
  bio?: string
  location?: string
  country?: string
  phone?: string
  age?: number
  education: Education[]
  languages: string[]
  linkedInUrl?: string
  portfolioUrl?: string
  cvUrl?: string
  skills: string[]
  experience: Experience[]
  // Work preferences
  workPreference: 'REMOTE' | 'HYBRID' | 'ONSITE' | 'ANY'
  preferredCountries: string[]
  openToRelocation: boolean
  availableHours?: string
}

export interface Education {
  institution: string
  degree: string
  field: string
  startDate: string
  endDate?: string
  current: boolean
}

export interface Experience {
  company: string
  position: string
  description: string
  startDate: string
  endDate?: string
  current: boolean
  skills: string[]
}

export interface Company {
  id: string
  name: string
  industry: string
  size: string
  logo?: string
  description: string
  website?: string
  location: string
  culture: string[]
  benefits: string[]
  plan: CompanyPlan
  planExpiresAt?: string
}

export interface Vacancy {
  id: string
  companyId: string
  title: string
  description: string
  requirements: string[]
  salaryMin?: number
  salaryMax?: number
  location: string
  type: 'REMOTE' | 'HYBRID' | 'ONSITE'
  status: VacancyStatus
  category: string
  assessmentWeights: AssessmentWeights
  createdAt: string
}

export interface AssessmentWeights {
  psychometric: number
  cognitive: number
  behavioral: number
  technical: number
  experience: number
  skills: number
  cultural: number
}

export interface Assessment {
  id: string
  name: string
  category: AssessmentCategory
  description: string
  timeLimitMinutes: number
  questions: Question[]
  targetRoles: string[]
}

export interface Question {
  id: string
  type: 'likert_scale' | 'multiple_choice' | 'scenario' | 'ranking' | 'open_ended'
  dimension: string
  subDimension?: string
  text: string
  options: string[]
  weights?: Record<string, number>
  reverseScored?: boolean
  scenario?: string
}

export interface AssessmentResponse {
  id: string
  candidateId: string
  assessmentId: string
  vacancyId?: string
  answers: Answer[]
  startedAt: string
  completedAt?: string
  score?: number
  dimensionScores?: Record<string, number>
}

export interface Answer {
  questionId: string
  value: string | number
  timeSpentSeconds: number
}

export interface MatchResult {
  id: string
  candidateId: string
  vacancyId: string
  companyId: string
  companyFitScore: number
  companyFitBreakdown: {
    skillsMatch: number
    assessmentMatch: number
    experienceMatch: number
    culturalFit: number
  }
  candidateFitScore: number
  candidateFitBreakdown: {
    careerGrowth: number
    salaryFit: number
    cultureMatch: number
    locationFit: number
  }
  overallMatch: number
  recommendation: Recommendation
  createdAt: string
}

export interface Referral {
  id: string
  candidateId: string
  vacancyId: string
  companyId: string
  status: ReferralStatus
  matchScore: number
  referredAt: string
  notes?: string
}

// Store
interface AppState {
  // Auth
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string, name?: string, role?: UserRole) => Promise<void>
  logout: () => void
  setUser: (user: User) => void

  // Navigation
  currentPortal: UserRole | 'LANDING'
  setCurrentPortal: (portal: UserRole | 'LANDING') => void

  // Candidate
  candidateProfile: CandidateProfile | null
  setCandidateProfile: (profile: CandidateProfile) => void
  candidateMatches: MatchResult[]
  setCandidateMatches: (matches: MatchResult[]) => void

  // Company
  company: Company | null
  setCompany: (company: Company) => void
  companyVacancies: Vacancy[]
  setCompanyVacancies: (vacancies: Vacancy[]) => void
  companyReferrals: Referral[]
  setCompanyReferrals: (referrals: Referral[]) => void

  // Admin
  adminCompanies: Company[]
  setAdminCompanies: (companies: Company[]) => void
  adminVacancies: Vacancy[]
  setAdminVacancies: (vacancies: Vacancy[]) => void
  adminAssessments: Assessment[]
  setAdminAssessments: (assessments: Assessment[]) => void

  // Assessments
  currentAssessment: Assessment | null
  setCurrentAssessment: (assessment: Assessment | null) => void
  assessmentResponses: AssessmentResponse[]
  addAssessmentResponse: (response: AssessmentResponse) => void

  // Hydration
  hasHydrated: boolean
  setHasHydrated: (v: boolean) => void

  // UI
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  unreadMessages: number
  setUnreadMessages: (count: number) => void
  notifications: Notification[]
  addNotification: (notification: Notification) => void
  removeNotification: (id: string) => void
}

export interface Notification {
  id: string
  type: 'success' | 'error' | 'info' | 'warning'
  title: string
  message: string
  createdAt: string
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
  // Auth
  user: null,
  isAuthenticated: false,
  login: async (email: string, password: string, name?: string, role?: UserRole) => {
    // Si tiene name y role, es un registro
    if (name && role) {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name, role }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Error al registrar')
      const user: User = {
        id: data.user.id,
        email: data.user.email,
        name: data.user.name,
        role: data.user.role,
        createdAt: data.user.createdAt,
      }
      set({ user, isAuthenticated: true, currentPortal: user.role })
      return
    }

    // Login normal contra Supabase
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || 'Credenciales inválidas')
    const user: User = {
      id: data.user.id,
      email: data.user.email,
      name: data.user.name,
      role: data.user.role,
      avatar: data.user.avatar || undefined,
      createdAt: data.user.createdAt,
    }
    set({ user, isAuthenticated: true, currentPortal: user.role })
  },
  logout: () => {
    set({
      user: null,
      isAuthenticated: false,
      currentPortal: 'LANDING',
      candidateProfile: null,
      company: null,
    })
  },
  setUser: (user) => set({ user }),

  // Navigation
  currentPortal: 'LANDING',
  setCurrentPortal: (portal) => set({ currentPortal: portal }),

  // Candidate
  candidateProfile: null,
  setCandidateProfile: (profile) => set({ candidateProfile: profile }),
  candidateMatches: [],
  setCandidateMatches: (matches) => set({ candidateMatches: matches }),

  // Company
  company: null,
  setCompany: (company) => set({ company }),
  companyVacancies: [],
  setCompanyVacancies: (vacancies) => set({ companyVacancies: vacancies }),
  companyReferrals: [],
  setCompanyReferrals: (referrals) => set({ companyReferrals: referrals }),

  // Admin
  adminCompanies: [],
  setAdminCompanies: (companies) => set({ adminCompanies: companies }),
  adminVacancies: [],
  setAdminVacancies: (vacancies) => set({ adminVacancies: vacancies }),
  adminAssessments: [],
  setAdminAssessments: (assessments) => set({ adminAssessments: assessments }),

  // Assessments
  currentAssessment: null,
  setCurrentAssessment: (assessment) => set({ currentAssessment: assessment }),
  assessmentResponses: [],
  addAssessmentResponse: (response) =>
    set((state) => ({
      assessmentResponses: [...state.assessmentResponses, response],
    })),

  // Hydration
  hasHydrated: false,
  setHasHydrated: (v) => set({ hasHydrated: v }),

  // UI
  sidebarOpen: true,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  unreadMessages: 3,
  setUnreadMessages: (count) => set({ unreadMessages: count }),
  notifications: [],
  addNotification: (notification) =>
    set((state) => ({
      notifications: [...state.notifications, notification],
    })),
  removeNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),
}),
    {
      name: 'talentix-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        currentPortal: state.currentPortal,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true)
      },
    }
  )
)
