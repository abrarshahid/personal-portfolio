"use client"

import { usePathname, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

export function NavigationLoader() {
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const [isNavigating, setIsNavigating] = useState(false)

    useEffect(() => {
        setIsNavigating(false)
    }, [pathname, searchParams])

    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            const target = (e.target as Element).closest('a')
            if (!target) return

            const href = target.getAttribute('href')
            if (!href) return

            // Check if it's an external link or modifier click
            if (
                target.target === '_blank' ||
                e.ctrlKey ||
                e.metaKey ||
                e.altKey ||
                e.shiftKey
            ) {
                return
            }

            // Check if it's a valid local link
            if (href.startsWith('/') || href.startsWith(window.location.origin)) {
                // Don't trigger if clicking current path
                if (href === window.location.pathname) return

                setIsNavigating(true)
            }
        }

        document.addEventListener('click', handleClick)
        return () => document.removeEventListener('click', handleClick)
    }, [])

    if (!isNavigating) return null

    return (
        <div className="fixed inset-0 z-[60] pointer-events-none">
            {/* Top Progress Bar */}
            <div className="h-[3px] w-full bg-background">
                <div className="h-full bg-foreground animate-progress-indeterminate origin-left" />
            </div>

            {/* Content Dimmer */}
            <div className="absolute inset-0 bg-background/20 backdrop-blur-[1px] animate-fade-in" />
        </div>
    )
}
