// Copy Page Button Component
// Copy this file to: src/features/docs/copy-page-button.tsx
// Dependencies: lucide-react, sonner (for toast notifications)

import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface CopyPageButtonProps {
  content?: string;
}

export function CopyPageButton({ content }: CopyPageButtonProps) {
  const [hasCopied, setHasCopied] = useState(false);

  /**
   * Extracts markdown content from rendered HTML
   * Converts DOM elements back to semantic markdown format
   *
   * Handles:
   * - Headings (h1-h6)
   * - Code blocks (pre/code)
   * - Inline code
   * - Paragraphs
   * - Lists (ul, ol)
   * - Blockquotes
   * - Links
   * - Tables
   */
  const extractMarkdownContent = (element: HTMLElement): string => {
    const lines: string[] = [];
    let inCodeBlock = false;

    const processNode = (node: Node, depth = 0): void => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        const el = node as HTMLElement;
        const tagName = el.tagName.toLowerCase();

        // Skip buttons and interactive elements
        if (["button", "svg"].includes(tagName)) {
          return;
        }

        // Handle headings - convert back to markdown with # symbols
        if (tagName.match(/^h[1-6]$/)) {
          const level = parseInt(tagName[1]);
          const prefix = "#".repeat(level);
          const text = el.textContent?.trim();
          if (text) {
            lines.push(`\n${prefix} ${text}\n`);
          }
          return;
        }

        // Handle code blocks (pre + code)
        if (tagName === "pre") {
          const codeEl = el.querySelector("code");
          const code = (codeEl || el).textContent?.trim();
          if (code && !inCodeBlock) {
            inCodeBlock = true;
            lines.push("\n```");
            lines.push(code);
            lines.push("```\n");
            inCodeBlock = false;
          }
          return;
        }

        // Handle inline code
        if (tagName === "code" && el.parentElement?.tagName !== "PRE") {
          const text = el.textContent?.trim();
          if (text) {
            lines.push(`\`${text}\``);
          }
          return;
        }

        // Handle paragraphs
        if (tagName === "p") {
          const text = el.textContent?.trim();
          if (text) {
            lines.push(`\n${text}\n`);
          }
          return;
        }

        // Handle lists
        if (tagName === "ul" || tagName === "ol") {
          lines.push("");
          el.childNodes.forEach((child) => processNode(child, depth));
          lines.push("");
          return;
        }

        // Handle list items
        if (tagName === "li") {
          const text = el.textContent?.trim();
          if (text) {
            const indent = "  ".repeat(depth);
            const marker = el.parentElement?.tagName === "OL" ? "1." : "-";
            lines.push(`${indent}${marker} ${text}`);
          }
          return;
        }

        // Handle blockquotes
        if (tagName === "blockquote") {
          const text = el.textContent?.trim();
          if (text) {
            lines.push(`\n> ${text}\n`);
          }
          return;
        }

        // Handle links
        if (tagName === "a") {
          const text = el.textContent?.trim();
          const href = el.getAttribute("href");
          if (text && href) {
            lines.push(`[${text}](${href})`);
          }
          return;
        }

        // Handle tables
        if (tagName === "table") {
          lines.push("\n");
          el.childNodes.forEach((child) => processNode(child, depth));
          lines.push("\n");
          return;
        }

        // For other elements, process children recursively
        el.childNodes.forEach((child) => processNode(child, depth));
      } else if (node.nodeType === Node.TEXT_NODE && !inCodeBlock) {
        const text = node.textContent?.trim();
        if (text) {
          lines.push(text);
        }
      }
    };

    processNode(element);

    // Clean up the output
    return lines
      .join("\n")
      .replace(/\n{3,}/g, "\n\n") // Remove excessive newlines
      .replace(/\n\s+\n/g, "\n\n") // Remove whitespace between newlines
      .trim();
  };

  const handleCopy = async () => {
    try {
      let textToCopy = content;

      // If no content provided, extract from the page DOM
      if (!textToCopy) {
        // Look for element with data-docs-content attribute
        // This should wrap your entire documentation content
        const contentContainer = document.querySelector("[data-docs-content]");

        if (contentContainer instanceof HTMLElement) {
          textToCopy = extractMarkdownContent(contentContainer);
        } else {
          throw new Error("Could not find content to copy");
        }
      }

      if (!textToCopy) {
        throw new Error("No content to copy");
      }

      // Copy to clipboard
      await navigator.clipboard.writeText(textToCopy);

      // Show feedback
      setHasCopied(true);
      toast.success("Page content copied to clipboard");

      // Reset icon after delay
      setTimeout(() => setHasCopied(false), 2000);
    } catch (error) {
      console.error("Copy failed:", error);
      toast.error("Failed to copy content");
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleCopy}
      className="gap-2 w-fit"
      title="Copy page content as markdown"
    >
      {hasCopied ? (
        <Check className="size-4" />
      ) : (
        <Copy className="size-4" />
      )}
      <span className="hidden sm:block">
        {hasCopied ? "Copied" : "Copy page"}
      </span>
    </Button>
  );
}
