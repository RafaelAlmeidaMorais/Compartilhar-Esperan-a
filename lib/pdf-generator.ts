import jsPDF from "jspdf"
import "jspdf-autotable"

declare module "jspdf" {
  interface jsPDF {
    autoTable: (options: any) => jsPDF
  }
}

export interface FamilyData {
  id: string
  publicCode: string
  responsibleName: string
  responsibleCpf: string
  phone: string
  email?: string
  address: string
  neighborhood: string
  city: string
  state: string
  zipCode: string
  familyMembers: Array<{
    name: string
    relationship: string
    age: number
    occupation?: string
  }>
  monthlyIncome: number
  housingType: string
  housingCondition: string
  needs: string[]
  observations?: string
  createdAt: string
  status: string
  urgency: string
}

export function generateFamilyPDF(family: FamilyData): void {
  const doc = new jsPDF()

  // Header
  doc.setFontSize(20)
  doc.setTextColor(40, 40, 40)
  doc.text("Igreja Esperança - Ministério Compartilhar Esperança", 20, 20)

  doc.setFontSize(16)
  doc.text("Ficha de Cadastro Familiar", 20, 35)

  // Family basic info
  doc.setFontSize(12)
  doc.setTextColor(60, 60, 60)

  let yPosition = 50

  doc.text(`Código: ${family.publicCode}`, 20, yPosition)
  yPosition += 10
  doc.text(`Status: ${family.status}`, 20, yPosition)
  yPosition += 10
  doc.text(`Urgência: ${family.urgency}`, 20, yPosition)
  yPosition += 10
  doc.text(`Data de Cadastro: ${new Date(family.createdAt).toLocaleDateString("pt-BR")}`, 20, yPosition)

  yPosition += 20

  // Responsible person
  doc.setFontSize(14)
  doc.setTextColor(40, 40, 40)
  doc.text("Responsável pela Família", 20, yPosition)
  yPosition += 10

  doc.setFontSize(12)
  doc.setTextColor(60, 60, 60)
  doc.text(`Nome: ${family.responsibleName}`, 20, yPosition)
  yPosition += 8
  doc.text(`CPF: ${family.responsibleCpf}`, 20, yPosition)
  yPosition += 8
  doc.text(`Telefone: ${family.phone}`, 20, yPosition)
  yPosition += 8
  if (family.email) {
    doc.text(`Email: ${family.email}`, 20, yPosition)
    yPosition += 8
  }

  yPosition += 10

  // Address
  doc.setFontSize(14)
  doc.setTextColor(40, 40, 40)
  doc.text("Endereço", 20, yPosition)
  yPosition += 10

  doc.setFontSize(12)
  doc.setTextColor(60, 60, 60)
  doc.text(`${family.address}`, 20, yPosition)
  yPosition += 8
  doc.text(`${family.neighborhood}, ${family.city} - ${family.state}`, 20, yPosition)
  yPosition += 8
  doc.text(`CEP: ${family.zipCode}`, 20, yPosition)

  yPosition += 20

  // Family members table
  if (family.familyMembers.length > 0) {
    doc.setFontSize(14)
    doc.setTextColor(40, 40, 40)
    doc.text("Membros da Família", 20, yPosition)
    yPosition += 10

    const tableData = family.familyMembers.map((member) => [
      member.name,
      member.relationship,
      member.age.toString(),
      member.occupation || "Não informado",
    ])

    doc.autoTable({
      startY: yPosition,
      head: [["Nome", "Parentesco", "Idade", "Ocupação"]],
      body: tableData,
      theme: "grid",
      styles: { fontSize: 10 },
      headStyles: { fillColor: [66, 139, 202] },
    })

    yPosition = (doc as any).lastAutoTable.finalY + 20
  }

  // Economic info
  if (yPosition > 250) {
    doc.addPage()
    yPosition = 20
  }

  doc.setFontSize(14)
  doc.setTextColor(40, 40, 40)
  doc.text("Informações Socioeconômicas", 20, yPosition)
  yPosition += 10

  doc.setFontSize(12)
  doc.setTextColor(60, 60, 60)
  doc.text(`Renda Mensal: R$ ${family.monthlyIncome.toLocaleString("pt-BR")}`, 20, yPosition)
  yPosition += 8
  doc.text(`Tipo de Moradia: ${family.housingType}`, 20, yPosition)
  yPosition += 8
  doc.text(`Condição da Moradia: ${family.housingCondition}`, 20, yPosition)

  yPosition += 20

  // Needs
  if (family.needs.length > 0) {
    doc.setFontSize(14)
    doc.setTextColor(40, 40, 40)
    doc.text("Necessidades Identificadas", 20, yPosition)
    yPosition += 10

    doc.setFontSize(12)
    doc.setTextColor(60, 60, 60)
    family.needs.forEach((need) => {
      doc.text(`• ${need}`, 25, yPosition)
      yPosition += 8
    })
  }

  // Observations
  if (family.observations) {
    yPosition += 10
    doc.setFontSize(14)
    doc.setTextColor(40, 40, 40)
    doc.text("Observações", 20, yPosition)
    yPosition += 10

    doc.setFontSize(12)
    doc.setTextColor(60, 60, 60)
    const splitText = doc.splitTextToSize(family.observations, 170)
    doc.text(splitText, 20, yPosition)
  }

  // Footer
  const pageCount = doc.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setFontSize(8)
    doc.setTextColor(128, 128, 128)
    doc.text(`Página ${i} de ${pageCount}`, 20, 285)
    doc.text("Igreja Esperança - Ministério Compartilhar Esperança", 120, 285)
  }

  // Save the PDF
  doc.save(`familia-${family.publicCode}.pdf`)
}

