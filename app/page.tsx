import { createClient, isSupabaseConfigured } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Heart, Users, FileText, Calendar } from "lucide-react"
import Link from "next/link"

export default async function HomePage() {
  // If Supabase is not configured, show setup message directly
  if (!isSupabaseConfigured) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <h1 className="text-2xl font-bold mb-4 text-gray-900">Connect Supabase to get started</h1>
      </div>
    )
  }

  // Check if user is logged in
  const supabase = createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // If user is logged in, redirect to dashboard
  if (session) {
    redirect("/dashboard")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-100 p-2 rounded-full">
                <Heart className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Igreja Esperança</h1>
                <p className="text-sm text-gray-600">Ministério Compartilhar Esperança</p>
              </div>
            </div>
            <div className="flex space-x-4">
              <Link href="/auth/login">
                <Button variant="outline">Entrar</Button>
              </Link>
              <Link href="/cadastro">
                <Button className="bg-blue-600 hover:bg-blue-700">Cadastrar Família</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Sistema de Gestão de Assistência Familiar</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Plataforma dedicada ao cuidado e acompanhamento de famílias em situação de vulnerabilidade social,
            promovendo dignidade e esperança através do amor cristão.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="text-center">
            <CardHeader>
              <div className="bg-blue-100 p-3 rounded-full w-fit mx-auto mb-4">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <CardTitle className="text-lg">Cadastro de Famílias</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Registro completo e detalhado das famílias assistidas pelo ministério</CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="bg-green-100 p-3 rounded-full w-fit mx-auto mb-4">
                <Calendar className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle className="text-lg">Agendamento</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Sistema de visitas e acompanhamento personalizado para cada família</CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="bg-purple-100 p-3 rounded-full w-fit mx-auto mb-4">
                <FileText className="h-8 w-8 text-purple-600" />
              </div>
              <CardTitle className="text-lg">Relatórios</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Geração de relatórios detalhados e acompanhamento do progresso</CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="bg-orange-100 p-3 rounded-full w-fit mx-auto mb-4">
                <Heart className="h-8 w-8 text-orange-600" />
              </div>
              <CardTitle className="text-lg">Cuidado Integral</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Abordagem holística focada no bem-estar físico, emocional e espiritual</CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Card className="max-w-2xl mx-auto bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-2xl text-blue-900">Precisa de Assistência?</CardTitle>
              <CardDescription className="text-blue-700 text-base">
                Nossa equipe está pronta para ajudar sua família. Inicie o cadastro e receba o apoio necessário.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/cadastro">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3">
                  Iniciar Cadastro da Família
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p>&copy; 2024 Igreja Esperança - Ministério Compartilhar Esperança</p>
            <p className="text-sm mt-2">Levando esperança e dignidade às famílias em vulnerabilidade</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
