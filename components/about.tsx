import { Box, BoxHeader, BoxTitle, BoxContent } from "@/components/box"
import ReactMarkdown from "react-markdown"

interface AboutProps {
  bio?: string
}

const defaultBio = `
I'm an **AI Engineer** and **Olympiad Medalist** passionate about building intelligent systems. With a strong foundation in **algorithms** and **machine learning**, I solve complex problems and create impactful solutions.

Always **learning**, always **iterating**, always pushing boundaries.
`

export function About({ bio }: AboutProps) {
  const content = bio || defaultBio

  return (
    <Box>
      <BoxHeader>
        <BoxTitle>About</BoxTitle>
      </BoxHeader>
      <BoxContent>
        <div className="prose prose-sm dark:prose-invert max-w-none">
          <ReactMarkdown
            components={{
              p: ({ children }) => (
                <p className="text-sm leading-7 font-medium text-foreground">{children}</p>
              ),
              strong: ({ children }) => (
                <strong className="font-bold text-foreground">{children}</strong>
              ),
            }}
          >
            {content.trim()}
          </ReactMarkdown>
        </div>
      </BoxContent>
    </Box>
  )
}
