# DocSidebar Setup & Customization Guide

Complete guide for setting up and customizing the documentation sidebar navigation.

## Overview

The `DocSidebar` component provides a collapsible sidebar navigation for API documentation with:
- HTTP method badges (GET, POST, PUT, DELETE, PATCH)
- Color-coded methods
- Nested sections and items
- Responsive design (collapses on mobile)
- Active state highlighting

---

## Basic Setup

### File Location
```
src/components/doc-sidebar.tsx
```

### Import in Layout
```typescript
// src/routes/docs.tsx
import { DocSidebar } from "@/components/doc-sidebar";

export default function RouteComponent() {
  return (
    <SidebarProvider>
      <DocSidebar />
      <SidebarInset>
        {/* Content */}
      </SidebarInset>
    </SidebarProvider>
  );
}
```

---

## Data Structure

### Overview
The sidebar is driven by a `data` object with the following structure:

```typescript
type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

interface NavItem {
  title: string;           // Display name
  url: string;            // Link URL
  isActive?: boolean;     // Highlight state
  method?: HttpMethod;    // Optional HTTP method badge
}

interface NavSection {
  title: string;          // Section heading
  url: string;           // Section URL (usually "#")
  items?: NavItem[];     // Sub-items
}

const data: { navMain: NavSection[] } = {
  navMain: [
    {
      title: "Section Name",
      url: "#",
      items: [
        {
          title: "Item Name",
          url: "/docs/item-url",
          method: "GET"  // Optional
        }
      ]
    }
  ]
};
```

---

## Adding Sections & Items

### Example: Complete Navigation Structure

```typescript
const data: { navMain: NavSection[] } = {
  navMain: [
    // Section 1: Getting Started
    {
      title: "Getting Started",
      url: "#",
      items: [
        {
          title: "Introduction",
          url: "/docs",
        },
        {
          title: "Quick Start",
          url: "/docs/quick-start",
        },
        {
          title: "Authentication",
          url: "/docs/authentication",
        },
      ],
    },

    // Section 2: Querying
    {
      title: "Querying",
      url: "#",
      items: [
        {
          title: "Overview",
          url: "/docs/query-msisdn",
        },
        {
          title: "Institution Aggregates",
          url: "/docs/institution-aggregates",
          method: "GET",
        },
        {
          title: "Institution Breakdown",
          url: "/docs/institution-breakdown",
          method: "GET",
        },
        {
          title: "MSISDN Aggregates",
          url: "/docs/system-aggregates",
          method: "GET",
        },
        {
          title: "MSISDN Breakdown",
          url: "/docs/system-breakdown",
          method: "GET",
        },
      ],
    },

    // Section 3: Reporting
    {
      title: "Reporting",
      url: "#",
      items: [
        {
          title: "Single Report",
          url: "/docs/single-report",
          method: "POST",
        },
        {
          title: "Bulk Report",
          url: "/docs/bulk-report",
          method: "POST",
        },
      ],
    },

    // Section 4: Error Handling
    {
      title: "References",
      url: "#",
      items: [
        {
          title: "Error Codes",
          url: "/docs/error-codes",
        },
        {
          title: "Rate Limiting",
          url: "/docs/rate-limiting",
        },
        {
          title: "Response Formats",
          url: "/docs/response-formats",
        },
      ],
    },
  ],
};
```

---

## HTTP Method Badges

### Available Methods & Colors

| Method | Color | Code |
|--------|-------|------|
| GET | Blue | `bg-blue-500` |
| POST | Green | `bg-green-500` |
| PUT | Orange | `bg-orange-500` |
| DELETE | Red | `bg-red-500` |
| PATCH | Purple | `bg-purple-500` |

### How Colors Work

The `getMethodColors()` function returns colors based on state:

```typescript
const getMethodColors = (method: HttpMethod, isActive: boolean = false) => {
  if (isActive) {
    // Solid colors for active state
    return "bg-blue-500 text-white"; // Example for GET
  }

  // Muted colors for inactive state
  return "bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400";
};
```

