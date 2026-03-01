# Tracking Functions & Usage Patterns

## track()

A typed wrapper around `posthog.capture`. Only sends to PostHog in production — logs to console everywhere else. Silently fails so analytics never breaks the app:

```ts
// src/analytics/tracker.ts

export function track<T extends AnalyticsEventName>(
  eventName: T,
  properties?: AnalyticsEventProperties<T>,
): void {
  const isProduction = import.meta.env.VITE_APP_ENV === "production";

  const sanitizedProperties = sanitizeProperties(properties || {});

  if (!isProduction) {
    console.log(`[analytics] ${eventName}`, sanitizedProperties);
    return;
  }

  try {
    posthog.capture(eventName, sanitizedProperties);
  } catch (error) {
    console.error(`[analytics] Error tracking event: ${eventName}`, error);
  }
}
```

**Sanitization** strips any property key containing `password`, `token`, `secret`, `api_key`, `api_secret`, or `credit_card` — replacing the value with `"[REDACTED]"`. Run all properties through this before sending.

## Where to Call track()

### On mutation success

```ts
useMutation({
  mutationFn: ResourceService.Create,
  onSuccess: (response) => {
    track("resource.created", {
      resource_id: response.data.id,
      user_id: user?.id,
    });
    queryClient.invalidateQueries({ queryKey: [QUERY_KEYs.RESOURCE_LIST] });
  },
});
```

**Example from codebase** — tracking a creation inside a mutation (`src/features/dashboard/institutions/add-institution-dialog.tsx`):

```ts
onSuccess: (response) => {
  track("institution.created", {
    institution_name: values.name,
    created_by: user?.email,
    user_id: user?.userId,
  });
}
```

### On modal open/close

```ts
function handleOpenChange(open: boolean) {
  track(open ? "ui.modal.opened" : "ui.modal.closed", {
    modal_name: "add-resource",
  });
  setIsOpen(open);
}
```

**Example from codebase** (`src/features/dashboard/institutions/add-institution-dialog.tsx`):

```ts
track("ui.modal.opened", { modal_name: "add-institution" });
track("ui.modal.closed", { modal_name: "add-institution" });
```

### On feature page load

```ts
useEffect(() => {
  track("ui.feature.opened", { feature: "resource_management" });
}, []);
```

**Example from codebase** (`src/routes/dashboard/user-management/index.tsx`):

```ts
useEffect(() => {
  track("ui.feature.opened", { feature: "user_management" });
}, []);
```

### On API errors (axios interceptor)

```ts
track("error.occurred", {
  error_type: error.name,
  error_message: error.message,
  error_code: error.status,
  page_path: window.location.pathname,
});
```

**Example from codebase** — called inside the axios response interceptor (`src/lib/config/axios.ts`):

```ts
track("error.occurred", {
  error_type: error.name,
  error_message: error.message,
  error_code: error.status,
  page_path: window.location.pathname,
});
```

## identifyUser()

Call after successful login to link all future PostHog events to the user's identity:

```ts
export function identifyUser(
  userId: string,
  properties: Omit<UserContextProps, "user_id">,
): void {
  if (!isProduction) {
    console.log("[analytics] User identified:", userId, properties);
    return;
  }
  posthog.identify(userId);
  posthog.setPersonProperties(sanitizeProperties({ user_id: userId, ...properties }));
}
```

**Pattern** — call in login mutation `onSuccess`, after the track call:

```ts
track("auth.login.success", { ... });
identifyUser(user.id, {
  user_email: user.email,
  user_role: user.role,
});
```

**Example from codebase** (`src/routes/auth/signin.tsx`):

```ts
track("auth.login.success", { user_id: response.data.userId, ... });
identifyUser(form.getValues("email"), {
  user_email: form.getValues("email"),
  user_role: response.data.role.name,
  institution_id: response.data.institution.id,
  institution_name: response.data.institution.name,
});
```

## resetUserIdentity()

Call on logout to unlink the PostHog session from the user — prevents the next user on the same device being associated with the previous session:

```ts
export function resetUserIdentity(): void {
  if (!isProduction) return;
  posthog.reset();
}
```

**Pattern** — track first (still identified), then reset, then clear cache:

```ts
track("auth.logout", { user_id: user?.id });
resetUserIdentity();
queryClient.clear();
navigate({ to: "/auth/signin" });
```

**Example from codebase** (`src/components/shared/dashboard/nav-user.tsx`):

```ts
onSuccess: () => {
  track("auth.logout", { user_id: user?.userId, user_email: user?.email });
  resetUserIdentity();
  queryClient.clear();
  nav({ to: "/auth/signin" });
},
```
