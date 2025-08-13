"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Calendar, Clock, MapPin, User, Search, Filter, CheckCircle, X } from "lucide-react"
import { updateVisitStatus } from "@/lib/visits-tasks-data"
import { useRouter } from "next/navigation"

interface Visit {
  id: string
  title: string
  description: string
  visit_type: string
  status: string
  scheduled_at: string
  completed_at: string
  notes: string
  family: {
    id: string
    public_code: string
    responsible_name: string
    neighborhood: string
    city: string
  }
  assignedUser: {
    name: string
    email: string
  }
}

interface VisitListProps {
  visits: Visit[]
}

const statusColors = {
  SCHEDULED: "bg-blue-100 text-blue-800",
  COMPLETED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
  RESCHEDULED: "bg-yellow-100 text-yellow-800",
}

const statusLabels = {
  SCHEDULED: "Agendada",
  COMPLETED: "Concluída",
  CANCELLED: "Cancelada",
  RESCHEDULED: "Reagendada",
}

const typeLabels = {
  HOME_VISIT: "Visita Domiciliar",
  OFFICE_VISIT: "Visita no Escritório",
  PHONE_CALL: "Ligação Telefônica",
  OTHER: "Outro",
}

export default function VisitList({ visits }: VisitListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [selectedVisit, setSelectedVisit] = useState<Visit | null>(null)
  const [completionNotes, setCompletionNotes] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const filteredVisits = visits.filter((visit) => {
    const matchesSearch =
      visit.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      visit.family.responsible_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      visit.family.public_code.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || visit.status === statusFilter
    const matchesType = typeFilter === "all" || visit.visit_type === typeFilter

    return matchesSearch && matchesStatus && matchesType
  })

  const handleCompleteVisit = async (visitId: string) => {
    setLoading(true)
    try {
      const result = await updateVisitStatus(visitId, "COMPLETED", completionNotes)
      if (result.success) {
        setSelectedVisit(null)
        setCompletionNotes("")
        router.refresh()
      } else {
        alert("Erro ao concluir visita: " + result.error)
      }
    } catch (error) {
      alert("Erro ao concluir visita")
    } finally {
      setLoading(false)
    }
  }

  const handleCancelVisit = async (visitId: string) => {
    setLoading(true)
    try {
      const result = await updateVisitStatus(visitId, "CANCELLED")
      if (result.success) {
        router.refresh()
      } else {
        alert("Erro ao cancelar visita: " + result.error)
      }
    } catch (error) {
      alert("Erro ao cancelar visita")
    } finally {
      setLoading(false)
    }
  }

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
                  placeholder="Título, família, código..."
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
                  <SelectItem value="SCHEDULED">Agendada</SelectItem>
                  <SelectItem value="COMPLETED">Concluída</SelectItem>
                  <SelectItem value="CANCELLED">Cancelada</SelectItem>
                  <SelectItem value="RESCHEDULED">Reagendada</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Tipo</label>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Tipos</SelectItem>
                  <SelectItem value="HOME_VISIT">Visita Domiciliar</SelectItem>
                  <SelectItem value="OFFICE_VISIT">Visita no Escritório</SelectItem>
                  <SelectItem value="PHONE_CALL">Ligação Telefônica</SelectItem>
                  <SelectItem value="OTHER">Outro</SelectItem>
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
            {filteredVisits.length} visita{filteredVisits.length !== 1 ? "s" : ""} encontrada
            {filteredVisits.length !== 1 ? "s" : ""}
          </h3>
        </div>

        {filteredVisits.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Nenhuma visita encontrada com os filtros aplicados</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {filteredVisits.map((visit) => (
              <Card key={visit.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <h4 className="text-lg font-medium text-gray-900">{visit.title}</h4>
                        <Badge className={statusColors[visit.status as keyof typeof statusColors]}>
                          {statusLabels[visit.status as keyof typeof statusLabels]}
                        </Badge>
                        <Badge variant="outline">{typeLabels[visit.visit_type as keyof typeof typeLabels]}</Badge>
                      </div>

                      {visit.description && <p className="text-gray-600 mb-3">{visit.description}</p>}

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-2" />
                          {visit.family.responsible_name} ({visit.family.public_code})
                        </div>
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-2" />
                          {visit.family.neighborhood}, {visit.family.city}
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2" />
                          {new Date(visit.scheduled_at).toLocaleDateString("pt-BR")}
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-2" />
                          {new Date(visit.scheduled_at).toLocaleTimeString("pt-BR", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </div>

                      <div className="mt-3 text-sm text-gray-600">
                        Responsável: <span className="font-medium">{visit.assignedUser.name}</span>
                      </div>

                      {visit.notes && (
                        <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-700">
                            <strong>Observações:</strong> {visit.notes}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="ml-4 flex flex-col space-y-2">
                      {visit.status === "SCHEDULED" && (
                        <>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button size="sm" onClick={() => setSelectedVisit(visit)}>
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Concluir
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Concluir Visita</DialogTitle>
                                <DialogDescription>
                                  Adicione observações sobre a visita realizada (opcional).
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <Textarea
                                  placeholder="Observações sobre a visita..."
                                  value={completionNotes}
                                  onChange={(e) => setCompletionNotes(e.target.value)}
                                  rows={4}
                                />
                                <div className="flex justify-end space-x-2">
                                  <Button
                                    variant="outline"
                                    onClick={() => {
                                      setSelectedVisit(null)
                                      setCompletionNotes("")
                                    }}
                                  >
                                    Cancelar
                                  </Button>
                                  <Button onClick={() => handleCompleteVisit(visit.id)} disabled={loading}>
                                    Concluir Visita
                                  </Button>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleCancelVisit(visit.id)}
                            disabled={loading}
                          >
                            <X className="h-4 w-4 mr-2" />
                            Cancelar
                          </Button>
                        </>
                      )}
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