### Adding a New Method Badge

Simply add the `method` prop to a nav item:

```typescript
{
  title: "Create Resource",
  url: "/docs/create-resource",
  method: "POST"  // Badge will auto-color and label
}
```

---

## Active State Highlighting

### How It Works

The sidebar checks the current route and highlights matching items.

### Setting Active State Manually

```typescript
{
  title: "Query Data",
  url: "/docs/query-data",
  isActive: true  // Will be highlighted
}
```

### Automatic Active State

TanStack Router integration (if added) can auto-detect current page:

```typescript
// In component logic
const location = useLocation(); // TanStack Router

// Then map over navMain and set isActive based on location
navMain.map(section => ({
  ...section,
  items: section.items?.map(item => ({
    ...item,
    isActive: location.pathname === item.url
  }))
}))
```

---

## Component Structure

The sidebar uses Shadcn/ui Sidebar components:

```typescript
export function DocSidebar() {
  return (
    <Sidebar variant="sidebar">
      {/* Header */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            {/* Logo & version */}
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* Main navigation */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu className="gap-2">
            {/* Map over data.navMain */}
            {data.navMain.map(item => (
              <SidebarMenuItem key={item.title}>
                {/* Section header */}
                <SidebarMenuButton asChild>
                  <a href={item.url} className="font-bold">
                    {item.title}
                  </a>
                </SidebarMenuButton>

                {/* Sub-items */}
                {item.items?.length ? (
                  <SidebarMenuSub>
                    {item.items.map(subItem => (
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton asChild>
                          <a href={subItem.url}>
                            {/* Method badge if present */}
                            {subItem.method && (
                              <span className={getMethodColors(...)}>
                                {subItem.method}
                              </span>
                            )}
                            <span>{subItem.title}</span>
                          </a>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                ) : null}
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
```

---

## Customization Examples

### Example 1: Add New Section

Edit the `data.navMain` array to add a new section:

```typescript
// Add after "Reporting" section
{
  title: "Advanced",
  url: "#",
  items: [
    {
      title: "Webhooks",
      url: "/docs/webhooks",
      method: "POST"
    },
    {
      title: "Batch Processing",
      url: "/docs/batch-processing",
      method: "POST"
    }
  ]
}
```

### Example 2: Add New Item to Section

Add to an existing section's items array:

```typescript
// In "Getting Started" section
items: [
  {
    title: "Introduction",
    url: "/docs",
  },
  // ... existing items ...
  {
    title: "FAQ",
    url: "/docs/faq",  // New item
  }
]
```

### Example 3: Hide Method Badge

Simply omit the `method` prop:

```typescript
{
  title: "Introduction",
  url: "/docs/introduction",
  // No method = no badge
}
```

### Example 4: Different Methods in Same Section

```typescript
{
  title: "Resource Operations",
  url: "#",
  items: [
    {
      title: "Get All",
      url: "/docs/get-all",
      method: "GET"
    },
    {
      title: "Create",
      url: "/docs/create",
      method: "POST"
    },
    {
      title: "Update",
      url: "/docs/update",
      method: "PUT"
    },
    {
      title: "Delete",
      url: "/docs/delete",
      method: "DELETE"
    }
  ]
}
```

---

## Styling & Customization

### Header Styling

Edit header section:

```typescript
<SidebarHeader>
  <SidebarMenu>
    <SidebarMenuItem>
      <SidebarMenuButton size="lg" asChild>
        <a href="#">
          <Logo />
          <div className="flex flex-col gap-0.5 leading-none">
            <span className="font-medium">Documentation</span>
            <span className="">v1.0.0</span>
          </div>
        </a>
      </SidebarMenuButton>
    </SidebarMenuItem>
  </SidebarMenu>
</SidebarHeader>
```

**Change version number:**
```typescript
<span className="">v2.0.0</span>
```

**Change header text:**
```typescript
<span className="font-medium">API Reference</span>
```

### Section Spacing

Adjust gap between sections:

```typescript
<SidebarMenu className="gap-2">  {/* Change '2' to control spacing */}
  {/* items */}
</SidebarMenu>
```

