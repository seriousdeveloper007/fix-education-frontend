import React from 'react';
import PropTypes from 'prop-types';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import katex from 'katex';

import CodeBlock from './studyroom/CodeBlock';

// Pre-process text to fix common formatting issues
const preprocessMarkdown = (text = '') => {
  let processed = text.replace(/```text\n([^`]+?)\n```/g, '$1');
  processed = processed.replace(/^text$/gm, '');
  processed = processed.replace(/\n{3,}/g, '\n\n');
  const fenceCount = (processed.match(/```/g) || []).length;
  if (fenceCount % 2) {
    processed = `${processed}\n\`\`\``;
  }
  return processed;
};

const MathBlock = ({ expression }) => {
  const html = katex.renderToString(String(expression || '').trim(), {
    throwOnError: false,
    displayMode: true,
  });
  return (
    <div
      className="my-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 overflow-x-auto max-w-full"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

MathBlock.propTypes = {
  expression: PropTypes.string,
};

// Helper function to check if children contain block-level elements
const hasBlockLevelChildren = (children) => {
  if (!children) return false;
  
  const checkChild = (child) => {
    if (React.isValidElement(child)) {
      const type = child.type;
      // Check for block-level element types
      if (typeof type === 'string') {
        return ['div', 'pre', 'blockquote', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 
                'ul', 'ol', 'li', 'table', 'thead', 'tbody', 'tr', 'th', 'td'].includes(type);
      }
      // Check for custom components that might render block elements
      return type === CodeBlock || type === MathBlock;
    }
    return false;
  };

  if (Array.isArray(children)) {
    return children.some(checkChild);
  }
  
  return checkChild(children);
};

export default function MarkdownRenderer({ text, className }) {
  const processedText = preprocessMarkdown(text);
  
  return (
    <div className={`${className} max-w-full overflow-hidden`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={{
          code({ inline, className, children, ...props }) {
            const raw = String(children || '');
            const match = /language-(\w+)/.exec(className || '');
            const lang = match?.[1];

            // Skip rendering empty or 'text' language blocks
            if (!inline && lang === 'text' && raw.trim().length < 50) {
              return <p className="leading-7 text-zinc-800">{raw}</p>;
            }

            // Treat fenced latex/tex/math as math, not code
            if (!inline && ['latex', 'tex', 'math'].includes(lang)) {
              return <MathBlock expression={raw} />;
            }

            if (inline) {
              return (
                <code className="py-0.5 rounded bg-gray-200 font-mono text-[0.85em]">
                  {raw}
                </code>
              );
            }

            // Regular fenced code blocks -> CodeBlock
            return <CodeBlock language={lang || 'python'} value={raw} />;
          },
          p({ children }) {
            // Filter out empty paragraphs
            if (!children || (typeof children === 'string' && !children.trim())) {
              return null;
            }
            
            // Check if children contain block-level elements
            if (hasBlockLevelChildren(children)) {
              // Use a div instead of p to avoid nesting violations
              return <div className="leading-7 text-zinc-800 mb-4">{children}</div>;
            }
            
            return <p className="leading-7 text-zinc-800 mb-4">{children}</p>;
          },
          h3({ children }) {
            return <h3 className="text-lg font-semibold mb-3 mt-4">{children}</h3>;
          },
          table({ children }) {
            return (
              <div className="overflow-x-auto my-4">
                <table className="w-full">{children}</table>
              </div>
            );
          },
        }}
      >
        {processedText}
      </ReactMarkdown>
    </div>
  );
}

MarkdownRenderer.propTypes = {
  text: PropTypes.string,
  className: PropTypes.string,
};
