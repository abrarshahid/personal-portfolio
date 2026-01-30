import { Box, BoxHeader, BoxTitle, BoxContent } from "@/components/box"
import ReactMarkdown from "react-markdown"

interface Section {
    id: string
    title: string
    type: string
    content?: string
}

export async function MarkdownSection({ section }: { section: Section }) {
    if (!section.content) return null

    return (
        <Box>
            <BoxHeader>
                <BoxTitle>{section.title}</BoxTitle>
            </BoxHeader>
            <BoxContent>
                <div className="prose prose-sm dark:prose-invert max-w-none">
                    <ReactMarkdown
                        components={{
                            p: ({ children }) => (
                                <p className="text-sm leading-7 font-medium text-foreground mb-4 last:mb-0">{children}</p>
                            ),
                            strong: ({ children }) => (
                                <strong className="font-bold text-foreground">{children}</strong>
                            ),
                            a: ({ href, children }) => (
                                <a
                                    href={href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-foreground underline hover:no-underline"
                                >
                                    {children}
                                </a>
                            ),
                            ul: ({ children }) => (
                                <ul className="list-disc list-inside space-y-1 text-sm text-foreground">{children}</ul>
                            ),
                            li: ({ children }) => (
                                <li className="text-sm text-foreground">{children}</li>
                            ),
                        }}
                    >
                        {section.content}
                    </ReactMarkdown>
                </div>
            </BoxContent>
        </Box>
    )
}
