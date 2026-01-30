"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Plus, Trash2, ArrowLeft, Pencil } from "lucide-react"
import Link from "next/link"

export default function AdminArticlesPage() {
    const [articles, setArticles] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const router = useRouter()
    const supabase = createClient()

    useEffect(() => {
        loadArticles()
    }, [])

    const loadArticles = async () => {
        const { data } = await supabase
            .from("articles")
            .select("*")
            .order("created_at", { ascending: false })

        if (data) setArticles(data)
        setLoading(false)
    }

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this article?")) return
        const { error } = await supabase.from("articles").delete().eq("id", id)
        if (!error) loadArticles()
    }

    if (loading) return <div className="p-8">Loading...</div>

    return (
        <div className="p-8 max-w-6xl mx-auto space-y-8">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <Link href="/admin/dashboard">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <h1 className="text-3xl font-bold">Manage Articles</h1>
                </div>
                <Link href="/admin/articles/new">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" /> Add Article
                    </Button>
                </Link>
            </div>

            <div className="grid gap-4">
                {articles.map((article) => (
                    <div key={article.id} className="p-4 bg-card border rounded-lg shadow-sm flex justify-between items-center">
                        <div>
                            <div className="flex items-center gap-2">
                                <h2 className="text-lg font-semibold">{article.title}</h2>
                                {!article.published && (
                                    <span className="text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground">Draft</span>
                                )}
                            </div>
                            <p className="text-sm text-muted-foreground">
                                Slug: {article.slug}
                            </p>
                        </div>

                        <div className="flex items-center gap-2">
                            <Link href={`/admin/articles/${article.id}`}>
                                <Button variant="ghost" size="icon">
                                    <Pencil className="h-4 w-4" />
                                </Button>
                            </Link>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="text-destructive hover:text-destructive"
                                onClick={() => handleDelete(article.id)}
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                ))}
                {articles.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground border border-dashed rounded-lg">
                        No articles found.
                    </div>
                )}
            </div>
        </div>
    )
}
