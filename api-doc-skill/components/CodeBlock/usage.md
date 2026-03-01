# CodeBlock Component Guide

Professional syntax-highlighted code display with tabbed multi-language support and copy-to-clipboard functionality.

## Overview

The CodeBlock component renders code with:
- Syntax highlighting (using Shiki)
- Tab support for multiple languages
- Copy button with animation feedback
- Horizontal scroll for overflow code
- Dark mode support
- Responsive design

## Installation

### Dependencies

```bash
npm install motion/react shiki lucide-react
```

### Files to Create

1. **CodeBlock.tsx** - Main component (copy to `src/components/ui/code-block.tsx`)
2. **SyntaxHighlighter.tsx** - Helper for syntax highlighting using Shiki (copy to `src/components/ui/syntax-highlighter.tsx`)

## Basic Usage

### Single Code Block

```jsx
<CodeBlock
  code={`function hello() {\n  console.log("Hello")\n}`}
  language="javascript"
/>
```

### Multiple Languages (Tabs)

```jsx
<CodeBlock
  tabs={[
    {
      label: "cURL",
      code: `curl -X GET http://api.example.com/data`,
      language: "bash"
    },
    {
      label: "JavaScript",
      code: `const data = await fetch('http://api.example.com/data')`,
      language: "javascript"
    },
    {
      label: "Python",
      code: `response = requests.get('http://api.example.com/data')`,
      language: "python"
    }
  ]}
/>
```

## Props

```typescript
interface CodeTab {
  label: string;        // Tab label (e.g., "JavaScript", "cURL")
  code: string;        // Code content
  language?: string;   // Language for syntax highlighting
}

interface CodeBlockProps {
  tabs?: CodeTab[];           // Multiple code samples with tabs
  code?: string;              // Single code sample
  language?: string;          // Default language ("bash")
  className?: string;         // Additional Tailwind classes
}
```

## Features Explained

### Syntax Highlighting

Uses Shiki for accurate syntax highlighting. Supports all major languages:
- JavaScript/TypeScript
- Python
- cURL/Bash
- JSON
- HTML/CSS
- SQL
- And 100+ more

### Tab Navigation

When multiple code samples provided:
- Smooth tab switching with animation
- Active tab indicator
- Keyboard accessible

### Copy Button

- Top-right corner of code block
- Animated copy icon → check mark
- Toast notification feedback
- Automatically resets after 2 seconds

### Overflow Handling

- Horizontal scroll for long lines
- Custom scrollbar styling
- Desktop and mobile friendly

### Dark Mode

All colors respond to dark mode:
- Light background in light mode
- Dark background in dark mode
- Adjusted text colors
- Contrast-friendly

## Advanced Examples

### With Custom Styling

```jsx
<CodeBlock
  code={codeString}
  language="typescript"
  className="max-w-2xl"
/>
```

### API Documentation Example

```jsx
<CodeBlock
  tabs={[
    {
      label: "cURL",
      code: `curl --request POST \\
--url https://api.example.com/users \\
--header 'Content-Type: application/json' \\
--data '{
  "name": "John",
  "email": "john@example.com"
}'`,
      language: "bash"
    },
    {
      label: "JavaScript",
      code: `const response = await fetch('https://api.example.com/users', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'John',
    email: 'john@example.com'
  })
});
const data = await response.json();`,
      language: "javascript"
    }
  ]}
/>
```

## Component Structure

```
CodeBlock (Container)
├── Tab Bar (if multiple tabs)
│   └── Tab Buttons (with active indicator)
└── Code Content
    ├── Copy Button (top-right)
    └── Pre/Code Block (with syntax highlighting)
```

## Styling

### Default Colors

**Light Mode:**
- Background: `zinc-50`
- Text: `zinc-950`
- Border: `zinc-950/10`

**Dark Mode:**
- Background: `white/5`
- Text: `zinc-50`
- Border: `white/10`

### Customization

Override with className prop:

```jsx
<CodeBlock
  code={code}
  language="javascript"
  className="border-2 border-blue-500"
/>
```

## Dependencies Used

| Package | Purpose |
|---------|---------|
| `motion/react` | Smooth animations for tab switching |
| `shiki` | Syntax highlighting |
| `lucide-react` | Copy/Check icons |
| `clsx` / `tailwind-merge` | Class merging (via cn utility) |

## Related Components

- **SyntaxHighlighter** - Internal component for rendering highlighted code
- **MDXComponents** - Uses CodeBlock in documentation pages
- **CopyPageButton** - Copies entire page as markdown

## Accessibility

- Tab buttons are keyboard navigable
- Copy button has aria-label
- Proper contrast ratios in both light/dark mode
- ARIA roles for tab list

## Performance Notes

- Lazy syntax highlighting (on demand)
- Smooth animations (GPU-accelerated)
- Efficient re-renders with useMemo
- Resize observer for overflow detection

## Common Use Cases

1. **API Documentation** - Multiple language examples
2. **Code Tutorials** - Step-by-step code blocks
3. **Installation Guides** - Commands in different shells
4. **Configuration Examples** - JSON, YAML, etc.

## Troubleshooting

### Syntax highlighting not working?
- Ensure `SyntaxHighlighter` component is implemented
- Check language parameter is correct
- Verify Shiki is installed

### Copy button not working?
- Check browser clipboard API support
- Verify error handling in handleCopy
- Check toast notifications setup

### Tabs not showing?
- Ensure tabs array has more than 1 item
- Verify each tab has label and code

## Migration from Other Libraries

If migrating from Prism.js or Highlight.js:
1. Replace syntax highlighter references
2. Update language names to Shiki format
3. Adjust styling if needed
4. Test with dark mode
