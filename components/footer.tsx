import Link from "next/link"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { Github, Twitter, Linkedin, Instagram, Mail, Globe } from "lucide-react"

export async function Footer() {
    const supabase = await createServerSupabaseClient()

    const { data: profile } = await supabase
        .from("profile")
        .select("social_links")
        .single()

    const socialLinks = profile?.social_links || []

    const getIcon = (label: string) => {
        const lowerLabel = label.toLowerCase()
        if (lowerLabel.includes("github")) return <Github className="h-5 w-5" />
        if (lowerLabel.includes("twitter") || lowerLabel.includes("x")) return <Twitter className="h-5 w-5" />
        if (lowerLabel.includes("linkedin")) return <Linkedin className="h-5 w-5" />
        if (lowerLabel.includes("instagram")) return <Instagram className="h-5 w-5" />
        if (lowerLabel.includes("mail") || lowerLabel.includes("email")) return <Mail className="h-5 w-5" />
        return <Globe className="h-5 w-5" />
    }

    return (
        <footer className="py-8 screen-line-before">
            <div className="mx-auto max-w-3xl px-4 flex flex-col md:flex-row items-center justify-between gap-4">
                <p className="text-center text-sm text-muted-foreground order-2 md:order-1">
                    &copy; {new Date().getFullYear()} Abrar Shahid Rahik. All rights reserved.
                </p>

                <div className="flex items-center gap-4 order-1 md:order-2">
                    {socialLinks.map((link: any) => (
                        <Link
                            key={link.label}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted-foreground hover:text-foreground transition-colors"
                            aria-label={link.label}
                        >
                            {getIcon(link.label)}
                        </Link>
                    ))}
                </div>
            </div>
        </footer>
    )
}
