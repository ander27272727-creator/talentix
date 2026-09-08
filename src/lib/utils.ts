import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date))
}

export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency,
  }).format(amount)
}

export function getMatchColor(score: number): string {
  if (score >= 90) return 'text-emerald-600 bg-emerald-50'
  if (score >= 75) return 'text-blue-600 bg-blue-50'
  if (score >= 60) return 'text-amber-600 bg-amber-50'
  return 'text-red-600 bg-red-50'
}

export function getMatchLabel(score: number): string {
  if (score >= 90) return 'Excelente Match'
  if (score >= 75) return 'Muy Buen Match'
  if (score >= 60) return 'Buen Match'
  return 'Match Regular'
}

export function getRecommendationLabel(rec: string): string {
  const labels: Record<string, string> = {
    highly_recommended: 'Altamente Recomendado',
    recommended: 'Recomendado',
    possible: 'Posible',
    low_fit: 'Bajo Ajuste',
  }
  return labels[rec] || rec
}

export function getRecommendationColor(rec: string): string {
  const colors: Record<string, string> = {
    highly_recommended: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    recommended: 'bg-blue-100 text-blue-800 border-blue-200',
    possible: 'bg-amber-100 text-amber-800 border-amber-200',
    low_fit: 'bg-red-100 text-red-800 border-red-200',
  }
  return colors[rec] || 'bg-gray-100 text-gray-800'
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2)
}
