import Link from "next/link"
import { Box, BoxContent } from "@/components/box"
import { BadgeCheck, Briefcase, FileText, Twitter, Linkedin, Github } from "lucide-react"
import { createServerSupabaseClient } from "@/lib/supabase/server"

export async function Profile() {
    const supabase = await createServerSupabaseClient()

    // Fetch profile data
    const { data: profile } = await supabase
        .from("profile")
        .select("*")
        .single()

    // Default fallback data if no profile exists yet
    const data = profile || {
        name: "Louai Boumediene",
        role: "Software Engineer / Full-stack Developer",
        bio: "Product-minded software engineer. Building tools for the web, focused on user experience and performance.",
        image_url: null,
        resume_url: "https://drive.google.com/file/d/1c7-UIHy8GUvgj2XHuf7nfhUU4vpjRXSt/view?usp=sharing",
        social_links: [
            { label: "Twitter", url: "https://x.com/Louai_Dourov" },
            { label: "LinkedIn", url: "https://www.linkedin.com/in/louai-boumediene-018919262/" },
            { label: "GitHub", url: "https://github.com/Louai-Zokerburg" },
        ],
        status: {
            label: "Activepieces",
            url: "https://activepieces.com",
            active: true
        }
    }

    const getLink = (label: string) =>
        data.social_links?.find((l: any) => l.label.toLowerCase().includes(label.toLowerCase()))

    const twitter = getLink("twitter")
    const linkedin = getLink("linkedin")
    const github = getLink("github")

    // Placeholder image if no image_url is provided
    const imageUrl = data.image_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(data.name)}&background=random&size=200`

    return (
        <Box>
            <BoxContent className="space-y-10">
                {/* Hero Section */}
                <div className="flex flex-col md:flex-row gap-8 items-start">
                    {/* Image */}
                    <div className="flex-shrink-0">
                        <div className="h-32 w-32 rounded-full overflow-hidden border border-dashed border-muted-foreground/30">
                            <img
                                src={imageUrl}
                                alt={data.name}
                                className="h-full w-full object-cover"
                            />
                        </div>
                    </div>

                    {/* Text Content */}
                    <div className="space-y-2 pt-2">
                        <p className="text-muted-foreground font-mono text-sm">
                            Coding, Creativity, Coffee...
                        </p>
                        <h1 className="text-4xl font-bold flex items-center gap-2 text-foreground">
                            {data.name}
                            <BadgeCheck className="h-6 w-6 text-blue-500 fill-blue-500/10" />
                        </h1>
                        <p className="text-xl text-muted-foreground">
                            {data.role}
                        </p>
                    </div>
                </div>

                {/* Socials & Status List (Vertical) */}
                <div className="flex flex-col gap-3 text-[17px]">
                    {/* Status */}
                    {data.status?.active && (
                        <div className="flex items-center gap-3">
                            <Briefcase className="h-5 w-5 text-muted-foreground" />
                            <span className="text-muted-foreground">I build software at</span>
                            <Link
                                href={data.status.url || "#"}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-foreground border-b border-dashed border-muted-foreground/50 hover:border-foreground transition-colors"
                            >
                                {data.status.label}
                            </Link>
                        </div>
                    )}

                    {/* Resume */}
                    {data.resume_url && (
                        <div className="flex items-center gap-3">
                            <FileText className="h-5 w-5 text-muted-foreground" />
                            <span className="text-muted-foreground">Take a look at my</span>
                            <Link
                                href={data.resume_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-foreground border-b border-dashed border-muted-foreground/50 hover:border-foreground transition-colors"
                            >
                                Resume
                            </Link>
                        </div>
                    )}

                    {/* Twitter */}
                    {twitter && (
                        <div className="flex items-center gap-3">
                            <Twitter className="h-5 w-5 text-muted-foreground" />
                            <span className="text-muted-foreground">Follow me on</span>
                            <Link
                                href={twitter.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-foreground border-b border-dashed border-muted-foreground/50 hover:border-foreground transition-colors"
                            >
                                Twitter
                            </Link>
                        </div>
                    )}

                    {/* LinkedIn */}
                    {linkedin && (
                        <div className="flex items-center gap-3">
                            <Linkedin className="h-5 w-5 text-muted-foreground" />
                            <span className="text-muted-foreground">Let's connect on</span>
                            <Link
                                href={linkedin.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-foreground border-b border-dashed border-muted-foreground/50 hover:border-foreground transition-colors"
                            >
                                LinkedIn
                            </Link>
                        </div>
                    )}

                    {/* GitHub */}
                    {github && (
                        <div className="flex items-center gap-3">
                            <Github className="h-5 w-5 text-muted-foreground" />
                            <span className="text-muted-foreground">Check out my repos on</span>
                            <Link
                                href={github.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-foreground border-b border-dashed border-muted-foreground/50 hover:border-foreground transition-colors"
                            >
                                GitHub
                            </Link>
                        </div>
                    )}
                </div>
            </BoxContent>
        </Box>
    )
}
