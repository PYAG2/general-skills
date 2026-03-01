# MDX Components Reference

Complete guide to all custom MDX components available for writing API documentation.

## Overview

All custom components are exported from `src/components/docs/mdx-components.tsx` and automatically available in `.mdx` files through the `MDXProvider`.

---

## Layout Components

### ApiDocLayout

Creates the 3-column responsive layout structure.

**Props:**
```typescript
interface ApiDocLayoutProps {
  children: React.ReactNode;
}
```

**Usage:**
```mdx
<ApiDocLayout>
  <ApiDocSection>
    {/* Main content here */}
  </ApiDocSection>

  <ApiDocExample>
    {/* Right sidebar TOC here */}
  </ApiDocExample>
</ApiDocLayout>
```

**CSS Classes Applied:**
- Mobile: Single column
- Tablet: 2 columns (main content + TOC)
- Desktop: 3 columns (sidebar + main content + TOC)

---

### ApiDocSection

Main content area (takes 2 columns on desktop).

**Props:**
```typescript
interface ApiDocSectionProps {
  children: React.ReactNode;
}
```

**Usage:**
```mdx
<ApiDocSection>
  <ApiDocHeader ... />

  ## Main Content Section

  <ParamSection ... />
</ApiDocSection>
```

---

### ApiDocExample

Right-side sticky container for table of contents (desktop only).

**Props:**
```typescript
interface ApiDocExampleProps {
  children: React.ReactNode;
}
```

**Usage:**
```mdx
<div className="hidden lg:block">
  <ApiDocExample>
    <div className="space-y-1">
      <p className="font-semibold text-sm mb-3">On This Page</p>
      <TocLink href="#overview">Overview</TocLink>
      <TocLink href="#parameters">Parameters</TocLink>
      <TocLink href="#examples">Examples</TocLink>
    </div>
  </ApiDocExample>
</div>
```

**Features:**
- Sticky positioning (sticks to top while scrolling)
- Max height with scroll overflow
- Hidden on mobile/tablet

---

## Header Components

### ApiDocHeader

Main page header with method badge and endpoint path.

**Props:**
```typescript
interface ApiDocHeaderProps {
  title: string;          // Page title (e.g., "Report MSISDN")
  description?: string;   // Brief description of the endpoint
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  path: string;          // API path (e.g., "/api/v1/endpoint")
}
```

**Usage:**
```mdx
<ApiDocHeader
  title="Report MSISDN"
  description="Report a single suspicious phone number"
  method="POST"
  path="/api/v1/flagged-msisdns/reports"
/>
```

**Visual Output:**
- Large title with description
- Color-coded method badge (GET=blue, POST=green, etc.)
- Code block with method and path
- Copy button (auto-added)

---

### ApiEndpoint

Inline endpoint display for referencing endpoints within content.

**Props:**
```typescript
interface ApiEndpointProps {
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  path: string;
  description?: string;  // Optional explanation
}
```

**Usage:**
```mdx
Use this endpoint to query system data:

<ApiEndpoint
  method="GET"
  path="/api/v1/msisdn/aggregates"
  description="Get all flagged MSISDNs with aggregate data"
/>
```

**Visual Output:**
- Compact display with method badge
- Path in monospace font
- Optional description below

---

## Parameter Documentation

### ParamSection

Container for grouped parameters.

**Props:**
```typescript
interface ParamSectionProps {
  title: string;         // Section heading (e.g., "Query Parameters")
  children: React.ReactNode;
}
```

**Usage:**
```mdx
<ParamSection title="Query Parameters">
  <Param name="msisdn" type="string" required />
  <Param name="page" type="number" defaultValue="1" />
</ParamSection>
```

---

### Param

Individual parameter documentation (simple).

**Props:**
```typescript
interface ParamProps {
  name: string;           // Parameter name
  type: string;          // Data type (e.g., "string", "number")
  required?: boolean;    // Default: false
  description?: string;  // Optional explanation
  defaultValue?: string; // Optional default value
}
```

**Usage:**
```mdx
<Param
  name="msisdn"
  type="string"
  required
  description="Phone number to report"
/>

<Param
  name="page"
  type="number"
  defaultValue="1"
  description="Page number for pagination"
/>
```

**Visual Output:**
- Parameter name in green monospace
- Type label
- Required/Optional badge
- Description text
- Default value (if provided)

---

### ParamField

Individual parameter with child content (complex).

**Props:**
```typescript
interface ParamFieldProps {
  name: string;
  type: string;
  required?: boolean;
  children?: React.ReactNode;  // Custom content
}
```

**Usage:**
```mdx
<ParamField name="nested" type="object" required>
  Complex nested object with the following properties:
  - **field1**: Description of field1
  - **field2**: Description of field2
</ParamField>
```

---

## Code Examples

### CodeExample

