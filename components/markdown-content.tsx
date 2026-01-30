import ReactMarkdown from "react-markdown"

export function MarkdownContent({ content }: { content: string }) {
  return (
    <div className="text-[#FAFAFA] leading-relaxed opacity-90">
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  )
}
