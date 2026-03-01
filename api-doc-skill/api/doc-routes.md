# Documentation Routes Setup Guide

## Overview

The documentation system uses TanStack Router with file-based routing and MDX for content. This guide explains the routing structure and how to add new documentation pages.

## Directory Structure

```
src/
├── routes/
│   └── docs/
│       ├── index.tsx              # /docs - intro page
│       ├── quick-start.tsx        # /docs/quick-start
│       ├── getting-started.tsx    # /docs/getting-started
│       ├── api-endpoints/
│       │   ├── endpoint-one.tsx   # /docs/api-endpoints/endpoint-one
│       │   └── endpoint-two.tsx   # /docs/api-endpoints/endpoint-two
│       └── guides/
│           ├── guide-one.tsx      # /docs/guides/guide-one
│           └── guide-two.tsx      # /docs/guides/guide-two
├── assets/
│   └── docs/
│       ├── quick-start.mdx
│       ├── getting-started.mdx
│       ├── endpoint-one.mdx
│       ├── endpoint-two.mdx
│       ├── guide-one.mdx
│       └── guide-two.mdx
└── components/
    └── docs/
        ├── mdx-components.tsx     # All custom MDX components
        └── doc-sidebar.tsx        # Navigation sidebar
```

## How It Works

### 1. Main Docs Layout (`src/routes/docs.tsx`)

This is the root layout that wraps all documentation pages with:
- Fixed navbar with logo and dashboard link
- SidebarProvider with DocSidebar component
- Main content area with Outlet for child routes
- Breadcrumbs on mobile

**File Structure:**
```typescript
export const Route = createFileRoute("/docs")({
  component: RouteComponent,
  beforeLoad: async ({ context }) => {
    // Auth check - redirects to signin if not logged in
  },
});
```

### 2. Individual Page Routes

Each documentation page is a simple route that:
1. Imports MDX content from `src/assets/docs/`
2. Wraps it in MDXProvider with custom components
3. Returns JSX with proper spacing/styling

**Example Route File** (`src/routes/docs/quick-start.tsx`):
```typescript
import { createFileRoute } from "@tanstack/react-router";
import { MDXProvider } from "@mdx-js/react";
import QuickStartContent from "@/assets/docs/quick-start.mdx";
import { MDXComponents } from "@/components/docs/mdx-components";

export const Route = createFileRoute("/docs/quick-start")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex flex-col gap-6 w-full pb-8" data-docs-content>
      <MDXProvider components={MDXComponents}>
        <QuickStartContent />
      </MDXProvider>
    </div>
  );
}
```

## Creating New Documentation Pages

### Step 1: Create the Route File

Create a new file in `src/routes/docs/my-endpoint.tsx`:

```typescript
import { createFileRoute } from "@tanstack/react-router";
import { MDXProvider } from "@mdx-js/react";
import MyEndpointContent from "@/assets/docs/my-endpoint.mdx";
import { MDXComponents } from "@/components/docs/mdx-components";

export const Route = createFileRoute("/docs/my-endpoint")({
  component: MyEndpointComponent,
});

function MyEndpointComponent() {
  return (
    <div className="flex flex-col gap-6 w-full pb-8" data-docs-content>
      <MDXProvider components={MDXComponents}>
        <MyEndpointContent />
      </MDXProvider>
    </div>
  );
}
```

### Step 2: Create the MDX Content File

Create `src/assets/docs/my-endpoint.mdx`:

```mdx
<ApiDocLayout>
  <ApiDocSection>
    <ApiDocHeader
      title="My Endpoint"
      description="What this endpoint does"
      method="GET"
      path="/api/v1/my-endpoint"
    />

    ## Overview

    Detailed explanation of the endpoint...

    ### Query Parameters

    <ParamSection title="Parameters">
      <Param
        name="id"
        type="string"
        required
        description="Unique identifier"
      />
    </ParamSection>

    ### Examples

    <CodeExample
      languages={{
        cURL: `curl --request GET \\
--url 'http://api.example.com/api/v1/my-endpoint'`,
        JavaScript: `const response = await fetch('/api/v1/my-endpoint');
