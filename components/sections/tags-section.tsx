import { createServerSupabaseClient } from "@/lib/supabase/server"
import { Box, BoxHeader, BoxTitle, BoxContent } from "@/components/box"
import Link from "next/link"

interface Section {
    id: string
    title: string
    type: string
}

interface Tag {
    id: string
    name: string
    icon?: string
    url?: string
}

export async function TagsSection({ section }: { section: Section }) {
    const supabase = await createServerSupabaseClient()

    const { data: tags } = await supabase
        .from("tags")
        .select("*")
        .eq("section_id", section.id)
        .order("order_index", { ascending: true })

    if (!tags || tags.length === 0) return null

    return (
        <Box>
            <BoxHeader>
                <BoxTitle>{section.title}</BoxTitle>
            </BoxHeader>
            <BoxContent>
                <div className="flex flex-wrap gap-2">
                    {tags.map((tag: Tag) => (
                        tag.url ? (
                            <Link
                                key={tag.id}
                                href={tag.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 rounded-md border border-dashed px-3 py-1.5 text-sm font-medium transition-colors hover:bg-accent"
                            >
                                {tag.name}
                            </Link>
                        ) : (
                            <span
                                key={tag.id}
                                className="inline-flex items-center gap-1.5 rounded-md border border-dashed px-3 py-1.5 text-sm font-medium"
                            >
                                {tag.name}
                            </span>
                        )
                    ))}
                </div>
            </BoxContent>
        </Box>
    )
}
