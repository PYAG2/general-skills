# Permissions System Overview

A three-layer model that controls access at every level of the app.

## Architecture

```
Route Guards (beforeLoad)     ← Block unauthorized users before the page loads
        ↓
Component Visibility          ← Hide elements the user can't act on
        ↓
Action Guards (disabled state) ← Prevent triggering operations without permission
        ↓
Backend Validation            ← Server re-validates every request (never trust the frontend)
```

## Role Hierarchy

```
SUPER_ADMIN        ← Full system access; bypasses all permission checks
    ↓
INSTITUTION_ADMIN  ← Scoped to their institution
    ↓
USER               ← Limited access
```

Roles are checked with `hasRole()`. See [`utility-functions.md`](../implementation/utility-functions.md).

## Permission Model

Permissions follow a `RESOURCE:ACTION` format (e.g. `USER:CREATE`, `AUDIT_LOG:VIEW`). Each user receives a list of permissions from the backend based on their role.

Permissions are checked with `hasPermission()`. See [`utility-functions.md`](../implementation/utility-functions.md) for strict vs non-strict mode.

The full permission list lives in [`constants.md`](constants.md).

## Where Each Layer Lives

| Layer | File |
|---|---|
| Route guards | [`route-guards.md`](../implementation/route-guards.md) |
| Conditional rendering + disabled buttons | [`action-guards.md`](../implementation/action-guards.md) |
| Sidebar / navbar filtering | [`navbar-permissions.md`](../implementation/navbar-permissions.md) |
| Permission + role constants | [`constants.md`](constants.md) |
| `hasRole` / `hasPermission` / `getCurrentUser` | [`utility-functions.md`](../implementation/utility-functions.md) |
