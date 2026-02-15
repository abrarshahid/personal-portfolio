"use client"

import { useEffect, useState } from "react"
import { Signature } from "@/components/signature"

export function LoadingScreen() {
    const [dismissed, setDismissed] = useState(false)
    const [hidden, setHidden] = useState(false)

    useEffect(() => {
        // Auto-dismiss after splash animation plays
        const timer = setTimeout(() => {
            setDismissed(true)
        }, 2400)

        // Fully remove from DOM after fade-out completes
        const removeTimer = setTimeout(() => {
            setHidden(true)
        }, 3000)

        return () => {
            clearTimeout(timer)
            clearTimeout(removeTimer)
        }
    }, [])

    if (hidden) return null

    return (
        <div
            className={`loading-screen ${dismissed ? "dismissed" : ""}`}
            aria-hidden="true"
        >
            <div className="flex flex-col items-center gap-6">
                <div className="scale-150">
                    <Signature />
                </div>
                <div className="flex gap-1.5 mt-4">
                    <span className="loading-dot w-1.5 h-1.5 rounded-full bg-foreground/60" style={{ animationDelay: "0s" }} />
                    <span className="loading-dot w-1.5 h-1.5 rounded-full bg-foreground/60" style={{ animationDelay: "0.2s" }} />
                    <span className="loading-dot w-1.5 h-1.5 rounded-full bg-foreground/60" style={{ animationDelay: "0.4s" }} />
                </div>
            </div>
        </div>
    )
}