export function generateVisitsReport(visits: any[], startDate: string, endDate: string): void {
  const doc = new jsPDF()

  // Header
  doc.setFontSize(20)
  doc.setTextColor(40, 40, 40)
  doc.text("Relatório de Visitas", 20, 20)

  doc.setFontSize(12)
  doc.text(`Período: ${startDate} a ${endDate}`, 20, 35)
  doc.text(`Total de Visitas: ${visits.length}`, 20, 45)

  // Visits table
  const tableData = visits.map((visit) => [
    visit.family.publicCode,
    visit.family.responsibleName,
    new Date(visit.scheduledDate).toLocaleDateString("pt-BR"),
    visit.status,
    visit.type,
  ])

  doc.autoTable({
    startY: 60,
    head: [["Código", "Família", "Data", "Status", "Tipo"]],
    body: tableData,
    theme: "grid",
    styles: { fontSize: 10 },
    headStyles: { fillColor: [66, 139, 202] },
  })

  doc.save(`relatorio-visitas-${startDate}-${endDate}.pdf`)
}

export function generateStatisticsReport(stats: any): void {
  const doc = new jsPDF()

  // Header
  doc.setFontSize(20)
  doc.setTextColor(40, 40, 40)
  doc.text("Relatório Estatístico", 20, 20)

  doc.setFontSize(12)
  doc.text(`Gerado em: ${new Date().toLocaleDateString("pt-BR")}`, 20, 35)

  let yPosition = 50

  // General statistics
  doc.setFontSize(14)
  doc.text("Estatísticas Gerais", 20, yPosition)
  yPosition += 15

  doc.setFontSize(12)
  doc.text(`Total de Famílias Cadastradas: ${stats.totalFamilies}`, 25, yPosition)
  yPosition += 8
  doc.text(`Famílias Ativas: ${stats.activeFamilies}`, 25, yPosition)
  yPosition += 8
  doc.text(`Famílias Pendentes: ${stats.pendingFamilies}`, 25, yPosition)
  yPosition += 8
  doc.text(`Casos Urgentes: ${stats.urgentCases}`, 25, yPosition)

  yPosition += 20

  // Monthly statistics
  doc.setFontSize(14)
  doc.text("Estatísticas do Mês", 20, yPosition)
  yPosition += 15

  doc.setFontSize(12)
  doc.text(`Novos Cadastros: ${stats.monthlyRegistrations}`, 25, yPosition)
  yPosition += 8
  doc.text(`Visitas Realizadas: ${stats.monthlyVisits}`, 25, yPosition)
  yPosition += 8
  doc.text(`Tarefas Concluídas: ${stats.monthlyTasks}`, 25, yPosition)

  doc.save(`relatorio-estatistico-${new Date().toISOString().split("T")[0]}.pdf`)
}
