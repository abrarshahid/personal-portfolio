import { createServerSupabaseClient } from "@/lib/supabase/server"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Pattern } from "@/components/pattern"
import { Box, BoxHeader, BoxTitle, BoxContent } from "@/components/box"
import { PageTransition } from "@/components/page-transition"
import Link from "next/link"
import { ExternalLink } from "lucide-react"
import ReactMarkdown from "react-markdown"

interface Project {
    id: string
    title: string
    subtitle?: string
    description?: string
    link?: string
    github_url?: string
    technologies?: string[]
}

export default async function ProjectsPage() {
    const supabase = await createServerSupabaseClient()

    const { data: projects } = await supabase
        .from("projects")
        .select("*")
        .order("order_index", { ascending: true })

    return (
        <PageTransition>
            <Navbar />

            <main
                aria-label="Projects"
                className="mx-auto min-h-[calc(100vh-120px)] max-w-3xl px-4"
            >
                <Pattern className="h-14" />

                <Box>
                    <BoxHeader>
                        <BoxTitle>All Projects</BoxTitle>
                    </BoxHeader>
                    <BoxContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {projects?.map((project: Project) => (
                                <div
                                    key={project.id}
                                    className="group relative flex flex-col rounded-lg border border-dashed p-4 transition-colors hover:border-foreground/30 hover:bg-accent/50"
                                >
                                    <div className="space-y-3 flex-1 flex flex-col">
                                        <div className="flex items-start justify-between gap-2">
                                            <h3 className="font-semibold text-lg text-foreground">
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
                                                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                                                    </svg>
                                                </Link>
                                            )}
                                        </div>
                                        {project.subtitle && (
                                            <div className="text-sm text-muted-foreground flex-1 font-medium prose prose-sm dark:prose-invert max-w-none">
                                                <ReactMarkdown>{project.subtitle}</ReactMarkdown>
                                            </div>
                                        )}
                                        {project.description && !project.subtitle && (
                                            <div className="text-sm text-muted-foreground flex-1 prose prose-sm dark:prose-invert max-w-none">
                                                <ReactMarkdown>{project.description}</ReactMarkdown>
                                            </div>
                                        )}
                                        {project.technologies && project.technologies.length > 0 && (
                                            <div className="flex flex-wrap gap-1.5 pt-2">
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
                                </div>
                            ))}
                            {(!projects || projects.length === 0) && (
                                <div className="col-span-full text-center py-12 text-muted-foreground">
                                    No projects found.
                                </div>
                            )}
                        </div>
                    </BoxContent>
                </Box>

                <Pattern />
            </main>

            <Footer />
        </PageTransition>
    )
}

