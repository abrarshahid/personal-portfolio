"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Moon, Sun, Menu, X } from "lucide-react"
import { useEffect, useState } from "react"
import { Signature } from "@/components/signature"

const navLinks = [
    { href: "/", label: "Home" },
    { href: "/projects", label: "Projects" },
    { href: "/articles", label: "Articles" },
]

export function Navbar() {
    const pathname = usePathname()
    const [isDark, setIsDark] = useState(true)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    useEffect(() => {
        // Check initial theme
        const isDarkMode = document.documentElement.classList.contains("dark")
        setIsDark(isDarkMode)
    }, [])

    const toggleTheme = () => {
        const newIsDark = !isDark
        setIsDark(newIsDark)

        if (newIsDark) {
            document.documentElement.classList.add("dark")
            localStorage.setItem("theme", "dark")
        } else {
            document.documentElement.classList.remove("dark")
            localStorage.setItem("theme", "light")
        }
    }

    return (
        <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm">
            <div className="mx-auto max-w-3xl px-4">
                <div className="flex h-14 items-center justify-between screen-line-after">

                    {/* Logo */}
                    <Link href="/" className="text-lg font-semibold tracking-tight">
                        <Signature />
                    </Link>

                    {/* Desktop Nav Links */}
                    <div className="hidden md:flex items-center gap-6">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={cn(
                                    "text-sm font-medium transition-colors hover:text-foreground",
                                    pathname === link.href
                                        ? "text-foreground"
                                        : "text-muted-foreground"
                                )}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* Theme Toggle & Mobile Menu */}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-md hover:bg-accent transition-colors"
                            aria-label="Toggle theme"
                        >
                            {isDark ? (
                                <Sun className="h-5 w-5" />
                            ) : (
                                <Moon className="h-5 w-5" />
                            )}
                        </button>

                        {/* Mobile Menu Toggle */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="p-2 rounded-md hover:bg-accent transition-colors md:hidden"
                            aria-label="Toggle menu"
                        >
                            {mobileMenuOpen ? (
                                <X className="h-5 w-5" />
                            ) : (
                                <Menu className="h-5 w-5" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden py-4 space-y-2 screen-line-after">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setMobileMenuOpen(false)}
                                className={cn(
                                    "block py-2 text-sm font-medium transition-colors",
                                    pathname === link.href
                                        ? "text-foreground"
                                        : "text-muted-foreground"
                                )}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </nav>
    )
}
