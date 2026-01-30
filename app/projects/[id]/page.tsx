import { createServerSupabaseClient } from "@/lib/supabase/server"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Pattern } from "@/components/pattern"
import { Box, BoxHeader, BoxTitle, BoxContent } from "@/components/box"
import Link from "next/link"
import { ExternalLink, Github, ArrowLeft } from "lucide-react"
import ReactMarkdown from "react-markdown"
import { notFound } from "next/navigation"

export default async function ProjectDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const supabase = await createServerSupabaseClient()
    const { id } = await params

    const { data: project } = await supabase
        .from("projects")
        .select("*")
        .eq("id", id)
        .single()

    if (!project) {
        notFound()
    }

    return (
        <>
            <Navbar />

            <main
                aria-label="Project Details"
                className="mx-auto min-h-[calc(100vh-120px)] max-w-3xl px-4"
            >
                <Pattern className="h-14" />

                <div className="mb-6">
                    <Link
                        href="/"
                        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Home
                    </Link>
                </div>

                <Box>
                    <BoxHeader>
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                            <div className="space-y-1">
                                <BoxTitle className="text-2xl">{project.title}</BoxTitle>
                                {project.subtitle && (
                                    <div className="text-lg font-medium text-muted-foreground prose prose-lg dark:prose-invert max-w-none">
                                        <ReactMarkdown>{project.subtitle}</ReactMarkdown>
                                    </div>
                                )}
                                {project.description && (
                                    <div className="text-muted-foreground prose dark:prose-invert max-w-none">
                                        <ReactMarkdown>{project.description}</ReactMarkdown>
                                    </div>
                                )}
                            </div>
                            <div className="flex gap-2">
                                {project.github_url && (
                                    <Link
                                        href={project.github_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground transition-colors"
                                    >
                                        <Github className="h-4 w-4" />
                                    </Link>
                                )}
                                {project.link && (
                                    <Link
                                        href={project.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 transition-colors"
                                    >
                                        Visit Site
                                        <ExternalLink className="ml-2 h-4 w-4" />
                                    </Link>
                                )}
                            </div>
                        </div>
                    </BoxHeader>
                    <BoxContent>
                        {project.technologies && project.technologies.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-8">
                                {project.technologies.map((tech: string, index: number) => (
                                    <span
                                        key={index}
                                        className="text-xs px-2.5 py-0.5 rounded-full bg-secondary text-secondary-foreground font-medium"
                                    >
                                        {tech}
                                    </span>
                                ))}
                            </div>
                        )}

                        {project.content ? (
                            <div className="prose dark:prose-invert max-w-none">
                                <ReactMarkdown>{project.content}</ReactMarkdown>
                            </div>
                        ) : (
                            <p className="text-muted-foreground italic">No additional details provided.</p>
                        )}
                    </BoxContent>
                </Box>

                <Pattern />
            </main>

            <Footer />
        </>
    )
}
