"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Plus, Trash2, ArrowLeft, Pencil } from "lucide-react"
import Link from "next/link"

export default function AdminExperiencePage() {
    const [experience, setExperience] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const router = useRouter()
    const supabase = createClient()

    useEffect(() => {
        loadExperience()
    }, [])

    const loadExperience = async () => {
        const { data } = await supabase
            .from("experience")
            .select("*, sections(title)")
            .order("created_at", { ascending: false })

        if (data) setExperience(data)
        setLoading(false)
    }

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this experience?")) return
        const { error } = await supabase.from("experience").delete().eq("id", id)
        if (!error) loadExperience()
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
                    <h1 className="text-3xl font-bold">Manage Experience</h1>
                </div>
                <Link href="/admin/experience/new">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" /> Add Experience
                    </Button>
                </Link>
            </div>

            <div className="grid gap-4">
                {experience.map((item) => (
                    <div key={item.id} className="p-4 bg-card border rounded-lg shadow-sm flex justify-between items-center">
                        <div>
                            <h2 className="text-lg font-semibold">{item.role} at {item.company}</h2>
                            <p className="text-sm text-muted-foreground">
                                Section: {item.sections?.title || "Unknown"} | {item.period}
                            </p>
                        </div>

                        <div className="flex items-center gap-2">
                            <Link href={`/admin/experience/${item.id}`}>
                                <Button variant="ghost" size="icon">
                                    <Pencil className="h-4 w-4" />
                                </Button>
                            </Link>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="text-destructive hover:text-destructive"
                                onClick={() => handleDelete(item.id)}
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                ))}
                {experience.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground border border-dashed rounded-lg">
                        No experience items found.
                    </div>
                )}
            </div>
        </div>
    )
}
