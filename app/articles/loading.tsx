import { Navbar } from "@/components/navbar"
import { Pattern } from "@/components/pattern"
import { Box, BoxHeader, BoxTitle, BoxContent } from "@/components/box"

export default function ArticlesLoading() {
    return (
        <>
            <Navbar />
            <main
                aria-label="Loading articles"
                className="mx-auto min-h-[calc(100vh-120px)] max-w-3xl px-4"
            >
                <Pattern className="h-14" />

                <Box>
                    <BoxHeader>
                        <BoxTitle>Articles</BoxTitle>
                    </BoxHeader>
                    <BoxContent>
                        <div className="grid gap-6">
                            {[1, 2, 3].map((i) => (
                                <div
                                    key={i}
                                    className="p-4 rounded-lg border border-dashed space-y-3"
                                >
                                    <div className="skeleton-line w-3/4 h-6" />
                                    <div className="skeleton-line w-1/4 h-3" />
                                    <div className="skeleton-line w-full" />
                                    <div className="skeleton-line w-2/3" />
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