const data = await response.json();`
      }}
    />

    ### Response

    <ResponseExample
      status={200}
      description="Success"
      body={{ id: "123", name: "Example" }}
    />

  </ApiDocSection>

  <div className="hidden lg:block">
    <ApiDocExample>
      <div className="space-y-1">
        <p className="font-semibold text-sm mb-3">On This Page</p>
        <TocLink href="#overview">Overview</TocLink>
        <TocLink href="#query-parameters">Query Parameters</TocLink>
        <TocLink href="#examples">Examples</TocLink>
        <TocLink href="#response">Response</TocLink>
      </div>
    </ApiDocExample>
  </div>
</ApiDocLayout>
```

### Step 3: Update the Sidebar

Edit `src/components/doc-sidebar.tsx` and add your page to the `data.navMain` array:

```typescript
const data: { navMain: NavSection[] } = {
  navMain: [
    {
      title: "My Section",
      url: "#",
      items: [
        {
          title: "My Endpoint",
          url: "/docs/my-endpoint",
          method: "GET",  // optional - if this is an API endpoint
        },
      ],
    },
  ],
};
```

## Three-Column Layout Explained

The documentation uses a responsive 3-column grid layout:

```typescript
// From MDXComponents.tsx
function ApiDocLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-8 my-6">
      {children}
    </div>
  );
}
```

**Layout Breakdown:**

| Column | Component | Visible | Purpose |
|--------|-----------|---------|---------|
| 1 (Sidebar) | `<DocSidebar />` | Always | Navigation menu with sections |
| 2 (Main) | `<ApiDocSection>` | Always | Main content area (2 col span) |
| 3 (TOC) | `<ApiDocExample>` | Desktop only | Right-side table of contents |

**CSS Classes Used:**
- `lg:grid-cols-3` - 3 columns on large screens
- `lg:col-span-2` - Main content takes 2 columns
- `lg:sticky lg:top-20` - TOC stays fixed while scrolling
- `hidden lg:block` - Hide TOC on mobile

## Responsive Behavior

- **Mobile**: Sidebar collapses, shows hamburger menu
- **Tablet**: Sidebar + Main content (no TOC)
- **Desktop**: Full 3-column layout with sticky TOC

## Key Files to Remember

| File | Purpose |
|------|---------|
| `src/routes/docs.tsx` | Main layout wrapper |
| `src/routes/docs/*.tsx` | Individual page routes |
| `src/assets/docs/*.mdx` | Content files |
| `src/components/doc-sidebar.tsx` | Navigation sidebar |
| `src/components/docs/mdx-components.tsx` | Custom MDX components |

## Vite Plugin Configuration

The project uses `vite-plugin-pages` for file-based routing. MDX files are handled by `vite-plugin-mdx`.

**In `vite.config.ts`:**
```typescript
import Pages from 'vite-plugin-pages';
import MDX from 'vite-plugin-mdx';

export default defineConfig({
  plugins: [
    Pages({ /* config */ }),
    MDX({ /* config */ }),
  ],
});
```

This automatically:
- Creates routes from `src/routes/**/*.tsx` files
- Imports `.mdx` files as React components

## Best Practices

1. **File Naming**: Use kebab-case for both route and MDX files
2. **Imports**: Always import `MDXComponents` from the same location
3. **Layout**: Always wrap content in `<ApiDocLayout>` and `<ApiDocSection>`
4. **TOC**: Include right-side TOC for desktop users
5. **Auth**: Root `/docs` route checks authentication
6. **Spacing**: Use consistent spacing with `pb-8` on main content div

## Common Issues & Solutions

### Issue: Page shows blank
- Check that route file imports MDX content correctly
- Verify MDX file path matches import statement
- Ensure route is added to sidebar in DocSidebar.tsx

### Issue: Sidebar doesn't show new page
- Add entry to `data.navMain` in DocSidebar.tsx
- Use correct URL path `/docs/your-page`

### Issue: 3-column layout not working
- Wrap content in `<ApiDocLayout>` and `<ApiDocSection>`
- TOC must be wrapped in `<ApiDocExample>`
- Use `hidden lg:block` on TOC container

## Example: Complete New Page

See [quick-start.mdx](../../src/assets/docs/quick-start.mdx) for a complete working example with all component types.
