"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Plus, Trash2, ArrowLeft, Pencil } from "lucide-react"
import Link from "next/link"
import { Box, BoxHeader, BoxTitle, BoxContent } from "@/components/box"

export default function AdminProjectsPage() {
    const [projects, setProjects] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const router = useRouter()
    const supabase = createClient()

    useEffect(() => {
        loadProjects()
    }, [])

    const loadProjects = async () => {
        const { data } = await supabase
            .from("projects")
            .select("*, sections(title)")
            .order("created_at", { ascending: false })

        if (data) setProjects(data)
        setLoading(false)
    }

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this project?")) return
        const { error } = await supabase.from("projects").delete().eq("id", id)
        if (!error) loadProjects()
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
                    <h1 className="text-3xl font-bold">Manage Projects</h1>
                </div>
                <Link href="/admin/projects/new">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" /> Add Project
                    </Button>
                </Link>
            </div>

            <div className="grid gap-4">
                {projects.map((project) => (
                    <div key={project.id} className="p-4 bg-card border rounded-lg shadow-sm flex justify-between items-center">
                        <div>
                            <h2 className="text-lg font-semibold">{project.title}</h2>
                            <p className="text-sm text-muted-foreground">
                                Section: {project.sections?.title || "Unknown"}
                            </p>
                            {project.description && (
                                <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                                    {project.description}
                                </p>
                            )}
                        </div>

                        <div className="flex items-center gap-2">
                            <Link href={`/admin/projects/${project.id}`}>
                                <Button variant="ghost" size="icon">
                                    <Pencil className="h-4 w-4" />
                                </Button>
                            </Link>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="text-destructive hover:text-destructive"
                                onClick={() => handleDelete(project.id)}
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                ))}
                {projects.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground border border-dashed rounded-lg">
                        No projects found.
                    </div>
                )}
            </div>
        </div>
    )
}
