# Page Layout Skill

How the dashboard layout wraps routes, and how to use `PageHeader` inside a page.

## Structure

```
page-layout-skill/
├── SKILL.md                  # This file
├── dashboard-layout.md       # How the root dashboard route works
└── page-header.md            # PageHeader component — props and usage
```

## Where to Start

| Task | File |
| --- | --- |
| Understand how the dashboard wraps all pages | [dashboard-layout.md](dashboard-layout.md) |
| Add a title, description, and action buttons to a page | [page-header.md](page-header.md) |

## Quick Reference

**Dashboard layout** (`src/routes/dashboard.tsx`) wraps every dashboard route with sidebar + header + main area. Child routes render into `<Outlet />`.

**PageHeader** is used at the top of every page component:

```tsx
<PageHeader
  title="Page Title"
  description="Optional description"
  primaryAction={{
    label: "Create",
    variant: "outline",
    onClick: handleCreate,
    show: hasPermission([APP_PERMISSIONS.RESOURCE.CREATE], false, user),
  }}
  customActions={<ExportButton />}
/>
```
