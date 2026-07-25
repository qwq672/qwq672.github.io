import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";

/** Markdown renderer with the same GFM + line-break settings as the main site. */
export function MarkdownView({ content }: { content: string }) {
  return (
    <div className="prose-warm">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkBreaks]}
        components={{
          a: ({ node: _node, ...props }) => (
            <a target="_blank" rel="noopener noreferrer" {...props} />
          ),
          img: ({ node: _node, alt, ...props }) => (
            <img alt={alt ?? ""} loading="lazy" {...props} />
          ),
          // Wrap tables in a horizontal scroll container so wide tables
          // don't blow out the page width on mobile.
          table: ({ node: _node, ...props }) => (
            <div className="overflow-x-auto">
              <table {...props} />
            </div>
          ),
          pre: ({ node: _node, ...props }) => (
            <div className="overflow-x-auto">
              <pre {...props} />
            </div>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
