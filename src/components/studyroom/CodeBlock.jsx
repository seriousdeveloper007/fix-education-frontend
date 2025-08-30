// components/CodeBlock.jsx
import { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';

export default function CodeBlock({ language, value }) {
  const [copied, setCopied] = useState(false);

  const onCopy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  return (
    <figure className="my-3"> {/* spacing from surrounding text */}
      <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-zinc-200 px-3 py-1.5 text-xs text-zinc-600">
          <span className="font-mono">{language || 'text'}</span>
          <button
            onClick={onCopy}
            className="rounded px-2 py-0.5 hover:bg-zinc-100"
            aria-label="Copy code"
          >
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
        <div className="overflow-auto">
          <SyntaxHighlighter
            language={language}
            style={oneLight}                 // <-- light theme
            customStyle={{ margin: 0, background: 'transparent' }}
            wrapLongLines
          >
            {value}
          </SyntaxHighlighter>
        </div>
      </div>
    </figure>
  );
}
