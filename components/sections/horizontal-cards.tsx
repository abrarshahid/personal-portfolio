import { createServerSupabaseClient } from "@/lib/supabase/server"
import { Box, BoxHeader, BoxTitle, BoxContent } from "@/components/box"
import Link from "next/link"
import { ExternalLink, Github } from "lucide-react"
import ReactMarkdown from "react-markdown"

interface Section {
    id: string
    title: string
    type: string
}

interface Project {
    id: string
    title: string
    subtitle?: string
    description?: string
    link?: string
    github_url?: string
    technologies?: string[]
}

export async function HorizontalCards({ section }: { section: Section }) {
    const supabase = await createServerSupabaseClient()

    const { data: projects } = await supabase
        .from("projects")
        .select("*")
        .eq("section_id", section.id)
        .order("order_index", { ascending: true })

    if (!projects || projects.length === 0) return null

    return (
        <Box>
            <BoxHeader>
                <BoxTitle>{section.title}</BoxTitle>
            </BoxHeader>
            <BoxContent className="space-y-4">
                {projects.map((project: Project) => (
                    <div
                        key={project.id}
                        className="group relative flex flex-col gap-2 p-4 -mx-4 rounded-lg transition-colors hover:bg-accent/50"
                    >
                        <div className="flex items-start justify-between gap-2">
                            <h3 className="font-semibold text-foreground">
                                <Link
                                    href={`/projects/${project.id}`}
                                    className="inline-flex items-center gap-1.5 hover:underline before:absolute before:inset-0"
                                >
                                    {project.title}
                                </Link>
                            </h3>
                            {project.github_url && (
                                <Link
                                    href={project.github_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-muted-foreground hover:text-foreground transition-colors relative z-10"
                                >
                                    <Github className="h-4 w-4" />
                                </Link>
                            )}
                        </div>

                        {project.subtitle && (
                            <div className="text-sm text-muted-foreground font-medium prose prose-sm dark:prose-invert max-w-none">
                                <ReactMarkdown>{project.subtitle}</ReactMarkdown>
                            </div>
                        )}

                        {project.description && !project.subtitle && (
                            <div className="text-sm text-muted-foreground prose prose-sm dark:prose-invert max-w-none">
                                <ReactMarkdown>{project.description}</ReactMarkdown>
                            </div>
                        )}

                        {project.technologies && project.technologies.length > 0 && (
                            <div className="flex flex-wrap gap-1.5">
                                {project.technologies.map((tech, index) => (
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
            </BoxContent>
        </Box>
    )
}