- `gap-1` = Tight spacing
- `gap-2` = Default (moderate)
- `gap-4` = Loose spacing

### Menu Item Styling

Change active state colors:

```typescript
<SidebarMenuSubButton asChild isActive={subItem.isActive}>
  {/* The 'isActive' prop controls highlighting */}
</SidebarMenuSubButton>
```

### Method Badge Styling

Modify in `getMethodColors()` function:

```typescript
const getMethodColors = (method: HttpMethod, isActive: boolean = false) => {
  if (isActive) {
    const activeColors = {
      GET: "bg-blue-500 text-white",
      // ... modify colors here
    };
    return activeColors[method];
  }
  // ...
};
```

---

## Responsive Behavior

### Mobile (default)
- Sidebar collapses/slides in from left
- Hamburger menu toggle visible
- Full-width content

### Tablet (md breakpoint)
- Sidebar visible alongside content
- May stack if space tight

### Desktop (lg breakpoint)
- Sidebar always visible
- Content spans remaining width
- Professional side-by-side layout

### Hide on Specific Breakpoints

```typescript
<Sidebar className="hidden md:block">
  {/* Only show on medium+ screens */}
</Sidebar>
```

---

## Integration with Routes

### Auto-linking

Make sure nav item URLs match your actual routes:

```
Nav URL: /docs/quick-start
Route file: src/routes/docs/quick-start.tsx  ✓ Match!
```

### Creating Routes for New Items

When adding new sidebar items, create matching routes:

1. Add item to sidebar data:
```typescript
{
  title: "New Page",
  url: "/docs/new-page",
  method: "GET"
}
```

2. Create route file:
```
src/routes/docs/new-page.tsx
```

3. Create content file:
```
src/assets/docs/new-page.mdx
```

---

## Logo Component

The sidebar includes a Logo component at the top.

### Change Logo
```typescript
// In SidebarHeader
<SidebarMenuButton size="lg" asChild>
  <a href="#">
    <YourCustomLogo />  {/* Replace Logo */}
    {/* ... */}
  </a>
</SidebarMenuButton>
```

### Make Logo Clickable
```typescript
<a href="/docs">  {/* Change to desired route */}
  <Logo />
</a>
```

---

## Width Customization

Control sidebar width via the layout:

```typescript
// In src/routes/docs.tsx
<SidebarProvider
  style={
    {
      "--sidebar-width": "19rem",  // Adjust this value
    } as React.CSSProperties
  }
>
```

Standard widths:
- `16rem` = 256px (narrow)
- `18rem` = 288px (standard)
- `19rem` = 304px (default in this project)
- `20rem` = 320px (wide)

---

## Dark Mode Support

All colors support dark mode via `dark:` classes:

```typescript
const colors = {
  GET: "bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400",
  //                                  ^^^^ Dark mode version
};
```

Colors automatically switch when dark mode is enabled.

---

## Accessibility

The sidebar includes:
- Semantic HTML (`<nav>`, `<a>` tags)
- Proper ARIA labels (auto from Shadcn)
- Keyboard navigation support
- Focus states for keyboard users
- Color + text for method badges (not color alone)

---

## Performance Notes

- Navigation structure is static (defined once at top)
- No dynamic API calls
- Fast rendering even with many items
- Consider splitting very large docs (100+ items)

---

## Troubleshooting

### Issue: Items not appearing
**Solution:** Verify items are in the correct `navMain` array structure

### Issue: Links not working
**Solution:** Ensure URLs exactly match route files in `src/routes/docs/`

### Issue: Badge colors wrong
**Solution:** Check HTTP method spelling: "GET" not "get", "POST" not "post"

### Issue: Active highlighting not working
**Solution:** Add manual `isActive: true` or implement route-based active detection

### Issue: Sidebar too narrow/wide
**Solution:** Adjust `--sidebar-width` in SidebarProvider styles

---

## Complete Example File

See [DocSidebar.tsx](./DocSidebar.tsx) for the complete, working component.