Multi-language code example with tabs.

**Props:**
```typescript
interface CodeExampleProps {
  languages: {
    [key: string]: string;  // Language name -> code string
  };
}
```

**Usage:**
```mdx
<CodeExample
  languages={{
    cURL: `curl --request POST \\
--url https://api.example.com/endpoint \\
--header 'X-API-Key: YOUR_KEY' \\
--data '{...}'`,
    JavaScript: `const response = await fetch(
'https://api.example.com/endpoint',
{ method: 'POST', ... }
);`,
    Python: `import requests
response = requests.post(
  'https://api.example.com/endpoint',
  headers={'X-API-Key': 'YOUR_KEY'}
)`
  }}
/>
```

**Features:**
- Tabbed interface
- Code syntax highlighting with Shiki
- Line numbers
- Copy-to-clipboard button

**Supported Languages:**
- curl
- javascript (js)
- typescript (ts)
- python (py)
- bash
- json
- html
- css
- And many more...

---

### RequestBody

Display JSON request body with syntax highlighting.

**Props:**
```typescript
interface RequestBodyProps {
  body: string | object;    // JSON string or object
  description?: string;     // Optional explanation
}
```

**Usage:**
```mdx
### Example Request

<RequestBody
  description="Complete request example:"
  body={{
    msisdn: "0539901207",
    reason: "Fraud",
    description: "Suspicious withdrawal"
  }}
/>
```

---

## Response Documentation

### ResponseExample

Display API response with status code, description, and optional schema.

**Props:**
```typescript
interface ResponseExampleProps {
  status: number;          // HTTP status code
  description: string;     // Description of response
  body: string | object;   // Response body
  schema?: string | object; // Optional JSON schema
}
```

**Usage:**
```mdx
<ResponseExample
  status={200}
  description="Successfully reported"
  body={{
    success: true,
    message: "MSISDN reported",
    data: { reportId: "rpt_123" }
  }}
/>

<ResponseExample
  status={400}
  description="Invalid MSISDN format"
  body={{
    success: false,
    error: "Invalid format"
  }}
/>
```

**Visual Output:**
- Status code badge (green for 200s, red for 400s)
- Description text
- Formatted JSON with syntax highlighting
- Tabs for Example/Schema (if schema provided)

---

## Data Table Components

### CsvExample

Display CSV file structure with column definitions and example data.

**Props:**
```typescript
interface CsvColumn {
  name: string;        // Column name
  required: boolean;   // Is required
  description: string; // Column description
}

interface CsvRow {
  [key: string]: string;
}

interface CsvExampleProps {
  columns: CsvColumn[];
  rows: CsvRow[];
  caption?: string;    // Optional table caption
}
```

**Usage:**
```mdx
<CsvExample
  columns={[
    {
      name: "msisdn",
      required: true,
      description: "Phone number to report"
    },
    {
      name: "reason",
      required: true,
      description: "Reason for report (Fraud, Scam, etc.)"
    },
    {
      name: "description",
      required: false,
      description: "Additional details"
    }
  ]}
  rows={[
    {
      msisdn: "0539901207",
      reason: "Fraud",
      description: "Unauthorized transactions"
    },
    {
      msisdn: "0544123456",
      reason: "Scam",
      description: "Investment scam"
    }
  ]}
  caption="Bulk Report Example"
/>
```

**Visual Output:**
- Column definitions with required/optional badges
- Example data table
- Dark background with monospace font
- CSV file indicator

---

## Informational Components

### Note

Highlighted note/info box.

**Props:**
```typescript
interface NoteProps {
  children: React.ReactNode;
}
```

**Usage:**
```mdx
<Note>
  This endpoint requires authentication via the
  <code>X-API-Key</code> header.
</Note>

<Note>
  Rate limited to 1000 requests per hour. Check
  <code>X-RateLimit-Remaining</code> header for quota.
</Note>
```

**Visual Output:**
- Blue background
- Blue left border
- Blue info icon
- Suitable for important information

---

### Card

Clickable or standalone information card.

**Props:**
```typescript
interface CardProps {
  title?: string;           // Card title
  icon?: string;           // Icon/emoji
  href?: string;           // Optional URL for link cards
  children?: React.ReactNode;
}
```

**Usage:**
```mdx
{/* Standalone card */}
<Card title="API Keys" icon="🔑">
  Manage your API keys in the dashboard
</Card>

{/* Clickable link card */}
<Card
  title="Quick Start Guide"
  icon="🚀"
  href="/docs/quick-start"
>
  Get started with three simple steps
</Card>
```

**Visual Output:**
- Rounded border with shadow
- Icon + title + description
- Hover effects on link cards
- Open in same window or new tab

---

## Table of Contents

### TocLink

Navigation link for table of contents.

