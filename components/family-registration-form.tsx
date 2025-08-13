"use client"

import { useState } from "react"
import { useActionState } from "react"
import { useFormStatus } from "react-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Loader2, Plus, Trash2, ArrowLeft, ArrowRight, Heart } from "lucide-react"
import { saveFamilyRegistration } from "@/lib/family-registration"

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <Button
      type="submit"
      disabled={pending}
      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium h-11"
    >
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Salvando cadastro...
        </>
      ) : (
        "Finalizar Cadastro"
      )}
    </Button>
  )
}

interface FamilyMember {
  name: string
  kinship: string
  age: string
}

export default function FamilyRegistrationForm() {
  const [currentStep, setCurrentStep] = useState(1)
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([])
  const [state, formAction] = useActionState(saveFamilyRegistration, null)

  const totalSteps = 5

  const addFamilyMember = () => {
    setFamilyMembers([...familyMembers, { name: "", kinship: "", age: "" }])
  }

  const removeFamilyMember = (index: number) => {
    setFamilyMembers(familyMembers.filter((_, i) => i !== index))
  }

  const updateFamilyMember = (index: number, field: keyof FamilyMember, value: string) => {
    const updated = [...familyMembers]
    updated[index][field] = value
    setFamilyMembers(updated)
  }

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  // Show success message
  if (state?.success) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <div className="bg-green-100 p-3 rounded-full w-fit mx-auto mb-4">
            <Heart className="h-8 w-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl text-green-800">Cadastro Realizado com Sucesso!</CardTitle>
          <CardDescription className="text-base text-green-700">{state.message}</CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-2">Código da sua família:</p>
            <p className="text-2xl font-bold text-blue-600">{state.familyCode}</p>
            <p className="text-sm text-gray-600 mt-2">Guarde este código para futuras consultas</p>
          </div>
          <p className="text-gray-600">
            Nossa equipe entrará em contato em breve para agendar uma visita e dar início ao acompanhamento.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-600">
            Etapa {currentStep} de {totalSteps}
          </span>
          <span className="text-sm text-gray-500">{Math.round((currentStep / totalSteps) * 100)}% concluído</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      <form action={formAction}>
        {/* Step 1: Personal Information */}
        {currentStep === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>Informações Pessoais do Responsável</CardTitle>
              <CardDescription>Dados básicos da pessoa responsável pela família</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {state?.error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                  {state.error}
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="responsible_name">Nome Completo *</Label>
                  <Input id="responsible_name" name="responsible_name" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="number_of_members">Número de Pessoas na Família</Label>
                  <Input id="number_of_members" name="number_of_members" type="number" min="1" />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="marital_status">Estado Civil</Label>
                  <Select name="marital_status">
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SINGLE">Solteiro(a)</SelectItem>
                      <SelectItem value="MARRIED">Casado(a)</SelectItem>
                      <SelectItem value="DIVORCED">Divorciado(a)</SelectItem>
                      <SelectItem value="WIDOWED">Viúvo(a)</SelectItem>
                      <SelectItem value="SEPARATED">Separado(a)</SelectItem>
                      <SelectItem value="STABLE_UNION">União Estável</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender">Gênero</Label>
                  <Select name="gender">
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MALE">Masculino</SelectItem>
                      <SelectItem value="FEMALE">Feminino</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="birth_date">Data de Nascimento</Label>
                  <Input id="birth_date" name="birth_date" type="date" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="age">Idade</Label>
                  <Input id="age" name="age" type="number" min="0" max="120" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="race">Raça/Cor</Label>
                  <Select name="race">
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="WHITE">Branca</SelectItem>
                      <SelectItem value="BLACK">Negra</SelectItem>
                      <SelectItem value="BROWN">Parda</SelectItem>
                      <SelectItem value="YELLOW">Amarela</SelectItem>
                      <SelectItem value="INDIGENOUS">Indígena</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cpf">CPF</Label>
                  <Input id="cpf" name="cpf" placeholder="000.000.000-00" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rg">RG</Label>
                  <Input id="rg" name="rg" />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nis">NIS (Número de Identificação Social)</Label>
                  <Input id="nis" name="nis" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sus_card">Cartão SUS</Label>
                  <Input id="sus_card" name="sus_card" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="education">Escolaridade</Label>
                <Select name="education">
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ILLITERATE">Analfabeto</SelectItem>
                    <SelectItem value="INCOMPLETE_PRIMARY">Fundamental Incompleto</SelectItem>
                    <SelectItem value="COMPLETE_PRIMARY">Fundamental Completo</SelectItem>
                    <SelectItem value="INCOMPLETE_SECONDARY">Médio Incompleto</SelectItem>
                    <SelectItem value="COMPLETE_SECONDARY">Médio Completo</SelectItem>
                    <SelectItem value="INCOMPLETE_HIGHER">Superior Incompleto</SelectItem>
                    <SelectItem value="COMPLETE_HIGHER">Superior Completo</SelectItem>
                    <SelectItem value="POSTGRADUATE">Pós-graduação</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="occupation">Profissão/Ocupação</Label>
                  <Input id="occupation" name="occupation" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="professional_course">Curso Profissionalizante</Label>
                  <Input id="professional_course" name="professional_course" />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="formal_income">Renda Formal (R$)</Label>
                  <Input id="formal_income" name="formal_income" type="number" step="0.01" min="0" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="informal_income">Renda Informal (R$)</Label>
                  <Input id="informal_income" name="informal_income" type="number" step="0.01" min="0" />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Address and Contact */}
        {currentStep === 2 && (
          <Card>
            <CardHeader>
              <CardTitle>Endereço e Contato</CardTitle>
              <CardDescription>Informações de localização e contato da família</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="street">Rua/Avenida *</Label>
                  <Input id="street" name="street" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address_number">Número</Label>
                  <Input id="address_number" name="address_number" />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="neighborhood">Bairro *</Label>
                  <Input id="neighborhood" name="neighborhood" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">Cidade *</Label>
                  <Input id="city" name="city" required />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="zip_code">CEP</Label>
                  <Input id="zip_code" name="zip_code" placeholder="00000-000" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <Input id="phone" name="phone" placeholder="(00) 00000-0000" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="reference_point">Ponto de Referência</Label>
                <Input
                  id="reference_point"
                  name="reference_point"
                  placeholder="Ex: Próximo ao mercado, em frente à escola..."
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contact_person">Pessoa de Contato (se diferente do responsável)</Label>
                  <Input id="contact_person" name="contact_person" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="visit_day">Melhor Dia para Visitas</Label>
                  <Select name="visit_day">
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Segunda-feira">Segunda-feira</SelectItem>
                      <SelectItem value="Terça-feira">Terça-feira</SelectItem>
                      <SelectItem value="Quarta-feira">Quarta-feira</SelectItem>
                      <SelectItem value="Quinta-feira">Quinta-feira</SelectItem>
                      <SelectItem value="Sexta-feira">Sexta-feira</SelectItem>
                      <SelectItem value="Sábado">Sábado</SelectItem>
                      <SelectItem value="Domingo">Domingo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="visit_time">Melhor Horário para Visitas</Label>
                <Select name="visit_time">
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Manhã (8h-12h)">Manhã (8h-12h)</SelectItem>
                    <SelectItem value="Tarde (12h-18h)">Tarde (12h-18h)</SelectItem>
                    <SelectItem value="Noite (18h-20h)">Noite (18h-20h)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Family Members */}
        {currentStep === 3 && (
          <Card>
            <CardHeader>
              <CardTitle>Integrantes da Família</CardTitle>
              <CardDescription>Adicione informações sobre os demais membros da família</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {familyMembers.map((member, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">Membro {index + 1}</h4>
                    <Button type="button" variant="outline" size="sm" onClick={() => removeFamilyMember(index)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Nome Completo</Label>
                      <Input
                        name="member_name"
                        value={member.name}
                        onChange={(e) => updateFamilyMember(index, "name", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Parentesco</Label>
                      <Input
                        name="member_kinship"
                        value={member.kinship}
                        onChange={(e) => updateFamilyMember(index, "kinship", e.target.value)}
                        placeholder="Ex: Filho(a), Cônjuge, Pai/Mãe..."
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Idade</Label>
                      <Input
                        name="member_age"
                        type="number"
                        min="0"
                        max="120"
                        value={member.age}
                        onChange={(e) => updateFamilyMember(index, "age", e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              ))}

              <Button type="button" variant="outline" onClick={addFamilyMember} className="w-full bg-transparent">
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Membro da Família
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step 4: Housing */}
        {currentStep === 4 && (
          <Card>
            <CardHeader>
              <CardTitle>Informações da Moradia</CardTitle>
              <CardDescription>Detalhes sobre as condições de habitação da família</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="housing_type">Tipo de Moradia</Label>
                  <Select name="housing_type">
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="OWNED">Própria</SelectItem>
                      <SelectItem value="LEASED">Arrendada</SelectItem>
                      <SelectItem value="RENTED">Alugada</SelectItem>
                      <SelectItem value="FINANCED">Financiada</SelectItem>
                      <SelectItem value="CEDED">Cedida</SelectItem>
                      <SelectItem value="OCCUPATION">Ocupação</SelectItem>
                      <SelectItem value="STREET">Rua</SelectItem>
                      <SelectItem value="OTHER">Outra</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="construction_type">Tipo de Construção</Label>
                  <Select name="construction_type">
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="BRICK_MASONRY">Tijolo/Alvenaria</SelectItem>
                      <SelectItem value="ADOBE_COVERED">Taipa Revestida</SelectItem>
                      <SelectItem value="ADOBE_UNCOVERED">Taipa não Revestida</SelectItem>
                      <SelectItem value="WOOD">Madeira</SelectItem>
                      <SelectItem value="RECYCLED_MATERIAL">Material Reaproveitado</SelectItem>
                      <SelectItem value="PLYWOOD">Compensado/Maderite</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="number_of_rooms">Número de Cômodos</Label>
                  <Input id="number_of_rooms" name="number_of_rooms" type="number" min="0" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="number_of_bedrooms">Número de Quartos</Label>
                  <Input id="number_of_bedrooms" name="number_of_bedrooms" type="number" min="0" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="number_of_bathrooms">Número de Banheiros</Label>
                  <Input id="number_of_bathrooms" name="number_of_bathrooms" type="number" min="0" />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="water_supply">Abastecimento de Água</Label>
                  <Select name="water_supply">
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PUBLIC_PIPED">Rede Pública Encanada</SelectItem>
                      <SelectItem value="TRUCK_WELL_NATURAL">Carro Pipa/Poço/Água Natural</SelectItem>
                      <SelectItem value="COLLECTIVE_TAPS">Torneiras Coletivas</SelectItem>
                      <SelectItem value="OTHER">Outro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="electricity_type">Energia Elétrica</Label>
                  <Select name="electricity_type">
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="OWN_METER">Relógio Próprio</SelectItem>
                      <SelectItem value="NO_METER">Sem Medidor</SelectItem>
                      <SelectItem value="LOW_INCOME">Baixa Renda</SelectItem>
                      <SelectItem value="COMMUNITY_METER">Relógio Comunitário</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sewage_destination">Destino do Esgoto</Label>
                  <Select name="sewage_destination">
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PUBLIC_NETWORK">Rede Pública</SelectItem>
                      <SelectItem value="OPEN_SKY">Céu Aberto</SelectItem>
                      <SelectItem value="SEPTIC_TANK">Fossa</SelectItem>
                      <SelectItem value="OTHER">Outro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="waste_destination">Destino do Lixo</Label>
                  <Select name="waste_destination">
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="HOME_COLLECTION">Coleta Domiciliar</SelectItem>
                      <SelectItem value="DUMPSTER">Caçamba</SelectItem>
                      <SelectItem value="PUBLIC_AREA">Via Pública</SelectItem>
                      <SelectItem value="BURIED">Enterrado</SelectItem>
                      <SelectItem value="BURNED">Queimado</SelectItem>
                      <SelectItem value="OTHER">Outro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox id="paved_street" name="paved_street" value="true" />
                  <Label htmlFor="paved_street">Rua pavimentada</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="risk_location" name="risk_location" value="true" />
                  <Label htmlFor="risk_location">Localização de risco (enchente, deslizamento, etc.)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="vaccines_up_to_date" name="vaccines_up_to_date" value="true" />
                  <Label htmlFor="vaccines_up_to_date">Vacinas em dia</Label>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="food_situation">Situação Alimentar</Label>
                <Select name="food_situation">
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BALANCED">Equilibrada</SelectItem>
                    <SelectItem value="PRECARIOUS">Precária</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 5: Final Information */}
        {currentStep === 5 && (
          <Card>
            <CardHeader>
              <CardTitle>Informações Finais</CardTitle>
              <CardDescription>Necessidades imediatas e observações adicionais</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="immediate_needs">Necessidades Imediatas</Label>
                <Textarea
                  id="immediate_needs"
                  name="immediate_needs"
                  placeholder="Descreva as principais necessidades da família no momento (alimentação, medicamentos, roupas, etc.)"
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="final_observations">Observações Adicionais</Label>
                <Textarea
                  id="final_observations"
                  name="final_observations"
                  placeholder="Qualquer informação adicional que considere importante para o atendimento da família"
                  rows={4}
                />
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Informações sobre o Processo</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Após o cadastro, sua família receberá um código único para acompanhamento</li>
                  <li>• Nossa equipe entrará em contato em até 48 horas</li>
                  <li>• Uma visita será agendada conforme sua disponibilidade</li>
                  <li>• Todos os dados são confidenciais e protegidos</li>
                </ul>
              </div>

              <SubmitButton />
            </CardContent>
          </Card>
        )}

        {/* Navigation Buttons */}
        {currentStep < 5 && (
          <div className="flex justify-between mt-6">
            <Button type="button" variant="outline" onClick={prevStep} disabled={currentStep === 1}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Anterior
            </Button>
            <Button type="button" onClick={nextStep}>
              Próximo
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        )}

        {currentStep === 5 && (
          <div className="flex justify-start mt-6">
            <Button type="button" variant="outline" onClick={prevStep}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Anterior
            </Button>
          </div>
        )}
      </form>
    </div>
  )
}
