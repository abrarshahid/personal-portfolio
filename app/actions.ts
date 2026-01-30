"use server"

import { createServerSupabaseClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function submitContactForm(formData: FormData) {
    const supabase = await createServerSupabaseClient()

    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const subject = formData.get("subject") as string
    const message = formData.get("message") as string

    if (!name || !email || !subject || !message) {
        return { error: "All fields are required" }
    }

    const { error } = await supabase.from("messages").insert({
        name,
        email,
        subject,
        message,
    })

    if (error) {
        return { error: "Failed to send message. Please try again." }
    }

    revalidatePath("/admin/messages")
    return { success: "Message sent successfully!" }
}
