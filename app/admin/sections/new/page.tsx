"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

const sectionTypes = [
  { value: "experience", label: "Experience Timeline" },
  { value: "horizontal_cards", label: "Horizontal Cards (Projects)" },
  { value: "vertical_cards", label: "Vertical Cards (Grid)" },
  { value: "tags", label: "Tags (Tech Stack)" },
  { value: "markdown", label: "Markdown Text" },
]

export default function NewSectionPage() {
  const [title, setTitle] = useState("")
  const [type, setType] = useState("")
  const [content, setContent] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !type) {
      setError("Please fill in all required fields")
      return
    }

    setLoading(true)
    setError(null)

    // Get the max order_index
    const { data: sections } = await supabase
      .from("sections")
      .select("order_index")
      .order("order_index", { ascending: false })
      .limit(1)

    const newOrderIndex = sections && sections.length > 0 ? sections[0].order_index + 1 : 0

    const { error: insertError } = await supabase.from("sections").insert({
      title,
      type,
      content: type === "markdown" ? content : null,
      is_visible: true,
      order_index: newOrderIndex,
    })

    if (insertError) {
      setError(insertError.message)
      setLoading(false)
    } else {
      router.push("/admin/dashboard")
    }
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <Link href="/admin/dashboard" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Dashboard
      </Link>

      <Card>
        <CardHeader>
          <CardTitle>Create New Section</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Section Title *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Experience, Tech Stack, Projects"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Section Type *</Label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a section type" />
                </SelectTrigger>
                <SelectContent>
                  {sectionTypes.map((t) => (
                    <SelectItem key={t.value} value={t.value}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                {type === "experience" && "Display work experience with company, role, and period"}
                {type === "horizontal_cards" && "Show items in a horizontal layout with thumbnails"}
                {type === "vertical_cards" && "Display items in a 2-column grid with images"}
                {type === "tags" && "Show a collection of clickable tag pills"}
                {type === "markdown" && "Rich text content with markdown formatting"}
              </p>
            </div>

            {type === "markdown" && (
              <div className="space-y-2">
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Enter markdown content..."
                  rows={6}
                />
              </div>
            )}

            {error && <p className="text-sm text-destructive">{error}</p>}

            <div className="flex gap-4">
              <Button type="submit" disabled={loading}>
                {loading ? "Creating..." : "Create Section"}
              </Button>
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
