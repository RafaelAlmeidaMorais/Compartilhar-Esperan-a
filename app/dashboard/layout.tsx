import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Dashboard - Sistema de Gestão Familiar",
  description: "Painel administrativo do sistema de gestão de assistência familiar",
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