**Props:**
```typescript
interface TocLinkProps {
  href: string;          // Anchor link (e.g., "#overview")
  children: React.ReactNode;
  indent?: boolean;      // Add left padding for sub-items
}
```

**Usage:**
```mdx
<div className="hidden lg:block">
  <ApiDocExample>
    <div className="space-y-1">
      <p className="font-semibold text-sm mb-3">On This Page</p>
      <TocLink href="#overview">Overview</TocLink>
      <TocLink href="#parameters">Parameters</TocLink>
      <TocLink indent href="#query-parameters">Query Params</TocLink>
      <TocLink indent href="#body-parameters">Body Params</TocLink>
      <TocLink href="#examples">Examples</TocLink>
    </div>
  </ApiDocExample>
</div>
```

**Features:**
- Auto-converts anchor links to smooth scrolling
- Updates URL on click
- Hover effects
- Optional indentation

**Important:** Heading IDs are auto-generated from h2, h3, h4 text using slugify function:
- "Query Parameters" → `#query-parameters`
- "Response Fields" → `#response-fields`

---

## HTML Headings (Customized)

Custom heading components with auto-generated IDs.

### h1, h2, h3, h4

All standard markdown headings are customized:

**Features:**
- Auto-generated ID from heading text
- Proper semantic HTML (`<h1>`, `<h2>`, etc.)
- Tailwind styling (size, spacing, etc.)
- Scroll-margin for fixed navbar offset

**Usage in MDX:**
```mdx
# Main Title (becomes h1 with id="main-title")

## Section (becomes h2 with id="section")

### Subsection (becomes h3 with id="subsection")
```

**ID Generation:**
- Converts to lowercase
- Removes special characters
- Replaces spaces with hyphens
- Removes leading/trailing hyphens

---

## HTML Formatting (Customized)

Standard HTML elements are styled with Tailwind:

### Lists
```mdx
- Item 1
- Item 2
  - Nested item

1. First
2. Second
```

### Code
```mdx
Inline `code` is styled with background and rounded corners

Code blocks use Shiki syntax highlighting:

```json
{
  "key": "value"
}
```
```

### Links & Text
```mdx
[Link text](https://example.com) - styled with underline

> Blockquote - styled with left border and italic
```

---

## Complete Example

Here's a complete example using multiple components:

```mdx
<ApiDocLayout>
  <ApiDocSection>
    <ApiDocHeader
      title="Report MSISDN"
      description="Report a suspicious phone number"
      method="POST"
      path="/api/v1/flagged-msisdns/reports"
    />

    ## Authorization

    <ParamSection title="Headers">
      <ParamField name="X-API-Key" type="string" required>
        Your API authentication key
      </ParamField>
    </ParamSection>

    ## Request Body

    <ParamSection title="Body Parameters">
      <Param
        name="msisdn"
        type="string"
        required
        description="Phone number"
      />
      <Param
        name="reason"
        type="string"
        required
        description="Reason for report"
      />
    </ParamSection>

    <Note>
      Provide as much detail as possible in the description field.
    </Note>

    ## Examples

    <CodeExample
      languages={{
        cURL: `curl -X POST...`,
        JavaScript: `const response = fetch(...)`
      }}
    />

    ## Responses

    <ResponseExample
      status={200}
      description="Success"
      body={{ reportId: "123", success: true }}
    />

  </ApiDocSection>

  <div className="hidden lg:block">
    <ApiDocExample>
      <p className="font-semibold text-sm mb-3">On This Page</p>
      <TocLink href="#authorization">Authorization</TocLink>
      <TocLink href="#request-body">Request Body</TocLink>
      <TocLink href="#examples">Examples</TocLink>
      <TocLink href="#responses">Responses</TocLink>
    </ApiDocExample>
  </div>
</ApiDocLayout>
```

---

## Component Architecture

```
ApiDocLayout (3-column grid)
├── ApiDocSection (Col 1-2: Main content)
│   ├── ApiDocHeader
│   ├── Markdown headings (h1, h2, h3, h4)
│   ├── Markdown lists (ul, ol, li)
│   ├── Markdown formatting (p, code, pre, blockquote)
│   ├── ParamSection
│   │   ├── Param
│   │   └── ParamField
│   ├── ApiEndpoint
│   ├── CodeExample
│   ├── RequestBody
│   ├── ResponseExample
│   ├── CsvExample
│   ├── Note
│   └── Card
└── ApiDocExample (Col 3: Right sidebar TOC)
    └── TocLink
```

---

## Styling Notes

All components use:
- **Tailwind CSS** for styling
- **Shadcn/ui** color tokens
- **Dark mode** support via `dark:` classes
- **Responsive** design with breakpoints

Override classes if needed:
```mdx
<Note className="bg-yellow-50 dark:bg-yellow-950">
  Custom styled note
</Note>
```
