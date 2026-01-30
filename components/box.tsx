import { cn } from "@/lib/utils"

interface BoxProps {
    children: React.ReactNode
    className?: string
}

export function Box({ children, className }: BoxProps) {
    return (
        <section className={cn("md:border-x border-dashed border-border", className)}>
            {children}
        </section>
    )
}

interface BoxHeaderProps {
    children: React.ReactNode
    className?: string
}

export function BoxHeader({ children, className }: BoxHeaderProps) {
    return (
        <div className={cn("px-4 py-3 screen-line-after", className)}>
            {children}
        </div>
    )
}

interface BoxTitleProps {
    children: React.ReactNode
    className?: string
}

export function BoxTitle({ children, className }: BoxTitleProps) {
    return (
        <h2 className={cn("text-sm font-semibold uppercase tracking-widest text-muted-foreground", className)}>
            {children}
        </h2>
    )
}

interface BoxContentProps {
    children: React.ReactNode
    className?: string
}

export function BoxContent({ children, className }: BoxContentProps) {
    return (
        <div className={cn("px-4 py-6", className)}>
            {children}
        </div>
    )
}
