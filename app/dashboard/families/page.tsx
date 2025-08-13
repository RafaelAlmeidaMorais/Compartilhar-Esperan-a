import { createClient, isSupabaseConfigured } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import DashboardSidebar from "@/components/dashboard-sidebar"
import FamilyList from "@/components/family-list"
import { getAllFamilies } from "@/lib/family-data"
import { getUserProfile } from "@/lib/dashboard-data"

export default async function FamiliesPage() {
  // If Supabase is not configured, show setup message
  if (!isSupabaseConfigured) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <h1 className="text-2xl font-bold mb-4 text-gray-900">Connect Supabase to get started</h1>
      </div>
    )
  }

  // Check authentication
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Get user profile from our database
  const userProfile = await getUserProfile(user.id)
  if (!userProfile) {
    redirect("/auth/login")
  }

  // Get all families
  const families = await getAllFamilies()

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardSidebar user={userProfile} />

      {/* Main content */}
      <div className="lg:pl-64">
        <main className="py-6">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* Page header */}
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900">Gestão de Famílias</h1>
              <p className="text-gray-600">Visualize e gerencie todas as famílias cadastradas no sistema</p>
            </div>

            {/* Family list */}
            <FamilyList families={families} />
          </div>
        </main>
      </div>
    </div>
  )
}
