"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";

export function MarkdownView({ content }: { content: string }) {
  return (
    <div className="prose-warm">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkBreaks]}
        components={{
          a: ({ node, ...props }) => (
            <a target="_blank" rel="noopener noreferrer" {...props} />
          ),
          img: ({ node, alt, ...props }) => (
            <img alt={alt ?? ""} loading="lazy" {...props} />
          ),
          // Wrap tables in a horizontal scroll container so wide tables
          // don't blow out the page width on mobile.
          table: ({ node, ...props }) => (
            <div className="overflow-x-auto">
              <table {...props} />
            </div>
          ),
          // Same for code blocks.
          pre: ({ node, ...props }) => (
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
