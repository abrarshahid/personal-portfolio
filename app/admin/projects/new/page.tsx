"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"
import { Box, BoxHeader, BoxTitle, BoxContent } from "@/components/box"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function ProjectEditorPage() {
    const params = useParams()
    const isNew = !params.id
    const router = useRouter()
    const supabase = createClient()

    const [loading, setLoading] = useState(false)
    const [sections, setSections] = useState<any[]>([])
    const [formData, setFormData] = useState({
        title: "",
        subtitle: "",
        description: "",
        link: "",
        github_url: "",
        technologies: "",
        section_id: "",
        content: "",
    })

    useEffect(() => {
        loadSections()
        if (!isNew) {
            loadProject()
        }
    }, [])

    const loadSections = async () => {
        // Only load sections that support projects (cards)
        const { data } = await supabase
            .from("sections")
            .select("*")
            .in("type", ["horizontal_cards", "vertical_cards"])
            .order("order_index")

        if (data) setSections(data)
    }

    const loadProject = async () => {
        const { data } = await supabase
            .from("projects")
            .select("*")
            .eq("id", params.id)
            .single()

        if (data) {
            setFormData({
                title: data.title,
                subtitle: data.subtitle || "",
                description: data.description || "",
                link: data.link || "",
                github_url: data.github_url || "",
                technologies: data.technologies?.join(", ") || "",
                section_id: data.section_id,
                content: data.content || "",
            })
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        const projectData = {
            title: formData.title,
            subtitle: formData.subtitle,
            description: formData.description,
            link: formData.link,
            github_url: formData.github_url,
            technologies: formData.technologies.split(",").map(t => t.trim()).filter(Boolean),
            section_id: formData.section_id,
            content: formData.content,
        }

        if (isNew) {
            await supabase.from("projects").insert(projectData)
        } else {
            await supabase.from("projects").update(projectData).eq("id", params.id)
        }

        setLoading(false)
        router.push("/admin/projects")
    }

    return (
        <div className="p-8 max-w-2xl mx-auto space-y-8">
            <div className="flex items-center gap-4">
                <Link href="/admin/projects">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <h1 className="text-3xl font-bold">{isNew ? "New Project" : "Edit Project"}</h1>
            </div>

            <Box>
                <BoxContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label>Section</Label>
                            <Select
                                value={formData.section_id}
                                onValueChange={(val) => setFormData({ ...formData, section_id: val })}
                                required
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a section" />
                                </SelectTrigger>
                                <SelectContent>
                                    {sections.map((s) => (
                                        <SelectItem key={s.id} value={s.id}>
                                            {s.title} ({s.type.replace("_", " ")})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Title</Label>
                            <Input
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Subtitle (Short Description)</Label>
                            <Input
                                value={formData.subtitle}
                                onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                                placeholder="e.g., A Next.js Portfolio Template"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Description (Full Summary)</Label>
                            <Textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                rows={3}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Project Link</Label>
                                <Input
                                    value={formData.link}
                                    onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                                    placeholder="https://..."
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>GitHub URL</Label>
                                <Input
                                    value={formData.github_url}
                                    onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
                                    placeholder="https://github.com/..."
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Technologies (comma separated)</Label>
                            <Input
                                value={formData.technologies}
                                onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
                                placeholder="React, Next.js, Supabase"
                            />
                        </div>

                        <Button type="submit" disabled={loading} className="w-full">
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {isNew ? "Create Project" : "Update Project"}
                        </Button>
                    </form>
                </BoxContent>
            </Box>
        </div>
    )
}
