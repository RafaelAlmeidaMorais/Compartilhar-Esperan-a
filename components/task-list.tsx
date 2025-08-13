"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckSquare, Clock, User, Search, Filter, CheckCircle, AlertTriangle } from "lucide-react"
import { updateTaskStatus } from "@/lib/visits-tasks-data"
import { useRouter } from "next/navigation"

interface Task {
  id: string
  title: string
  description: string
  status: string
  priority: string
  due_date: string
  completed_at: string
  created_at: string
  family?: {
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

interface TaskListProps {
  tasks: Task[]
}

const statusColors = {
  PENDING: "bg-orange-100 text-orange-800",
  IN_PROGRESS: "bg-blue-100 text-blue-800",
  COMPLETED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
}

const priorityColors = {
  LOW: "bg-green-100 text-green-800",
  MEDIUM: "bg-yellow-100 text-yellow-800",
  HIGH: "bg-orange-100 text-orange-800",
  URGENT: "bg-red-100 text-red-800",
}

const statusLabels = {
  PENDING: "Pendente",
  IN_PROGRESS: "Em Progresso",
  COMPLETED: "Concluída",
  CANCELLED: "Cancelada",
}

const priorityLabels = {
  LOW: "Baixa",
  MEDIUM: "Média",
  HIGH: "Alta",
  URGENT: "Urgente",
}

export default function TaskList({ tasks }: TaskListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (task.family && task.family.responsible_name.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesStatus = statusFilter === "all" || task.status === statusFilter
    const matchesPriority = priorityFilter === "all" || task.priority === priorityFilter

    return matchesSearch && matchesStatus && matchesPriority
  })

  const handleUpdateStatus = async (taskId: string, newStatus: string) => {
    setLoading(true)
    try {
      const result = await updateTaskStatus(taskId, newStatus)
      if (result.success) {
        router.refresh()
      } else {
        alert("Erro ao atualizar tarefa: " + result.error)
      }
    } catch (error) {
      alert("Erro ao atualizar tarefa")
    } finally {
      setLoading(false)
    }
  }

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date() && dueDate
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
                  placeholder="Título, descrição, família..."
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
                  <SelectItem value="IN_PROGRESS">Em Progresso</SelectItem>
                  <SelectItem value="COMPLETED">Concluída</SelectItem>
                  <SelectItem value="CANCELLED">Cancelada</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Prioridade</label>
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as Prioridades</SelectItem>
                  <SelectItem value="LOW">Baixa</SelectItem>
                  <SelectItem value="MEDIUM">Média</SelectItem>
                  <SelectItem value="HIGH">Alta</SelectItem>
                  <SelectItem value="URGENT">Urgente</SelectItem>
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
            {filteredTasks.length} tarefa{filteredTasks.length !== 1 ? "s" : ""} encontrada
            {filteredTasks.length !== 1 ? "s" : ""}
          </h3>
        </div>

        {filteredTasks.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <CheckSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Nenhuma tarefa encontrada com os filtros aplicados</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {filteredTasks.map((task) => (
              <Card key={task.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <h4 className="text-lg font-medium text-gray-900">{task.title}</h4>
                        <Badge className={statusColors[task.status as keyof typeof statusColors]}>
                          {statusLabels[task.status as keyof typeof statusLabels]}
                        </Badge>
                        <Badge className={priorityColors[task.priority as keyof typeof priorityColors]}>
                          {priorityLabels[task.priority as keyof typeof priorityLabels]}
                        </Badge>
                        {task.due_date && isOverdue(task.due_date) && task.status !== "COMPLETED" && (
                          <Badge variant="destructive">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            Atrasada
                          </Badge>
                        )}
                      </div>

                      {task.description && <p className="text-gray-600 mb-3">{task.description}</p>}

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                        {task.family && (
                          <div className="flex items-center">
                            <User className="h-4 w-4 mr-2" />
                            {task.family.responsible_name} ({task.family.public_code})
                          </div>
                        )}
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-2" />
                          Responsável: {task.assignedUser.name}
                        </div>
                        {task.due_date && (
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-2" />
                            Prazo: {new Date(task.due_date).toLocaleDateString("pt-BR")}
                          </div>
                        )}
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-2" />
                          Criada: {new Date(task.created_at).toLocaleDateString("pt-BR")}
                        </div>
                      </div>

                      {task.completed_at && (
                        <div className="mt-3 text-sm text-green-600">
                          Concluída em: {new Date(task.completed_at).toLocaleDateString("pt-BR")}
                        </div>
                      )}
                    </div>

                    <div className="ml-4 flex flex-col space-y-2">
                      {task.status === "PENDING" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleUpdateStatus(task.id, "IN_PROGRESS")}
                          disabled={loading}
                        >
                          Iniciar
                        </Button>
                      )}
                      {task.status === "IN_PROGRESS" && (
                        <Button size="sm" onClick={() => handleUpdateStatus(task.id, "COMPLETED")} disabled={loading}>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Concluir
                        </Button>
                      )}
                      {(task.status === "PENDING" || task.status === "IN_PROGRESS") && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleUpdateStatus(task.id, "CANCELLED")}
                          disabled={loading}
                        >
                          Cancelar
                        </Button>
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
