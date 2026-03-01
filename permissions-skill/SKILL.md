# Permissions & Authorization Skill

How to implement role-based and permission-based access control using TanStack Router, React Query, and utility functions.

## Structure

```
permissions-skill/
├── SKILL.md                               # This file
├── core/
│   ├── permissions-system.md              # Architecture overview
│   └── constants.md                       # APP_PERMISSIONS and role strings
└── implementation/
    ├── utility-functions.md               # hasRole(), hasPermission(), getCurrentUser()
    ├── route-guards.md                    # beforeLoad guards with TanStack Router
    ├── action-guards.md                   # Conditional rendering and disabled buttons
    └── navbar-permissions.md              # Data-driven sidebar filtering
```

## Where to Start

| Task | File |
| --- | --- |
| Understand the overall system | [core/permissions-system.md](core/permissions-system.md) |
| Define permission constants | [core/constants.md](core/constants.md) |
| Learn the check functions | [implementation/utility-functions.md](implementation/utility-functions.md) |
| Protect a route | [implementation/route-guards.md](implementation/route-guards.md) |
| Hide/disable UI elements | [implementation/action-guards.md](implementation/action-guards.md) |
| Control sidebar nav visibility | [implementation/navbar-permissions.md](implementation/navbar-permissions.md) |

## Quick Reference

**Protect a route (beforeLoad):**

```typescript
beforeLoad: async ({ context }) => {
  const response = await context.queryClient.ensureQueryData(
    currentUserQueryOptions(),
  );
  if (!hasRole(["SUPER_ADMIN", "INSTITUTION_ADMIN"], response.data)) {
    throw redirect({ to: "/dashboard", search: {} });
  }
},
```

**Conditional render in component:**

```typescript
const { data: user } = useCurrentUser();

{hasPermission([APP_PERMISSIONS.USER.CREATE], false, user) && (
  <InviteUserButton />
)}
```

**Disable a button:**

```typescript
<Button
  disabled={!hasPermission([APP_PERMISSIONS.USER.DELETE], true, user)}
  onClick={() => handleDelete(id)}
>
  Delete
</Button>
```
