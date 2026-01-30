import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Profile } from "@/components/profile"
import { About } from "@/components/about"
import { Pattern } from "@/components/pattern"
import { DynamicSections } from "@/components/dynamic-sections"
import { Contact } from "@/components/contact"
import { StaticExperienceSection } from "@/components/static-experience-section"
import { StaticProjectsSection } from "@/components/static-projects-section"
import { createServerSupabaseClient } from "@/lib/supabase/server"

export default async function Home() {
  const supabase = await createServerSupabaseClient()

  // Fetch Profile for Bio
  const { data: profile } = await supabase.from("profile").select("bio").single()

  // Fetch Default Experience (section_id is NULL)
  const { data: experience } = await supabase
    .from("experience")
    .select("*")
    .is("section_id", null)
    .order("created_at", { ascending: false })

  // Fetch Default Projects (section_id is NULL)
  const { data: projects } = await supabase
    .from("projects")
    .select("*")
    .is("section_id", null)
    .order("created_at", { ascending: false })

  return (
    <>
      <Navbar />

      <main
        aria-label="Main content"
        className="mx-auto min-h-[calc(100vh-120px)] max-w-3xl px-4"
      >
        <Pattern className="h-14" />
        <Profile />
        <Pattern />
        <About bio={profile?.bio} />
        <Pattern />
        <StaticExperienceSection items={experience || []} />
        <Pattern />
        <StaticProjectsSection items={projects || []} />
        <Pattern />
        <DynamicSections />
        <Pattern />
        <Contact />
        <Pattern />
      </main>

      <Footer />
    </>
  )
}
