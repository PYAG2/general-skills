# Event Map Pattern

How to define typed events so TypeScript enforces the right properties at every `track()` call site.

## The Pattern

Create a single interface where every key is an event name and the value is its required properties:

```ts
// src/analytics/events.ts

export interface AnalyticsEventMap {
  // Naming convention: "domain.noun.verb"
  // Examples:
  "auth.login.success":     UserContextProps & SessionProps;
  "auth.login.failed":      { email: string; error_type: string; error_message: string };
  "user.invite.sent":       { invited_email: string; invited_by: string; role: string };
  "resource.created":       UserContextProps & { resource_id: string; resource_name: string };
  "resource.deleted":       UserContextProps & { resource_id: string };
  "ui.modal.opened":        { modal_name: string; user_id?: string };
  "ui.modal.closed":        { modal_name: string; user_id?: string };
  "ui.feature.opened":      { feature: string; user_id?: string };
  "error.occurred":         ErrorProps & UserContextProps & { page_path?: string };
}

export type AnalyticsEventName = keyof AnalyticsEventMap;
export type AnalyticsEventProperties<T extends AnalyticsEventName> = AnalyticsEventMap[T];
```

`track<T extends AnalyticsEventName>(eventName: T, properties?: AnalyticsEventProperties<T>)` uses these types to enforce the right shape at every call site.

## Shared Property Interfaces

Rather than repeating common fields, define reusable property groups and compose them with `&`:

```ts
// src/analytics/properties.ts

export interface UserContextProps {
  user_id?: string;
  user_email?: string;
  user_role?: string;
  institution_id?: string;  // if multi-tenant
}

export interface SessionProps {
  session_id?: string;
  timestamp?: number;
}

export interface ErrorProps {
  error_type?: string;
  error_message?: string;
  error_code?: number;
}
```

Compose them in the event map:

```ts
"auth.login.success": UserContextProps & SessionProps;
"error.occurred":     ErrorProps & UserContextProps & { page_path?: string };
```

## Event Naming Convention

Use dot-separated `domain.noun.verb` — keeps events grouped and scannable in PostHog:

| Domain | Examples |
| --- | --- |
| `auth` | `auth.login.success`, `auth.logout` |
| `user` | `user.invite.sent`, `user.deleted` |
| `ui` | `ui.modal.opened`, `ui.feature.opened` |
| `resource` | `resource.created`, `resource.updated` |
| `error` | `error.occurred` |

## Adding a New Event

1. Add to `AnalyticsEventMap`:

```ts
"resource.exported": UserContextProps & {
  export_format: string;
  record_count?: number;
};
```

2. Call it — TypeScript enforces the shape immediately:

```ts
track("resource.exported", {
  export_format: "csv",
  record_count: results.length,
  user_id: user?.id,
});
```

No other registration needed.
