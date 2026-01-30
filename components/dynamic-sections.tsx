import { createServerSupabaseClient } from "@/lib/supabase/server"
import { HorizontalCards } from "./sections/horizontal-cards"
import { VerticalCards } from "./sections/vertical-cards"
import { TagsSection } from "./sections/tags-section"
import { MarkdownSection } from "./sections/markdown-section"
import { ExperienceSection } from "./sections/experience-section"
import { Pattern } from "./pattern"

interface Section {
  id: string
  title: string
  type: string
  is_visible: boolean
  order_index: number
  content?: string
}

export async function DynamicSections() {
  const supabase = await createServerSupabaseClient()

  const { data: sections } = await supabase
    .from("sections")
    .select("*")
    .eq("is_visible", true)
    .order("order_index", { ascending: true })

  if (!sections || sections.length === 0) {
    return null
  }

  return (
    <>
      {sections.map((section: Section, index: number) => {
        let SectionComponent = null

        switch (section.type) {
          case "horizontal_cards":
            SectionComponent = <HorizontalCards key={section.id} section={section} />
            break
          case "vertical_cards":
            SectionComponent = <VerticalCards key={section.id} section={section} />
            break
          case "tags":
            SectionComponent = <TagsSection key={section.id} section={section} />
            break
          case "markdown":
            SectionComponent = <MarkdownSection key={section.id} section={section} />
            break
          case "experience":
            SectionComponent = <ExperienceSection key={section.id} section={section} />
            break
          default:
            return null
        }

        return (
          <div key={section.id}>
            {SectionComponent}
            {index < sections.length - 1 && <Pattern />}
          </div>
        )
      })}
    </>
  )
}
