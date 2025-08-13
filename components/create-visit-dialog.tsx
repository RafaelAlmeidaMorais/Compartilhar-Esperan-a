"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus } from "lucide-react"
import { createVisit } from "@/lib/visits-tasks-data"
import { useRouter } from "next/navigation"

interface CreateVisitDialogProps {
  families: Array<{ id: string; public_code: string; responsible_name: string }>
  users: Array<{ id: string; name: string }>
}

export default function CreateVisitDialog({ families, users }: CreateVisitDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    visit_type: "HOME_VISIT",
    scheduled_at: "",
    family_id: "",
    assigned_to: "",
  })
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title || !formData.scheduled_at || !formData.family_id || !formData.assigned_to) {
      alert("Preencha todos os campos obrigatórios")
      return
    }

    setLoading(true)
    try {
      const result = await createVisit(formData)
      if (result.success) {
        setOpen(false)
        setFormData({
          title: "",
          description: "",
          visit_type: "HOME_VISIT",
          scheduled_at: "",
          family_id: "",
          assigned_to: "",
        })
        router.refresh()
      } else {
        alert("Erro ao criar visita: " + result.error)
      }
    } catch (error) {
      alert("Erro ao criar visita")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Nova Visita
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Agendar Nova Visita</DialogTitle>
          <DialogDescription>Preencha as informações para agendar uma nova visita.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Ex: Visita inicial, Acompanhamento..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="family_id">Família *</Label>
            <Select
              value={formData.family_id}
              onValueChange={(value) => setFormData({ ...formData, family_id: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma família" />
              </SelectTrigger>
              <SelectContent>
                {families.map((family) => (
                  <SelectItem key={family.id} value={family.id}>
                    {family.responsible_name} ({family.public_code})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="visit_type">Tipo de Visita</Label>
            <Select
              value={formData.visit_type}
              onValueChange={(value) => setFormData({ ...formData, visit_type: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="HOME_VISIT">Visita Domiciliar</SelectItem>
                <SelectItem value="OFFICE_VISIT">Visita no Escritório</SelectItem>
                <SelectItem value="PHONE_CALL">Ligação Telefônica</SelectItem>
                <SelectItem value="OTHER">Outro</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="scheduled_at">Data e Hora *</Label>
            <Input
              id="scheduled_at"
              type="datetime-local"
              value={formData.scheduled_at}
              onChange={(e) => setFormData({ ...formData, scheduled_at: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="assigned_to">Responsável *</Label>
            <Select
              value={formData.assigned_to}
              onValueChange={(value) => setFormData({ ...formData, assigned_to: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um responsável" />
              </SelectTrigger>
              <SelectContent>
                {users.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Detalhes sobre a visita..."
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Criando..." : "Criar Visita"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
