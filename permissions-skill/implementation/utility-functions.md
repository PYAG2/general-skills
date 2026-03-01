# Utility Functions for Permission Checking

The core permission helpers used across the app. These live in `src/utils/auth/index.ts`.

## hasRole()

Check if a user has one of the required roles:

```typescript
export function hasRole(
  requiredRoles: string[],
  user?: UserProfile | null,
): boolean {
  const currentUser = user !== undefined ? user : getCurrentUser();

  if (!currentUser) return false;
  if (!requiredRoles || requiredRoles.length === 0) return true;

  return requiredRoles.includes(currentUser.role?.name ?? "");
}
```

**Usage:**

```typescript
// In beforeLoad guard
if (!hasRole(["SUPER_ADMIN", "INSTITUTION_ADMIN"], response.data)) {
  throw redirect({ to: "/dashboard", search: {} });
}

// In component (pass user from useCurrentUser)
const { data: user } = useCurrentUser();

{hasRole(["SUPER_ADMIN"], user) && <AdminPanel />}
```

## hasPermission()

Check if a user has required permissions. Supports strict (ALL) and non-strict (ANY) modes:

```typescript
export function hasPermission(
  requiredPermissions: string[],
  strict: boolean = true,
  user?: UserProfile | null,
): boolean {
  const currentUser = user !== undefined ? user : getCurrentUser();

  if (!currentUser) return false;

  // Super admin bypasses all permission checks
  if (currentUser.role.name === "SUPER_ADMIN") return true;

  if (!requiredPermissions || requiredPermissions.length === 0) return true;

  const userPermissions = currentUser.permissions || [];

  // strict = true → user must have ALL permissions
  if (strict) {
    return requiredPermissions.every((p) => userPermissions.includes(p));
  }

  // strict = false → user must have AT LEAST ONE permission
  return requiredPermissions.some((p) => userPermissions.includes(p));
}
```

**Usage:**

```typescript
import { APP_PERMISSIONS } from "@/constants/core";

// Strict (AND) - user must have ALL listed permissions
hasPermission([APP_PERMISSIONS.USER.CREATE], true, user)

// Non-strict (OR) - user must have ANY of the listed permissions
hasPermission([APP_PERMISSIONS.USER.VIEW, APP_PERMISSIONS.USER.CREATE], false, user)

// In JSX — show a primary action conditionally
primaryAction={{
  label: "Invite new user",
  show: hasPermission([APP_PERMISSIONS.USER.CREATE], false, user),
}}

// Conditional render
{hasPermission([APP_PERMISSIONS.USER.CREATE]) && (
  <CreateUserSheet open={isOpen} onOpenChange={setIsOpen} />
)}
```

## getCurrentUser()

Read user from React Query cache (no fetch):

```typescript
export function getCurrentUser(): UserProfile | null {
  const cachedData = queryClient.getQueryData<GetUserProfileResponse>([
    QUERY_KEYs.CURRENT_USER,
  ]);
  return cachedData?.data || null;
}
```

Used inside `hasPermission` and `hasRole` when no `user` argument is passed. Safe to call outside of React components (e.g. in mutation callbacks or event handlers).

## Summary

| Function | When to use |
| --- | --- |
| `hasRole(roles, user)` | Check if user has any of the roles |
| `hasPermission(perms, strict, user)` | Check permissions — strict = ALL, non-strict = ANY |
| `getCurrentUser()` | Read user from cache outside of components |

> **Note:** In components, always pass `user` from `useCurrentUser()` to get reactive updates. Without the `user` argument, functions fall back to a cache snapshot that won't re-render on change.
