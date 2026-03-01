# PostHog Setup

## Environment Variables

```
VITE_PUBLIC_POSTHOG_KEY=phc_xxxxxxxxxxxx
VITE_PUBLIC_POSTHOG_HOST=https://app.posthog.com
VITE_APP_ENV=production   # only "production" sends events to PostHog
```

`track()` logs to console in any non-production env and silently skips the PostHog call. No events are sent during development or staging.

## Provider in main.tsx

`PostHogProvider` only wraps the app in production. Non-production renders the same tree without it:

```tsx
// src/main.tsx

import { PostHogProvider } from "posthog-js/react";

const posthogHost = import.meta.env.VITE_PUBLIC_POSTHOG_HOST;
const posthogKey  = import.meta.env.VITE_PUBLIC_POSTHOG_KEY;
const isProduction = import.meta.env.VITE_APP_ENV === "production";

const options = {
  api_host: posthogHost,
} as const;

root.render(
  <StrictMode>
    <HelmetProvider>
      {isProduction && posthogKey ? (
        <PostHogProvider apiKey={posthogKey} options={options}>
          <ConfirmationProvider>
            <QueryClientProvider client={queryClient}>
              <RouterProvider router={router} />
              <Toaster richColors />
            </QueryClientProvider>
          </ConfirmationProvider>
        </PostHogProvider>
      ) : (
        <ConfirmationProvider>
          <QueryClientProvider client={queryClient}>
            <RouterProvider router={router} />
            <Toaster richColors />
          </QueryClientProvider>
        </ConfirmationProvider>
      )}
    </HelmetProvider>
  </StrictMode>,
);
```

## Install

```bash
npm install posthog-js
```
