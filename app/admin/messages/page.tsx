"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Trash2, Mail } from "lucide-react"
import Link from "next/link"

export default function MessagesPage() {
    const [messages, setMessages] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const router = useRouter()
    const supabase = createClient()

    useEffect(() => {
        loadMessages()
    }, [])

    const loadMessages = async () => {
        setLoading(true)
        const { data } = await supabase
            .from("messages")
            .select("*")
            .order("created_at", { ascending: false })

        if (data) setMessages(data)
        setLoading(false)
    }

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this message?")) return
        const { error } = await supabase.from("messages").delete().eq("id", id)
        if (!error) loadMessages()
    }

    const handleMarkRead = async (id: string, currentStatus: boolean) => {
        const { error } = await supabase
            .from("messages")
            .update({ read: !currentStatus })
            .eq("id", id)
        if (!error) loadMessages()
    }

    if (loading) return <div className="p-8">Loading...</div>

    return (
        <div className="p-8 max-w-4xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
                <Link href="/admin/dashboard" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Dashboard
                </Link>
                <h1 className="text-2xl font-bold">Messages</h1>
            </div>

            <div className="space-y-4">
                {messages.map((msg) => (
                    <Card key={msg.id} className={msg.read ? "opacity-60" : ""}>
                        <CardHeader className="flex flex-row items-start justify-between pb-2">
                            <div className="space-y-1">
                                <CardTitle className="text-base font-medium">
                                    {msg.subject}
                                </CardTitle>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <span className="font-semibold text-foreground">{msg.name}</span>
                                    <span>&lt;{msg.email}&gt;</span>
                                    <span>•</span>
                                    <span>{new Date(msg.created_at).toLocaleDateString()}</span>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleMarkRead(msg.id, msg.read)}
                                >
                                    {msg.read ? "Mark Unread" : "Mark Read"}
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-destructive hover:text-destructive"
                                    onClick={() => handleDelete(msg.id)}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                        </CardContent>
                    </Card>
                ))}
                {messages.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground border border-dashed rounded-lg">
                        No messages yet.
                    </div>
                )}
            </div>
        </div>
    )
}
