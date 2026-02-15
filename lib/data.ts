import { unstable_cache } from "next/cache"
import { createStaticSupabaseClient } from "./supabase/server"

export const getProfile = unstable_cache(
    async () => {
        const supabase = createStaticSupabaseClient()
        const { data } = await supabase.from("profile").select("bio").single()
        return data
    },
    ["profile-bio"],
    { revalidate: 3600 }
)

export const getExperience = unstable_cache(
    async () => {
        const supabase = createStaticSupabaseClient()
        const { data } = await supabase
            .from("experience")
            .select("*")
            .is("section_id", null)
            .order("created_at", { ascending: false })
        return data
    },
    ["experience-list"],
    { revalidate: 3600 }
)

export const getProjects = unstable_cache(
    async () => {
        const supabase = createStaticSupabaseClient()
        const { data } = await supabase
            .from("projects")
            .select("*")
            .is("section_id", null)
            .order("created_at", { ascending: false })
        return data
    },
    ["projects-list"],
    { revalidate: 3600 }
)
