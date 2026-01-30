import { createServerSupabaseClient } from "@/lib/supabase/server"
import { Box, BoxHeader, BoxTitle, BoxContent } from "@/components/box"
import Link from "next/link"
import { ExternalLink } from "lucide-react"

interface Section {
  id: string
  title: string
  type: string
}

interface Experience {
  id: string
  company: string
  role: string
  period: string
  description?: string
  company_url?: string
  technologies?: string[]
}

export async function ExperienceSection({ section }: { section: Section }) {
  const supabase = await createServerSupabaseClient()

  const { data: experiences } = await supabase
    .from("experience")
    .select("*")
    .eq("section_id", section.id)
    .order("order_index", { ascending: true })

  if (!experiences || experiences.length === 0) return null

  return (
    <Box>
      <BoxHeader>
        <BoxTitle>{section.title}</BoxTitle>
      </BoxHeader>
      <BoxContent className="px-0">
        <div className="divide-y divide-dashed divide-border">
          {experiences.map((exp: Experience) => (
            <div key={exp.id} className="px-4 py-4 first:pt-0 last:pb-0">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-1">
                <div className="space-y-1">
                  <h3 className="font-semibold text-foreground">
                    {exp.company_url ? (
                      <Link
                        href={exp.company_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 hover:underline"
                      >
                        {exp.company}
                        <ExternalLink className="h-3.5 w-3.5" />
                      </Link>
                    ) : (
                      exp.company
                    )}
                  </h3>
                  <p className="text-sm text-muted-foreground">{exp.role}</p>
                </div>
                <p className="text-sm text-muted-foreground md:text-right flex-shrink-0">
                  {exp.period}
                </p>
              </div>
              {exp.description && (
                <p className="text-sm text-muted-foreground mt-2 max-w-xl">
                  {exp.description}
                </p>
              )}
              {exp.technologies && exp.technologies.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {exp.technologies.map((tech, index) => (
                    <span
                      key={index}
                      className="text-xs px-2 py-0.5 rounded bg-accent text-muted-foreground"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </BoxContent>
    </Box>
  )
}
