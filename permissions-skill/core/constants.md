# Permission & Role Constants

Defined in `src/constants/core/index.ts`. All permission strings used in `hasPermission()` come from here — never hardcode strings directly.

## APP_PERMISSIONS

Organized by resource. Each resource has CRUD-style keys:

```typescript
export const APP_PERMISSIONS = {
  AUDIT_LOG: {
    CREATE: "AUDIT_LOG:CREATE",
    DELETE: "AUDIT_LOG:DELETE",
    UPDATE: "AUDIT_LOG:UPDATE",
    VIEW:   "AUDIT_LOG:VIEW",
  },

  INSTITUTION: {
    CREATE: "INSTITUTION:CREATE",
    DELETE: "INSTITUTION:DELETE",
    UPDATE: "INSTITUTION:UPDATE",
    VIEW:   "INSTITUTION:VIEW",
  },

  RESOURCE: {
    DELETE: "RESOURCE:DELETE",
    REPORT: "RESOURCE:REPORT",
    UPDATE: "RESOURCE:UPDATE",
    VIEW:   "RESOURCE:VIEW",
  },

  ROLE_PERMISSION: {
    CREATE: "ROLE_PERMISSION:CREATE",
    DELETE: "ROLE_PERMISSION:DELETE",
    UPDATE: "ROLE_PERMISSION:UPDATE",
    VIEW:   "ROLE_PERMISSION:VIEW",
  },

  USER: {
    CREATE: "USER:CREATE",
    DELETE: "USER:DELETE",
    UPDATE: "USER:UPDATE",
    VIEW:   "USER:VIEW",
  },
};
```

**Naming convention:** `RESOURCE:ACTION` — uppercase, colon-separated.

## Roles

Roles are a string union type on the `UserProfile`, not a constant object:

```typescript
type SystemUserRoles = "SUPER_ADMIN" | "INSTITUTION_ADMIN" | "USER";
```

Pass these as plain strings into `hasRole()`:

```typescript
hasRole(["SUPER_ADMIN"], user)
hasRole(["SUPER_ADMIN", "INSTITUTION_ADMIN"], user)
```

## QUERY_KEYs

Used by React Query to identify the current user cache entry:

```typescript
export const QUERY_KEYs = {
  CURRENT_USER: "current-user",
  // ... other keys
};
```

## Usage

```typescript
import { APP_PERMISSIONS } from "@/constants/core";
import { hasPermission } from "@/utils/auth";

// Check a single permission
hasPermission([APP_PERMISSIONS.USER.CREATE], true, user)

// Check if user has any of these
hasPermission(
  [APP_PERMISSIONS.USER.VIEW, APP_PERMISSIONS.USER.CREATE],
  false,
  user,
)
```

## Adding a New Resource

When you add a new resource to the system:

1. Add its permissions to `APP_PERMISSIONS`:

```typescript
NEW_RESOURCE: {
  CREATE: "NEW_RESOURCE:CREATE",
  DELETE: "NEW_RESOURCE:DELETE",
  UPDATE: "NEW_RESOURCE:UPDATE",
  VIEW:   "NEW_RESOURCE:VIEW",
},
```

1. Use in components immediately — no other config needed on the frontend. The backend controls which roles actually receive each permission.
