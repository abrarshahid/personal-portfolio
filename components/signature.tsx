"use client"

import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"

const letters: Record<string, (props: React.SVGProps<SVGPathElement>) => React.ReactNode> = {
    'A': (props) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 46 51" height="51" width="46"><path d="M14.9987 32.0003C20.8769 23.2406 40.7942 1.02295 44.6176 1.58265C48.4411 2.14235 25.4397 26.0685 19.6688 50.0398C28.2839 11.7157 5.83642 32.6888 1.46688 33.1804C4.63512 27.4831 32.8719 20.946 44.7496 24.6628" {...props}></path></svg>,
    'b': (props) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 51" height="51" width="17"><path d="M15.9206 5.40527L2.07203 28.8782C1.02375 28.8035 6.74541 22.7468 8.7643 23.9805C10.5595 25.4012 1.88642 33.589 1.17541 32.0187C0.464395 30.4485 9.73655 25.9621 13.9253 24.7283" {...props}></path></svg>,
    'r': (props) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 13 51" height="51" width="13"><path d="M4.04688 23.3381L1.02539 30.1005C7.1047 22.5828 11.8527 19.8132 11.2412 24.1654" {...props}></path></svg>,
    'a': (props) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 13 51" height="51" width="13"><path d="M5.99958 25C5.73591 21.1582 1.99899 25.5 1.49941 28C1.00013 30.5 7.65454 23.3545 7.65454 23.3545C3.5802 27.3691 3.29278 30.5313 4.09638 30.7478C5.08629 31.0263 12.2012 24.7466 12.2012 24.7466" {...props}></path></svg>,
    'S': (props) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 46 51" height="51" width="46"><path d="M44.435 9.39728C49.435 -5.10286 -4.56457 25.3972 1.43476 32.8973C6.23411 38.8972 25.0605 38.3972 24.4355 40.8972C23.8105 43.3972 10.9355 44.8972 7.93479 42.8973" {...props}></path></svg>,
    'h': (props) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 51" height="51" width="18"><path d="M14.75 6.08472C8.75724 15.6124 5.74081 20.6113 1.16797 28.7222C2.27051 26.7174 7.40879 23.7648 9.19185 23.8223C10.4381 23.8798 8.46919 26.815 9.75037 27.5733C11.2054 28.4346 16.3726 24.6677 16.3726 24.6677" {...props}></path></svg>,
    'i': (props) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 9 51" height="51" width="9"><path d="M3.7548 22.9229C2.60207 23.529 -0.752212 29.5295 1.61166 28.7618C3.97553 27.994 5.61205 25.8726 7.67374 24.721" {...props}></path></svg>,
    'd': (props) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 51" height="51" width="20"><path d="M6.08732 26.1229C8.23611 18.5681 -0.331592 27.5316 1.908 28.6301C7.01852 28.6767 10.2741 20.6086 19.1923 6.23315C9.56633 22.4841 2.35848 34.2032 2.35848 34.2032" {...props}></path></svg>
}

export function Signature() {
    const name = "Abrar Shahid"
    const [key, setKey] = useState(0)

    // Re-trigger animation on mount to ensure it plays
    useEffect(() => {
        setKey(prev => prev + 1)
    }, [])

    return (
        <div key={key} className="flex items-center flex-wrap justify-start min-h-[10px] scale-75 origin-left">
            {name.split("").map((char, index) => {
                if (char === " ") {
                    return <div key={index} className="min-w-[12px]" />
                }

                const isAfterA = index > 0 && name[index - 1] === 'A'
                const isAfterS = index > 0 && name[index - 1] === 'S'
                const LetterComponent = letters[char]

                if (!LetterComponent) return null

                return (
                    <div
                        key={index}
                        className={cn(
                            "mx-[-2px]",
                            isAfterA && "-ml-[8px]",
                            isAfterS && "-ml-[12px]"
                        )}
                    >
                        <LetterComponent
                            className="stroke-[hsl(var(--foreground))] stroke-[1.5] stroke-round fill-none"
                            style={{
                                strokeDasharray: "1000px",
                                strokeDashoffset: "1000px",
                                animation: "sign 3s ease forwards",
                                animationDelay: `${index * 0.15}s`,
                            }}
                        />
                    </div>
                )
            })}
        </div>
    )
}
