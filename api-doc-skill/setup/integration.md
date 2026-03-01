# Integration Checklist - Setting Up API Documentation in New Projects

Complete checklist for replicating this API documentation system in a new project.

## Prerequisites

Ensure your project has these dependencies:

```bash
npm install @mdx-js/react @mdx-js/rollup vite-plugin-mdx vite-plugin-pages
npm install @tanstack/react-router
npm install @radix-ui/react-sidebar @radix-ui/react-accordion
npm install shiki                   # For syntax highlighting
npm install tailwindcss             # For styling
```

---

## Setup Steps

### Step 1: Install Dependencies ✓

```bash
# Core MDX & routing
npm install @mdx-js/react vite-plugin-mdx vite-plugin-pages

# UI Components
npm install @radix-ui/react-sidebar @radix-ui/react-dialog @radix-ui/react-dropdown-menu
npm install @radix-ui/react-scroll-area @radix-ui/react-tabs

# Syntax highlighting
npm install shiki
npm install -D @shikijs/transformers

# Utilities
npm install tailwindcss tailwind-merge clsx
```

### Step 2: Configure Vite ✓

Update `vite.config.ts`:

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import Pages from 'vite-plugin-pages';
import MDX from 'vite-plugin-mdx';
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    Pages({
      dirs: 'src/routes',
      exclude: ['**/*.tsx.disabled'],
    }),
    MDX({
      jsxImportSource: '@emotion/react',
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

### Step 3: Create Directory Structure ✓

```bash
# Create necessary directories
mkdir -p src/routes/docs
mkdir -p src/assets/docs
mkdir -p src/components/docs
```

### Step 4: Copy Core Components ✓

Copy these files from the skill:

1. **MDX Components**: Copy `MDXComponents.tsx` to:
   ```
   src/components/docs/mdx-components.tsx
   ```

2. **Sidebar Component**: Copy `DocSidebar.tsx` to:
   ```
   src/components/doc-sidebar.tsx
   ```

3. **CodeBlock Component**: Copy `CodeBlock.tsx` to:
   ```
   src/components/ui/code-block.tsx
   ```

4. **CopyPageButton Component**: Copy `CopyPageButton.tsx` to:
   ```
   src/features/docs/copy-page-button.tsx
   ```

5. **Sidebar UI**: You need Shadcn sidebar components:
   ```bash
   npx shadcn-ui@latest add sidebar button
   ```

### Step 5: Create Root Documentation Route ✓

Create `src/routes/docs.tsx`:

```typescript
import {
  createFileRoute,
  Outlet,
  redirect,
} from "@tanstack/react-router";
import { DocSidebar } from "@/components/doc-sidebar";
import { Logo } from "@/components/logo";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

export const Route = createFileRoute("/docs")({
  component: RouteComponent,
  beforeLoad: async ({ context }) => {
    // Optional: Add authentication check
    // throw redirect({ to: "/auth/signin" });
  },
});

export default function RouteComponent() {
  return (
    <>
      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 h-16 border-b bg-white px-6 flex items-center justify-between z-50">
        <Logo />
        <div>{/* Optional buttons */}</div>
      </nav>

      {/* Content with Sidebar */}
      <div className="pt-16">
        <SidebarProvider
          style={
            {
              "--sidebar-width": "19rem",
            } as React.CSSProperties
          }
        >
          <DocSidebar />
          <SidebarInset>
            <header className="flex lg:hidden h-16 shrink-0 items-center gap-2 px-4 border-b">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2" />
            </header>
            <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
              <Outlet />
            </div>
          </SidebarInset>
        </SidebarProvider>
      </div>
    </>
  );
}
```

### Step 6: Create Individual Doc Routes ✓

Create `src/routes/docs/index.tsx` (intro page):

```typescript
import { createFileRoute } from "@tanstack/react-router";
import { MDXProvider } from "@mdx-js/react";
import IntroContent from "@/assets/docs/intro.mdx";
import { MDXComponents } from "@/components/docs/mdx-components";

export const Route = createFileRoute("/docs/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex flex-col gap-6 w-full pb-8" data-docs-content>
      <MDXProvider components={MDXComponents}>
        <IntroContent />
      </MDXProvider>
    </div>
  );
}
```

Create `src/routes/docs/quick-start.tsx`:

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

**Repeat for each documentation page** - just change the import and component name.

### Step 7: Create MDX Content Files ✓

Create `src/assets/docs/intro.mdx`:

```mdx
<ApiDocLayout>
  <ApiDocSection>
    <h1>Welcome to the API Documentation</h1>

    This is the introduction page. You can use all MDX components here.

    <Note>
      Start with the Quick Start guide to get up and running quickly.
    </Note>

  </ApiDocSection>

  <div className="hidden lg:block">
    <ApiDocExample>
      <div className="space-y-1">
        <p className="font-semibold text-sm mb-3">Sections</p>
        <TocLink href="#welcome">Welcome</TocLink>
      </div>
    </ApiDocExample>
  </div>
</ApiDocLayout>
```

Create `src/assets/docs/quick-start.mdx`:

```mdx
<ApiDocLayout>
  <ApiDocSection>
    <ApiDocHeader
      title="Quick Start"
      description="Get started in 3 simple steps"
    />

    ## Step 1: Get Your API Key

    Login and create an API key on the dashboard.

    ## Step 2: Make Your First Request

    <CodeExample
      languages={{
        cURL: `curl --request GET \\
--url 'http://api.example.com/endpoint' \\
--header 'X-API-Key: YOUR_KEY'`,
        JavaScript: `const response = await fetch(
  'http://api.example.com/endpoint',
  { headers: { 'X-API-Key': 'YOUR_KEY' } }
);`
      }}
    />

    ## Step 3: Handle the Response

    The API returns JSON responses. Check our error codes reference for handling errors.

  </ApiDocSection>

  <div className="hidden lg:block">
    <ApiDocExample>
      <p className="font-semibold text-sm mb-3">On This Page</p>
      <TocLink href="#step-1-get-your-api-key">Step 1</TocLink>
      <TocLink href="#step-2-make-your-first-request">Step 2</TocLink>
      <TocLink href="#step-3-handle-the-response">Step 3</TocLink>
    </ApiDocExample>
  </div>
</ApiDocLayout>
```

### Step 8: Update Sidebar Navigation ✓

Edit `src/components/doc-sidebar.tsx` - update the `data` object to match your pages:

```typescript
const data: { navMain: NavSection[] } = {
  navMain: [
    {
      title: "Getting Started",
      url: "#",
      items: [
        { title: "Introduction", url: "/docs" },
        { title: "Quick Start", url: "/docs/quick-start" },
        // Add more items...
      ],
    },
    // Add more sections...
  ],
};
```

### Step 9: Test the Setup ✓

```bash
npm run dev
```

Navigate to `http://localhost:5173/docs`

You should see:
- Fixed navbar at top
- Sidebar on left (collapses on mobile)
- Main content area
- Right-side TOC on desktop

### Step 10: Add Your Content ✓

For each API endpoint or page:

1. Create route in `src/routes/docs/endpoint-name.tsx`
2. Create content in `src/assets/docs/endpoint-name.mdx`
3. Add entry to sidebar data in `doc-sidebar.tsx`

---

## File Checklist

Use this checklist to verify you have all necessary files:

```
✓ src/routes/docs.tsx                      # Main layout
✓ src/routes/docs/index.tsx                # Intro page
✓ src/routes/docs/quick-start.tsx          # Quick start page
✓ src/routes/docs/*.tsx                    # Other doc pages
✓ src/assets/docs/intro.mdx                # Intro content
✓ src/assets/docs/quick-start.mdx          # Quick start content
✓ src/assets/docs/*.mdx                    # Other content files
✓ src/components/docs/mdx-components.tsx   # MDX components
✓ src/components/doc-sidebar.tsx           # Sidebar component
✓ src/components/ui/sidebar.tsx            # Shadcn sidebar (from shadcn-ui add sidebar)
✓ vite.config.ts                           # With MDX & Pages plugins
```

---

## Optional Enhancements

### 1. Add Search

Add document search functionality:

```bash
npm install cmdk            # Command palette
```

### 2. Add Dark Mode

Use `next-themes`:

```bash
npm install next-themes
```

### 3. Add Breadcrumbs

Use Shadcn breadcrumb component:

```bash
npx shadcn-ui@latest add breadcrumb
```

### 4. Add Copy Button

Create `src/features/docs/copy-page-button.tsx`:

```typescript
import { Copy, CheckCircle } from "lucide-react";
import { useState } from "react";

export function CopyPageButton() {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="p-2 hover:bg-gray-100 rounded"
    >
      {copied ? (
        <CheckCircle className="w-4 h-4" />
      ) : (
        <Copy className="w-4 h-4" />
      )}
    </button>
  );
}
```

### 5. Add Code Block with Syntax Highlighting

Create `src/components/ui/code-block.tsx`:

```typescript
import { codeToHtml } from 'shiki';

export function CodeBlock({
  code,
  language = 'javascript'
}: {
  code: string;
  language?: string;
}) {
  const [html, setHtml] = React.useState('');

  React.useEffect(() => {
    codeToHtml(code, {
      lang: language,
      theme: 'nord'
    }).then(setHtml);
  }, [code, language]);

  return (
    <pre
      dangerouslySetInnerHTML={{ __html: html }}
      className="rounded-lg overflow-x-auto"
    />
  );
}
```

---

## Troubleshooting

### Issue: Routes not loading
**Solution:** Verify `vite-plugin-pages` is configured in vite.config.ts

### Issue: MDX imports failing
**Solution:** Ensure `vite-plugin-mdx` is installed and configured

### Issue: Components not found
**Solution:** Check import paths match your actual file locations

### Issue: Sidebar not showing
**Solution:** Verify Shadcn sidebar components are installed

### Issue: Styling looks wrong
**Solution:** Ensure Tailwind CSS is configured correctly

---

## Next Steps

After setup:

1. **Create all doc pages** - Add more route/MDX pairs
2. **Populate content** - Write actual API documentation
3. **Customize styling** - Match your brand colors
4. **Add search** - Help users find content
5. **Setup versioning** - Document multiple API versions
6. **Add analytics** - Track documentation usage

---

## Reference Files

This integration checklist references:
- [doc-routes.md](../api/doc-routes.md) - Routing details
- [MDXComponents/usage.md](../components/MDXComponents/usage.md) - Component reference
- [DocSidebar/usage.md](../components/DocSidebar/usage.md) - Sidebar customization

---

## Support

For detailed information on any aspect:

- **Routing?** → Read [doc-routes.md](../api/doc-routes.md)
- **Components?** → Read [MDXComponents/usage.md](../components/MDXComponents/usage.md)
- **Sidebar?** → Read [DocSidebar/usage.md](../components/DocSidebar/usage.md)
- **Endpoints?** → Read [endpoints.md](../api/endpoints.md)
- **Patterns?** → Read [patterns.md](../api/patterns.md)
