"use server"

import { createClient } from "@/lib/supabase/server"

// Visits functions
export async function getAllVisits() {
  const supabase = createClient()

  try {
    const { data: visits, error } = await supabase
      .from("visits")
      .select(
        `
        *,
        family:families(id, public_code, responsible_name, neighborhood, city),
        assignedUser:users(name, email)
      `,
      )
      .order("scheduled_at", { ascending: true })

    if (error) {
      console.error("Error fetching visits:", error)
      return []
    }

    return visits || []
  } catch (error) {
    console.error("Error fetching visits:", error)
    return []
  }
}

export async function createVisit(visitData: {
  title: string
  description?: string
  visit_type: string
  scheduled_at: string
  family_id: string
  assigned_to: string
}) {
  const supabase = createClient()

  try {
    const { data: visit, error } = await supabase.from("visits").insert(visitData).select().single()

    if (error) {
      console.error("Error creating visit:", error)
      return { success: false, error: error.message }
    }

    return { success: true, visit }
  } catch (error) {
    console.error("Error creating visit:", error)
    return { success: false, error: "Erro interno do sistema" }
  }
}

export async function updateVisitStatus(visitId: string, status: string, notes?: string) {
  const supabase = createClient()

  try {
    const updateData: any = { status }
    if (status === "COMPLETED") {
      updateData.completed_at = new Date().toISOString()
    }
    if (notes) {
      updateData.notes = notes
    }

    const { error } = await supabase.from("visits").update(updateData).eq("id", visitId)

    if (error) {
      console.error("Error updating visit:", error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error("Error updating visit:", error)
    return { success: false, error: "Erro interno do sistema" }
  }
}

// Tasks functions
export async function getAllTasks() {
  const supabase = createClient()

  try {
    const { data: tasks, error } = await supabase
      .from("tasks")
      .select(
        `
        *,
        family:families(id, public_code, responsible_name, neighborhood, city),
        assignedUser:users(name, email)
      `,
      )
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching tasks:", error)
      return []
    }

    return tasks || []
  } catch (error) {
    console.error("Error fetching tasks:", error)
    return []
  }
}

export async function createTask(taskData: {
  title: string
  description?: string
  priority: string
  due_date?: string
  family_id?: string
  assigned_to: string
}) {
  const supabase = createClient()

  try {
    const { data: task, error } = await supabase.from("tasks").insert(taskData).select().single()

    if (error) {
      console.error("Error creating task:", error)
      return { success: false, error: error.message }
    }

    return { success: true, task }
  } catch (error) {
    console.error("Error creating task:", error)
    return { success: false, error: "Erro interno do sistema" }
  }
}

export async function updateTaskStatus(taskId: string, status: string) {
  const supabase = createClient()

  try {
    const updateData: any = { status }
    if (status === "COMPLETED") {
      updateData.completed_at = new Date().toISOString()
    }

    const { error } = await supabase.from("tasks").update(updateData).eq("id", taskId)

    if (error) {
      console.error("Error updating task:", error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error("Error updating task:", error)
    return { success: false, error: "Erro interno do sistema" }
  }
}

export async function getUpcomingVisits(limit = 10) {
  const supabase = createClient()

  try {
    const { data: visits, error } = await supabase
      .from("visits")
      .select(
        `
        *,
        family:families(id, public_code, responsible_name, phone),
        assignedUser:users(name)
      `,
      )
      .eq("status", "SCHEDULED")
      .gte("scheduled_at", new Date().toISOString())
      .order("scheduled_at", { ascending: true })
      .limit(limit)

    if (error) {
      console.error("Error fetching upcoming visits:", error)
      return []
    }

    return visits || []
  } catch (error) {
    console.error("Error fetching upcoming visits:", error)
    return []
  }
}

export async function getPendingTasks(limit = 10) {
  const supabase = createClient()

  try {
    const { data: tasks, error } = await supabase
      .from("tasks")
      .select(
        `
        *,
        family:families(id, public_code, responsible_name),
        assignedUser:users(name)
      `,
      )
      .in("status", ["PENDING", "IN_PROGRESS"])
      .order("priority", { ascending: false })
      .order("due_date", { ascending: true })
      .limit(limit)

    if (error) {
      console.error("Error fetching pending tasks:", error)
      return []
    }

    return tasks || []
  } catch (error) {
    console.error("Error fetching pending tasks:", error)
    return []
  }
}
