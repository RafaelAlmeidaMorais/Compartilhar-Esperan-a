"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { User, MapPin, Phone, Users, Home, FileText, Clock, AlertTriangle, Edit, Save, X } from "lucide-react"
import { updateFamilyStatus, assignFamilyToUser, addAttendanceHistory } from "@/lib/family-data"
import { useRouter } from "next/navigation"

interface FamilyDetailsProps {
  family: any
  users: any[]
  currentUserId: string
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

export default function FamilyDetails({ family, users, currentUserId }: FamilyDetailsProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [status, setStatus] = useState(family.status)
  const [urgencyLevel, setUrgencyLevel] = useState(family.urgency_level)
  const [assignedTo, setAssignedTo] = useState(family.assigned_to || "unassigned")
  const [newAttendance, setNewAttendance] = useState("")
  const [attendanceUrgency, setAttendanceUrgency] = useState("LOW")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSaveChanges = async () => {
    setLoading(true)
    try {
      // Update status and urgency
      const statusResult = await updateFamilyStatus(family.id, status, urgencyLevel)
      if (!statusResult.success) {
        alert("Erro ao atualizar status: " + statusResult.error)
        return
      }

      // Update assignment if changed
      if (assignedTo !== family.assigned_to) {
        const assignResult = await assignFamilyToUser(family.id, assignedTo)
        if (!assignResult.success) {
          alert("Erro ao atribuir família: " + assignResult.error)
          return
        }
      }

      setIsEditing(false)
      router.refresh()
    } catch (error) {
      alert("Erro ao salvar alterações")
    } finally {
      setLoading(false)
    }
  }

  const handleAddAttendance = async () => {
    if (!newAttendance.trim()) return

    setLoading(true)
    try {
      const result = await addAttendanceHistory(family.id, currentUserId, newAttendance, attendanceUrgency)
      if (result.success) {
        setNewAttendance("")
        setAttendanceUrgency("LOW")
        router.refresh()
      } else {
        alert("Erro ao adicionar atendimento: " + result.error)
      }
    } catch (error) {
      alert("Erro ao adicionar atendimento")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl">{family.responsible_name}</CardTitle>
              <CardDescription className="text-base mt-2">
                Código: <span className="font-mono">{family.public_code}</span>
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Badge className={statusColors[family.status as keyof typeof statusColors]}>
                {statusLabels[family.status as keyof typeof statusLabels]}
              </Badge>
              <Badge className={urgencyColors[family.urgency_level as keyof typeof urgencyColors]}>
                {urgencyLabels[family.urgency_level as keyof typeof urgencyLabels]}
              </Badge>
              {!isEditing ? (
                <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Editar
                </Button>
              ) : (
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>
                    <X className="h-4 w-4 mr-2" />
                    Cancelar
                  </Button>
                  <Button size="sm" onClick={handleSaveChanges} disabled={loading}>
                    <Save className="h-4 w-4 mr-2" />
                    Salvar
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardHeader>
        {isEditing && (
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Status</label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
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
                <Select value={urgencyLevel} onValueChange={setUrgencyLevel}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LOW">Baixa</SelectItem>
                    <SelectItem value="MEDIUM">Média</SelectItem>
                    <SelectItem value="HIGH">Alta</SelectItem>
                    <SelectItem value="CRITICAL">Crítica</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Responsável</label>
                <Select value={assignedTo} onValueChange={setAssignedTo}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecionar responsável" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unassigned">Não atribuído</SelectItem>
                    {users.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="members">Membros</TabsTrigger>
          <TabsTrigger value="housing">Moradia</TabsTrigger>
          <TabsTrigger value="history">Histórico</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Informações Pessoais
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-gray-500">Nome:</span>
                    <p className="font-medium">{family.responsible_name}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Idade:</span>
                    <p className="font-medium">{family.age || "Não informado"}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-gray-500">CPF:</span>
                    <p className="font-medium">{family.cpf || "Não informado"}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">RG:</span>
                    <p className="font-medium">{family.rg || "Não informado"}</p>
                  </div>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Ocupação:</span>
                  <p className="font-medium">{family.occupation || "Não informado"}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-gray-500">Renda Formal:</span>
                    <p className="font-medium">
                      {family.formal_income ? `R$ ${Number(family.formal_income).toFixed(2)}` : "Não informado"}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Renda Informal:</span>
                    <p className="font-medium">
                      {family.informal_income ? `R$ ${Number(family.informal_income).toFixed(2)}` : "Não informado"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  Contato e Endereço
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <span className="text-sm text-gray-500">Endereço:</span>
                  <p className="font-medium">
                    {family.street}
                    {family.number && `, ${family.number}`}
                  </p>
                  <p className="text-sm text-gray-600">
                    {family.neighborhood}, {family.city}
                  </p>
                </div>
                {family.phone && (
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-2 text-gray-400" />
                    <span className="font-medium">{family.phone}</span>
                  </div>
                )}
                {family.reference_point && (
                  <div>
                    <span className="text-sm text-gray-500">Ponto de Referência:</span>
                    <p className="font-medium">{family.reference_point}</p>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-gray-500">Melhor dia:</span>
                    <p className="font-medium">{family.visit_day || "Não informado"}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Melhor horário:</span>
                    <p className="font-medium">{family.visit_time || "Não informado"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Immediate Needs */}
          {family.immediate_needs && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2" />
                  Necessidades Imediatas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">{family.immediate_needs}</p>
              </CardContent>
            </Card>
          )}

          {/* Final Observations */}
          {family.final_observations && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Observações Finais
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">{family.final_observations}</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="members" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Membros da Família ({family.familyMembers?.length || 0})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {family.familyMembers?.length > 0 ? (
                <div className="space-y-4">
                  {family.familyMembers.map((member: any, index: number) => (
                    <div key={member.id} className="border rounded-lg p-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <span className="text-sm text-gray-500">Nome:</span>
                          <p className="font-medium">{member.name}</p>
                        </div>
                        <div>
                          <span className="text-sm text-gray-500">Parentesco:</span>
                          <p className="font-medium">{member.kinship}</p>
                        </div>
                        <div>
                          <span className="text-sm text-gray-500">Idade:</span>
                          <p className="font-medium">
                            {member.birth_date
                              ? `${Math.floor((Date.now() - new Date(member.birth_date).getTime()) / (365.25 * 24 * 60 * 60 * 1000))} anos`
                              : "Não informado"}
                          </p>
                        </div>
                      </div>
                      {member.occupation && (
                        <div className="mt-2">
                          <span className="text-sm text-gray-500">Ocupação:</span>
                          <p className="font-medium">{member.occupation}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">Nenhum membro adicional cadastrado</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="housing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Home className="h-5 w-5 mr-2" />
                Informações da Moradia
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <span className="text-sm text-gray-500">Tipo de Moradia:</span>
                  <p className="font-medium">{family.housing_type || "Não informado"}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Tipo de Construção:</span>
                  <p className="font-medium">{family.construction_type || "Não informado"}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Número de Cômodos:</span>
                  <p className="font-medium">{family.number_of_rooms || "Não informado"}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Número de Quartos:</span>
                  <p className="font-medium">{family.number_of_bedrooms || "Não informado"}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Número de Banheiros:</span>
                  <p className="font-medium">{family.number_of_bathrooms || "Não informado"}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Abastecimento de Água:</span>
                  <p className="font-medium">{family.water_supply || "Não informado"}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Energia Elétrica:</span>
                  <p className="font-medium">{family.electricity_type || "Não informado"}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Destino do Esgoto:</span>
                  <p className="font-medium">{family.sewage_destination || "Não informado"}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Destino do Lixo:</span>
                  <p className="font-medium">{family.waste_destination || "Não informado"}</p>
                </div>
              </div>

              <div className="mt-6 space-y-2">
                <h4 className="font-medium text-gray-900">Condições Especiais:</h4>
                <div className="flex flex-wrap gap-2">
                  {family.paved_street && <Badge variant="outline">Rua Pavimentada</Badge>}
                  {family.risk_location && <Badge variant="destructive">Localização de Risco</Badge>}
                  {family.vaccines_up_to_date && <Badge variant="outline">Vacinas em Dia</Badge>}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          {/* Add new attendance */}
          <Card>
            <CardHeader>
              <CardTitle>Adicionar Atendimento</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Descreva o atendimento realizado..."
                value={newAttendance}
                onChange={(e) => setNewAttendance(e.target.value)}
                rows={3}
              />
              <div className="flex items-center justify-between">
                <Select value={attendanceUrgency} onValueChange={setAttendanceUrgency}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LOW">Baixa Urgência</SelectItem>
                    <SelectItem value="MEDIUM">Média Urgência</SelectItem>
                    <SelectItem value="HIGH">Alta Urgência</SelectItem>
                    <SelectItem value="CRITICAL">Urgência Crítica</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={handleAddAttendance} disabled={loading || !newAttendance.trim()}>
                  Adicionar Atendimento
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Attendance history */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                Histórico de Atendimentos
              </CardTitle>
            </CardHeader>
            <CardContent>
              {family.attendanceHistory?.length > 0 ? (
                <div className="space-y-4">
                  {family.attendanceHistory.map((attendance: any) => (
                    <div key={attendance.id} className="border-l-4 border-blue-200 pl-4 py-2">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-gray-900">{attendance.user?.name}</span>
                          <Badge className={urgencyColors[attendance.urgency as keyof typeof urgencyColors]}>
                            {urgencyLabels[attendance.urgency as keyof typeof urgencyLabels]}
                          </Badge>
                        </div>
                        <span className="text-sm text-gray-500">
                          {new Date(attendance.date).toLocaleDateString("pt-BR")}
                        </span>
                      </div>
                      <p className="text-gray-700">{attendance.description}</p>
                      {attendance.notes && <p className="text-sm text-gray-600 mt-1">Obs: {attendance.notes}</p>}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">Nenhum atendimento registrado ainda</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
