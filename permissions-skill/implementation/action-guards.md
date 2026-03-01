# Action Guards — Guarding Components and Buttons

How to use `hasPermission` and `hasRole` inside components to control what users see and can do.

## Setup in a Component

Always pull `user` from `useCurrentUser()` and pass it into the check functions. This keeps the UI reactive:

```typescript
import { useCurrentUser } from "@/hooks/queries/use-current-user";
import { hasPermission, hasRole } from "@/utils/auth";
import { APP_PERMISSIONS } from "@/constants/core";

function MyPage() {
  const { data: user } = useCurrentUser();

  return (
    <div>
      {/* ... */}
    </div>
  );
}
```

## Conditional Rendering

Show a component only when the user has a specific permission:

```typescript
{hasPermission([APP_PERMISSIONS.USER.CREATE], false, user) && (
  <InviteUserButton />
)}
```

Show a component only when the user has a certain role:

```typescript
{hasRole(["SUPER_ADMIN"], user) && <AdminPanel />}
```

## PageHeader Primary Action

Pass a `show` flag on the primary action to hide the button when the user lacks permission:

```typescript
<PageHeader
  title="User management"
  description="View and manage users"
  customActions={
    hasPermission([APP_PERMISSIONS.USER.VIEW], false, user) ? (
      <ExportButton />
    ) : null
  }
  primaryAction={{
    label: "Invite new user",
    variant: "outline",
    onClick: handleInviteUser,
    show: hasPermission([APP_PERMISSIONS.USER.CREATE], false, user),
  }}
/>
```

## Disabled Button with Reason

Disable a button and show a tooltip explaining why:

```typescript
<Button
  disabled={!hasPermission([APP_PERMISSIONS.USER.DELETE], true, user)}
  title={
    !hasPermission([APP_PERMISSIONS.USER.DELETE], true, user)
      ? "You don't have permission to delete users"
      : undefined
  }
  onClick={() => handleDelete(userId)}
  variant="destructive"
>
  Delete
</Button>
```

## Navbar / Sidebar Item Visibility

In the nav component, use `useCurrentUser()` and conditionally render items:

```typescript
// src/components/shared/dashboard/nav-user.tsx

export function NavUser() {
  const { data: user, isLoading } = useCurrentUser();

  if (isLoading) return <NavSkeleton />;
  if (!user) return null;

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        {/* Always shown */}
        <span>{user.fullName}</span>
        <span>{user.email}</span>
        <span>{user.institution.name}</span>

        {/* Only shown to admins */}
        {hasRole(["SUPER_ADMIN", "INSTITUTION_ADMIN"], user) && (
          <NavLink to="/dashboard/settings">Settings</NavLink>
        )}
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
```

## Strict vs Non-Strict in Context

Use `strict: true` (default) when the user must have **all** listed permissions. Use `strict: false` when **any one** is enough:

```typescript
// User must have BOTH VIEW and UPDATE to see this
{hasPermission(
  [APP_PERMISSIONS.INSTITUTION.VIEW, APP_PERMISSIONS.INSTITUTION.UPDATE],
  true,
  user,
) && <EditInstitutionButton />}

// User needs at least ONE of these to see the export
{hasPermission(
  [APP_PERMISSIONS.USER.VIEW, APP_PERMISSIONS.AUDIT_LOG.VIEW],
  false,
  user,
) && <ExportButton />}
```

## Logout — Clear Cache

On logout, clear the entire query cache so stale user/permission data doesn't persist:

```typescript
const { mutateAsync: logout } = useMutation({
  mutationFn: AuthService.Logout,
  onSuccess: () => {
    queryClient.clear();
    navigate({ to: "/auth/signin" });
  },
});
```
