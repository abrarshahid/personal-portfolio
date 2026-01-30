"use client"

import { useState } from "react"
import { Box, BoxHeader, BoxTitle, BoxContent } from "@/components/box"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { submitContactForm } from "@/app/actions"
import { Loader2 } from "lucide-react"

export function Contact() {
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const form = e.currentTarget
        setLoading(true)
        setError(null)
        setSuccess(false)

        const formData = new FormData(form)
        const result = await submitContactForm(formData)

        if (result.error) {
            setError(result.error)
        } else {
            setSuccess(true)
            form.reset()
        }
        setLoading(false)
    }

    return (
        <Box>
            <BoxHeader>
                <BoxTitle>Get in Touch</BoxTitle>
            </BoxHeader>
            <BoxContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Input name="name" placeholder="Name" required className="bg-background" />
                        </div>
                        <div className="space-y-2">
                            <Input name="email" type="email" placeholder="Email" required className="bg-background" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Input name="subject" placeholder="Subject" required className="bg-background" />
                    </div>
                    <div className="space-y-2">
                        <Textarea name="message" placeholder="Message" required rows={5} className="bg-background" />
                    </div>

                    {error && <p className="text-sm text-destructive">{error}</p>}
                    {success && <p className="text-sm text-green-500">Message sent successfully!</p>}

                    <Button type="submit" disabled={loading} className="w-full md:w-auto">
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Send Message
                    </Button>
                </form>
            </BoxContent>
        </Box>
    )
}
