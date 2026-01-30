"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Plus, Trash2, Save } from "lucide-react"
import Link from "next/link"
import { Switch } from "@/components/ui/switch"

export default function ProfileSettingsPage() {
    const [profile, setProfile] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const router = useRouter()
    const supabase = createClient()

    useEffect(() => {
        loadProfile()
    }, [])

    const loadProfile = async () => {
        setLoading(true)
        const { data } = await supabase.from("profile").select("*").single()

        if (data) {
            setProfile(data)
        } else {
            // Initialize with empty structure if no profile exists
            setProfile({
                name: "",
                role: "",
                bio: "",
                image_url: "",
                resume_url: "",
                social_links: [],
                status: { label: "", url: "", active: false }
            })
        }
        setLoading(false)
    }

    const handleSave = async () => {
        setSaving(true)

        // Check if profile exists to decide between insert and update
        const { data: existing } = await supabase.from("profile").select("id").single()

        let error
        if (existing) {
            const { error: updateError } = await supabase
                .from("profile")
                .update({
                    name: profile.name,
                    role: profile.role,
                    bio: profile.bio,
                    image_url: profile.image_url,
                    resume_url: profile.resume_url,
                    social_links: profile.social_links,
                    status: profile.status,
                    updated_at: new Date().toISOString()
                })
                .eq("id", existing.id)
            error = updateError
        } else {
            const { error: insertError } = await supabase
                .from("profile")
                .insert(profile)
            error = insertError
        }

        if (error) {
            alert("Error saving profile: " + error.message)
        } else {
            alert("Profile saved successfully!")
            loadProfile()
        }
        setSaving(false)
    }

    const addSocialLink = () => {
        setProfile({
            ...profile,
            social_links: [...(profile.social_links || []), { label: "", url: "" }]
        })
    }

    const updateSocialLink = (index: number, field: string, value: string) => {
        const newLinks = [...profile.social_links]
        newLinks[index] = { ...newLinks[index], [field]: value }
        setProfile({ ...profile, social_links: newLinks })
    }

    const removeSocialLink = (index: number) => {
        const newLinks = [...profile.social_links]
        newLinks.splice(index, 1)
        setProfile({ ...profile, social_links: newLinks })
    }

    if (loading) return <div className="p-8">Loading...</div>

    return (
        <div className="p-8 max-w-4xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
                <Link href="/admin/dashboard" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Dashboard
                </Link>
                <Button onClick={handleSave} disabled={saving}>
                    {saving ? "Saving..." : "Save Changes"}
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Profile Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Name</Label>
                            <Input
                                value={profile.name || ""}
                                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Role</Label>
                            <Input
                                value={profile.role || ""}
                                onChange={(e) => setProfile({ ...profile, role: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Bio</Label>
                        <Textarea
                            value={profile.bio || ""}
                            onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                            rows={3}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Profile Image URL</Label>
                            <Input
                                value={profile.image_url || ""}
                                onChange={(e) => setProfile({ ...profile, image_url: e.target.value })}
                                placeholder="https://..."
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Resume URL</Label>
                            <Input
                                value={profile.resume_url || ""}
                                onChange={(e) => setProfile({ ...profile, resume_url: e.target.value })}
                                placeholder="https://..."
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Current Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center gap-4 mb-4">
                        <Switch
                            checked={profile.status?.active}
                            onCheckedChange={(checked) => setProfile({ ...profile, status: { ...profile.status, active: checked } })}
                        />
                        <Label>Show Status Badge</Label>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Label</Label>
                            <Input
                                value={profile.status?.label || ""}
                                onChange={(e) => setProfile({ ...profile, status: { ...profile.status, label: e.target.value } })}
                                placeholder="e.g. Activepieces"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>URL</Label>
                            <Input
                                value={profile.status?.url || ""}
                                onChange={(e) => setProfile({ ...profile, status: { ...profile.status, url: e.target.value } })}
                                placeholder="https://..."
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Social Links</CardTitle>
                    <Button size="sm" onClick={addSocialLink} variant="outline">
                        <Plus className="mr-2 h-4 w-4" /> Add Link
                    </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                    {profile.social_links?.map((link: any, index: number) => (
                        <div key={index} className="flex gap-4 items-end">
                            <div className="space-y-2 flex-1">
                                <Label>Label</Label>
                                <Input
                                    value={link.label}
                                    onChange={(e) => updateSocialLink(index, "label", e.target.value)}
                                    placeholder="e.g. Twitter"
                                />
                            </div>
                            <div className="space-y-2 flex-[2]">
                                <Label>URL</Label>
                                <Input
                                    value={link.url}
                                    onChange={(e) => updateSocialLink(index, "url", e.target.value)}
                                    placeholder="https://..."
                                />
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="text-destructive hover:text-destructive mb-0.5"
                                onClick={() => removeSocialLink(index)}
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                    {(!profile.social_links || profile.social_links.length === 0) && (
                        <p className="text-muted-foreground text-sm">No social links added.</p>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
