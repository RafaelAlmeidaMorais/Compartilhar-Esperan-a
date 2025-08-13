"use server"

import { createClient } from "@/lib/supabase/server"

export async function getDashboardStats() {
  const supabase = createClient()

  try {
    // Get total families count
    const { count: totalFamilies } = await supabase.from("families").select("*", { count: "exact", head: true })

    // Get pending families count
    const { count: pendingFamilies } = await supabase
      .from("families")
      .select("*", { count: "exact", head: true })
      .eq("status", "PENDING")

    // Get active families count
    const { count: activeFamilies } = await supabase
      .from("families")
      .select("*", { count: "exact", head: true })
      .in("status", ["ACTIVE", "ASSISTED"])

    // Get urgent cases count
    const { count: urgentCases } = await supabase
      .from("families")
      .select("*", { count: "exact", head: true })
      .in("urgency_level", ["HIGH", "CRITICAL"])

    // Get scheduled visits count
    const { count: scheduledVisits } = await supabase
      .from("visits")
      .select("*", { count: "exact", head: true })
      .eq("status", "SCHEDULED")

    // Get completed visits count (this month)
    const startOfMonth = new Date()
    startOfMonth.setDate(1)
    startOfMonth.setHours(0, 0, 0, 0)

    const { count: completedVisits } = await supabase
      .from("visits")
      .select("*", { count: "exact", head: true })
      .eq("status", "COMPLETED")
      .gte("completed_at", startOfMonth.toISOString())

    // Get pending tasks count
    const { count: pendingTasks } = await supabase
      .from("tasks")
      .select("*", { count: "exact", head: true })
      .in("status", ["PENDING", "IN_PROGRESS"])

    // Get completed tasks count (this month)
    const { count: completedTasks } = await supabase
      .from("tasks")
      .select("*", { count: "exact", head: true })
      .eq("status", "COMPLETED")
      .gte("completed_at", startOfMonth.toISOString())

    return {
      totalFamilies: totalFamilies || 0,
      pendingFamilies: pendingFamilies || 0,
      activeFamilies: activeFamilies || 0,
      urgentCases: urgentCases || 0,
      scheduledVisits: scheduledVisits || 0,
      completedVisits: completedVisits || 0,
      pendingTasks: pendingTasks || 0,
      completedTasks: completedTasks || 0,
    }
  } catch (error) {
    console.error("Error fetching dashboard stats:", error)
    return {
      totalFamilies: 0,
      pendingFamilies: 0,
      activeFamilies: 0,
      urgentCases: 0,
      scheduledVisits: 0,
      completedVisits: 0,
      pendingTasks: 0,
      completedTasks: 0,
    }
  }
}

export async function getRecentFamilies(limit = 5) {
  const supabase = createClient()

  try {
    const { data: families, error } = await supabase
      .from("families")
      .select("id, public_code, responsible_name, status, urgency_level, created_at, neighborhood, city")
      .order("created_at", { ascending: false })
      .limit(limit)

    if (error) {
      console.error("Error fetching recent families:", error)
      return []
    }

    return families || []
  } catch (error) {
    console.error("Error fetching recent families:", error)
    return []
  }
}

export async function getUserProfile(userId: string) {
  const supabase = createClient()

  try {
    const { data: user, error } = await supabase.from("users").select("*").eq("id", userId).single()

    if (error) {
      console.error("Error fetching user profile:", error)
      return null
    }

    return user
  } catch (error) {
    console.error("Error fetching user profile:", error)
    return null
  }
}
