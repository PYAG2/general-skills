# API Documentation Skill Guide

This skill enables rapid development and replication of professional API documentation systems. It provides production-ready components, routing patterns, and architectural guidance that can be applied to any web project using React, TypeScript, and MDX.

## Quick Navigation

### 📍 Structure Overview

```
api-doc-skill/
├── SKILL.md                       # This file - navigation guide
├── api/
│   ├── endpoints.md               # Example API endpoint specifications
│   ├── patterns.md                # Reusable documentation patterns
│   └── doc-routes.md              # How routing works & architecture
├── components/
│   ├── MDXComponents/
│   │   ├── MDXComponents.tsx      # 19+ custom MDX components
│   │   └── usage.md               # Component reference & examples
│   ├── CodeBlock/
│   │   ├── CodeBlock.tsx          # Syntax-highlighted code blocks
│   │   └── usage.md               # Code block guide
│   ├── CopyPageButton/
│   │   ├── CopyPageButton.tsx     # Page content copy functionality
│   │   └── usage.md               # Copy button guide
│   └── DocSidebar/
│       ├── DocSidebar.tsx         # Data-driven navigation sidebar
│       └── usage.md               # Sidebar setup & customization
└── setup/
    └── integration.md             # Step-by-step integration checklist
```

## When to Use Each Section

### 🎯 **Creating a New API Documentation Page?**
1. **Start**: Read [doc-routes.md](api/doc-routes.md) - Understand routing
2. **Then**: Check [endpoints.md](api/endpoints.md) - See endpoint patterns
3. **Finally**: Reference [MDXComponents/usage.md](components/MDXComponents/usage.md) - Use the right components

### 🎨 **Adding New Doc Components?**
- See [MDXComponents/usage.md](components/MDXComponents/usage.md) - All components available
- Check existing `.mdx` files in `src/assets/docs/` for usage examples

### 📋 **Setting Up Documentation Sidebar?**
- Read [DocSidebar/usage.md](components/DocSidebar/usage.md) - Navigation structure
- Reference [DocSidebar.tsx](components/DocSidebar/DocSidebar.tsx) - Component implementation

### 🔄 **Replicating This Documentation System?**
- Follow [setup/integration.md](setup/integration.md) - Complete integration checklist

---

## Key Concepts

### 📑 Three-Column Layout Structure
The documentation uses a responsive 3-column layout:
- **Column 1 (Sidebar)**: Navigation menu with sections and endpoints
- **Column 2 (Main Content)**: MDX-rendered API documentation
- **Column 3 (Sticky TOC)**: Right-side table of contents (desktop only)

[Learn more →](api/doc-routes.md)

### 🔗 MDX-Powered Documentation
Documentation pages are written in `.mdx` (Markdown + JSX) format:
- Mix markdown text with React components
- Use custom components for code blocks, parameters, responses
- Located in `src/assets/docs/`
- Automatically routed via TanStack Router

[Component reference →](components/MDXComponents/usage.md)

### 🎯 Dynamic Sidebar Navigation
The sidebar is data-driven with HTTP method badges:
- **GET** (Blue), **POST** (Green), **PUT** (Orange), **DELETE** (Red), **PATCH** (Purple)
- Organized into sections (Getting Started, Querying, Reporting)
- Nested sub-items for detailed endpoints

[Setup guide →](components/DocSidebar/usage.md)

---

## File Reference

| File | Purpose | When to Use |
|------|---------|------------|
| [endpoints.md](api/endpoints.md) | Complete endpoint specifications | Building new endpoints, documenting existing ones |
| [patterns.md](api/patterns.md) | Code patterns & best practices | Implementing new features, code reviews |
| [doc-routes.md](api/doc-routes.md) | Route setup & file structure | Creating doc pages, understanding routing |
| [MDXComponents.tsx](components/MDXComponents/MDXComponents.tsx) | Component implementations | Extending documentation UI |
| [MDXComponents/usage.md](components/MDXComponents/usage.md) | Component reference & examples | Writing documentation pages |
| [DocSidebar.tsx](components/DocSidebar/DocSidebar.tsx) | Sidebar component code | Modifying navigation structure |
| [DocSidebar/usage.md](components/DocSidebar/usage.md) | Sidebar setup & customization | Adding/removing doc sections |
| [integration.md](setup/integration.md) | Integration checklist | Setting up in new projects |

---

## Common Tasks

### ✏️ Add a New Endpoint to Documentation
1. Open the endpoint's `.mdx` file in `src/assets/docs/`
2. Use `ApiDocHeader`, `ParamSection`, `RequestBody`, `ResponseExample` components
3. Add entry to sidebar data in [DocSidebar.tsx](components/DocSidebar/DocSidebar.tsx)
4. Create route in `src/routes/docs/` if needed

[See example →](components/MDXComponents/usage.md#examples)

### 🎨 Customize Sidebar Navigation
Edit the `data.navMain` array in [DocSidebar.tsx](components/DocSidebar/DocSidebar.tsx):
- Add sections under `navMain`
- Add items with `title`, `url`, `method` (optional)
- Component auto-colors methods

[Full setup guide →](components/DocSidebar/usage.md)

### 🚀 Create Full Documentation System
Follow [integration.md](setup/integration.md) checklist:
1. Copy route setup from [doc-routes.md](api/doc-routes.md)
2. Copy MDX components from [MDXComponents.tsx](components/MDXComponents/MDXComponents.tsx)
3. Copy sidebar from [DocSidebar.tsx](components/DocSidebar/DocSidebar.tsx)
4. Create `.mdx` files using component patterns

---

## Quick Reference: Most Used Components

```jsx
// Header with method badge
<ApiDocHeader
  title="Endpoint Name"
  description="What it does"
  method="POST"
  path="/api/v1/endpoint"
/>

// Parameter documentation
<ParamSection title="Query Parameters">
  <Param name="msisdn" type="string" required description="Phone number" />
  <Param name="page" type="number" defaultValue="1" description="Page number" />
</ParamSection>

// Code examples in multiple languages
<CodeExample
  languages={{
    cURL: "curl --request POST...",
    JavaScript: "const response = await fetch..."
  }}
/>

// Response documentation
<ResponseExample
  status={200}
  description="Success"
  body={/* JSON object */}
/>
```

[More components →](components/MDXComponents/usage.md)

---

## Tech Stack Used

- **Routing**: TanStack Router (File-based routing in `src/routes/docs/`)
- **Documentation Format**: MDX (Markdown + React JSX)
- **Styling**: Tailwind CSS + Shadcn/ui components
- **Syntax Highlighting**: Shiki
- **UI Library**: Radix UI (Sidebar, Tabs, etc.)

---

## Need Help?

- **Routing questions?** → [doc-routes.md](api/doc-routes.md)
- **Component usage?** → [MDXComponents/usage.md](components/MDXComponents/usage.md)
- **Sidebar setup?** → [DocSidebar/usage.md](components/DocSidebar/usage.md)
- **Full integration?** → [integration.md](setup/integration.md)
- **Endpoint specs?** → [endpoints.md](api/endpoints.md)
