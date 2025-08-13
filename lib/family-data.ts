"use server"

import { createClient } from "@/lib/supabase/server"

export async function getAllFamilies() {
  const supabase = createClient()

  try {
    const { data: families, error } = await supabase
      .from("families")
      .select(
        `
        *,
        assignedUser:users(name)
      `,
      )
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching families:", error)
      return []
    }

    return families || []
  } catch (error) {
    console.error("Error fetching families:", error)
    return []
  }
}

export async function getFamilyById(id: string) {
  const supabase = createClient()

  try {
    const { data: family, error } = await supabase
      .from("families")
      .select(
        `
        *,
        assignedUser:users(name, email),
        familyMembers:family_members(*),
        visits(*),
        tasks(*),
        attendanceHistory:attendance_history(*, user:users(name)),
        notifications(*),
        documents(*)
      `,
      )
      .eq("id", id)
      .single()

    if (error) {
      console.error("Error fetching family:", error)
      return null
    }

    return family
  } catch (error) {
    console.error("Error fetching family:", error)
    return null
  }
}

export async function updateFamilyStatus(familyId: string, status: string, urgencyLevel?: string) {
  const supabase = createClient()

  try {
    const updateData: any = { status }
    if (urgencyLevel) {
      updateData.urgency_level = urgencyLevel
    }

    const { error } = await supabase.from("families").update(updateData).eq("id", familyId)

    if (error) {
      console.error("Error updating family status:", error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error("Error updating family status:", error)
    return { success: false, error: "Erro interno do sistema" }
  }
}

export async function assignFamilyToUser(familyId: string, userId: string) {
  const supabase = createClient()

  try {
    const { error } = await supabase.from("families").update({ assigned_to: userId }).eq("id", familyId)

    if (error) {
      console.error("Error assigning family:", error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error("Error assigning family:", error)
    return { success: false, error: "Erro interno do sistema" }
  }
}

export async function addAttendanceHistory(
  familyId: string,
  userId: string,
  description: string,
  urgency = "LOW",
  notes?: string,
) {
  const supabase = createClient()

  try {
    const { error } = await supabase.from("attendance_history").insert({
      family_id: familyId,
      attended_by: userId,
      description,
      urgency,
      notes,
    })

    if (error) {
      console.error("Error adding attendance history:", error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error("Error adding attendance history:", error)
    return { success: false, error: "Erro interno do sistema" }
  }
}

export async function getAllUsers() {
  const supabase = createClient()

  try {
    const { data: users, error } = await supabase
      .from("users")
      .select("id, name, email, role")
      .eq("status", "ACTIVE")
      .order("name")

    if (error) {
      console.error("Error fetching users:", error)
      return []
    }

    return users || []
  } catch (error) {
    console.error("Error fetching users:", error)
    return []
  }
}
