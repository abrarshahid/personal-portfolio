import { createServerSupabaseClient } from "@/lib/supabase/server"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Pattern } from "@/components/pattern"
import { Box, BoxHeader, BoxTitle, BoxContent } from "@/components/box"
import Link from "next/link"
import { ArrowLeft, Calendar } from "lucide-react"
import { notFound } from "next/navigation"
import ReactMarkdown from "react-markdown"
import { Button } from "@/components/ui/button"

interface PageProps {
    params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps) {
    const { slug } = await params
    const supabase = await createServerSupabaseClient()
    const { data: article } = await supabase
        .from("articles")
        .select("title, description")
        .eq("slug", slug)
        .single()

    if (!article) {
        return {
            title: "Article Not Found",
        }
    }

    return {
        title: `${article.title} | Abrar Shahid Rahik`,
        description: article.description,
    }
}

export default async function ArticlePage({ params }: PageProps) {
    const { slug } = await params
    const supabase = await createServerSupabaseClient()

    const { data: article } = await supabase
        .from("articles")
        .select("*")
        .eq("slug", slug)
        .eq("published", true)
        .single()

    if (!article) {
        notFound()
    }

    return (
        <>
            <Navbar />

            <main
                aria-label="Article"
                className="mx-auto min-h-[calc(100vh-120px)] max-w-3xl px-4"
            >
                <Pattern className="h-14" />

                <div className="mb-8">
                    <Link href="/articles">
                        <Button variant="ghost" size="sm" className="-ml-2 text-muted-foreground">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Articles
                        </Button>
                    </Link>
                </div>

                <Box>
                    <BoxHeader>
                        <div className="space-y-4">
                            <BoxTitle className="text-3xl md:text-4xl leading-tight">
                                {article.title}
                            </BoxTitle>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Calendar className="h-4 w-4" />
                                <time dateTime={article.created_at}>
                                    {new Date(article.created_at).toLocaleDateString("en-US", {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                    })}
                                </time>
                            </div>
                        </div>
                    </BoxHeader>
                    <BoxContent>
                        <article className="prose prose-zinc dark:prose-invert max-w-none">
                            {article.image_url && (
                                <img
                                    src={article.image_url}
                                    alt={article.title}
                                    className="rounded-lg w-full aspect-video object-cover mb-8"
                                />
                            )}
                            <ReactMarkdown>{article.content}</ReactMarkdown>
                        </article>
                    </BoxContent>
                </Box>

                <Pattern />
            </main>

            <Footer />
        </>
    )
}
