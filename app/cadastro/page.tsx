import FamilyRegistrationForm from "@/components/family-registration-form"
import { Heart } from "lucide-react"
import Link from "next/link"

export default function RegistrationPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link href="/" className="flex items-center space-x-3">
              <div className="bg-blue-100 p-2 rounded-full">
                <Heart className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">Igreja Esperança</h1>
                <p className="text-sm text-gray-600">Ministério Compartilhar Esperança</p>
              </div>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Cadastro de Família</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Preencha as informações abaixo para que possamos conhecer melhor sua família e oferecer o apoio necessário.
            Todas as informações são confidenciais e serão usadas apenas para fins de assistência social.
          </p>
        </div>

        <FamilyRegistrationForm />
      </main>
    </div>
  )
}
