"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar, Download, FileText, BarChart3, Users } from "lucide-react"
import { generateVisitsReport, generateStatisticsReport } from "@/lib/pdf-generator"

export function ReportsDashboard() {
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [reportType, setReportType] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerateReport = async () => {
    if (!reportType) return

    setIsGenerating(true)

    try {
      switch (reportType) {
        case "visits":
          // Mock data - replace with actual API call
          const visitsData = [
            {
              family: { publicCode: "FAM-20241201-001", responsibleName: "Maria Silva" },
              scheduledDate: "2024-12-01",
              status: "Concluída",
              type: "Domiciliar",
            },
            {
              family: { publicCode: "FAM-20241201-002", responsibleName: "João Santos" },
              scheduledDate: "2024-12-02",
              status: "Agendada",
              type: "Acompanhamento",
            },
          ]
          generateVisitsReport(visitsData, startDate, endDate)
          break

        case "statistics":
          // Mock data - replace with actual API call
          const statsData = {
            totalFamilies: 150,
            activeFamilies: 120,
            pendingFamilies: 25,
            urgentCases: 8,
            monthlyRegistrations: 12,
            monthlyVisits: 45,
            monthlyTasks: 38,
          }
          generateStatisticsReport(statsData)
          break

        case "families":
          // Export families data as CSV
          const csvData =
            "Código,Nome,Status,Urgência,Data Cadastro\nFAM-20241201-001,Maria Silva,Ativa,Média,01/12/2024\nFAM-20241201-002,João Santos,Pendente,Alta,02/12/2024"
          const blob = new Blob([csvData], { type: "text/csv" })
          const url = window.URL.createObjectURL(blob)
          const a = document.createElement("a")
          a.href = url
          a.download = `familias-${new Date().toISOString().split("T")[0]}.csv`
          a.click()
          break
      }
    } catch (error) {
      console.error("Erro ao gerar relatório:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Relatórios e Exportações</h2>
        <p className="text-gray-600">Gere relatórios detalhados e exporte dados do sistema</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              Relatório de Visitas
            </CardTitle>
            <CardDescription>Gere relatórios detalhados das visitas realizadas em um período</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => setReportType("visits")}
              className="w-full"
              variant={reportType === "visits" ? "default" : "outline"}
            >
              Selecionar
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-green-600" />
              Relatório Estatístico
            </CardTitle>
            <CardDescription>Estatísticas gerais do sistema e métricas de desempenho</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => setReportType("statistics")}
              className="w-full"
              variant={reportType === "statistics" ? "default" : "outline"}
            >
              Selecionar
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-purple-600" />
              Exportar Famílias
            </CardTitle>
            <CardDescription>Exporte dados das famílias cadastradas em formato CSV</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => setReportType("families")}
              className="w-full"
              variant={reportType === "families" ? "default" : "outline"}
            >
              Selecionar
            </Button>
          </CardContent>
        </Card>
      </div>

      {reportType && (
        <Card>
          <CardHeader>
            <CardTitle>Configurações do Relatório</CardTitle>
            <CardDescription>Configure os parâmetros para gerar o relatório selecionado</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {(reportType === "visits" || reportType === "families") && (
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="start-date">Data Inicial</Label>
                  <Input id="start-date" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end-date">Data Final</Label>
                  <Input id="end-date" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                </div>
              </div>
            )}

            <div className="flex justify-end">
              <Button
                onClick={handleGenerateReport}
                disabled={isGenerating || (reportType !== "statistics" && (!startDate || !endDate))}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                {isGenerating ? "Gerando..." : "Gerar Relatório"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Relatórios Rápidos</CardTitle>
          <CardDescription>Acesse relatórios pré-configurados mais utilizados</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            <Button variant="outline" className="flex items-center gap-2 bg-transparent">
              <FileText className="h-4 w-4" />
              Famílias do Mês
            </Button>
            <Button variant="outline" className="flex items-center gap-2 bg-transparent">
              <Calendar className="h-4 w-4" />
              Visitas da Semana
            </Button>
            <Button variant="outline" className="flex items-center gap-2 bg-transparent">
              <BarChart3 className="h-4 w-4" />
              Casos Urgentes
            </Button>
            <Button variant="outline" className="flex items-center gap-2 bg-transparent">
              <Users className="h-4 w-4" />
              Resumo Geral
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
