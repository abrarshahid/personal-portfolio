"use client"

import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Plus, Trash2, ExternalLink, Eye, EyeOff, GripVertical, ArrowUp, ArrowDown } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { Switch } from "@/components/ui/switch"

export default function AdminDashboard() {
  const [sections, setSections] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    checkUser()
    loadSections()
  }, [])

  const checkUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) router.push("/admin/login")
  }

  const loadSections = async () => {
    const { data } = await supabase.from("sections").select("*").order("order_index", { ascending: true })
    if (data) setSections(data)
    setLoading(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this section?")) return
    const { error } = await supabase.from("sections").delete().eq("id", id)
    if (!error) loadSections()
  }

  const handleToggleVisibility = async (id: string, currentVisibility: boolean) => {
    const { error } = await supabase
      .from("sections")
      .update({ is_visible: !currentVisibility })
      .eq("id", id)

    if (!error) {
      setSections(sections.map(s => s.id === id ? { ...s, is_visible: !currentVisibility } : s))
    }
  }

  const handleMove = async (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return
    if (direction === 'down' && index === sections.length - 1) return

    const newSections = [...sections]
    const targetIndex = direction === 'up' ? index - 1 : index + 1

    const currentSection = newSections[index]
    const targetSection = newSections[targetIndex]

    // Swap order_index
    const tempOrder = currentSection.order_index
    currentSection.order_index = targetSection.order_index
    targetSection.order_index = tempOrder

    // Optimistic update
    // Swap positions in array
    newSections[index] = targetSection
    newSections[targetIndex] = currentSection
    setSections(newSections)

    // Update in DB
    await supabase.from("sections").update({ order_index: currentSection.order_index }).eq("id", currentSection.id)
    await supabase.from("sections").update({ order_index: targetSection.order_index }).eq("id", targetSection.id)
  }

  if (loading) return <div className="p-8">Loading...</div>

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Portfolio Content</h1>
        <div className="flex gap-4">
          <Link href="/" target="_blank">
            <Button variant="outline">
              <ExternalLink className="mr-2 h-4 w-4" /> View Site
            </Button>
          </Link>
          <Link href="/admin/profile">
            <Button variant="secondary">
              Profile Settings
            </Button>
          </Link>
          <Link href="/admin/messages">
            <Button variant="secondary">
              Messages
            </Button>
          </Link>
          <Link href="/admin/projects">
            <Button variant="secondary">
              Manage Projects
            </Button>
          </Link>
          <Link href="/admin/experience">
            <Button variant="secondary">
              Manage Experience
            </Button>
          </Link>
          <Link href="/admin/articles">
            <Button variant="secondary">
              Manage Articles
            </Button>
          </Link>
          <Link href="/admin/sections/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add Section
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-4">
        {sections.map((section, index) => (
          <div key={section.id} className="p-4 bg-card border rounded-lg shadow-sm flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="flex flex-col gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  disabled={index === 0}
                  onClick={() => handleMove(index, 'up')}
                >
                  <ArrowUp className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  disabled={index === sections.length - 1}
                  onClick={() => handleMove(index, 'down')}
                >
                  <ArrowDown className="h-4 w-4" />
                </Button>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-semibold">{section.title}</h2>
                  {!section.is_visible && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">Hidden</span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground capitalize">{section.type.replace("_", " ")}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 mr-4">
                <Switch
                  checked={section.is_visible}
                  onCheckedChange={() => handleToggleVisibility(section.id, section.is_visible)}
                />
                <span className="text-sm text-muted-foreground w-12">
                  {section.is_visible ? "Visible" : "Hidden"}
                </span>
              </div>

              <Link href={`/admin/sections/${section.id}`}>
                <Button variant="outline" size="sm">Edit Content</Button>
              </Link>

              <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => handleDelete(section.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
        {sections.length === 0 && (
          <div className="text-center py-12 text-muted-foreground border border-dashed rounded-lg">
            No sections created yet. Start by adding a new one.
          </div>
        )}
      </div>
    </div>
  )
}
