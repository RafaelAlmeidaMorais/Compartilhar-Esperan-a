"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Eye, Search, Filter, Users, MapPin, Calendar } from "lucide-react"
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
  number_of_members: number
  phone: string
  assigned_to: string
  assignedUser?: {
    name: string
  }
}

interface FamilyListProps {
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

export default function FamilyList({ families }: FamilyListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [urgencyFilter, setUrgencyFilter] = useState("all")

  const filteredFamilies = families.filter((family) => {
    const matchesSearch =
      family.responsible_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      family.public_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      family.neighborhood.toLowerCase().includes(searchTerm.toLowerCase()) ||
      family.city.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || family.status === statusFilter
    const matchesUrgency = urgencyFilter === "all" || family.urgency_level === urgencyFilter

    return matchesSearch && matchesStatus && matchesUrgency
  })

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="h-5 w-5 mr-2" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Buscar</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Nome, código, bairro..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Status</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Status</SelectItem>
                  <SelectItem value="PENDING">Pendente</SelectItem>
                  <SelectItem value="IN_ANALYSIS">Em Análise</SelectItem>
                  <SelectItem value="ACTIVE">Ativo</SelectItem>
                  <SelectItem value="ASSISTED">Assistido</SelectItem>
                  <SelectItem value="INACTIVE">Inativo</SelectItem>
                  <SelectItem value="ARCHIVED">Arquivado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Urgência</label>
              <Select value={urgencyFilter} onValueChange={setUrgencyFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as Urgências</SelectItem>
                  <SelectItem value="LOW">Baixa</SelectItem>
                  <SelectItem value="MEDIUM">Média</SelectItem>
                  <SelectItem value="HIGH">Alta</SelectItem>
                  <SelectItem value="CRITICAL">Crítica</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">
            {filteredFamilies.length} família{filteredFamilies.length !== 1 ? "s" : ""} encontrada
            {filteredFamilies.length !== 1 ? "s" : ""}
          </h3>
        </div>

        {filteredFamilies.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Nenhuma família encontrada com os filtros aplicados</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {filteredFamilies.map((family) => (
              <Card key={family.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <h4 className="text-lg font-medium text-gray-900">{family.responsible_name}</h4>
                        <Badge className={statusColors[family.status as keyof typeof statusColors]}>
                          {statusLabels[family.status as keyof typeof statusLabels]}
                        </Badge>
                        <Badge className={urgencyColors[family.urgency_level as keyof typeof urgencyColors]}>
                          {urgencyLabels[family.urgency_level as keyof typeof urgencyLabels]}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-2" />
                          {family.neighborhood}, {family.city}
                        </div>
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-2" />
                          {family.number_of_members || 0} membro{(family.number_of_members || 0) !== 1 ? "s" : ""}
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2" />
                          {new Date(family.created_at).toLocaleDateString("pt-BR")}
                        </div>
                      </div>

                      <div className="mt-3 flex items-center justify-between">
                        <div className="text-sm">
                          <span className="text-gray-500">Código: </span>
                          <span className="font-mono text-gray-900">{family.public_code}</span>
                          {family.phone && (
                            <>
                              <span className="text-gray-500 ml-4">Telefone: </span>
                              <span className="text-gray-900">{family.phone}</span>
                            </>
                          )}
                        </div>
                        {family.assignedUser && (
                          <div className="text-sm text-gray-600">
                            Responsável: <span className="font-medium">{family.assignedUser.name}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="ml-4">
                      <Link href={`/dashboard/families/${family.id}`}>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          Ver Detalhes
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
