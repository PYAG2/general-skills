# Navbar / Sidebar Permissions

The sidebar uses a data-driven config array where each route declares its own `requiredPermissions` and `requiredRoles`. The nav component fetches the user once and filters the list — no per-item JSX conditionals needed.

## The Route Config Type

Each nav item carries optional permission/role requirements alongside its display data:

```ts
export type Route = {
  id: string;
  title: string;
  icon?: React.ReactNode;
  link: string;
  requiredPermissions?: string[];
  requiredRoles?: string[];
  subs?: {
    title: string;
    link: string;
    icon?: React.ReactNode;
    requiredPermissions?: string[];
    requiredRoles?: string[];
  }[];
};
```

Items with no `requiredPermissions` or `requiredRoles` are visible to all authenticated users.

## The canAccessRoute Filter

A single local function handles both checks. It uses `hasPermission` in non-strict mode (`false`) so the user needs any one of the listed permissions:

```ts
const canAccessRoute = (route: {
  requiredPermissions?: string[];
  requiredRoles?: string[];
}) => {
  // No restrictions — visible to all
  if (!route.requiredPermissions && !route.requiredRoles) return true;

  // Check permissions (non-strict: any one is enough)
  if (route.requiredPermissions && route.requiredPermissions.length > 0) {
    if (!hasPermission(route.requiredPermissions, false, user)) return false;
  }

  // Check roles
  if (route.requiredRoles && route.requiredRoles.length > 0) {
    if (!hasRole(route.requiredRoles, user)) return false;
  }

  return true;
};

const visibleRoutes = routes.filter(canAccessRoute);
```

Sub-routes are filtered the same way:

```ts
const visibleSubs = route.subs?.filter(canAccessRoute);
```

## Defining the Nav Items

Permissions and roles are declared alongside the route config, not scattered in JSX:

```ts
const navRoutes: Route[] = [
  {
    id: "dashboard",
    title: "Dashboard",
    icon: <Home className="size-4" />,
    link: "/dashboard",
    // No restrictions — all authenticated users see this
  },
  {
    id: "resource-management",
    title: "Resource management",
    icon: <Layers className="size-4" />,
    link: "/dashboard/resource-management",
    requiredPermissions: [APP_PERMISSIONS.RESOURCE.VIEW],
  },
  {
    id: "admin-area",
    title: "Admin area",
    icon: <Shield className="size-4" />,
    link: "/dashboard/admin",
    requiredRoles: ["SUPER_ADMIN"],
  },
  {
    id: "user-management",
    title: "User management",
    icon: <Users className="size-4" />,
    link: "/dashboard/user-management",
    requiredRoles: ["SUPER_ADMIN", "INSTITUTION_ADMIN"],
  },
];
```

**Example from codebase** (`src/components/shared/dashboard/app-sidebar.tsx`):

```ts
const dashboardRoutes: Route[] = [
  {
    id: "dashboard",
    title: "Dashboard",
    icon: <Home className="size-4" />,
    link: "/dashboard",
  },
  {
    id: "institutions",
    title: "Institutions",
    icon: <Building2 className="size-4" />,
    link: "/dashboard/institutions/",
    requiredRoles: ["SUPER_ADMIN"],
  },
  {
    id: "user-management",
    title: "User management",
    icon: <Users className="size-4" />,
    link: "/dashboard/user-management",
    requiredRoles: ["SUPER_ADMIN", "INSTITUTION_ADMIN"],
  },
  {
    id: "audit-log",
    title: "Audit log",
    icon: <FileText className="size-4" />,
    link: "/dashboard/audit-log",
    requiredPermissions: [APP_PERMISSIONS.AUDIT_LOG.VIEW],
  },
];
```

## In the Nav Component

Fetch user once at the top, show a skeleton while loading, then filter and render:

```ts
export default function DashboardNavigation({ routes }: { routes: Route[] }) {
  const { data: user, isLoading } = useCurrentUser();

  if (isLoading || !user) {
    return <NavSkeleton />;
  }

  const canAccessRoute = (route) => { /* ... as above */ };
  const visibleRoutes = routes.filter(canAccessRoute);

  return (
    <SidebarMenu>
      {visibleRoutes.map((route) => {
        const visibleSubs = route.subs?.filter(canAccessRoute);
        // render route...
      })}
    </SidebarMenu>
  );
}
```

## Why This Pattern

- **Config stays in one place** — `app-sidebar.tsx` owns which routes exist and who can see them. The nav component is generic.
- **No conditional JSX per item** — instead of `{hasRole(...) && <NavItem />}` repeated for every item, a single `filter` handles everything.
- **Sub-routes work the same way** — `subs` use the same `canAccessRoute` function, so nested items are filtered consistently.
- **Easy to add new routes** — add an object to the array with the appropriate `requiredRoles` or `requiredPermissions`. No changes to the nav component needed.
