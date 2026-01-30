"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Plus, Trash2, GripVertical, Save } from "lucide-react"
import Link from "next/link"
import { Switch } from "@/components/ui/switch"

export default function EditSectionPage() {
  const params = useParams()
  const id = params.id as string
  const [section, setSection] = useState<any>(null)
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  // Form states for new item
  const [newItemOpen, setNewItemOpen] = useState(false)
  const [newItem, setNewItem] = useState<any>({})

  useEffect(() => {
    loadData()
  }, [id])

  const loadData = async () => {
    setLoading(true)
    // Load section details
    const { data: sectionData } = await supabase
      .from("sections")
      .select("*")
      .eq("id", id)
      .single()

    if (sectionData) {
      setSection(sectionData)

      // Load items based on type
      let tableName = ""
      if (sectionData.type === "experience") tableName = "experience"
      else if (sectionData.type === "tags") tableName = "tags"
      else if (["horizontal_cards", "vertical_cards"].includes(sectionData.type)) tableName = "projects"

      if (tableName) {
        const { data: itemsData } = await supabase
          .from(tableName)
          .select("*")
          .eq("section_id", id)
          .order("order_index", { ascending: true })

        setItems(itemsData || [])
      }
    }
    setLoading(false)
  }

  const handleUpdateSection = async () => {
    setSaving(true)
    await supabase
      .from("sections")
      .update({
        title: section.title,
        content: section.content,
        is_visible: section.is_visible
      })
      .eq("id", id)
    setSaving(false)
  }

  const handleDeleteItem = async (itemId: string, tableName: string) => {
    if (!confirm("Delete this item?")) return
    await supabase.from(tableName).delete().eq("id", itemId)
    loadData()
  }

  const handleAddItem = async () => {
    let tableName = ""
    if (section.type === "experience") tableName = "experience"
    else if (section.type === "tags") tableName = "tags"
    else if (["horizontal_cards", "vertical_cards"].includes(section.type)) tableName = "projects"

    if (!tableName) return

    // Get max order
    const maxOrder = items.length > 0 ? Math.max(...items.map(i => i.order_index)) : -1

    const itemToInsert = {
      ...newItem,
      section_id: id,
      order_index: maxOrder + 1,
      // Handle array fields if any (technologies)
      technologies: newItem.technologies ? newItem.technologies.split(",").map((t: string) => t.trim()) : undefined
    }

    const { error } = await supabase.from(tableName).insert(itemToInsert)

    if (!error) {
      setNewItem({})
      setNewItemOpen(false)
      loadData()
    } else {
      alert("Error adding item: " + error.message)
    }
  }

  if (loading) return <div className="p-8">Loading...</div>
  if (!section) return <div className="p-8">Section not found</div>

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <Link href="/admin/dashboard" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Link>
        <Button onClick={handleUpdateSection} disabled={saving}>
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Section Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input
                value={section.title}
                onChange={(e) => setSection({ ...section, title: e.target.value })}
              />
            </div>
            <div className="space-y-2 flex flex-col justify-end pb-2">
              <div className="flex items-center gap-2">
                <Switch
                  checked={section.is_visible}
                  onCheckedChange={(checked) => setSection({ ...section, is_visible: checked })}
                />
                <Label>Visible on site</Label>
              </div>
            </div>
          </div>

          {section.type === "markdown" && (
            <div className="space-y-2">
              <Label>Content (Markdown)</Label>
              <Textarea
                value={section.content || ""}
                onChange={(e) => setSection({ ...section, content: e.target.value })}
                rows={10}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {section.type !== "markdown" && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Content Items</CardTitle>
            <Button size="sm" onClick={() => setNewItemOpen(true)} disabled={newItemOpen}>
              <Plus className="mr-2 h-4 w-4" /> Add Item
            </Button>
          </CardHeader>
          <CardContent>
            {newItemOpen && (
              <div className="mb-6 p-4 border border-dashed rounded-lg bg-accent/20 space-y-4">
                <h3 className="font-medium">New Item</h3>

                {section.type === "tags" && (
                  <div className="grid gap-4">
                    <Input
                      placeholder="Tag Name"
                      value={newItem.name || ""}
                      onChange={e => setNewItem({ ...newItem, name: e.target.value })}
                    />
                    <Input
                      placeholder="URL (optional)"
                      value={newItem.url || ""}
                      onChange={e => setNewItem({ ...newItem, url: e.target.value })}
                    />
                  </div>
                )}

                {section.type === "experience" && (
                  <div className="grid gap-4">
                    <Input
                      placeholder="Company"
                      value={newItem.company || ""}
                      onChange={e => setNewItem({ ...newItem, company: e.target.value })}
                    />
                    <Input
                      placeholder="Role"
                      value={newItem.role || ""}
                      onChange={e => setNewItem({ ...newItem, role: e.target.value })}
                    />
                    <Input
                      placeholder="Period (e.g. 2023 - Present)"
                      value={newItem.period || ""}
                      onChange={e => setNewItem({ ...newItem, period: e.target.value })}
                    />
                    <Input
                      placeholder="Company URL (optional)"
                      value={newItem.company_url || ""}
                      onChange={e => setNewItem({ ...newItem, company_url: e.target.value })}
                    />
                    <Textarea
                      placeholder="Description"
                      value={newItem.description || ""}
                      onChange={e => setNewItem({ ...newItem, description: e.target.value })}
                    />
                    <Input
                      placeholder="Technologies (comma separated)"
                      value={newItem.technologies || ""}
                      onChange={e => setNewItem({ ...newItem, technologies: e.target.value })}
                    />
                  </div>
                )}

                {["horizontal_cards", "vertical_cards"].includes(section.type) && (
                  <div className="grid gap-4">
                    <Input
                      placeholder="Title"
                      value={newItem.title || ""}
                      onChange={e => setNewItem({ ...newItem, title: e.target.value })}
                    />
                    <Textarea
                      placeholder="Description"
                      value={newItem.description || ""}
                      onChange={e => setNewItem({ ...newItem, description: e.target.value })}
                    />
                    <Input
                      placeholder="Image URL"
                      value={newItem.image_url || ""}
                      onChange={e => setNewItem({ ...newItem, image_url: e.target.value })}
                    />
                    <Input
                      placeholder="Link URL"
                      value={newItem.link || ""}
                      onChange={e => setNewItem({ ...newItem, link: e.target.value })}
                    />
                    <Input
                      placeholder="GitHub URL"
                      value={newItem.github_url || ""}
                      onChange={e => setNewItem({ ...newItem, github_url: e.target.value })}
                    />
                    <Input
                      placeholder="Technologies (comma separated)"
                      value={newItem.technologies || ""}
                      onChange={e => setNewItem({ ...newItem, technologies: e.target.value })}
                    />
                  </div>
                )}

                <div className="flex gap-2">
                  <Button size="sm" onClick={handleAddItem}>Save Item</Button>
                  <Button size="sm" variant="ghost" onClick={() => setNewItemOpen(false)}>Cancel</Button>
                </div>
              </div>
            )}

            <div className="space-y-2">
              {items.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 border rounded-md bg-card">
                  <div className="flex items-center gap-3">
                    <GripVertical className="h-4 w-4 text-muted-foreground cursor-move" />
                    <div>
                      <p className="font-medium">
                        {item.title || item.name || item.company || "Untitled"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {item.role || item.description?.substring(0, 50)}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:text-destructive"
                    onClick={() => handleDeleteItem(item.id, section.type === "experience" ? "experience" : section.type === "tags" ? "tags" : "projects")}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              {items.length === 0 && !newItemOpen && (
                <p className="text-center text-muted-foreground py-4">No items yet.</p>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
