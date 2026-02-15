import { Navbar } from "@/components/navbar"
import { Pattern } from "@/components/pattern"

export default function Loading() {
    return (
        <>
            <Navbar />
            <main
                aria-label="Loading"
                className="mx-auto min-h-[calc(100vh-120px)] max-w-3xl px-4"
            >
                <Pattern className="h-14" />

                <div className="space-y-8 py-4">
                    {/* Profile skeleton */}
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full skeleton-line shrink-0" />
                        <div className="space-y-2 flex-1">
                            <div className="skeleton-line w-1/3 h-5" />
                            <div className="skeleton-line w-1/2 h-4" />
                        </div>
                    </div>

                    <Pattern />

                    {/* About skeleton */}
                    <div className="space-y-3">
                        <div className="skeleton-line w-20 h-5" />
                        <div className="skeleton-line w-full" />
                        <div className="skeleton-line w-4/5" />
                        <div className="skeleton-line w-3/5" />
                    </div>

                    <Pattern />

                    {/* Experience skeleton */}
                    <div className="space-y-3">
                        <div className="skeleton-line w-32 h-5" />
                        <div className="space-y-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="space-y-2 p-4 rounded-lg border border-dashed">
                                    <div className="skeleton-line w-2/3 h-4" />
                                    <div className="skeleton-line w-1/3 h-3" />
                                    <div className="skeleton-line w-full" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </>
    )
}
