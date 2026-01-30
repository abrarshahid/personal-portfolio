import { Box, BoxHeader, BoxTitle, BoxContent } from "@/components/box"
import { ExternalLink, Github } from "lucide-react"
import Link from "next/link"
import ReactMarkdown from "react-markdown"

interface ProjectItem {
    id: string
    title: string
    subtitle?: string
    description?: string
    content?: string
    link?: string
    github_url?: string
    technologies?: string[]
}

interface StaticProjectsSectionProps {
    items: ProjectItem[]
}

export function StaticProjectsSection({ items }: StaticProjectsSectionProps) {
    if (!items || items.length === 0) return null

    return (
        <Box>
            <BoxHeader>
                <BoxTitle>Projects</BoxTitle>
            </BoxHeader>
            <BoxContent>
                <div className="grid grid-cols-1 gap-6">
                    {items.map((project) => (
                        <div
                            key={project.id}
                            className="group relative flex flex-col rounded-lg border border-dashed p-5 transition-colors hover:border-foreground/30 hover:bg-accent/50"
                        >
                            <div className="space-y-3 flex-1 flex flex-col">
                                <div className="flex items-start justify-between gap-2">
                                    <h3 className="font-semibold text-lg text-foreground">
                                        <Link
                                            href={`/projects/${project.id}`}
                                            className="inline-flex items-center gap-1.5 hover:underline decoration-dashed underline-offset-4 before:absolute before:inset-0"
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
                                            <Github className="h-5 w-5" />
                                        </Link>
                                    )}
                                </div>

                                {project.subtitle && (
                                    <div className="text-sm text-muted-foreground leading-relaxed font-medium prose prose-sm dark:prose-invert max-w-none">
                                        <ReactMarkdown>{project.subtitle}</ReactMarkdown>
                                    </div>
                                )}

                                {project.description && !project.subtitle && (
                                    <div className="text-sm text-muted-foreground leading-relaxed prose prose-sm dark:prose-invert max-w-none">
                                        <ReactMarkdown>{project.description}</ReactMarkdown>
                                    </div>
                                )}

                                {project.content && (
                                    <div className="prose dark:prose-invert max-w-none text-sm text-muted-foreground mt-2">
                                        <ReactMarkdown>{project.content}</ReactMarkdown>
                                    </div>
                                )}

                                {project.technologies && project.technologies.length > 0 && (
                                    <div className="flex flex-wrap gap-1.5 pt-2 mt-auto">
                                        {project.technologies.map((tech, index) => (
                                            <span
                                                key={index}
                                                className="text-xs px-2 py-0.5 rounded bg-secondary text-secondary-foreground border border-transparent hover:border-border transition-colors"
                                            >
                                                {tech}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </BoxContent>
        </Box>
    )
}
