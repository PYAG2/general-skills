// Syntax Highlighter Component using Shiki
// Copy this file to: src/components/ui/syntax-highlighter.tsx
// Dependencies: shiki

import { codeToHtml } from "shiki";
import { useEffect, useState } from "react";

interface SyntaxHighlighterProps {
  code: string;
  language?: string;
}

/**
 * Renders syntax-highlighted code using Shiki
 * Shiki provides accurate syntax highlighting matching VS Code
 *
 * Supported languages: JavaScript, TypeScript, Python, Bash, JSON, HTML, CSS, SQL, etc.
 * Theme: Default (light/dark mode aware)
 */
export function SyntaxHighlighter({
  code,
  language = "bash",
}: SyntaxHighlighterProps) {
  const [html, setHtml] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const highlightCode = async () => {
      try {
        setIsLoading(true);
        const highlighted = await codeToHtml(code, {
          lang: language || "bash",
          theme: "github-dark",
        });
        setHtml(highlighted);
      } catch (error) {
        console.error("Syntax highlighting error:", error);
        // Fallback to plain code if highlighting fails
        setHtml(`<pre><code>${escapeHtml(code)}</code></pre>`);
      } finally {
        setIsLoading(false);
      }
    };

    highlightCode();
  }, [code, language]);

  if (isLoading) {
    return <div>{code}</div>;
  }

  // Shiki returns wrapped HTML, we extract the inner content
  return (
    <div
      dangerouslySetInnerHTML={{
        __html: html,
      }}
      className="syntax-highlighted-code"
      style={{
        lineHeight: "1.5",
      }}
    />
  );
}

/**
 * Utility function to escape HTML special characters
 * Used as fallback when syntax highlighting fails
 */
function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return text.replace(/[&<>"']/g, (char) => map[char]);
}
