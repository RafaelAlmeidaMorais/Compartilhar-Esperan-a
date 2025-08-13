"use server"

import { createServerActionClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

// Generate unique public code for family
export function generateFamilyCode(): string {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, "0")
  const day = String(now.getDate()).padStart(2, "0")
  const random = Math.random().toString(36).substring(2, 8).toUpperCase()

  return `fam-${year}${month}${day}-${random}`
}

// Save family registration data
export async function saveFamilyRegistration(prevState: any, formData: FormData) {
  const cookieStore = cookies()
  const supabase = createServerActionClient({ cookies: () => cookieStore })

  try {
    // Extract form data
    const familyData = {
      public_code: generateFamilyCode(),
      status: "PENDING",
      urgency_level: "LOW",

      // Personal information
      responsible_name: formData.get("responsible_name")?.toString() || "",
      number_of_members: Number.parseInt(formData.get("number_of_members")?.toString() || "0"),
      marital_status: formData.get("marital_status")?.toString() || null,
      nis: formData.get("nis")?.toString() || null,
      cpf: formData.get("cpf")?.toString() || null,
      rg: formData.get("rg")?.toString() || null,
      sus_card: formData.get("sus_card")?.toString() || null,
      birth_date: formData.get("birth_date")?.toString() || null,
      age: Number.parseInt(formData.get("age")?.toString() || "0") || null,
      gender: formData.get("gender")?.toString() || null,
      education: formData.get("education")?.toString() || null,
      race: formData.get("race")?.toString() || null,
      formal_income: Number.parseFloat(formData.get("formal_income")?.toString() || "0") || null,
      informal_income: Number.parseFloat(formData.get("informal_income")?.toString() || "0") || null,
      occupation: formData.get("occupation")?.toString() || null,
      professional_course: formData.get("professional_course")?.toString() || null,
      church_in_homes: formData.get("church_in_homes")?.toString() || null,
      ic_leader: formData.get("ic_leader")?.toString() || null,
      leader_contact: formData.get("leader_contact")?.toString() || null,

      // Address
      street: formData.get("street")?.toString() || "",
      number: formData.get("address_number")?.toString() || null,
      neighborhood: formData.get("neighborhood")?.toString() || "",
      zip_code: formData.get("zip_code")?.toString() || null,
      city: formData.get("city")?.toString() || "",
      reference_point: formData.get("reference_point")?.toString() || null,
      phone: formData.get("phone")?.toString() || null,
      contact_person: formData.get("contact_person")?.toString() || null,
      visit_day: formData.get("visit_day")?.toString() || null,
      visit_time: formData.get("visit_time")?.toString() || null,

      // Housing
      housing_type: formData.get("housing_type")?.toString() || null,
      paved_street: formData.get("paved_street") === "true",
      number_of_rooms: Number.parseInt(formData.get("number_of_rooms")?.toString() || "0") || null,
      number_of_bedrooms: Number.parseInt(formData.get("number_of_bedrooms")?.toString() || "0") || null,
      number_of_bathrooms: Number.parseInt(formData.get("number_of_bathrooms")?.toString() || "0") || null,
      construction_type: formData.get("construction_type")?.toString() || null,
      risk_location: formData.get("risk_location") === "true",
      electricity_type: formData.get("electricity_type")?.toString() || null,
      sewage_destination: formData.get("sewage_destination")?.toString() || null,
      bathroom_type: formData.get("bathroom_type")?.toString() || null,
      water_supply: formData.get("water_supply")?.toString() || null,
      waste_destination: formData.get("waste_destination")?.toString() || null,

      // Health
      vaccines_up_to_date: formData.get("vaccines_up_to_date") === "true",
      food_situation: formData.get("food_situation")?.toString() || null,

      // Immediate needs
      immediate_needs: formData.get("immediate_needs")?.toString() || null,
      final_observations: formData.get("final_observations")?.toString() || null,
    }

    // Insert family data
    const { data: family, error: familyError } = await supabase.from("families").insert(familyData).select().single()

    if (familyError) {
      console.error("Family insertion error:", familyError)
      return { error: "Erro ao salvar dados da família. Tente novamente." }
    }

    // Insert family members if provided
    const memberNames = formData.getAll("member_name")
    const memberKinships = formData.getAll("member_kinship")
    const memberAges = formData.getAll("member_age")

    if (memberNames.length > 0) {
      const members = memberNames
        .map((name, index) => ({
          family_id: family.id,
          name: name.toString(),
          kinship: memberKinships[index]?.toString() || "",
          age: Number.parseInt(memberAges[index]?.toString() || "0") || null,
        }))
        .filter((member) => member.name.trim() !== "")

      if (members.length > 0) {
        const { error: membersError } = await supabase.from("family_members").insert(members)

        if (membersError) {
          console.error("Members insertion error:", membersError)
          // Don't fail the whole process for member errors
        }
      }
    }

    return {
      success: true,
      familyCode: family.public_code,
      message: "Cadastro realizado com sucesso! Sua família foi registrada e receberá acompanhamento em breve.",
    }
  } catch (error) {
    console.error("Registration error:", error)
    return { error: "Erro interno do sistema. Tente novamente mais tarde." }
  }
}
