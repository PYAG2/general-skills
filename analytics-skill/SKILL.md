# Analytics Skill — PostHog Tracking

How to wire up PostHog and track events in a typed, production-safe way.

## Structure

```
analytics-skill/
├── SKILL.md          # This file
├── setup.md          # Provider setup in main.tsx, env vars
├── events.md         # AnalyticsEventMap pattern — typed event definitions
├── tracking.md       # track(), identifyUser(), resetUserIdentity() + where to call them
└── enhancement.md    # EVENT_NAMES constant — autocomplete for event names
```

## Where to Start

| Task | File |
| --- | --- |
| Set up PostHog in a new project | [setup.md](setup.md) |
| Define typed events for your app | [events.md](events.md) |
| Call `track()` in components and mutations | [tracking.md](tracking.md) |
| Add an `EVENT_NAMES` constant for autocomplete | [enhancement.md](enhancement.md) |

## Quick Reference

```ts
import { track } from "@/analytics/tracker";

// On mutation success
track("resource.created", { resource_id: response.data.id, user_id: user?.id });

// On modal open/close
track(open ? "ui.modal.opened" : "ui.modal.closed", { modal_name: "add-resource" });

// On page/feature load
useEffect(() => { track("ui.feature.opened", { feature: "resource_management" }); }, []);
```

All event names and properties are typed via `AnalyticsEventMap` — TypeScript errors if the shape is wrong.
