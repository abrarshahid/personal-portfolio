import { cn } from "@/lib/utils"

interface PatternProps {
    className?: string
}

export function Pattern({ className }: PatternProps) {
    return (
        <div
            className={cn(
                "h-8 w-full screen-line-after",
                className
            )}
        />
    )
}
