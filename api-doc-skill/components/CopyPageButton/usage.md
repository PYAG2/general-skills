# CopyPageButton Component Guide

A smart "Copy Page" button that extracts and copies documentation content as clean markdown.

## Overview

CopyPageButton enables users to:
- Copy entire documentation page as markdown
- Extract only relevant content (skips buttons, UI chrome)
- Convert rendered HTML back to semantic markdown
- Provide visual feedback (icon animation)
- Show toast notifications

## How It Works

The component has two modes:

### Mode 1: Copy Page Content (Automatic)
When placed on a documentation page, it automatically:
1. Finds the content container (marked with `data-docs-content` attribute)
2. Traverses the DOM recursively
3. Converts HTML elements to markdown syntax
4. Cleans up formatting
5. Copies to clipboard

### Mode 2: Copy Custom Content
Pass custom content via the `content` prop:

```jsx
<CopyPageButton content="Your custom markdown here" />
```

## Installation

### Dependencies

```bash
npm install sonner  # Toast notifications
```

Also requires:
- `@/components/ui/button` - Shadcn Button component
- `lucide-react` - Icons (Copy, Check)

### Files to Create

Create this file: `src/features/docs/copy-page-button.tsx`

## Usage

### Basic Setup

In your documentation layout, wrap content with `data-docs-content`:

```jsx
export function DocsLayout() {
  return (
    <div>
      <header>
        <h1>Documentation</h1>
        <CopyPageButton />  {/* Button here */}
      </header>

      <main data-docs-content>
        {/* Your documentation content */}
      </main>
    </div>
  );
}
```

### With MDXComponents

```mdx
<ApiDocLayout>
  <ApiDocSection>
    <ApiDocHeader
      title="My Endpoint"
      method="GET"
      path="/api/v1/endpoint"
    />
    {/* Content here gets copied */}
  </ApiDocSection>
</ApiDocLayout>

{/* The CopyPageButton is placed in the ApiDocHeader component */}
```

### Custom Content

```jsx
<CopyPageButton content={`# Custom Title\n\nCustom content here`} />
```

## Props

```typescript
interface CopyPageButtonProps {
  content?: string;  // Optional: custom markdown content to copy
                     // If not provided, extracts from [data-docs-content]
}
```

## Markdown Conversion

The component converts HTML elements to markdown:

| HTML Element | Markdown Output |
|--------------|-----------------|
| `<h1>Title</h1>` | `# Title` |
| `<h2>Section</h2>` | `## Section` |
| `<p>Text</p>` | `Text` (with newlines) |
| `<code>code</code>` | `` `code` `` |
| `<pre><code>block</code></pre>` | `` ```\nblock\n``` `` |
| `<a href="url">link</a>` | `[link](url)` |
| `<ul><li>item</li></ul>` | `- item` |
| `<ol><li>item</li></ol>` | `1. item` |
| `<blockquote>quote</blockquote>` | `> quote` |
| `<table>...</table>` | Preserved as-is |

## Features

### Content Extraction

- ✅ Finds content via `[data-docs-content]` attribute
- ✅ Skips UI elements (buttons, icons, SVGs)
- ✅ Preserves nested structures
- ✅ Handles code blocks with language tags
- ✅ Cleans excessive whitespace
- ✅ Maintains semantic meaning

### User Feedback

- 📋 Copy icon when ready
- ✅ Check mark when copied
- 🔔 Toast notification ("Page content copied")
- ⏱️ Icon resets after 2 seconds

### Accessibility

- Button with clear label
- Keyboard accessible
- Screen reader friendly
- Visual feedback on action

### Responsive

- Full text visible on desktop
- Icon-only on mobile (space saving)
- Works on all screen sizes

## Implementation Example

### Complete Documentation Page

```jsx
// src/routes/docs/my-endpoint.tsx

import { createFileRoute } from "@tanstack/react-router";
import { MDXProvider } from "@mdx-js/react";
import MyEndpointContent from "@/assets/docs/my-endpoint.mdx";
import { MDXComponents } from "@/components/docs/mdx-components";

export const Route = createFileRoute("/docs/my-endpoint")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    // The data-docs-content attribute is required for auto-extraction
    <div className="flex flex-col gap-6 w-full pb-8" data-docs-content>
      <MDXProvider components={MDXComponents}>
        <MyEndpointContent />
      </MDXProvider>
    </div>
  );
}
```

The `CopyPageButton` is used inside `ApiDocHeader` component (in MDXComponents), so it automatically picks up all content within `data-docs-content`.

## Advanced Usage

### Exclude Specific Elements

To exclude certain elements from being copied, modify the `processNode` function:

```typescript
// In extractMarkdownContent function
if (["button", "svg", ".custom-exclude-class"].includes(tagName)) {
  return;  // Skip this element
}
```

### Custom Content Processing

Pass custom markdown directly:

```jsx
<CopyPageButton
  content={customMarkdownString}
/>
```

### Customizing Toast Messages

Edit the toast messages:

```typescript
toast.success("Documentation copied!");  // Success message
toast.error("Failed to copy");           // Error message
```

## Styling

The button inherits from Shadcn Button:
- Variant: `outline`
- Size: `sm`
- Responsive text (hidden on mobile)
- Icon animation (Copy → Check)

### Customize with className

```jsx
<CopyPageButton className="bg-blue-500" />
```

## DOM Structure Requirements

For automatic content extraction to work:

```html
<div data-docs-content>
  {/* All content here will be copied */}
  <h1>Title</h1>
  <p>Content...</p>
</div>
```

**Important**: The `data-docs-content` attribute must wrap your documentation content.

## Troubleshooting

### "Could not find content to copy"
- Ensure `[data-docs-content]` attribute exists in your layout
- Check element selector matches your structure
- Verify content is rendered before clicking

### Copy button not working in some environments
- Check browser clipboard API support (modern browsers only)
- Verify HTTPS context (required for clipboard API)
- Check browser permissions for clipboard access

### Markdown output looks wrong
- Review `extractMarkdownContent` conversion rules
- Check for unsupported HTML elements
- Ensure element nesting is semantic

## Browser Support

Requires:
- Modern browsers with Clipboard API support
- All modern browsers (Chrome 63+, Firefox 53+, Safari 13.1+, Edge 79+)
- HTTPS context (localhost OK for development)

## Performance

- Lightweight extraction algorithm
- Single DOM traverse (O(n))
- No external dependencies for extraction
- Instant clipboard operation

## Integration with Shadcn

Uses Shadcn Button component:
```bash
npx shadcn-ui@latest add button
```

## Related Components

- **CodeBlock** - Code blocks with copy button
- **MDXComponents** - Uses CopyPageButton in ApiDocHeader
- **Documentation Pages** - Wrapped with data-docs-content

## Accessibility Features

- Keyboard: Tab to focus, Enter to activate
- Screen readers: Button label "Copy page"
- ARIA attributes: Proper roles and labels
- Visual feedback: Icon + toast notification
- Mobile friendly: Touch targets proper size

## Common Use Cases

1. **API Documentation** - Copy endpoint docs for reference
2. **Tutorials** - Copy steps as markdown notes
3. **Guides** - Copy instructions for offline use
4. **Code Snippets** - Copy entire examples with context
5. **Learning** - Save documentation for later study
