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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function ExperienceEditorPage() {
    const params = useParams()
    const isNew = !params.id
    const router = useRouter()
    const supabase = createClient()

    const [loading, setLoading] = useState(false)
    const [sections, setSections] = useState<any[]>([])
    const [formData, setFormData] = useState({
        company: "",
        role: "",
        period: "",
        description: "",
        company_url: "",
        technologies: "",
        section_id: "",
    })

    useEffect(() => {
        loadSections()
        if (!isNew) {
            loadExperience()
        }
    }, [])

    const loadSections = async () => {
        // Only load sections that support experience
        const { data } = await supabase
            .from("sections")
            .select("*")
            .eq("type", "experience")
            .order("order_index")

        if (data) setSections(data)
    }

    const loadExperience = async () => {
        const { data } = await supabase
            .from("experience")
            .select("*")
            .eq("id", params.id)
            .single()

        if (data) {
            setFormData({
                company: data.company,
                role: data.role,
                period: data.period,
                description: data.description || "",
                company_url: data.company_url || "",
                technologies: data.technologies?.join(", ") || "",
                section_id: data.section_id,
            })
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        const experienceData = {
            company: formData.company,
            role: formData.role,
            period: formData.period,
            description: formData.description,
            company_url: formData.company_url,
            technologies: formData.technologies.split(",").map(t => t.trim()).filter(Boolean),
            section_id: formData.section_id,
        }

        if (isNew) {
            await supabase.from("experience").insert(experienceData)
        } else {
            await supabase.from("experience").update(experienceData).eq("id", params.id)
        }

        setLoading(false)
        router.push("/admin/experience")
    }

    return (
        <div className="p-8 max-w-2xl mx-auto space-y-8">
            <div className="flex items-center gap-4">
                <Link href="/admin/experience">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <h1 className="text-3xl font-bold">{isNew ? "New Experience" : "Edit Experience"}</h1>
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
                                            {s.title}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Company</Label>
                                <Input
                                    value={formData.company}
                                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Role</Label>
                                <Input
                                    value={formData.role}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Period</Label>
                                <Input
                                    value={formData.period}
                                    onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                                    placeholder="2023 - Present"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Company URL</Label>
                                <Input
                                    value={formData.company_url}
                                    onChange={(e) => setFormData({ ...formData, company_url: e.target.value })}
                                    placeholder="https://..."
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Description</Label>
                            <Textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                rows={3}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Technologies (comma separated)</Label>
                            <Input
                                value={formData.technologies}
                                onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
                                placeholder="React, TypeScript, Node.js"
                            />
                        </div>

                        <Button type="submit" disabled={loading} className="w-full">
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {isNew ? "Create Experience" : "Update Experience"}
                        </Button>
                    </form>
                </BoxContent>
            </Box>
        </div>
    )
}
