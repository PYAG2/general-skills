# Enhancement: EVENT_NAMES Constant

Currently event names are passed as raw strings to `track()`. TypeScript already catches typos via `AnalyticsEventMap`, but autocomplete doesn't surface the available names unless you start typing the exact string.

Adding an `EVENT_NAMES` object gives you:
- Autocomplete when calling `track()`
- One place to rename an event across the whole codebase
- Easier to grep for where an event is used

## Add to `src/analytics/events.ts`

**Example from codebase (`src/analytics/events.ts`)** — adapt event names and categories to your app:

```ts
export const EVENT_NAMES = {
  // Auth
  AUTH_LOGIN_SUCCESS: "auth.login.success",
  AUTH_LOGOUT:        "auth.logout",

  // Users
  USER_INVITE_SENT: "user.invite.sent",

  // UI / Navigation
  UI_PAGE_VIEWED:  "ui.page.viewed",
  UI_MODAL_OPENED: "ui.modal.opened",
  UI_MODAL_CLOSED: "ui.modal.closed",

  // Errors
  ERROR_OCCURRED: "error.occurred",
} as const satisfies Record<string, AnalyticsEventName>;
```

The `satisfies Record<string, AnalyticsEventName>` ensures every value is a valid key in `AnalyticsEventMap` — if you add a key to `EVENT_NAMES` that doesn't exist in the map, TypeScript errors.

## Usage

```ts
import { track } from "@/analytics/tracker";
import { EVENT_NAMES } from "@/analytics/events";

// Before
track("ui.modal.opened", { modal_name: "add-institution" });

// After
track(EVENT_NAMES.UI_MODAL_OPENED, { modal_name: "add-institution" });
```

Both work. `track()` is still fully typed either way — the constant just makes it easier to discover event names via autocomplete.
