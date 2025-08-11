// components/MarkdownRenderer.jsx
import React from 'react';
import PropTypes from 'prop-types';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import katex from 'katex';

import CodeBlock from './CodeBlock'; // adjust path if different

// Ensures unclosed ``` blocks don't break the renderer
export const safeForRender = (s = '') => {
  const fenceCount = (s.match(/```/g) || []).length;
  return fenceCount % 2 ? `${s}\n\`\`\`` : s;
};

// Render fenced ```latex / ```tex / ```math blocks with KaTeX (display mode)
const MathBlock = ({ expression }) => {
  const html = katex.renderToString(String(expression || '').trim(), {
    throwOnError: false,
    displayMode: true,
  });
  return (
    <div
      className="my-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

MathBlock.propTypes = {
  expression: PropTypes.string,
};

export default function MarkdownRenderer({ text, className }) {
  return (
    <div className={className}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={{
          code({ inline, className, children, ...props }) {
            const raw = String(children || '');
            const match = /language-(\w+)/.exec(className || '');
            const lang = match?.[1];

            // Treat fenced ```latex/tex/math as math, not code
            if (!inline && ['latex', 'tex', 'math'].includes(lang)) {
              return <MathBlock expression={raw} />;
            }

            if (inline) {
              return (
                <code className="px-1 py-0.5 rounded bg-gray-200 font-mono text-[0.85em]">
                  {raw}
                </code>
              );
            }

            // Regular fenced code blocks -> SyntaxHighlighter
            return <CodeBlock language={lang} value={raw} />;
          },
          p({ children }) {
            return <p className="leading-7 text-zinc-800">{children}</p>;
          },
          table({ children }) {
            return (
              <div className="overflow-x-auto">
                <table className="w-full">{children}</table>
              </div>
            );
          },
        }}
      >
        {safeForRender(text)}
      </ReactMarkdown>
    </div>
  );
}

MarkdownRenderer.propTypes = {
  text: PropTypes.string,
  className: PropTypes.string,
};
