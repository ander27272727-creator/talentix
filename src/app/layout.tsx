import type { Metadata } from "next"
import "./globals.css"
import NotificationSystem from "@/components/notifications"

export const metadata: Metadata = {
  title: "Talentix — Plataforma de Reclutamiento Inteligente",
  description: "Conectamos el talento con las mejores empresas mediante evaluaciones científicas e IA. El candidato se evalúa gratis, las empresas reciben talento rankeado.",
  keywords: "reclutamiento, talento, evaluaciones, psicometría, matching, empleo,招聘, hiring",
  authors: [{ name: "Talentix" }],
  openGraph: {
    title: "Talentix — Reclutamiento Inteligente",
    description: "El futuro del reclutamiento: evaluaciones científicas + IA + matching bidireccional",
    url: "https://talentix.com",
    siteName: "Talentix",
    locale: "es_ES",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Talentix — Reclutamiento Inteligente",
    description: "El futuro del reclutamiento: evaluaciones científicas + IA + matching bidireccional",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className="scroll-smooth">
      <body className="min-h-screen bg-background antialiased">
        {children}
        <NotificationSystem />
      </body>
    </html>
  )
}
