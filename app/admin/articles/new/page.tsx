"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"
import { Box, BoxContent } from "@/components/box"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

export default function ArticleEditorPage() {
    const params = useParams()
    const isNew = !params.id
    const router = useRouter()
    const supabase = createClient()

    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        title: "",
        slug: "",
        description: "",
        image_url: "",
        content: "",
        published: false,
    })

    useEffect(() => {
        if (!isNew) {
            loadArticle()
        }
    }, [])

    const loadArticle = async () => {
        const { data } = await supabase
            .from("articles")
            .select("*")
            .eq("id", params.id)
            .single()

        if (data) {
            setFormData({
                title: data.title,
                slug: data.slug,
                description: data.description || "",
                image_url: data.image_url || "",
                content: data.content || "",
                published: data.published,
            })
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        const articleData = {
            title: formData.title,
            slug: formData.slug,
            description: formData.description,
            image_url: formData.image_url,
            content: formData.content,
            published: formData.published,
        }

        if (isNew) {
            await supabase.from("articles").insert(articleData)
        } else {
            await supabase.from("articles").update(articleData).eq("id", params.id)
        }

        setLoading(false)
        router.push("/admin/articles")
    }

    // Auto-generate slug from title if slug is empty
    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const title = e.target.value
        if (isNew && !formData.slug) {
            const slug = title
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/(^-|-$)+/g, "")
            setFormData({ ...formData, title, slug })
        } else {
            setFormData({ ...formData, title })
        }
    }

    return (
        <div className="p-8 max-w-4xl mx-auto space-y-8">
            <div className="flex items-center gap-4">
                <Link href="/admin/articles">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <h1 className="text-3xl font-bold">{isNew ? "New Article" : "Edit Article"}</h1>
            </div>

            <Box>
                <BoxContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label>Title</Label>
                                <Input
                                    value={formData.title}
                                    onChange={handleTitleChange}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Slug</Label>
                                <Input
                                    value={formData.slug}
                                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Description (Short Summary)</Label>
                            <Textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                rows={3}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Image URL (Optional)</Label>
                            <Input
                                value={formData.image_url}
                                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                                placeholder="https://..."
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Content (Markdown)</Label>
                            <Textarea
                                value={formData.content}
                                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                rows={15}
                                className="font-mono text-sm"
                                placeholder="# Article Title\n\nWrite your article content here..."
                            />
                        </div>

                        <div className="flex items-center gap-2">
                            <Switch
                                checked={formData.published}
                                onCheckedChange={(checked) => setFormData({ ...formData, published: checked })}
                            />
                            <Label>Published</Label>
                        </div>

                        <Button type="submit" disabled={loading} className="w-full">
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {isNew ? "Create Article" : "Update Article"}
                        </Button>
                    </form>
                </BoxContent>
            </Box>
        </div>
    )
}
