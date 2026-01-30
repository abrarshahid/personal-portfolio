import { Box, BoxHeader, BoxTitle, BoxContent } from "@/components/box"
import { Briefcase } from "lucide-react"
import Link from "next/link"

interface ExperienceItem {
    id: string
    company: string
    role: string
    period: string
    description?: string
    company_url?: string
    technologies?: string[]
}

interface StaticExperienceSectionProps {
    items: ExperienceItem[]
}

export function StaticExperienceSection({ items }: StaticExperienceSectionProps) {
    if (!items || items.length === 0) return null

    return (
        <Box>
            <BoxHeader>
                <BoxTitle>Experience</BoxTitle>
            </BoxHeader>
            <BoxContent>
                <div className="relative border-l border-dashed border-muted-foreground/30 ml-3 space-y-8 py-2">
                    {items.map((item) => (
                        <div key={item.id} className="relative pl-8">
                            <div className="absolute -left-[5px] top-2 h-2.5 w-2.5 rounded-full border border-muted-foreground bg-background" />

                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-4 mb-2">
                                <h3 className="font-semibold text-lg text-foreground">
                                    {item.role}
                                    <span className="text-muted-foreground font-normal"> at </span>
                                    {item.company_url ? (
                                        <Link
                                            href={item.company_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-foreground hover:underline decoration-dashed underline-offset-4"
                                        >
                                            {item.company}
                                        </Link>
                                    ) : (
                                        <span className="text-foreground">{item.company}</span>
                                    )}
                                </h3>
                                <span className="text-sm text-muted-foreground font-mono whitespace-nowrap bg-secondary/50 px-2 py-0.5 rounded">
                                    {item.period}
                                </span>
                            </div>

                            {item.description && (
                                <p className="text-muted-foreground mb-3 text-sm leading-relaxed">
                                    {item.description}
                                </p>
                            )}

                            {item.technologies && item.technologies.length > 0 && (
                                <div className="flex flex-wrap gap-1.5">
                                    {item.technologies.map((tech, i) => (
                                        <span
                                            key={i}
                                            className="text-xs px-2 py-0.5 rounded bg-secondary text-secondary-foreground border border-transparent hover:border-border transition-colors"
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
