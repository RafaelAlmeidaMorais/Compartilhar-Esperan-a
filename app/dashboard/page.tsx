import { createClient, isSupabaseConfigured } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import DashboardSidebar from "@/components/dashboard-sidebar"
import DashboardStats from "@/components/dashboard-stats"
import RecentFamilies from "@/components/recent-families"
import { getDashboardStats, getRecentFamilies, getUserProfile } from "@/lib/dashboard-data"

export default async function DashboardPage() {
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

  // Get dashboard data
  const [stats, recentFamilies] = await Promise.all([getDashboardStats(), getRecentFamilies()])

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardSidebar user={userProfile} />

      {/* Main content */}
      <div className="lg:pl-64">
        <main className="py-6">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* Page header */}
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600">Visão geral do sistema de gestão de assistência familiar</p>
            </div>

            {/* Stats */}
            <div className="mb-8">
              <DashboardStats stats={stats} />
            </div>

            {/* Recent families and quick actions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <RecentFamilies families={recentFamilies} />

              {/* Quick Actions */}
              <div className="space-y-6">
                {/* Today's Schedule */}
                <div className="bg-white rounded-lg border p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Agenda de Hoje</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <div>
                        <p className="font-medium text-blue-900">Visitas Agendadas</p>
                        <p className="text-sm text-blue-700">{stats.scheduledVisits} visitas pendentes</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                      <div>
                        <p className="font-medium text-orange-900">Tarefas Pendentes</p>
                        <p className="text-sm text-orange-700">{stats.pendingTasks} tarefas em aberto</p>
                      </div>
                    </div>
                    {stats.urgentCases > 0 && (
                      <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                        <div>
                          <p className="font-medium text-red-900">Casos Urgentes</p>
                          <p className="text-sm text-red-700">{stats.urgentCases} casos precisam de atenção</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Monthly Summary */}
                <div className="bg-white rounded-lg border p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Resumo do Mês</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Visitas Realizadas</span>
                      <span className="font-medium text-gray-900">{stats.completedVisits}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tarefas Concluídas</span>
                      <span className="font-medium text-gray-900">{stats.completedTasks}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Famílias Ativas</span>
                      <span className="font-medium text-gray-900">{stats.activeFamilies}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
