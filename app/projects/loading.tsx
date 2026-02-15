import { Navbar } from "@/components/navbar"
import { Pattern } from "@/components/pattern"
import { Box, BoxHeader, BoxTitle, BoxContent } from "@/components/box"

export default function ProjectsLoading() {
    return (
        <>
            <Navbar />
            <main
                aria-label="Loading projects"
                className="mx-auto min-h-[calc(100vh-120px)] max-w-3xl px-4"
            >
                <Pattern className="h-14" />

                <Box>
                    <BoxHeader>
                        <BoxTitle>All Projects</BoxTitle>
                    </BoxHeader>
                    <BoxContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {[1, 2, 3, 4].map((i) => (
                                <div
                                    key={i}
                                    className="rounded-lg border border-dashed p-4 space-y-3"
                                >
                                    <div className="skeleton-line w-3/4 h-5" />
                                    <div className="skeleton-line w-full" />
                                    <div className="skeleton-line w-2/3" />
                                    <div className="flex gap-1.5 pt-2">
                                        <div className="skeleton-line w-12 h-5 rounded" />
                                        <div className="skeleton-line w-16 h-5 rounded" />
                                        <div className="skeleton-line w-10 h-5 rounded" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </BoxContent>
                </Box>

                <Pattern />
            </main>
        </>
    )
}
