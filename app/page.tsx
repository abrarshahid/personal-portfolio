import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Profile } from "@/components/profile"
import { About } from "@/components/about"
import { Pattern } from "@/components/pattern"
import { DynamicSections } from "@/components/dynamic-sections"
import { Contact } from "@/components/contact"
import { StaticExperienceSection } from "@/components/static-experience-section"
import { StaticProjectsSection } from "@/components/static-projects-section"
import { getExperience, getProfile, getProjects } from "@/lib/data"

export default async function Home() {
  const [profile, experience, projects] = await Promise.all([
    getProfile(),
    getExperience(),
    getProjects(),
  ])

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
