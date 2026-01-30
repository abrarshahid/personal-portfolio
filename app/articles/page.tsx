import { createServerSupabaseClient } from "@/lib/supabase/server"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Pattern } from "@/components/pattern"
import { Box, BoxHeader, BoxTitle, BoxContent } from "@/components/box"
import Link from "next/link"
import { Calendar } from "lucide-react"

export const metadata = {
    title: "Articles | Abrar Shahid Rahik",
    description: "Thoughts, tutorials, and insights on software development.",
}

export default async function ArticlesPage() {
    const supabase = await createServerSupabaseClient()

    const { data: articles } = await supabase
        .from("articles")
        .select("*")
        .eq("published", true)
        .order("created_at", { ascending: false })

    return (
        <>
            <Navbar />

            <main
                aria-label="Articles"
                className="mx-auto min-h-[calc(100vh-120px)] max-w-3xl px-4"
            >
                <Pattern className="h-14" />

                <Box>
                    <BoxHeader>
                        <BoxTitle>Articles</BoxTitle>
                    </BoxHeader>
                    <BoxContent>
                        <div className="grid gap-6">
                            {articles?.map((article) => (
                                <Link
                                    key={article.id}
                                    href={`/articles/${article.slug}`}
                                    className="group block"
                                >
                                    <div className="p-4 rounded-lg border border-dashed transition-colors hover:border-foreground/30 hover:bg-accent/50">
                                        <div className="flex flex-col gap-2">
                                            <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">
                                                {article.title}
                                            </h3>

                                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                <Calendar className="h-3 w-3" />
                                                <time dateTime={article.created_at}>
                                                    {new Date(article.created_at).toLocaleDateString("en-US", {
                                                        year: "numeric",
                                                        month: "long",
                                                        day: "numeric",
                                                    })}
                                                </time>
                                            </div>

                                            {article.description && (
                                                <p className="text-muted-foreground line-clamp-2">
                                                    {article.description}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </Link>
                            ))}
                            {(!articles || articles.length === 0) && (
                                <div className="text-center py-12 text-muted-foreground">
                                    No articles found.
                                </div>
                            )}
                        </div>
                    </BoxContent>
                </Box>

                <Pattern />
            </main>

            <Footer />
        </>
    )
}
