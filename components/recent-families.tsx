"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye } from "lucide-react"
import Link from "next/link"

interface Family {
  id: string
  public_code: string
  responsible_name: string
  status: string
  urgency_level: string
  created_at: string
  neighborhood: string
  city: string
}

interface RecentFamiliesProps {
  families: Family[]
}

const statusColors = {
  PENDING: "bg-orange-100 text-orange-800",
  IN_ANALYSIS: "bg-blue-100 text-blue-800",
  ACTIVE: "bg-green-100 text-green-800",
  ASSISTED: "bg-purple-100 text-purple-800",
  INACTIVE: "bg-gray-100 text-gray-800",
  ARCHIVED: "bg-gray-100 text-gray-800",
}

const urgencyColors = {
  LOW: "bg-green-100 text-green-800",
  MEDIUM: "bg-yellow-100 text-yellow-800",
  HIGH: "bg-orange-100 text-orange-800",
  CRITICAL: "bg-red-100 text-red-800",
}

const statusLabels = {
  PENDING: "Pendente",
  IN_ANALYSIS: "Em Análise",
  ACTIVE: "Ativo",
  ASSISTED: "Assistido",
  INACTIVE: "Inativo",
  ARCHIVED: "Arquivado",
}

const urgencyLabels = {
  LOW: "Baixa",
  MEDIUM: "Média",
  HIGH: "Alta",
  CRITICAL: "Crítica",
}

export default function RecentFamilies({ families }: RecentFamiliesProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Famílias Recentes</CardTitle>
        <CardDescription>Últimas famílias cadastradas no sistema</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {families.length === 0 ? (
            <p className="text-gray-500 text-center py-4">Nenhuma família cadastrada ainda</p>
          ) : (
            families.map((family) => (
              <div key={family.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h4 className="font-medium text-gray-900">{family.responsible_name}</h4>
                    <Badge className={statusColors[family.status as keyof typeof statusColors]}>
                      {statusLabels[family.status as keyof typeof statusLabels]}
                    </Badge>
                    <Badge className={urgencyColors[family.urgency_level as keyof typeof urgencyColors]}>
                      {urgencyLabels[family.urgency_level as keyof typeof urgencyLabels]}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">
                    {family.neighborhood}, {family.city}
                  </p>
                  <p className="text-xs text-gray-500">
                    Código: {family.public_code} • Cadastrado em{" "}
                    {new Date(family.created_at).toLocaleDateString("pt-BR")}
                  </p>
                </div>
                <Link href={`/dashboard/families/${family.id}`}>
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    Ver
                  </Button>
                </Link>
              </div>
            ))
          )}
        </div>
        {families.length > 0 && (
          <div className="mt-4 text-center">
            <Link href="/dashboard/families">
              <Button variant="outline">Ver Todas as Famílias</Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
